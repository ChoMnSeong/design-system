import { useState, type CSSProperties, type ReactNode, type Ref } from 'react'
import type { Tone } from './types.js'

export type SliderMark = { value: number; label?: ReactNode }

type SliderValue = number | [number, number]

export type SliderProps<V extends SliderValue = SliderValue> = {
    /** 숫자 하나 또는 [시작, 끝] 범위 */
    value?: V
    defaultValue?: V
    onValueChange?: (value: V) => void
    /** @deprecated onValueChange 를 쓴다 */
    onChange?: (value: V) => void
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    /** 값 말풍선. auto 는 잡고 있을 때·포커스일 때만 */
    showTooltip?: 'auto' | 'always' | 'never'
    /** @deprecated showTooltip 을 쓴다. true = 'always' */
    showLabel?: boolean
    formatValue?: (n: number) => string
    /** 눈금. label 이 있으면 아래에 글자를 단다 */
    marks?: SliderMark[]
    orientation?: 'horizontal' | 'vertical'
    /** 세로일 때 높이 */
    length?: number | string
    tone?: Tone
    fullWidth?: boolean
    style?: CSSProperties
    'aria-label'?: string
    ref?: Ref<HTMLInputElement>
}

export const Slider = <V extends SliderValue = number>({
    value: valueProp,
    defaultValue,
    onValueChange,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    disabled,
    showTooltip,
    showLabel,
    formatValue = (n) => String(n),
    marks,
    orientation = 'horizontal',
    length = 160,
    tone = 'accent',
    fullWidth = true,
    style,
    'aria-label': ariaLabel,
    ref,
}: SliderProps<V>) => {
    const [inner, setInner] = useState<SliderValue>(defaultValue ?? (min as SliderValue))
    const value = (valueProp ?? inner) as SliderValue
    const range = Array.isArray(value)
    const vals = range ? (value as [number, number]) : [value as number]
    const [activeThumb, setActiveThumb] = useState<number | null>(null)
    const tip = showTooltip ?? (showLabel ? 'always' : 'auto')

    const pct = (n: number) => ((n - min) / (max - min)) * 100
    const set = (i: number, n: number) => {
        let next: SliderValue
        if (range) {
            const [a, b] = value as [number, number]
            next = i === 0 ? [Math.min(n, b), b] : [a, Math.max(n, a)]
        } else next = n
        if (valueProp === undefined) setInner(next)
        onValueChange?.(next as V)
        onChange?.(next as V)
    }

    const lo = range ? pct(vals[0]!) : 0
    const hi = pct(range ? vals[1]! : vals[0]!)
    const vertical = orientation === 'vertical'

    return (
        <div
            data-ds-slider=""
            data-orientation={orientation}
            data-tone={tone}
            data-disabled={disabled ? '' : undefined}
            data-has-marks={marks?.some((m) => m.label !== undefined) ? '' : undefined}
            style={{
                ...(vertical ? { height: length } : { width: fullWidth ? '100%' : undefined }),
                ...style,
            }}
        >
            <div data-slot="track">
                <span
                    data-slot="fill"
                    style={vertical ? { bottom: `${lo}%`, height: `${hi - lo}%` } : { left: `${lo}%`, width: `${hi - lo}%` }}
                />
                {marks?.map((m) => (
                    <span
                        key={m.value}
                        data-slot="mark"
                        data-on={m.value >= (range ? vals[0]! : min) && m.value <= (range ? vals[1]! : vals[0]!) ? '' : undefined}
                        style={vertical ? { bottom: `${pct(m.value)}%` } : { left: `${pct(m.value)}%` }}
                    >
                        {m.label !== undefined && <span data-slot="mark-label">{m.label}</span>}
                    </span>
                ))}
                {vals.map((v, i) => (
                    <span
                        key={`t${i}`}
                        data-slot="thumb"
                        data-active={activeThumb === i ? '' : undefined}
                        style={vertical ? { bottom: `${pct(v)}%` } : { left: `${pct(v)}%` }}
                    >
                        {tip !== 'never' && (
                            <span data-slot="tooltip" data-show={tip === 'always' ? 'always' : undefined}>
                                {formatValue(v)}
                            </span>
                        )}
                    </span>
                ))}
            </div>
            {vals.map((v, i) => (
                <input
                    key={i}
                    ref={i === 0 ? ref : undefined}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={v}
                    disabled={disabled}
                    aria-label={range ? `${ariaLabel ?? '범위'} ${i === 0 ? '시작' : '끝'}` : ariaLabel}
                    aria-valuetext={formatValue(v)}
                    aria-orientation={orientation}
                    onChange={(e) => set(i, Number(e.target.value))}
                    onFocus={() => setActiveThumb(i)}
                    onBlur={() => setActiveThumb(null)}
                    onPointerDown={() => setActiveThumb(i)}
                    onPointerUp={() => setActiveThumb(null)}
                    // 범위에서 두 손잡이가 겹치면 위쪽 끝에 있는 쪽을 앞에 둔다
                    style={range && i === 0 && v >= max - (max - min) * 0.02 ? { zIndex: 3 } : undefined}
                />
            ))}
        </div>
    )
}
