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
    /** input name. 없으면 자동 생성 */
    name?: string
    /** 제어 모드 값 */
    value?: string
    /** 비제어 초기값 */
    defaultValue?: string
    /** 값이 바뀔 때 (새 값) */
    onValueChange?: (value: string) => void
    /** @deprecated onValueChange 를 쓴다. */
    onChange?: (value: string) => void
    /** children 대신 옵션 배열로 그린다. */
    options?: Option[]
    /** default: 동그라미, card: 설명이 있는 카드 선택, button: 붙은 버튼 */
    appearance?: RadioAppearance
    /** 배치 방향. 없으면 default 형은 column, 그 밖은 row */
    direction?: 'row' | 'column'
    /** 하위 Radio 크기 */
    size?: FieldSize
    /** 모든 Radio 비활성 */
    disabled?: boolean
    /** Radio 요소들 (options 가 없을 때) */
    children?: ReactNode
    /** 그룹 요소 인라인 스타일 */
    style?: CSSProperties
    /** 그룹 접근성 이름 */
    'aria-label'?: string
    /** 그룹 이름이 되는 요소 id */
    'aria-labelledby'?: string
}

/** 하나만 고르는 라디오 묶음 */
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
    /** 라디오 옆 라벨. card 형에선 굵게 */
    label?: ReactNode
    /** 라벨 아래 보조 설명 */
    description?: ReactNode
    /** 선택될 때 그룹에 넘기는 값 */
    value: string
    /** xs 12 · sm 14 · md 16 · lg 20. 없으면 그룹 크기 */
    size?: FieldSize
    /** DOM 요소 ref */
    ref?: Ref<HTMLInputElement>
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'value' | 'name'>

/** RadioGroup 안에 두는 라디오 하나 */
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
