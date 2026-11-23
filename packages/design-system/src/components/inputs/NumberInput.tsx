import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type InputHTMLAttributes,
    type ReactNode,
    type Ref,
} from 'react'
import { fieldIconSize, type FieldSize } from '../types.js'
import type { BorderVariant } from '../borderVariant.js'
import { useBorderVariant } from '../../provider/useDesignSystem.js'
import { IconChevronDown, IconChevronUp, IconMinus, IconPlus } from '../icons.js'
import { FieldBox, useFormSize } from '../form/Field.js'

export type NumberInputProps = {
    /** 제어 모드 값. 비어 있으면 null */
    value?: number | null
    /** 비제어 초기값 */
    defaultValue?: number | null
    /** 값이 바뀔 때 (새 값, 비우면 null) */
    onValueChange?: (value: number | null) => void
    /** @deprecated onValueChange 를 쓴다. 빈 값이면 호출되지 않는다. */
    onChange?: (value: number) => void
    /** 최솟값 */
    min?: number
    /** 최댓값 */
    max?: number
    /** 스테퍼·위아래 화살표 키로 바뀌는 양 */
    step?: number
    /** 소수 자릿수. 표시와 반올림에 쓴다. */
    precision?: number
    /** true 면 ',' 로, 문자열이면 그 글자로 천 단위를 끊는다. 기본 true. */
    thousandSeparator?: boolean | string
    /** 직접 서식을 정한다. thousandSeparator · precision 보다 우선. */
    formatValue?: (n: number) => string
    /** 값 뒤 단위 (kg, %, 원) */
    unit?: ReactNode
    /** both: 양쪽 −/+, right: 오른쪽 위아래 화살표, none: 없음 */
    stepper?: 'both' | 'right' | 'none'
    /** 음수 입력 허용 */
    allowNegative?: boolean
    /** 포커스가 빠질 때 min·max 안으로 맞춘다. false 면 범위를 벗어난 값은 invalid 로 보인다. */
    clampOnBlur?: boolean
    /** 오류 상태. 범위를 벗어나도 오류로 보인다 */
    invalid?: boolean
    /** 읽기 전용. 스테퍼도 막는다 */
    readOnly?: boolean
    /** 비활성 */
    disabled?: boolean
    /** 높이 xs 24 · sm 28 · md 36 · lg 44. 없으면 Form 값 */
    size?: FieldSize
    /** outlined 테두리 · filled 채운 배경 · underline 밑줄 · ghost 투명 */
    variant?: BorderVariant
    /** 값이 없을 때 안내 문구 */
    placeholder?: string
    /** 부모 너비를 꽉 채운다 */
    fullWidth?: boolean
    /** 테두리 상자 인라인 스타일 */
    style?: CSSProperties
    /** DOM 요소 ref */
    ref?: Ref<HTMLInputElement>
} & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'size' | 'type' | 'min' | 'max' | 'step'
>

const round = (n: number, p?: number) =>
    p === undefined ? n : Math.round(n * 10 ** p) / 10 ** p

/** 천 단위 서식과 스테퍼가 있는 숫자 입력 */
export const NumberInput = ({
    value: valueProp,
    defaultValue = null,
    onValueChange,
    onChange,
    min,
    max,
    step = 1,
    precision,
    thousandSeparator = true,
    formatValue,
    unit,
    stepper = 'both',
    allowNegative = true,
    clampOnBlur = true,
    invalid,
    readOnly,
    disabled,
    size: sizeProp,
    variant: variantProp,
    placeholder,
    fullWidth,
    style,
    className,
    ref,
    onBlur,
    onFocus,
    onKeyDown,
    ...rest
}: NumberInputProps) => {
    const variant = useBorderVariant(variantProp)
    const size = useFormSize(sizeProp)
    const [inner, setInner] = useState<number | null>(defaultValue)
    const value = valueProp !== undefined ? valueProp : inner
    const [focused, setFocused] = useState(false)
    const [draft, setDraft] = useState('')

    const sep = thousandSeparator === true ? ',' : thousandSeparator || ''
    const format = (n: number | null) => {
        if (n === null || Number.isNaN(n)) return ''
        if (formatValue) return formatValue(n)
        const fixed = precision !== undefined ? n.toFixed(precision) : String(n)
        if (!sep) return fixed
        const [i, d] = fixed.split('.')
        const neg = i!.startsWith('-')
        const body = (neg ? i!.slice(1) : i!).replace(/\B(?=(\d{3})+(?!\d))/g, sep)
        return `${neg ? '-' : ''}${body}${d !== undefined ? `.${d}` : ''}`
    }

    const commit = (n: number | null) => {
        if (valueProp === undefined) setInner(n)
        onValueChange?.(n)
        if (n !== null) onChange?.(n)
    }
    const clamp = (n: number) => {
        let v = round(n, precision)
        if (!allowNegative && v < 0) v = 0
        if (min !== undefined && v < min) v = min
        if (max !== undefined && v > max) v = max
        return v
    }
    const bump = (dir: 1 | -1) => {
        if (disabled || readOnly) return
        commit(clamp((value ?? 0) + dir * step))
    }

    // 포커스 중에는 사용자가 친 글자를 그대로 두고, 빠질 때 서식을 입힌다.
    const prevValue = useRef(value)
    useEffect(() => {
        if (!focused && prevValue.current !== value) setDraft('')
        prevValue.current = value
    }, [value, focused])

    const outOfRange =
        value !== null &&
        ((min !== undefined && value < min) ||
            (max !== undefined && value > max) ||
            (!allowNegative && value < 0))

    const iconSize = fieldIconSize[size]
    const stepBtn = (dir: 1 | -1, label: string, icon: ReactNode, s?: CSSProperties) => (
        <button
            type="button"
            data-slot="action"
            tabIndex={-1}
            aria-label={label}
            disabled={disabled || readOnly}
            onClick={() => bump(dir)}
            style={s}
        >
            {icon}
        </button>
    )

    return (
        <FieldBox
            size={size}
            variant={variant}
            invalid={invalid || outOfRange}
            readOnly={readOnly}
            disabled={disabled}
            fullWidth={fullWidth}
            align={stepper === 'both' ? 'center' : 'right'}
            data-ds-numberinput=""
            style={{
                ...(stepper === 'both' ? { paddingLeft: 4, paddingRight: 4 } : null),
                ...(stepper === 'right' ? { paddingRight: 0 } : null),
                ...style,
            }}
            className={className}
        >
            {stepper === 'both' && stepBtn(-1, '감소', <IconMinus size={iconSize} />, { margin: 0, padding: 6 })}
            <input
                ref={ref}
                type="text"
                inputMode={precision ? 'decimal' : 'numeric'}
                role="spinbutton"
                aria-valuenow={value ?? undefined}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-invalid={invalid || outOfRange || undefined}
                data-ds-numeric=""
                readOnly={readOnly}
                disabled={disabled}
                placeholder={placeholder}
                value={focused ? draft : format(value)}
                onFocus={(e) => {
                    setFocused(true)
                    setDraft(value === null ? '' : String(round(value, precision)))
                    onFocus?.(e)
                }}
                onChange={(e) => {
                    const raw = e.target.value
                    const re = allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/
                    const cleaned = raw.split(sep || '\u0000').join('')
                    if (!re.test(cleaned)) return
                    setDraft(cleaned)
                    if (cleaned === '' || cleaned === '-' || cleaned === '.') {
                        commit(null)
                        return
                    }
                    const n = Number(cleaned)
                    if (!Number.isNaN(n)) commit(n)
                }}
                onBlur={(e) => {
                    setFocused(false)
                    if (value !== null && clampOnBlur) {
                        const c = clamp(value)
                        if (c !== value) commit(c)
                    } else if (value !== null && precision !== undefined) {
                        commit(round(value, precision))
                    }
                    onBlur?.(e)
                }}
                onKeyDown={(e) => {
                    onKeyDown?.(e)
                    if (e.key === 'ArrowUp') {
                        e.preventDefault()
                        bump(1)
                    } else if (e.key === 'ArrowDown') {
                        e.preventDefault()
                        bump(-1)
                    }
                }}
                {...rest}
            />
            {unit && (
                <span data-slot="adorn" style={{ fontSize: '12px' }}>
                    {unit}
                </span>
            )}
            {stepper === 'both' && stepBtn(1, '증가', <IconPlus size={iconSize} />, { margin: 0, padding: 6 })}
            {stepper === 'right' && (
                <span
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignSelf: 'stretch',
                        borderLeft: '1px solid var(--ds-color-border-subtle)',
                    }}
                >
                    {stepBtn(1, '증가', <IconChevronUp size={12} />, { flex: 1, width: 24, margin: 0, padding: 0, borderRadius: 0 })}
                    {stepBtn(-1, '감소', <IconChevronDown size={12} />, { flex: 1, width: 24, margin: 0, padding: 0, borderRadius: 0 })}
                </span>
            )}
        </FieldBox>
    )
}
