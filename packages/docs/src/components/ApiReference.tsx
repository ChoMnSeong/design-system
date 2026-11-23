import { Badge } from '@ensnif/design-system'
import api from '../api/api.json'
import { SectionHeading } from './DocSection'

type Prop = { name: string; type: string; required: boolean; default: string | null; description: string; deprecated?: string | boolean }
type Entry = { file: string; propsType: string; description: string; props: Prop[]; extends: string[] }
const API = api as Record<string, Entry>

/** HTMLAttributes<HTMLSpanElement> → <span> 의 HTML 속성 */
const extendsText = (t: string) => {
    const el = t.match(/HTML(\w*?)Element>/)?.[1]
    const tag: Record<string, string> = { Span: 'span', Div: 'div', Button: 'button', Input: 'input', TextArea: 'textarea', Anchor: 'a', Heading: 'h1~h6', Paragraph: 'p', Table: 'table', TableCell: 'td/th', TableRow: 'tr', TableSection: 'thead/tbody', Image: 'img', Select: 'select', Label: 'label', UList: 'ul', OList: 'ol', LI: 'li', Form: 'form', '': '요소' }
    if (el !== undefined) return <>그 밖의 <code>&lt;{tag[el] ?? el.toLowerCase()}&gt;</code> HTML 속성{/^Omit</.test(t) ? ` (${t.match(/,\s*(.+)>$/)?.[1] ?? ''} 제외)` : ''}</>
    const m = t.match(/^(?:Omit<)?([A-Z][A-Za-z]*)Props/)
    if (m) return <><code>{m[1]}</code> 의 props{/^Omit</.test(t) ? ` (${t.match(/,\s*(.+)>$/)?.[1] ?? ''} 제외)` : ''}</>
    return <code>{t}</code>
}

const PropsTable = ({ name }: { name: string }) => {
    const e = API[name]
    if (!e) return <p className="docs-muted">HTML 속성만 받습니다. 따로 정의한 props 가 없습니다.</p>
    return (
        <>
            {e.description && <p className="docs-api-desc">{e.description}</p>}
            {e.props.length > 0 && (
                <div className="docs-table-wrap" role="region" aria-label={`${name} props`} tabIndex={0}>
                    <table className="docs-props">
                        <thead>
                            <tr>
                                <th scope="col">Prop</th>
                                <th scope="col">타입</th>
                                <th scope="col">기본값</th>
                                <th scope="col">설명</th>
                            </tr>
                        </thead>
                        <tbody>
                            {e.props.map((p) => (
                                <tr key={p.name} data-deprecated={p.deprecated ? '' : undefined}>
                                    <td>
                                        <code className="docs-prop-name">{p.name}</code>
                                        {p.required && <span className="docs-required" title="필수">*</span>}
                                    </td>
                                    <td><code className="docs-type">{p.type}</code></td>
                                    <td>{p.default ? <code>{p.default}</code> : <span className="docs-muted">–</span>}</td>
                                    <td>
                                        {p.deprecated && <Badge size="xs" tone="warning" style={{ marginRight: 6 }}>사용 중단</Badge>}
                                        {p.required && <span className="docs-req-label">필수. </span>}
                                        {p.description}
                                        {p.deprecated && typeof p.deprecated === 'string' && <span className="docs-muted"> → {p.deprecated}</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {e.extends.length > 0 && <p className="docs-muted docs-extends">{e.extends.map((t, i) => <span key={t}>{i > 0 && ' · '}{extendsText(t)}</span>)}도 받습니다.</p>}
        </>
    )
}

/** API 단락: 컴포넌트마다 h3 + props 표 */
export const ApiReference = ({ components }: { components: string[] }) => (
    <section aria-labelledby="api">
        <SectionHeading id="api">API</SectionHeading>
        {components.map((c) => (
            <div key={c} className="docs-api-block">
                <h3 id={`api-${c}`} className="docs-h3"><code>{c}</code></h3>
                <PropsTable name={c} />
            </div>
        ))}
    </section>
)
