import { useEffect, useState } from 'react'
import { CodeBlock } from '@ensnif/design-system'
import { useDocMeta } from '../docs/DocContext'
import { ApiReference } from './ApiReference'
import { SectionHeading } from './DocSection'

/** 제목 아래: 사용법 · 구성 · (예시 제목) */
export const DocIntro = () => {
    const meta = useDocMeta()
    if (!meta) return null
    const usage = meta.usage ?? `import { ${meta.components.join(', ')} } from '@ensnif/design-system'`
    return (
        <>
            <section>
                <SectionHeading id="usage">사용법</SectionHeading>
                <CodeBlock code={usage.trim()} language="tsx" />
            </section>
            {meta.composition && (
                <section>
                    <SectionHeading id="composition">구성</SectionHeading>
                    <CodeBlock code={meta.composition.trim()} language="text" showCopy={false} />
                    {meta.compositionNote && <p className="docs-note">{meta.compositionNote}</p>}
                </section>
            )}
            <SectionHeading id="examples">예시</SectionHeading>
        </>
    )
}

/** 예시 뒤: 접근성 · 함수 · API */
export const DocOutro = () => {
    const meta = useDocMeta()
    if (!meta) return null
    return (
        <>
            {meta.a11y && meta.a11y.length > 0 && (
                <section>
                    <SectionHeading id="accessibility">접근성</SectionHeading>
                    <ul className="docs-list">
                        {meta.a11y.map((t) => <li key={t}>{t}</li>)}
                    </ul>
                </section>
            )}
            {meta.functions && meta.functions.length > 0 && (
                <section>
                    <SectionHeading id="functions">함수 · 훅</SectionHeading>
                    {meta.functions.map((f) => (
                        <div key={f.name} className="docs-api-block">
                            <h3 id={`fn-${f.name}`} className="docs-h3"><code>{f.name}</code></h3>
                            <CodeBlock code={f.signature} language="ts" showCopy={false} />
                            <p className="docs-api-desc">{f.description}</p>
                        </div>
                    ))}
                </section>
            )}
            <ApiReference components={meta.components} />
        </>
    )
}

type Heading = { id: string; text: string; level: 2 | 3 }

/** 오른쪽 목차: 본문 h2 · h3[id] 를 모아 보여 주고, 지금 읽는 위치를 표시한다 */
export const Toc = ({ routeKey }: { routeKey: string }) => {
    const [items, setItems] = useState<Heading[]>([])
    const [active, setActive] = useState('')
    useEffect(() => {
        const main = document.querySelector('.docs-main')
        if (!main) return
        const collect = () => setItems([...main.querySelectorAll<HTMLElement>('h2[id], h3[id]')].map((h) => ({ id: h.id, text: h.textContent ?? '', level: h.tagName === 'H2' ? 2 : 3 })))
        collect()
        const mo = new MutationObserver(collect)
        mo.observe(main, { childList: true, subtree: true })
        const io = new IntersectionObserver((es) => { const v = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (v) setActive(v.target.id) }, { rootMargin: '-64px 0px -70% 0px' })
        main.querySelectorAll('h2[id], h3[id]').forEach((h) => io.observe(h))
        return () => { mo.disconnect(); io.disconnect() }
    }, [routeKey])
    if (items.length < 2) return null
    return (
        <nav className="docs-toc" aria-label="이 페이지 목차">
            <div className="docs-toc-title">이 페이지</div>
            <ul>
                {items.map((h) => (
                    <li key={h.id} data-level={h.level}>
                        <a href={`#${h.id}`} aria-current={active === h.id ? 'location' : undefined} onClick={(e) => { e.preventDefault(); document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setActive(h.id) }}>{h.text}</a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
