import type { HTMLAttributes, ReactNode } from 'react'
import type { Tone } from './types.js'

export type DividerProps = {
    orientation?: 'horizontal' | 'vertical'
    label?: ReactNode
    labelPosition?: 'start' | 'center' | 'end'
    inset?: boolean
    dashed?: boolean
    tone?: Tone
} & HTMLAttributes<HTMLDivElement>

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
