import type { ReactNode } from 'react'

/** 문서 큰 단락 제목 (h2). id 가 있어 목차 · 링크로 바로 간다 */
export const SectionHeading = ({ id, children }: { id: string; children: ReactNode }) => (
    <h2 id={id} className="docs-h2">
        <a href={`#${id}`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>
            {children}
        </a>
    </h2>
)
