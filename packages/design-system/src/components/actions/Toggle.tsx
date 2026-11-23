import {
    Children,
    createContext,
    isValidElement,
    useContext,
    useState,
    type HTMLAttributes,
    type KeyboardEvent,
    type ReactNode,
    type Ref,
} from 'react'
import { Button, type ButtonProps, type ButtonSize } from './Button.js'
import { ButtonGroup } from './ButtonGroup.js'
import type { Tone } from '../types.js'

export type ToggleAppearance = 'outline' | 'ghost' | 'soft'

export type ToggleProps = Omit<
    ButtonProps,
    'appearance' | 'selected' | 'variant' | 'onChange' | 'loading' | 'confirm'
> & {
    /** 제어 모드 눌림 상태 */
    pressed?: boolean
    /** 비제어 초기 눌림 상태 */
    defaultPressed?: boolean
    /** 눌림 상태가 바뀔 때 (새 상태) */
    onValueChange?: (pressed: boolean) => void
    /** @deprecated onValueChange 를 쓴다. */
    onPressedChange?: (pressed: boolean) => void
    /** outline: 테두리 · ghost: 배경 없음 · soft: 연한 배경 */
    appearance?: ToggleAppearance
    /** ToggleGroup 안에서 이 항목을 가리키는 값. */
    value?: string
    /** DOM 요소 ref */
    ref?: Ref<HTMLButtonElement>
}

type GroupCtx = {
    isOn: (v: string) => boolean
    toggle: (v: string) => void
    appearance?: ToggleAppearance
    tone?: Tone
    size?: ButtonSize
}
const ToggleGroupContext = createContext<GroupCtx | null>(null)

/**
 * 켜고 끄는 버튼. 눌림은 aria-pressed 로 나가고 스타일은 Button 과 같은 시트를 쓴다.
 * - outline · ghost: 눌리면 강조색 옅은 바탕 + accent 글자
 * - soft + tone: 눌리면 해당 톤 solid (예: 알람 켜짐)
 */
export const Toggle = ({
    pressed: pressedProp,
    defaultPressed = false,
    onValueChange,
    onPressedChange,
    appearance,
    tone,
    size,
    value,
    onClick,
    ...rest
}: ToggleProps) => {
    const group = useContext(ToggleGroupContext)
    const [inner, setInner] = useState(defaultPressed)
    const inGroup = group !== null && value !== undefined
    const pressed = inGroup ? group.isOn(value) : (pressedProp ?? inner)
    const resolvedAppearance = appearance ?? group?.appearance ?? 'outline'
    return (
        <Button
            appearance={resolvedAppearance}
            tone={tone ?? group?.tone ?? 'neutral'}
            size={size ?? group?.size}
            selected={pressed}
            data-ds-toggle=""
            onClick={(e) => {
                onClick?.(e)
                if (e.defaultPrevented) return
                if (inGroup) {
                    group.toggle(value)
                    return
                }
                const next = !pressed
                if (pressedProp === undefined) setInner(next)
                onValueChange?.(next)
                onPressedChange?.(next)
            }}
            {...rest}
        />
    )
}

type SingleProps = {
    /** single: 하나만 켜짐 · multiple: 여러 개 켜짐 */
    type?: 'single'
    /** 제어 모드 값 (켜진 항목의 value, 없으면 null) */
    value?: string | null
    /** 비제어 초기값 */
    defaultValue?: string | null
    /** 값이 바뀔 때 (새 값) */
    onValueChange?: (value: string | null) => void
    /** single 에서 이미 켜진 항목을 다시 눌러 끌 수 있는지. */
    allowEmpty?: boolean
}
type MultipleProps = {
    /** single: 하나만 켜짐 · multiple: 여러 개 켜짐 */
    type: 'multiple'
    /** 제어 모드 값 (켜진 항목 value 배열) */
    value?: string[]
    /** 비제어 초기값 */
    defaultValue?: string[]
    /** 값이 바뀔 때 (새 값) */
    onValueChange?: (value: string[]) => void
    /** multiple 에서는 쓰지 않음 */
    allowEmpty?: never
}

export type ToggleGroupProps = (SingleProps | MultipleProps) & {
    /** 자식 Toggle 의 기본 appearance */
    appearance?: ToggleAppearance
    /** 자식 Toggle 의 기본 톤 */
    tone?: Tone
    /** 자식 Toggle 의 기본 크기 */
    size?: ButtonSize
    /** 기본: single 은 붙여서(세그먼트처럼), multiple 은 띄워서. */
    attached?: boolean
    /** 배치 방향. 방향키 이동도 이 축을 따름 */
    orientation?: 'horizontal' | 'vertical'
    /** value 를 지정한 Toggle 들 */
    children: ReactNode
} & Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>

/** 여러 Toggle 중 하나 또는 여러 개를 켜는 그룹 */
export const ToggleGroup = (props: ToggleGroupProps) => {
    const {
        type = 'single',
        value: valueProp,
        defaultValue,
        onValueChange,
        allowEmpty = false,
        appearance,
        tone,
        size,
        attached,
        orientation,
        children,
        ...rest
    } = props as ToggleGroupProps & {
        value?: string | string[] | null
        defaultValue?: string | string[] | null
        onValueChange?: (v: unknown) => void
        allowEmpty?: boolean
    }
    const multiple = type === 'multiple'
    const [inner, setInner] = useState<string | string[] | null>(
        defaultValue ?? (multiple ? [] : null),
    )
    const current = valueProp !== undefined ? valueProp : inner
    const list: string[] = Array.isArray(current) ? current : current ? [current] : []

    const set = (next: string | string[] | null) => {
        if (valueProp === undefined) setInner(next)
        onValueChange?.(next)
    }
    const ctx: GroupCtx = {
        isOn: (v) => list.includes(v),
        toggle: (v) => {
            if (multiple) {
                set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
            } else if (list[0] === v) {
                if (allowEmpty) set(null)
            } else set(v)
        },
        appearance,
        tone,
        size,
    }

    // 방향키로 항목 사이를 옮긴다 (roving 은 아니고 포커스 이동만).
    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const keys =
            orientation === 'vertical' ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight']
        if (!keys.includes(e.key)) return
        const btns = Array.from(
            e.currentTarget.querySelectorAll<HTMLButtonElement>('[data-ds-toggle]:not(:disabled)'),
        )
        const i = btns.indexOf(document.activeElement as HTMLButtonElement)
        if (i < 0) return
        e.preventDefault()
        const d = e.key === keys[1] ? 1 : -1
        btns[(i + d + btns.length) % btns.length]?.focus()
    }

    const count = Children.toArray(children).filter(isValidElement).length
    return (
        <ToggleGroupContext.Provider value={ctx}>
            <ButtonGroup
                attached={attached ?? (!multiple && count > 1)}
                orientation={orientation}
                onKeyDown={onKeyDown}
                {...rest}
            >
                {children}
            </ButtonGroup>
        </ToggleGroupContext.Provider>
    )
}
