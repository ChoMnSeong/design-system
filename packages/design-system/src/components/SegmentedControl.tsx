import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { FieldSize, Option } from './types.js'

export type SegmentedControlProps<V extends string = string> = {
    options: Option<V>[]
    value?: V
    defaultValue?: V
    onValueChange?: (value: V) => void
    size?: FieldSize
    fullWidth?: boolean
    disabled?: boolean
    style?: CSSProperties
    'aria-label'?: string
}

/** 보기·기간처럼 서로 배타적인 짧은 선택지. 선택된 칸이 떠오른 알약으로 보인다. */
export const SegmentedControl = <V extends string = string>({
    options,
    value: valueProp,
    defaultValue,
    onValueChange,
    size = 'md',
    fullWidth,
    disabled,
    style,
    'aria-label': ariaLabel,
}: SegmentedControlProps<V>) => {
    const [inner, setInner] = useState<V | undefined>(defaultValue ?? options[0]?.value)
    const value = valueProp ?? inner
    const ref = useRef<HTMLDivElement | null>(null)
    const select = (v: V) => {
        if (valueProp === undefined) setInner(v)
        onValueChange?.(v)
    }
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
        e.preventDefault()
        const enabled = options.filter((o) => !o.disabled)
        const i = enabled.findIndex((o) => o.value === value)
        const next = enabled[(i + (e.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length]
        if (next) {
            select(next.value)
            ref.current?.querySelector<HTMLButtonElement>(`[data-value="${CSS.escape(next.value)}"]`)?.focus()
        }
    }
    return (
        <div
            ref={ref}
            role="radiogroup"
            aria-label={ariaLabel}
            data-ds-segmented=""
            data-size={size}
            data-full-width={fullWidth ? '' : undefined}
            onKeyDown={onKeyDown}
            style={style}
        >
            {options.map((o) => {
                const on = o.value === value
                return (
                    <button
                        key={o.value}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        data-value={o.value}
                        tabIndex={on ? 0 : -1}
                        disabled={disabled || o.disabled}
                        onClick={() => select(o.value)}
                    >
                        {o.icon}
                        {o.label}
                    </button>
                )
            })}
        </div>
    )
}
