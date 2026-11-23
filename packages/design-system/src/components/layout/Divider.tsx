import type { HTMLAttributes, ReactNode } from 'react'
import type { Tone } from '../types.js'

export type DividerProps = {
    /** horizontal 가로선 · vertical 세로선 */
    orientation?: 'horizontal' | 'vertical'
    /** 선 사이 글자 (가로선에서만) */
    label?: ReactNode
    /** label 위치 */
    labelPosition?: 'start' | 'center' | 'end'
    /** 좌우 여백 (가로선 12px · 세로선 8px) */
    inset?: boolean
    /** 점선 */
    dashed?: boolean
    /** 선 · 글자 색 */
    tone?: Tone
} & HTMLAttributes<HTMLDivElement>

/** 구역을 나누는 선. 가운데 글자를 넣을 수 있다 */
export const Divider = ({ orientation = 'horizontal', label, labelPosition = 'center', inset, dashed, tone, ...rest }: DividerProps) => (
    <div
        role="separator"
        aria-orientation={orientation}
        data-ds-divider=""
        data-orientation={orientation}
        data-label-position={label ? labelPosition : undefined}
        data-inset={inset ? '' : undefined}
        data-dashed={dashed ? '' : undefined}
        data-tone={tone}
        {...rest}
    >
        {label && orientation === 'horizontal' && <span data-slot="label">{label}</span>}
    </div>
)
