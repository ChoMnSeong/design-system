import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { FieldSize, Option } from '../types.js'

export type SegmentedControlProps<V extends string = string> = {
    /** 칸으로 그릴 선택지 */
    options: Option<V>[]
    /** 제어 모드 값 */
    value?: V
    /** 비제어 초기값. 없으면 첫 옵션 */
    defaultValue?: V
    /** 값이 바뀔 때 (새 값) */
    onValueChange?: (value: V) => void
    /** 칸 높이 xs 20 · sm 22 · md 28 · lg 36 */
    size?: FieldSize
    /** 부모 너비를 채우고 칸을 같은 폭으로 */
    fullWidth?: boolean
    /** 모든 칸 비활성 */
    disabled?: boolean
    /** 루트 요소 인라인 스타일 */
    style?: CSSProperties
    /** 그룹 접근성 이름 */
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
