import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type ClipboardEvent,
    type KeyboardEvent,
} from 'react'
import { mergeStyles, type Size } from '../types.js'
import {
    borderVariantContainerStyle,
    type BorderVariant,
} from '../borderVariant.js'
import { useBorderVariant } from '../../provider/useDesignSystem.js'

export type OTPInputProps = {
    /** 칸 개수 */
    length?: number
    /** 제어 모드 값 */
    value?: string
    /** 비제어 초기값 */
    defaultValue?: string
    /** 값이 바뀔 때 (새 값) */
    onChange?: (value: string) => void
    /** 모든 칸이 찼을 때 (전체 값) */
    onComplete?: (value: string) => void
    /** numeric: 숫자만 · alphanumeric: 영문·숫자 */
    type?: 'numeric' | 'alphanumeric'
    /** 마운트 시 첫 칸에 포커스 */
    autoFocus?: boolean
    /** 비활성 */
    disabled?: boolean
    /** 칸 테두리. outlined 테두리 · filled 채운 배경 · underline 밑줄 · ghost 투명 */
    variant?: BorderVariant
    /** 입력한 글자를 ● 로 가린다 */
    mask?: boolean
    /** 칸 크기. sm 32 · md 40 · lg 48 */
    size?: Size
    /** 오류 상태. 칸 테두리를 빨갛게 */
    invalid?: boolean
    /** 그룹 접근성 이름. 칸마다 "n번째 자리" 가 붙는다 */
    'aria-label'?: string
    /** 루트 요소 인라인 스타일 */
    style?: CSSProperties
}

/** 한 칸에 한 글자씩 받는 인증번호 입력 */
export const OTPInput = ({
    length = 6,
    value: controlled,
    defaultValue = '',
    onChange,
    onComplete,
    type = 'numeric',
    autoFocus,
    disabled,
    variant: variantProp,
    mask,
    size = 'md',
    invalid,
    'aria-label': ariaLabel = '인증번호',
    style,
}: OTPInputProps) => {
    const variant = useBorderVariant(variantProp)
    const [internal, setInternal] = useState(defaultValue.slice(0, length))
    const value = (controlled ?? internal).slice(0, length)
    const refs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        if (autoFocus) refs.current[0]?.focus()
    }, [autoFocus])

    const update = (next: string) => {
        const trimmed = next.slice(0, length)
        if (controlled === undefined) setInternal(trimmed)
        onChange?.(trimmed)
        if (trimmed.length === length) onComplete?.(trimmed)
    }

    const isValid = (ch: string): boolean => {
        if (type === 'numeric') return /^\d$/.test(ch)
        return /^[0-9a-zA-Z]$/.test(ch)
    }

    const onCharChange = (idx: number, raw: string) => {
        const ch = raw.slice(-1)
        if (ch && !isValid(ch)) return
        const arr = value.padEnd(length, ' ').split('')
        arr[idx] = ch || ' '
        const next = arr.join('').replace(/\s+$/, '')
        update(next)
        if (ch && idx < length - 1) {
            refs.current[idx + 1]?.focus()
        }
    }

    const onKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !value[idx] && idx > 0) {
            refs.current[idx - 1]?.focus()
        } else if (e.key === 'ArrowLeft' && idx > 0) {
            refs.current[idx - 1]?.focus()
        } else if (e.key === 'ArrowRight' && idx < length - 1) {
            refs.current[idx + 1]?.focus()
        }
    }

    const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text').trim()
        const filtered = text
            .split('')
            .filter(isValid)
            .slice(0, length)
            .join('')
        if (filtered) {
            update(filtered)
            const next = Math.min(filtered.length, length - 1)
            refs.current[next]?.focus()
        }
    }

    const cellSize = size === 'sm' ? 32 : size === 'lg' ? 48 : 40
    const cellStyle: CSSProperties = {
        width: `${cellSize}px`,
        height: `${cellSize + 6}px`,
        textAlign: 'center',
        fontSize: size === 'sm' ? '15px' : size === 'lg' ? '22px' : '18px',
        fontWeight: 700,
        fontFamily: 'var(--ds-typography-font-family-mono)',
        color: 'var(--ds-color-foreground-primary)',
        outline: 'none',
        ...borderVariantContainerStyle(variant, { surfaceToken: 'inset', invalid }),
    }

    return (
        <div
            role="group"
            aria-label={ariaLabel}
            style={mergeStyles(
                {
                    display: 'inline-flex',
                    gap: '6px',
                    opacity: disabled ? 0.5 : 1,
                },
                style,
            )}
        >
            {Array.from({ length }, (_, idx) => (
                <input
                    data-ds-numeric=""
                    key={idx}
                    ref={(el) => {
                        refs.current[idx] = el
                    }}
                    type={mask ? 'password' : 'text'}
                    aria-label={`${ariaLabel} ${idx + 1}번째 자리`}
                    aria-invalid={invalid || undefined}
                    inputMode={type === 'numeric' ? 'numeric' : 'text'}
                    autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                    spellCheck={false}
                    maxLength={1}
                    value={value[idx] ?? ''}
                    disabled={disabled}
                    onChange={(e) => onCharChange(idx, e.target.value)}
                    onKeyDown={(e) => onKeyDown(idx, e)}
                    onPaste={onPaste}
                    onFocus={(e) => e.currentTarget.select()}
                    data-ds-focusable=""
                    data-ds-input-variant={variant}
                    style={cellStyle}
                />
            ))}
        </div>
    )
}
