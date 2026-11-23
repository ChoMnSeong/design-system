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
    /** 체크박스 옆 라벨 */
    label?: ReactNode
    /** 라벨 아래 보조 설명 */
    description?: ReactNode
    /** 일부 선택 상태(가로줄)로 표시 */
    indeterminate?: boolean
    /** xs 12 · sm 14 · md 16 · lg 20 */
    size?: FieldSize
    /** 체크됐을 때 색. 기본 accent */
    tone?: Tone
    /** 체크 상태가 바뀔 때 (checked) */
    onCheckedChange?: (checked: boolean) => void
    /** DOM 요소 ref */
    ref?: Ref<HTMLInputElement>
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>

/** 라벨·설명을 붙일 수 있는 체크박스 */
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
    /** 체크박스로 그릴 선택지 */
    options: Option[]
    /** 제어 모드 값 */
    value?: string[]
    /** 비제어 초기값 */
    defaultValue?: string[]
    /** 값이 바뀔 때 (새 값) */
    onValueChange?: (value: string[]) => void
    /** row: 가로로 늘어놓고 줄바꿈 · column: 세로 */
    direction?: 'row' | 'column'
    /** 맨 위에 "전체 선택" 체크박스를 둔다. 문자열이면 그 라벨로. */
    selectAll?: boolean | ReactNode
    /** 각 체크박스 크기 */
    size?: FieldSize
    /** 체크됐을 때 색 */
    tone?: Tone
    /** 모든 항목 비활성 */
    disabled?: boolean
    /** 그룹 요소 인라인 스타일 */
    style?: CSSProperties
    /** 그룹 접근성 이름 */
    'aria-label'?: string
}

/** 옵션 배열로 그리는 체크박스 묶음 (전체 선택 지원) */
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
