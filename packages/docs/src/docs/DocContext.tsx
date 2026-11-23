import { createContext, useContext } from 'react'
import type { DocMeta } from './types'

export const DocContext = createContext<DocMeta | null>(null)
/** 지금 페이지의 문서 설명. 컴포넌트 페이지가 아니면 null */
export const useDocMeta = () => useContext(DocContext)

/** 제목을 앵커 id 로: 공백 · 기호를 - 로 */
export const slug = (s: string) =>
    s
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-|-$/g, '')
