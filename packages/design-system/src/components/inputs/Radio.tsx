import {
    createContext,
    useContext,
    useId,
    useState,
    type CSSProperties,
    type InputHTMLAttributes,
    type ReactNode,
    type Ref,
} from 'react'
import type { FieldSize, Option } from '../types.js'

type RadioCtxValue = {
    name: string
    value: string | undefined
    select: (v: string) => void
    disabled?: boolean
    size: FieldSize
    appearance: RadioAppearance
}
const RadioCtx = createContext<RadioCtxValue | null>(null)

export type RadioAppearance = 'default' | 'card' | 'button'

export type RadioGroupProps = {
    name?: string
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    /** @deprecated onValueChange 를 쓴다. */
    onChange?: (value: string) => void
    /** children 대신 옵션 배열로 그린다. */
    options?: Option[]
    /** default: 동그라미, card: 설명이 있는 카드 선택, button: 붙은 버튼 */
    appearance?: RadioAppearance
    direction?: 'row' | 'column'
    size?: FieldSize
    disabled?: boolean
    children?: ReactNode
    style?: CSSProperties
    'aria-label'?: string
    'aria-labelledby'?: string
}

export const RadioGroup = ({
    name,
    value: valueProp,
    defaultValue,
    onValueChange,
    onChange,
    options,
    appearance = 'default',
    direction,
    size = 'md',
    disabled,
    children,
    style,
    ...aria
}: RadioGroupProps) => {
    const autoName = useId()
    const [inner, setInner] = useState(defaultValue)
    const value = valueProp ?? inner
    const dir = direction ?? (appearance === 'default' ? 'column' : 'row')
    return (
        <RadioCtx.Provider
            value={{
                name: name ?? autoName,
                value,
                select: (v) => {
                    if (valueProp === undefined) setInner(v)
                    onValueChange?.(v)
                    onChange?.(v)
                },
                disabled,
                size,
                appearance,
            }}
        >
            <div
                role="radiogroup"
                data-ds-choice-group=""
                data-direction={dir}
                data-appearance={appearance}
                style={style}
                {...aria}
            >
                {options
                    ? options.map((o) => (
                          <Radio
                              key={o.value}
                              value={o.value}
                              label={o.label}
                              description={o.description}
                              disabled={o.disabled}
                          />
                      ))
                    : children}
            </div>
        </RadioCtx.Provider>
    )
}

export type RadioProps = {
    label?: ReactNode
    description?: ReactNode
    value: string
    size?: FieldSize
    ref?: Ref<HTMLInputElement>
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'value' | 'name'>

export const Radio = ({
    label,
    description,
    value,
    size: sizeProp,
    disabled: ownDisabled,
    checked: checkedProp,
    onChange,
    className,
    style,
    ref,
    ...rest
}: RadioProps) => {
    const ctx = useContext(RadioCtx)
    const descId = useId()
    const size = sizeProp ?? ctx?.size ?? 'md'
    const disabled = ownDisabled ?? ctx?.disabled
    const checked = ctx ? ctx.value === value : checkedProp
    const appearance = ctx?.appearance ?? 'default'
    return (
        <label
            data-ds-choice=""
            data-size={size}
            data-appearance={appearance}
            data-checked={checked ? '' : undefined}
            data-disabled={disabled ? '' : undefined}
            className={className}
            style={style}
        >
            <input
                ref={ref}
                type="radio"
                data-ds-radio=""
                data-size={size}
                name={ctx?.name}
                value={value}
                checked={checked}
                disabled={disabled}
                aria-describedby={description ? descId : undefined}
                onChange={(e) => {
                    onChange?.(e)
                    if (e.target.checked) ctx?.select(value)
                }}
                {...rest}
            />
            {(label || description) && (
                <span data-slot="text">
                    {appearance === 'card' ? <b>{label}</b> : label}
                    {description && (
                        <small id={descId} data-slot="desc">
                            {description}
                        </small>
                    )}
                </span>
            )}
        </label>
    )
}
