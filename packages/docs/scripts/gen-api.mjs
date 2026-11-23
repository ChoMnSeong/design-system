// 라이브러리 TypeScript 소스에서 컴포넌트 props 표를 뽑아 src/api/api.json 으로 쓴다.
// 이름 · 타입 · 기본값 · 설명(JSDoc) · @deprecated 를 코드에서 그대로 가져와 문서와 코드가 어긋나지 않게 한다.
// 실행: pnpm --filter design-system-docs api  (dev · build 전에 자동으로 돈다)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const here = path.dirname(fileURLToPath(import.meta.url))
const LIB = path.resolve(here, '../../design-system/src')
const OUT = path.resolve(here, '../src/api/api.json')

const configPath = path.resolve(LIB, '../tsconfig.json')
const config = ts.parseJsonConfigFileContent(ts.readConfigFile(configPath, ts.sys.readFile).config, ts.sys, path.dirname(configPath))
const program = ts.createProgram({ rootNames: config.fileNames, options: { ...config.options, noEmit: true } })
const checker = program.getTypeChecker()
const inLib = (sf) => sf && path.resolve(sf.fileName).startsWith(LIB)

const docOf = (sym) => ts.displayPartsToString(sym.getDocumentationComment(checker)).trim()
/** 교차 타입 속 인라인 주석은 심볼에 안 붙어서 선언 노드에서 직접 읽는다 */
const declDoc = (decl) => {
    // 같은 줄의 주석은 앞 토큰({ 나 ;)의 꼬리 주석으로 잡혀서, 선언 앞 공백 · 주석 구간을 직접 본다
    const trivia = decl.getSourceFile().text.slice(decl.pos, decl.getStart())
    const doc = trivia.match(/\/\*\*[\s\S]*?\*\//g)?.pop()
    // @deprecated 같은 태그는 따로 표시하니 본문에서 뺀다
    return doc ? doc.replace(/^\/\*\*|\*\/$/g, '').replace(/^\s*\*\s?/gm, '').replace(/@\w+[\s\S]*$/, '').replace(/\s+/g, ' ').trim() : ''
}
const tagsOf = (sym) => Object.fromEntries(sym.getJsDocTags(checker).map((t) => [t.name, ts.displayPartsToString(t.text ?? []).trim()]))
const clean = (s) => s.replace(/\s+/g, ' ').replace(/import\("[^"]+"\)\./g, '').trim()

/** 타입 노드를 펼친다: 리터럴 유니온 별칭(Tone, Size …)은 선언 순서 그대로 */
const expand = (node, depth = 0) => {
    if (depth > 4) return null
    if (ts.isUnionTypeNode(node)) {
        const parts = node.types.map((t) => expand(t, depth + 1))
        return parts.every(Boolean) ? parts.flat() : null
    }
    if (ts.isLiteralTypeNode(node)) return [clean(node.getText())]
    if (ts.isTypeReferenceNode(node) && !node.typeArguments) {
        const sym = checker.getSymbolAtLocation(node.typeName)
        const decl = sym?.declarations?.[0]
        if (decl && ts.isTypeAliasDeclaration(decl) && inLib(decl.getSourceFile())) return expand(decl.type, depth + 1)
    }
    return null
}
/** 별칭(Size, Tone 처럼)이 문자열 리터럴 유니온이면 펼쳐서 보여 준다 */
const typeText = (decl, sym) => {
    const declared = decl.type ? clean(decl.type.getText()) : clean(checker.typeToString(checker.getTypeOfSymbolAtLocation(sym, decl)))
    const ex = decl.type && expand(decl.type)
    if (ex && ex.length <= 14) return [...new Set(ex)].join(' | ').replace(/"/g, "'")
    const t = checker.getTypeOfSymbolAtLocation(sym, decl)
    const nonNull = checker.getNonNullableType(t)
    if (nonNull.isUnion()) {
        const parts = nonNull.types
        const literal = parts.every((p) => p.isStringLiteral() || p.isNumberLiteral() || (p.flags & ts.TypeFlags.BooleanLiteral))
        if (literal && parts.length <= 12 && /^[A-Z][A-Za-z]*(\s*\|\s*'[^']*')*$/.test(declared)) {
            const vals = parts.map((p) => checker.typeToString(p)).filter((v, i, a) => a.indexOf(v) === i)
            if (!(vals.length === 2 && vals.includes('true') && vals.includes('false'))) return vals.join(' | ').replace(/"/g, "'")
        }
    }
    return declared.replace(/"/g, "'")
}

/** 타입 별칭이 직접 선언한 type literal 들 (교차 타입의 {...} 부분) */
const ownLiterals = (node) => {
    if (ts.isTypeLiteralNode(node)) return [node]
    if (ts.isIntersectionTypeNode(node) || ts.isUnionTypeNode(node)) return node.types.flatMap(ownLiterals)
    if (ts.isParenthesizedTypeNode(node)) return ownLiterals(node.type)
    return []
}
/** 교차 타입에서 {...} 가 아닌 부분 = 이어받는 타입 (HTMLAttributes<HTMLSpanElement>, Omit<CardProps, …>) */
const inherited = (node) => {
    if (ts.isIntersectionTypeNode(node)) return node.types.flatMap(inherited)
    if (ts.isParenthesizedTypeNode(node)) return inherited(node.type)
    if (ts.isTypeLiteralNode(node) || ts.isUnionTypeNode(node)) return []
    return [clean(node.getText())]
}

// 1) Props 타입 별칭 모으기
const aliases = new Map()
for (const sf of program.getSourceFiles()) {
    if (!inLib(sf)) continue
    ts.forEachChild(sf, (n) => {
        if (ts.isTypeAliasDeclaration(n) && /Props$/.test(n.name.text) && n.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) aliases.set(n.name.text, { node: n, sf })
    })
}

// 2) 컴포넌트와 기본값: export const X = ({ a = 1 }: XProps) => …  /  const { a = 1 } = props
const components = []
/** export const Card: X = ((…) => …) as Y  ·  export const Skeleton = Object.assign(SkeletonBase, …) */
const unwrapFn = (e) => {
    while (e && (ts.isParenthesizedExpression(e) || ts.isAsExpression(e) || ts.isSatisfiesExpression?.(e) || ts.isTypeAssertionExpression(e))) e = e.expression
    if (!e) return null
    if (ts.isArrowFunction(e) || ts.isFunctionExpression(e)) return e
    if (ts.isCallExpression(e) && e.expression.getText() === 'Object.assign' && e.arguments[0]) {
        const sym = checker.getSymbolAtLocation(e.arguments[0])
        const decl = sym?.valueDeclaration
        if (decl && ts.isVariableDeclaration(decl)) return unwrapFn(decl.initializer)
    }
    return null
}
const defaultsFrom = (pattern) => {
    const d = {}
    for (const el of pattern.elements) {
        if (!el.initializer) continue
        const key = el.propertyName ? el.propertyName.getText() : el.name.getText()
        d[key] = clean(el.initializer.getText())
    }
    return d
}
for (const sf of program.getSourceFiles()) {
    // DataGrid 내부 부품은 공개 API 가 아니다
    if (!inLib(sf) || /dataGridParts/.test(sf.fileName)) continue
    ts.forEachChild(sf, (n) => {
        if (!ts.isVariableStatement(n) || !n.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) return
        for (const d of n.declarationList.declarations) {
            const name = d.name.getText()
            const fn = unwrapFn(d.initializer)
            if (!/^[A-Z]/.test(name) || !fn) continue
            const param = fn.parameters[0]
            if (!param?.type) continue
            const ref = param.type.getText().match(/^([A-Z][A-Za-z]*Props)\b/)
            const aliased = ref && aliases.has(ref[1])
            // ({ icon }: { icon?: ReactNode } & HTMLAttributes<…>) 처럼 직접 쓴 타입도 받는다
            if (!aliased && !ownLiterals(param.type).length && !/HTML\w*Attributes</.test(param.type.getText())) continue
            let defaults = {}
            if (ts.isObjectBindingPattern(param.name)) defaults = defaultsFrom(param.name)
            else if (ts.isIdentifier(param.name) && fn.body && ts.isBlock(fn.body)) {
                const pn = param.name.text
                for (const st of fn.body.statements)
                    if (ts.isVariableStatement(st))
                        for (const vd of st.declarationList.declarations)
                            if (ts.isObjectBindingPattern(vd.name) && vd.initializer?.getText() === pn) Object.assign(defaults, defaultsFrom(vd.name))
            }
            const sym = checker.getSymbolAtLocation(d.name)
            components.push({ name, propsType: aliased ? ref[1] : null, typeNode: aliased ? aliases.get(ref[1]).node.type : param.type, aliasNode: aliased ? aliases.get(ref[1]).node : null, paramNode: param, file: path.relative(LIB, sf.fileName), description: sym ? docOf(sym) : '', defaults })
        }
    })
}

// 3) props 표 만들기
const out = {}
for (const c of components) {
    const node = c.aliasNode
    const own = new Set(ownLiterals(c.typeNode))
    const type = node ? checker.getTypeAtLocation(node.name) : checker.getTypeAtLocation(c.paramNode)
    const props = []
    const fromOtherProps = new Set()
    for (const p of checker.getPropertiesOfType(type)) {
        const decl = p.valueDeclaration ?? p.declarations?.[0]
        if (!decl || !inLib(decl.getSourceFile())) continue
        if (!own.has(decl.parent)) {
            // 다른 *Props 에서 이어받은 것: 표에는 넣지 않고 이름만 알린다
            const owner = ts.findAncestor(decl, ts.isTypeAliasDeclaration)
            if (owner && owner !== node) fromOtherProps.add(owner.name.text)
            continue
        }
        const tags = tagsOf(p)
        props.push({
            name: p.name,
            type: typeText(decl, p),
            required: !(p.flags & ts.SymbolFlags.Optional),
            default: c.defaults[p.name] ?? null,
            description: docOf(p) || declDoc(decl),
            ...(tags.deprecated !== undefined ? { deprecated: tags.deprecated || true } : {}),
        })
    }
    props.sort((a, b) => Number(!!a.deprecated) - Number(!!b.deprecated))
    out[c.name] = {
        file: c.file,
        propsType: c.propsType ?? '(직접 선언)',
        description: c.description,
        props,
        extends: (() => {
            const ext = inherited(c.typeNode)
            for (const n of fromOtherProps) if (!ext.some((t) => t.includes(n))) ext.push(n)
            return [...new Set(ext)]
        })(),
    }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n')
console.log(`api.json: 컴포넌트 ${Object.keys(out).length}개, props ${Object.values(out).reduce((a, c) => a + c.props.length, 0)}개`)
