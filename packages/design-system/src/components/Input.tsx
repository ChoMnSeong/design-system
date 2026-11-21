import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type InputHTMLAttributes,
    type ReactNode,
    type Ref,
} from 'react'
import { fieldIconSize, type FieldSize } from './types.js'
import type { BorderVariant } from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'
import { IconClose, IconEye, IconEyeOff } from './icons.js'
import { FieldAction, FieldBox, FieldSpinner, withAddons } from './Field.js'

/**
 * 입력 마스크.
 * - 문자열 패턴: `#` 숫자, `A` 영문자, `*` 아무 글자, 그 밖의 글자는 그대로 끼워 넣는다. 예) '###-##-#####'
 * - 'bizNo': 사업자등록번호 ###-##-#####
 * - 'phone': 휴대폰·지역번호 (02-###-####, 0##-###-####, 010-####-####)
 * - RegExp: 글자 하나씩 검사해 맞는 글자만 남긴다. 예) /[0-9A-Z]/
 */
export type InputMask = string | 'bizNo' | 'phone' | RegExp

const PATTERN_TOKEN: Record<string, RegExp> = {
    '#': /\d/,
    A: /[A-Za-z]/,
    '*': /./,
}

const applyPattern = (raw: string, pattern: string) => {
    const chars = raw.split('').filter((c) => /[\dA-Za-z]/.test(c) || pattern.includes('*'))
    let out = ''
    let ci = 0
    for (let pi = 0; pi < pattern.length && ci < chars.length; pi++) {
        const p = pattern[pi]!
        const token = PATTERN_TOKEN[p]
        if (token) {
            // 패턴 자리에 맞지 않는 글자는 버린다
            while (ci < chars.length && !token.test(chars[ci]!)) ci++
            if (ci < chars.length) out += chars[ci++]
        } else {
            out += p
            if (chars[ci] === p) ci++
        }
    }
    return out
}

const phonePattern = (digits: string) => {
    if (digits.startsWith('02')) return digits.length > 9 ? '##-####-####' : '##-###-####'
    if (digits.length > 10) return '###-####-####'
    return '###-###-####'
}

export const applyMask = (value: string, mask: InputMask): string => {
    if (mask instanceof RegExp) {
        const re = new RegExp(mask.source, mask.flags.replace('g', ''))
        return value
            .split('')
            .filter((c) => re.test(c))
            .join('')
    }
    if (mask === 'bizNo') return applyPattern(value.replace(/\D/g, ''), '###-##-#####')
    if (mask === 'phone') {
        const d = value.replace(/\D/g, '').slice(0, 11)
        return applyPattern(d, phonePattern(d))
    }
    return applyPattern(value, mask)
}

const maskPlaceholder = (mask: InputMask | undefined) =>
    mask === 'bizNo' ? '000-00-00000' : mask === 'phone' ? '010-0000-0000' : undefined

export type InputProps = {
    size?: FieldSize
    variant?: BorderVariant
    invalid?: boolean
    /** 테두리 안 앞·뒤 (아이콘, 단위 등) */
    prefix?: ReactNode
    suffix?: ReactNode
    /** 테두리 밖에 붙는 고정 문구나 버튼 (https://, kg, 찾기 버튼 등) */
    addonBefore?: ReactNode
    addonAfter?: ReactNode
    fullWidth?: boolean
    /** password 타입일 때 보이기/숨기기 버튼. 기본값은 password 면 true */
    revealable?: boolean
    clearable?: boolean
    onClear?: () => void
    mask?: InputMask
    /** maxLength 와 함께 "6 / 40" 글자 수를 보여 준다. */
    showCount?: boolean
    align?: 'left' | 'right' | 'center'
    /** onValueChange 호출을 늦춘다(ms). 검색창처럼 입력마다 요청하면 안 되는 곳에 쓴다. */
    debounce?: number
    onValueChange?: (value: string) => void
    /** 뒤쪽에 스피너. 비동기 검증·검색 중 표시. */
    loading?: boolean
    ref?: Ref<HTMLInputElement>
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'>

/** controlled input 의 값을 React 가 알아채도록 바꾼다 (native setter + input 이벤트). */
const setNativeValue = (node: HTMLInputElement, value: string) => {
    const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
    )?.set
    setter?.call(node, value)
    node.dispatchEvent(new Event('input', { bubbles: true }))
}

export const Input = ({
    size = 'md',
    variant: variantProp,
    invalid = false,
    prefix,
    suffix,
    addonBefore,
    addonAfter,
    fullWidth,
    revealable,
    clearable = false,
    onClear,
    mask,
    showCount,
    align,
    debounce,
    onValueChange,
    loading,
    type = 'text',
    style,
    className,
    ref,
    onChange,
    placeholder,
    ...rest
}: InputProps) => {
    const variant = useBorderVariant(variantProp)
    const innerRef = useRef<HTMLInputElement | null>(null)
    const setRefs = useCallback(
        (node: HTMLInputElement | null) => {
            innerRef.current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) ref.current = node
        },
        [ref],
    )

    const isControlled = rest.value !== undefined
    const [innerLength, setInnerLength] = useState(
        () => String(rest.defaultValue ?? '').length,
    )
    const length = isControlled ? String(rest.value ?? '').length : innerLength

    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
    useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current)
    }, [])
    const emitValue = (v: string) => {
        if (!onValueChange) return
        if (!debounce) return onValueChange(v)
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => onValueChange(v), debounce)
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (mask) {
            const masked = applyMask(e.target.value, mask)
            if (masked !== e.target.value) e.target.value = masked
        }
        if (!isControlled) setInnerLength(e.target.value.length)
        onChange?.(e)
        emitValue(e.target.value)
    }

    const handleClear = () => {
        const node = innerRef.current
        if (node) {
            setNativeValue(node, '')
            node.focus()
        }
        if (!isControlled) setInnerLength(0)
        onClear?.()
    }

    const isPassword = type === 'password'
    const showReveal = revealable ?? isPassword
    const [revealed, setRevealed] = useState(false)
    const effectiveType = isPassword && revealed ? 'text' : type
    const showClear = clearable && length > 0 && !rest.disabled && !rest.readOnly
    const iconSize = fieldIconSize[size]

    const box = (
        <FieldBox
            size={size}
            variant={variant}
            invalid={invalid}
            readOnly={rest.readOnly}
            disabled={rest.disabled}
            fullWidth={fullWidth}
            align={align}
            style={style}
            className={className}
        >
            {prefix && <span data-slot="adorn">{prefix}</span>}
            <input
                ref={setRefs}
                type={effectiveType}
                aria-invalid={invalid || undefined}
                placeholder={placeholder ?? maskPlaceholder(mask)}
                inputMode={
                    rest.inputMode ??
                    (mask === 'bizNo' || mask === 'phone' ? 'numeric' : undefined)
                }
                onChange={handleChange}
                {...rest}
            />
            {loading && <FieldSpinner />}
            {showClear && (
                <FieldAction aria-label="지우기" onClick={handleClear} tabIndex={-1}>
                    <IconClose size={iconSize} />
                </FieldAction>
            )}
            {showReveal && (
                <FieldAction
                    aria-label={revealed ? '비밀번호 숨기기' : '비밀번호 보기'}
                    aria-pressed={revealed}
                    onClick={() => setRevealed((v) => !v)}
                    disabled={rest.disabled}
                >
                    {revealed ? <IconEyeOff size={iconSize} /> : <IconEye size={iconSize} />}
                </FieldAction>
            )}
            {showCount && rest.maxLength !== undefined && (
                <span data-slot="count" aria-live="polite">
                    {length} / {rest.maxLength}
                </span>
            )}
            {suffix && <span data-slot="adorn">{suffix}</span>}
        </FieldBox>
    )
    return withAddons(box, addonBefore, addonAfter, fullWidth)
}
