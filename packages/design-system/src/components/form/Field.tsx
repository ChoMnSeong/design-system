import { createContext, useContext, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import type { BorderVariant } from '../borderVariant.js'
import type { FieldSize } from '../types.js'

export type FieldBoxProps = {
    /** 높이 xs 24 · sm 28 · md 36 · lg 44 (px) */
    size?: FieldSize
    /** outlined: 테두리 · filled: 채움 · underline: 밑줄 · ghost: 배경 없음 */
    variant?: BorderVariant
    /** 오류 상태 표시 */
    invalid?: boolean
    /** 읽기 전용 표시 (Form readOnly 도 따름) */
    readOnly?: boolean
    /** 비활성 표시 */
    disabled?: boolean
    /** 부모 폭을 가득 채움 */
    fullWidth?: boolean
    /** 높이를 내용에 맞춤 (여러 줄 입력용) */
    multiline?: boolean
    /** 글자 정렬 */
    align?: 'left' | 'right' | 'center'
    /** DOM 요소 ref */
    ref?: Ref<HTMLSpanElement>
} & HTMLAttributes<HTMLSpanElement>

export type FormContextValue = {
    /** 하위 FormField 의 기본 배치 */
    layout?: 'vertical' | 'horizontal' | 'inline'
    /** 하위 FormField 의 기본 라벨 폭 (px) */
    labelWidth?: number
    /** 하위 FormField 의 기본 라벨 정렬 */
    labelAlign?: 'left' | 'right'
    /** 하위 입력 컨트롤의 기본 크기 */
    size?: FieldSize
    /** 하위 입력 비활성 */
    disabled?: boolean
    /** 하위 입력 읽기 전용 */
    readOnly?: boolean
}
/** Form 이 하위 FormField · 입력 컨트롤에 일괄로 내려주는 값. */
export const FormContext = createContext<FormContextValue | null>(null)
export const useFormContext = () => useContext(FormContext)
/** prop 이 없으면 Form 의 size, 그것도 없으면 md */
export const useFormSize = (size: FieldSize | undefined): FieldSize => {
    const form = useContext(FormContext)
    return size ?? form?.size ?? 'md'
}

/** 입력 컨트롤의 테두리 상자. 스타일은 styles/field.ts. */
export const FieldBox = ({
    size = 'md',
    variant = 'outlined',
    invalid,
    readOnly,
    disabled,
    fullWidth,
    multiline,
    align,
    ref,
    ...rest
}: FieldBoxProps) => {
    const form = useContext(FormContext)
    readOnly = readOnly || form?.readOnly
    return (
    <span
        ref={ref}
        data-ds-field=""
        data-size={size}
        data-variant={variant}
        data-invalid={invalid ? '' : undefined}
        data-readonly={readOnly ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-full-width={fullWidth ? '' : undefined}
        data-multiline={multiline ? '' : undefined}
        data-align={align && align !== 'left' ? align : undefined}
        {...rest}
    />
    )
}

/** addonBefore · addonAfter 가 있으면 상자 밖에 붙여 감싼다. */
export const withAddons = (
    box: ReactNode,
    before: ReactNode,
    after: ReactNode,
    fullWidth?: boolean,
) =>
    before || after ? (
        <span data-ds-field-group="" data-full-width={fullWidth ? '' : undefined}>
            {before && <span data-slot="addon">{before}</span>}
            {box}
            {after && <span data-slot="addon">{after}</span>}
        </span>
    ) : (
        box
    )

/** 값 비우기·보이기 같은 필드 안 버튼. */
export const FieldAction = (props: HTMLAttributes<HTMLButtonElement> & { /** 누를 수 없게 */ disabled?: boolean }) => (
    <button type="button" data-slot="action" {...props} />
)

export const FieldSpinner = () => (
    <span data-slot="adorn" aria-hidden>
        <span data-ds-field-spinner="" data-ds-spinner="" />
    </span>
)
