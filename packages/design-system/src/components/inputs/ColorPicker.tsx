import {
    useRef,
    useState,
    type CSSProperties,
} from 'react'
import { Popover } from '../overlay/Popover.js'
import { useOutsideClick } from '../useOutsideClick.js'
import { mergeStyles, type FieldSize } from '../types.js'

export type ColorFormat = 'hex' | 'rgb' | 'oklch'

const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '')
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number]
}

/** sRGB → OKLCH (Björn Ottosson 의 OKLab 변환). */
const rgbToOklch = ([r, g, b]: [number, number, number]) => {
    const lin = (c: number) => {
        const v = c / 255
        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    }
    const [R, G, B] = [lin(r), lin(g), lin(b)]
    const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B)
    const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B)
    const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B)
    const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
    const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
    const Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
    const C = Math.sqrt(A * A + Bb * Bb)
    let H = (Math.atan2(Bb, A) * 180) / Math.PI
    if (H < 0) H += 360
    return [L, C, H] as const
}

/** 내부 값(#rrggbb + 알파)을 원하는 형식의 문자열로. */
export const formatColor = (hex: string, alpha: number, format: ColorFormat): string => {
    const a = Math.round(alpha * 100) / 100
    if (format === 'rgb') {
        const [r, g, b] = hexToRgb(hex)
        return a < 1 ? `rgb(${r} ${g} ${b} / ${a})` : `rgb(${r} ${g} ${b})`
    }
    if (format === 'oklch') {
        const [L, C, H] = rgbToOklch(hexToRgb(hex))
        const body = `${(L * 100).toFixed(1)}% ${C.toFixed(3)} ${C < 0.0005 ? 0 : H.toFixed(1)}`
        return a < 1 ? `oklch(${body} / ${a})` : `oklch(${body})`
    }
    return a < 1
        ? `${hex}${Math.round(a * 255).toString(16).padStart(2, '0')}`
        : hex
}

/** #rrggbbaa 를 받으면 색과 알파로 나눈다. */
const splitHexAlpha = (v: string): [string, number] => {
    const m = /^#([0-9a-fA-F]{6})([0-9a-fA-F]{2})$/.exec(v.trim())
    if (m) return [`#${m[1]!.toLowerCase()}`, parseInt(m[2]!, 16) / 255]
    return [v, 1]
}

export type ColorPickerProps = {
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void
    /** 바뀐 값을 format 형식 문자열로 받는다 */
    onValueChange?: (value: string) => void
    swatches?: string[]
    disabled?: boolean
    /** onChange · onValueChange 로 내보낼 형식. value 는 hex(#rrggbb, #rrggbbaa) 로 받는다 */
    format?: ColorFormat
    /** 투명도 슬라이더를 보인다 */
    alpha?: boolean
    size?: FieldSize
    style?: CSSProperties
}

const DEFAULT_SWATCHES = [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#14b8a6',
    '#3b82f6',
    '#6366f1',
    '#a35def',
    '#ec4899',
    '#71717a',
    '#000000',
    '#ffffff',
]

const isValidHex = (s: string): boolean =>
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s)

const normalizeHex = (s: string): string => {
    let h = s.trim()
    if (!h.startsWith('#')) h = `#${h}`
    if (/^#[0-9a-fA-F]{3}$/.test(h)) {
        h = `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`
    }
    return h.toLowerCase()
}

export const ColorPicker = ({
    value: controlled,
    defaultValue = '#a35def',
    onChange,
    onValueChange,
    swatches = DEFAULT_SWATCHES,
    disabled,
    format = 'hex',
    alpha: withAlpha = false,
    size = 'md',
    style,
}: ColorPickerProps) => {
    const [internal, setInternal] = useState(() => splitHexAlpha(defaultValue)[0])
    const [internalAlpha, setInternalAlpha] = useState(() => splitHexAlpha(defaultValue)[1])
    const [ctrlHex, ctrlAlpha] = controlled !== undefined ? splitHexAlpha(controlled) : [undefined, undefined]
    const value = ctrlHex ?? internal
    const alphaValue = ctrlAlpha ?? internalAlpha
    const emit = (hex: string, a: number) => {
        const out = formatColor(hex, withAlpha ? a : 1, format)
        onChange?.(out)
        onValueChange?.(out)
    }
    const [open, setOpen] = useState(false)
    const [draft, setDraft] = useState(value)

    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const popoverRef = useRef<HTMLDivElement | null>(null)
    useOutsideClick([popoverRef, triggerRef], () => setOpen(false), open)

    const apply = (next: string) => {
        if (!isValidHex(next)) return
        const norm = normalizeHex(next)
        if (controlled === undefined) setInternal(norm)
        emit(norm, alphaValue)
    }

    return (
        <div style={{ display: 'inline-block', ...style }}>
            <button
                data-ds-interactive="outline"
                ref={triggerRef}
                type="button"
                disabled={disabled}
                data-ds-focusable=""
                onClick={() => {
                    setOpen((v) => !v)
                    setDraft(value)
                }}
                aria-label="색 선택"
                aria-expanded={open}
                style={{
                    height: size === 'xs' ? '24px' : size === 'sm' ? '28px' : size === 'lg' ? '44px' : '36px',
                    padding: size === 'xs' || size === 'sm' ? '0 8px' : '0 12px',
                    background: 'var(--ds-surface-inset-background)',
                    border: 'var(--ds-surface-inset-border)',
                    borderRadius: 'var(--ds-surface-inset-radius)',
                    boxShadow: 'var(--ds-surface-inset-shadow)',
                    color: 'var(--ds-color-foreground-primary)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                }}
            >
                <span
                    aria-hidden
                    style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: 'var(--ds-radius-sm)',
                        background: `linear-gradient(${formatColor(value, withAlpha ? alphaValue : 1, 'rgb')}, ${formatColor(value, withAlpha ? alphaValue : 1, 'rgb')}), repeating-conic-gradient(#ccc 0 25%, #fff 0 50%) 0 0 / 8px 8px`,
                        border: '1px solid var(--ds-color-border-subtle)',
                        flexShrink: 0,
                    }}
                />
                <span
                    style={{
                        fontFamily: 'var(--ds-typography-font-family-mono)',
                        fontSize: '12px',
                    }}
                >
                    {formatColor(value, withAlpha ? alphaValue : 1, format)}
                </span>
            </button>

            <Popover open={open} triggerRef={triggerRef} offset={6} minWidth={232}>
                <div
                    ref={popoverRef}
                    style={{
                        padding: '12px',
                        background: 'var(--ds-surface-overlay-background)',
                        backdropFilter:
                            'var(--ds-surface-overlay-backdrop-filter)',
                        border: 'var(--ds-surface-overlay-border)',
                        borderRadius: 'var(--ds-surface-overlay-radius)',
                        boxShadow: 'var(--ds-surface-overlay-shadow)',
                    }}
                >
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(6, 1fr)',
                            gap: '6px',
                            marginBottom: '12px',
                        }}
                    >
                        {swatches.map((c) => {
                            const isSelected = c.toLowerCase() === value.toLowerCase()
                            return (
                                <button
                                    data-ds-interactive="subtle"
                                    key={c}
                                    type="button"
                                    onClick={() => {
                                        apply(c)
                                        setDraft(c)
                                    }}
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        background: c,
                                        border: isSelected
                                            ? `2px solid var(--ds-color-accent-background)`
                                            : '1px solid var(--ds-color-border-subtle)',
                                        borderRadius: 'var(--ds-radius-sm)',
                                        cursor: 'pointer',
                                        padding: 0,
                                    }}
                                    aria-label={c}
                                />
                            )
                        })}
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            gap: '6px',
                            alignItems: 'center',
                        }}
                    >
                        <input
                            type="color"
                            value={value}
                            onChange={(e) => {
                                apply(e.target.value)
                                setDraft(e.target.value)
                            }}
                            style={{
                                width: '36px',
                                height: '32px',
                                padding: 0,
                                border: '1px solid var(--ds-color-border-subtle)',
                                borderRadius: 'var(--ds-radius-sm)',
                                background: 'transparent',
                                cursor: 'pointer',
                            }}
                        />
                        <input
                            type="text"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onBlur={() => apply(draft)}
                            aria-label="색상 hex 값"
                            autoComplete="off"
                            spellCheck={false}
                            data-ds-focusable=""
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') apply(draft)
                            }}
                            style={{
                                flex: 1,
                                height: '32px',
                                padding: '0 8px',
                                background:
                                    'var(--ds-color-background-inset)',
                                border: '1px solid var(--ds-color-border-subtle)',
                                borderRadius: 'var(--ds-radius-sm)',
                                color: 'var(--ds-color-foreground-primary)',
                                fontSize: '12px',
                                fontFamily:
                                    'var(--ds-typography-font-family-mono)',
                                outline: 'none',
                            }}
                        />
                    </div>
                    {withAlpha && (
                        <label
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginTop: '10px',
                                fontSize: '12px',
                                color: 'var(--ds-color-foreground-tertiary)',
                            }}
                        >
                            투명도
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={Math.round(alphaValue * 100)}
                                aria-label="투명도"
                                onChange={(e) => {
                                    const a = Number(e.target.value) / 100
                                    if (ctrlAlpha === undefined) setInternalAlpha(a)
                                    emit(value, a)
                                }}
                                style={{ flex: 1, accentColor: 'var(--ds-palette-primary-600)' }}
                            />
                            <span style={{ fontFamily: 'var(--ds-typography-font-family-mono)', width: '36px', textAlign: 'right' }}>
                                {Math.round(alphaValue * 100)}%
                            </span>
                        </label>
                    )}
                </div>
            </Popover>
        </div>
    )
}
