import { useId } from 'react'

/** 값 하나 또는 화면 폭(px) 기준 단계별 값. { 0: 'column', 768: 'row' } */
export type Responsive<T> = T | Record<number, T>

export const isResponsive = <T,>(v: Responsive<T> | undefined): v is Record<number, T> =>
    !!v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).every((k) => /^\d+$/.test(k))

/** 기본값(가장 작은 단계)을 고른다 */
export const baseOf = <T,>(v: Responsive<T>): T => {
    if (!isResponsive(v)) return v
    const keys = Object.keys(v).map(Number).sort((a, b) => a - b)
    return v[keys[0]!]!
}

/**
 * 단계별 값이 있으면 @media 규칙을 만들어 돌려준다.
 * const { attr, css } = useResponsiveCss({ direction: [dir, (d) => `flex-direction:${d}`] })
 */
export const useResponsiveCss = (rules: Record<string, [Responsive<any> | undefined, (v: any) => string]>) => {
    const id = useId().replace(/[^a-zA-Z0-9]/g, '')
    const bps = new Map<number, string[]>()
    for (const [, [val, decl]] of Object.entries(rules)) {
        if (!isResponsive(val)) continue
        for (const [k, v] of Object.entries(val)) {
            const w = Number(k)
            if (w === 0) continue
            if (!bps.has(w)) bps.set(w, [])
            bps.get(w)!.push(decl(v))
        }
    }
    if (!bps.size) return { attr: undefined, css: null }
    const css = [...bps.entries()]
        .sort(([a], [b]) => a - b)
        .map(([w, decls]) => `@media (min-width:${w}px){[data-ds-r="${id}"]{${decls.join(';')}}}`)
        .join('')
    return { attr: id, css: <style>{css}</style> }
}
