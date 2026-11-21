import { useState, type InputHTMLAttributes, type ReactNode, type Ref } from 'react'
import type { FieldSize, Tone } from './types.js'

export type SwitchProps = {
    /** xs 24×14 · sm 28×16 · md 36×20 · lg 44×24 */
    size?: FieldSize
    label?: ReactNode
    /** 라벨을 스위치 앞(start)에 둘지 뒤(end)에 둘지. 기본 end */
    labelPosition?: 'start' | 'end'
    /** 켜짐·꺼짐에 따라 바뀌는 라벨. label 보다 우선 */
    onLabel?: ReactNode
    offLabel?: ReactNode
    /** 변경을 서버에 반영하는 중. 스위치 대신 스피너를 보이고 입력을 막는다 */
    loading?: boolean
    tone?: Tone
    onCheckedChange?: (checked: boolean) => void
    ref?: Ref<HTMLInputElement>
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>

export const Switch = ({
    size = 'md',
    label,
    labelPosition = 'end',
    onLabel,
    offLabel,
    loading,
    tone,
    onCheckedChange,
    onChange,
    checked: checkedProp,
    defaultChecked,
    disabled,
    className,
    style,
    ref,
    ...rest
}: SwitchProps) => {
    const [inner, setInner] = useState(!!defaultChecked)
    const checked = checkedProp ?? inner
    const text = checked ? (onLabel ?? label) : (offLabel ?? label)
    const control = loading ? (
        <span data-ds-switch-loading="" data-size={size} role="status" aria-label="적용 중">
            <span data-ds-field-spinner="" data-ds-spinner="" />
        </span>
    ) : (
        <input
            ref={ref}
            type="checkbox"
            role="switch"
            data-ds-switch=""
            data-size={size}
            data-tone={tone}
            checked={checked}
            aria-checked={checked}
            disabled={disabled}
            onChange={(e) => {
                if (checkedProp === undefined) setInner(e.target.checked)
                onChange?.(e)
                onCheckedChange?.(e.target.checked)
            }}
            {...rest}
        />
    )
    if (!text) return control
    return (
        <label
            data-ds-choice=""
            data-switch=""
            data-size={size}
            data-disabled={disabled || loading ? '' : undefined}
            className={className}
            style={style}
        >
            {labelPosition === 'start' && <span data-slot="text">{text}</span>}
            {control}
            {labelPosition === 'end' && <span data-slot="text">{text}</span>}
        </label>
    )
}
