import {
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
    type CSSProperties,
    type InputHTMLAttributes,
    type ReactNode,
    type Ref,
} from 'react'
import type { FieldSize, Option, Tone } from '../types.js'

export type CheckboxProps = {
    label?: ReactNode
    /** 라벨 아래 보조 설명 */
    description?: ReactNode
    indeterminate?: boolean
    /** xs 12 · sm 14 · md 16 · lg 20 */
    size?: FieldSize
    /** 체크됐을 때 색. 기본 accent */
    tone?: Tone
    onCheckedChange?: (checked: boolean) => void
    ref?: Ref<HTMLInputElement>
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>

export const Checkbox = ({
    label,
    description,
    indeterminate,
    size = 'md',
    tone,
    onCheckedChange,
    onChange,
    className,
    style,
    ref,
    ...rest
}: CheckboxProps) => {
    const inner = useRef<HTMLInputElement | null>(null)
    useEffect(() => {
        if (inner.current) inner.current.indeterminate = !!indeterminate
    }, [indeterminate])
    const setRef = useCallback(
        (node: HTMLInputElement | null) => {
            inner.current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) (ref as { current: HTMLInputElement | null }).current = node
        },
        [ref],
    )
    const descId = useId()
    const input = (
        <input
            ref={setRef}
            type="checkbox"
            data-ds-checkbox=""
            data-size={size}
            data-tone={tone}
            data-indeterminate={indeterminate ? '' : undefined}
            aria-describedby={description ? descId : undefined}
            onChange={(e) => {
                onChange?.(e)
                onCheckedChange?.(e.target.checked)
            }}
            {...rest}
        />
    )
    if (!label && !description) return input
    return (
        <label
            data-ds-choice=""
            data-size={size}
            data-disabled={rest.disabled ? '' : undefined}
            className={className}
            style={style}
        >
            {input}
            <span data-slot="text">
                {label}
                {description && (
                    <small id={descId} data-slot="desc">
                        {description}
                    </small>
                )}
            </span>
        </label>
    )
}

export type CheckboxGroupProps = {
    options: Option[]
    value?: string[]
    defaultValue?: string[]
    onValueChange?: (value: string[]) => void
    direction?: 'row' | 'column'
    /** 맨 위에 "전체 선택" 체크박스를 둔다. 문자열이면 그 라벨로. */
    selectAll?: boolean | ReactNode
    size?: FieldSize
    tone?: Tone
    disabled?: boolean
    style?: CSSProperties
    'aria-label'?: string
}

export const CheckboxGroup = ({
    options,
    value: valueProp,
    defaultValue = [],
    onValueChange,
    direction = 'column',
    selectAll,
    size = 'md',
    tone,
    disabled,
    style,
    'aria-label': ariaLabel,
}: CheckboxGroupProps) => {
    const [inner, setInner] = useState(defaultValue)
    const value = valueProp ?? inner
    const set = (next: string[]) => {
        if (valueProp === undefined) setInner(next)
        onValueChange?.(next)
    }
    const enabled = options.filter((o) => !o.disabled).map((o) => o.value)
    const allOn = enabled.length > 0 && enabled.every((v) => value.includes(v))
    const someOn = !allOn && enabled.some((v) => value.includes(v))
    return (
        <div
            role="group"
            aria-label={ariaLabel}
            data-ds-choice-group=""
            data-direction={direction}
            style={style}
        >
            {selectAll && (
                <Checkbox
                    size={size}
                    tone={tone}
                    disabled={disabled}
                    label={selectAll === true ? '전체 선택' : selectAll}
                    checked={allOn}
                    indeterminate={someOn}
                    onCheckedChange={(on) =>
                        set(
                            on
                                ? Array.from(new Set([...value, ...enabled]))
                                : value.filter((v) => !enabled.includes(v)),
                        )
                    }
                />
            )}
            <div data-ds-choice-group="" data-direction={direction} data-indent={selectAll ? '' : undefined}>
                {options.map((o) => (
                    <Checkbox
                        key={o.value}
                        size={size}
                        tone={tone}
                        label={o.label}
                        description={o.description}
                        disabled={disabled || o.disabled}
                        checked={value.includes(o.value)}
                        onCheckedChange={(on) =>
                            set(on ? [...value, o.value] : value.filter((v) => v !== o.value))
                        }
                    />
                ))}
            </div>
        </div>
    )
}
