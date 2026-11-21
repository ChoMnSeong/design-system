/**
 * 테마 프리셋 (보드 9-11): variant 위에 얹는 브랜드 층.
 * Metric · 제목 글꼴, 강조색(채움 · 글자), 카드 바탕만 바꾼다. 컴포넌트 구조는 그대로.
 */
export type ThemePreset = {
    name: string
    /** Metric 숫자 · 제목에만 쓰는 글꼴 */
    fontDisplay?: string
    /** fill: 버튼 · 막대 채움, text: 글자용 (4.5:1 자동 검사) */
    accent?: { fill: string; text?: string }
    cardBg?: string | ((mode: 'light' | 'dark') => string)
}

const registry = new Map<string, ThemePreset>()

/** 대비비 (WCAG) — #rrggbb 만 */
export const contrastRatio = (a: string, b: string) => {
    const lum = (hex: string) => {
        const m = /^#([0-9a-f]{6})$/i.exec(hex.trim())
        if (!m) return null
        const c = [0, 2, 4].map((i) => parseInt(m[1]!.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
        return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!
    }
    const la = lum(a)
    const lb = lum(b)
    if (la === null || lb === null) return null
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** 사내 브랜드 프리셋 등록. 글자용 강조색이 4.5:1 미만이면 경고한다 */
export const definePreset = (preset: ThemePreset): ThemePreset => {
    const text = preset.accent?.text
    const bg = typeof preset.cardBg === 'function' ? preset.cardBg('light') : (preset.cardBg ?? '#ffffff')
    if (text) {
        const r = contrastRatio(text, bg)
        if (r !== null && r < 4.5) console.warn(`[ds] preset "${preset.name}" accent.text 대비 ${r.toFixed(2)}:1 — 4.5:1 미만`)
    }
    registry.set(preset.name, preset)
    return preset
}

export const BUILTIN_PRESETS: ThemePreset[] = [
    { name: 'default' },
    { name: 'editorial', fontDisplay: '"Source Serif 4", Georgia, serif', accent: { fill: '#1a181d', text: '#1a181d' } },
    { name: 'neon', fontDisplay: '"JetBrains Mono", ui-monospace, monospace', accent: { fill: '#16a34a', text: '#15803d' }, cardBg: (m) => (m === 'dark' ? '#0b0f0c' : '#ffffff') },
    { name: 'photo', accent: { fill: '#c2410c', text: '#9a3412' }, cardBg: (m) => (m === 'dark' ? 'rgba(20,20,24,.72)' : 'rgba(255,255,255,.82)') },
]
BUILTIN_PRESETS.forEach((p) => registry.set(p.name, p))

export const getPreset = (name?: string | ThemePreset) => (typeof name === 'object' ? name : name ? registry.get(name) : undefined)

/** 프리셋 → CSS 변수 */
export const presetVars = (p: ThemePreset | undefined, mode: 'light' | 'dark'): Record<string, string> => {
    if (!p) return {}
    const out: Record<string, string> = {}
    if (p.fontDisplay) out['--ds-font-display'] = p.fontDisplay
    if (p.accent?.fill) {
        out['--ds-color-accent-background'] = p.accent.fill
        out['--ds-color-accent-hover-background'] = `color-mix(in oklab, ${p.accent.fill} 88%, #000)`
        out['--ds-color-accent-active-background'] = `color-mix(in oklab, ${p.accent.fill} 78%, #000)`
        out['--ds-palette-primary-600'] = p.accent.fill
    }
    if (p.accent?.text) out['--ds-tone-accent-text'] = p.accent.text
    if (p.cardBg) out['--ds-surface-card-background'] = typeof p.cardBg === 'function' ? p.cardBg(mode) : p.cardBg
    return out
}

/* ── glass 배경 (보드 9-12) ── */

export type GlassOptions = {
    /** pattern(공장 배치도, 기본) · neutral(회청 번짐) · tint(보라, 행사·보고 화면) · image */
    backdrop?: 'pattern' | 'neutral' | 'tint' | 'image'
    pattern?: 'plant'
    backdropImage?: string
    /** glass: CSS 유리 (모든 화면) · liquid: 고정 배경 위 KPI 위젯용 렌즈 (보드 9-16) */
    material?: 'glass' | 'liquid'
}

export const PLANT_LIGHT = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='816' height='760' viewBox='0 0 816 760'%3E%3Cline x1='0' y1='0' x2='0' y2='760' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='48' y1='0' x2='48' y2='760' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='96' y1='0' x2='96' y2='760' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='144' y1='0' x2='144' y2='760' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='192' y1='0' x2='192' y2='760' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='240' y1='0' x2='240' y2='760' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='288' y1='0' x2='288' y2='760' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='336' y1='0' x2='336' y2='760' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='384' y1='0' x2='384' y2='760' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='432' y1='0' x2='432' y2='760' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='480' y1='0' x2='480' y2='760' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='528' y1='0' x2='528' y2='760' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='576' y1='0' x2='576' y2='760' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='624' y1='0' x2='624' y2='760' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='672' y1='0' x2='672' y2='760' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='720' y1='0' x2='720' y2='760' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='768' y1='0' x2='768' y2='760' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='816' y1='0' x2='816' y2='760' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='0' y1='0' x2='816' y2='0' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='0' y1='48' x2='816' y2='48' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='0' y1='96' x2='816' y2='96' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='0' y1='144' x2='816' y2='144' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='0' y1='192' x2='816' y2='192' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='0' y1='240' x2='816' y2='240' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='0' y1='288' x2='816' y2='288' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='0' y1='336' x2='816' y2='336' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='0' y1='384' x2='816' y2='384' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='0' y1='432' x2='816' y2='432' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='0' y1='480' x2='816' y2='480' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='0' y1='528' x2='816' y2='528' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='0' y1='576' x2='816' y2='576' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='0' y1='624' x2='816' y2='624' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='0' y1='672' x2='816' y2='672' stroke='%23e4e8ef' stroke-width='1'/%3E%3Cline x1='0' y1='720' x2='816' y2='720' stroke='%23e4e8ef' stroke-width='1'/%3E%3Crect x='64' y='96' width='212' height='156' rx='18' fill='%23c6d6ee'/%3E%3Crect x='82' y='114' width='176' height='59' rx='10' fill='rgba(255,255,255,.55)'/%3E%3Ccircle cx='246' cy='224' r='10' fill='%23a9d3b4'/%3E%3Crect x='330' y='64' width='150' height='188' rx='18' fill='%23bde0d8'/%3E%3Crect x='348' y='82' width='114' height='71' rx='10' fill='rgba(255,255,255,.55)'/%3E%3Ccircle cx='450' cy='224' r='10' fill='%23a9d3b4'/%3E%3Crect x='536' y='120' width='232' height='132' rx='18' fill='%23eedac0'/%3E%3Crect x='554' y='138' width='196' height='50' rx='10' fill='rgba(255,255,255,.55)'/%3E%3Ccircle cx='738' cy='224' r='10' fill='%23a9d3b4'/%3E%3Crect x='24' y='300' width='768' height='40' rx='20' fill='%23d6d2e6'/%3E%3Ccircle cx='56' cy='320' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='104' cy='320' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='152' cy='320' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='200' cy='320' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='248' cy='320' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='296' cy='320' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='344' cy='320' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='392' cy='320' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='440' cy='320' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='488' cy='320' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='536' cy='320' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='584' cy='320' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='632' cy='320' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='680' cy='320' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='728' cy='320' r='8' fill='%23c3bdd8'/%3E%3Crect x='88' y='404' width='256' height='168' rx='18' fill='%23eedac0'/%3E%3Crect x='106' y='422' width='220' height='63' rx='10' fill='rgba(255,255,255,.55)'/%3E%3Ccircle cx='314' cy='544' r='10' fill='%23a9d3b4'/%3E%3Crect x='410' y='384' width='172' height='208' rx='18' fill='%23c6d6ee'/%3E%3Crect x='428' y='402' width='136' height='79' rx='10' fill='rgba(255,255,255,.55)'/%3E%3Ccircle cx='552' cy='564' r='10' fill='%23a9d3b4'/%3E%3Crect x='640' y='428' width='136' height='144' rx='18' fill='%23bde0d8'/%3E%3Crect x='658' y='446' width='100' height='54' rx='10' fill='rgba(255,255,255,.55)'/%3E%3Ccircle cx='746' cy='544' r='10' fill='%23a9d3b4'/%3E%3Crect x='372' y='620' width='24' height='24' rx='4' fill='%23eedac0'/%3E%3Crect x='404' y='620' width='24' height='24' rx='4' fill='%23eedac0'/%3E%3Crect x='24' y='668' width='768' height='40' rx='20' fill='%23d6d2e6'/%3E%3Ccircle cx='56' cy='688' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='104' cy='688' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='152' cy='688' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='200' cy='688' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='248' cy='688' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='296' cy='688' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='344' cy='688' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='392' cy='688' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='440' cy='688' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='488' cy='688' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='536' cy='688' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='584' cy='688' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='632' cy='688' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='680' cy='688' r='8' fill='%23c3bdd8'/%3E%3Ccircle cx='728' cy='688' r='8' fill='%23c3bdd8'/%3E%3C/svg%3E")`
export const PLANT_DARK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='816' height='760' viewBox='0 0 816 760'%3E%3Cline x1='0' y1='0' x2='0' y2='760' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='48' y1='0' x2='48' y2='760' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='96' y1='0' x2='96' y2='760' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='144' y1='0' x2='144' y2='760' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='192' y1='0' x2='192' y2='760' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='240' y1='0' x2='240' y2='760' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='288' y1='0' x2='288' y2='760' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='336' y1='0' x2='336' y2='760' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='384' y1='0' x2='384' y2='760' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='432' y1='0' x2='432' y2='760' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='480' y1='0' x2='480' y2='760' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='528' y1='0' x2='528' y2='760' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='576' y1='0' x2='576' y2='760' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='624' y1='0' x2='624' y2='760' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='672' y1='0' x2='672' y2='760' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='720' y1='0' x2='720' y2='760' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='768' y1='0' x2='768' y2='760' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='816' y1='0' x2='816' y2='760' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='0' y1='0' x2='816' y2='0' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='0' y1='48' x2='816' y2='48' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='0' y1='96' x2='816' y2='96' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='0' y1='144' x2='816' y2='144' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='0' y1='192' x2='816' y2='192' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='0' y1='240' x2='816' y2='240' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='0' y1='288' x2='816' y2='288' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='0' y1='336' x2='816' y2='336' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='0' y1='384' x2='816' y2='384' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='0' y1='432' x2='816' y2='432' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='0' y1='480' x2='816' y2='480' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='0' y1='528' x2='816' y2='528' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='0' y1='576' x2='816' y2='576' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='0' y1='624' x2='816' y2='624' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='0' y1='672' x2='816' y2='672' stroke='%231b1d23' stroke-width='1'/%3E%3Cline x1='0' y1='720' x2='816' y2='720' stroke='%231b1d23' stroke-width='1'/%3E%3Crect x='64' y='96' width='212' height='156' rx='18' fill='%231e2b3e'/%3E%3Crect x='82' y='114' width='176' height='59' rx='10' fill='rgba(255,255,255,.05)'/%3E%3Ccircle cx='246' cy='224' r='10' fill='%23264a31'/%3E%3Crect x='330' y='64' width='150' height='188' rx='18' fill='%2317322f'/%3E%3Crect x='348' y='82' width='114' height='71' rx='10' fill='rgba(255,255,255,.05)'/%3E%3Ccircle cx='450' cy='224' r='10' fill='%23264a31'/%3E%3Crect x='536' y='120' width='232' height='132' rx='18' fill='%232f281e'/%3E%3Crect x='554' y='138' width='196' height='50' rx='10' fill='rgba(255,255,255,.05)'/%3E%3Ccircle cx='738' cy='224' r='10' fill='%23264a31'/%3E%3Crect x='24' y='300' width='768' height='40' rx='20' fill='%23242130'/%3E%3Ccircle cx='56' cy='320' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='104' cy='320' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='152' cy='320' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='200' cy='320' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='248' cy='320' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='296' cy='320' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='344' cy='320' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='392' cy='320' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='440' cy='320' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='488' cy='320' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='536' cy='320' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='584' cy='320' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='632' cy='320' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='680' cy='320' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='728' cy='320' r='8' fill='%232e2a3b'/%3E%3Crect x='88' y='404' width='256' height='168' rx='18' fill='%232f281e'/%3E%3Crect x='106' y='422' width='220' height='63' rx='10' fill='rgba(255,255,255,.05)'/%3E%3Ccircle cx='314' cy='544' r='10' fill='%23264a31'/%3E%3Crect x='410' y='384' width='172' height='208' rx='18' fill='%231e2b3e'/%3E%3Crect x='428' y='402' width='136' height='79' rx='10' fill='rgba(255,255,255,.05)'/%3E%3Ccircle cx='552' cy='564' r='10' fill='%23264a31'/%3E%3Crect x='640' y='428' width='136' height='144' rx='18' fill='%2317322f'/%3E%3Crect x='658' y='446' width='100' height='54' rx='10' fill='rgba(255,255,255,.05)'/%3E%3Ccircle cx='746' cy='544' r='10' fill='%23264a31'/%3E%3Crect x='372' y='620' width='24' height='24' rx='4' fill='%232f281e'/%3E%3Crect x='404' y='620' width='24' height='24' rx='4' fill='%232f281e'/%3E%3Crect x='24' y='668' width='768' height='40' rx='20' fill='%23242130'/%3E%3Ccircle cx='56' cy='688' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='104' cy='688' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='152' cy='688' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='200' cy='688' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='248' cy='688' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='296' cy='688' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='344' cy='688' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='392' cy='688' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='440' cy='688' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='488' cy='688' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='536' cy='688' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='584' cy='688' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='632' cy='688' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='680' cy='688' r='8' fill='%232e2a3b'/%3E%3Ccircle cx='728' cy='688' r='8' fill='%232e2a3b'/%3E%3C/svg%3E")`

/** glassmorphism 페이지 배경. 유리는 뒤에 윤곽 있는 형태가 있어야 보인다 */
export const glassPageBackground = (g: GlassOptions | undefined, mode: 'light' | 'dark'): string => {
    const b = g?.backdrop ?? 'pattern'
    const light = mode === 'light'
    const neutral = light
        ? 'radial-gradient(1100px 620px at 8% 0%, #e3e8f0 0%, transparent 62%), radial-gradient(900px 700px at 92% 30%, #eceef3 0%, transparent 58%), radial-gradient(1000px 800px at 30% 75%, #e7e4ec 0%, transparent 60%), #f7f8fa'
        : 'radial-gradient(1100px 620px at 8% 0%, #1f2430 0%, transparent 62%), radial-gradient(900px 700px at 92% 30%, #232129 0%, transparent 58%), radial-gradient(1000px 800px at 30% 75%, #1c1f26 0%, transparent 60%), #141518'
    if (b === 'neutral') return neutral
    if (b === 'tint')
        return light
            ? 'radial-gradient(1100px 620px at 8% 0%, var(--ds-palette-primary-100) 0%, transparent 62%), radial-gradient(900px 700px at 92% 30%, var(--ds-palette-primary-50) 0%, transparent 58%), radial-gradient(1000px 800px at 30% 75%, var(--ds-palette-primary-100) 0%, transparent 60%), var(--ds-palette-neutral-50)'
            : 'radial-gradient(1100px 620px at 8% 0%, var(--ds-palette-primary-900) 0%, transparent 62%), radial-gradient(900px 700px at 92% 30%, var(--ds-palette-neutral-800) 0%, transparent 58%), radial-gradient(1000px 800px at 30% 75%, var(--ds-palette-primary-900) 0%, transparent 60%), #141518'
    if (b === 'image' && g?.backdropImage) return `linear-gradient(${light ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.45)'}, ${light ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.45)'}), url("${g.backdropImage}") center / cover fixed`
    return `${light ? PLANT_LIGHT : PLANT_DARK} 0 0 / 816px 760px, ${neutral}`
}
