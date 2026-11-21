import {
    cloneElement,
    isValidElement,
    useId,
    type CSSProperties,
    type FormHTMLAttributes,
    type HTMLAttributes,
    type ReactElement,
    type ReactNode,
    type Ref,
} from 'react'
import { Label } from './Label.js'
import { FormContext, useFormContext, type FormContextValue } from './Field.js'
import type { FieldSize } from './types.js'

export type FormFieldProps = {
    label?: ReactNode
    htmlFor?: string
    required?: boolean
    optional?: boolean | ReactNode
    tooltip?: ReactNode
    /** 라벨 아래 보조 설명 */
    description?: ReactNode
    /** 입력 아래 안내 (오류가 있으면 오류가 대신 보인다) */
    hint?: ReactNode
    error?: ReactNode
    /** vertical: 라벨 위 · horizontal: 라벨 왼쪽(labelWidth) · inline: 한 줄 (필터바) */
    layout?: 'vertical' | 'horizontal' | 'inline'
    labelWidth?: number
    labelAlign?: 'left' | 'right'
    /** Form columns 안에서 차지할 칸 수 */
    span?: number
    children: ReactNode
    ref?: Ref<HTMLDivElement>
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

export const FormField = ({
    label,
    htmlFor,
    required,
    optional,
    tooltip,
    description,
    error,
    hint,
    layout: layoutProp,
    labelWidth: lwProp,
    labelAlign: laProp,
    span,
    children,
    style,
    ref,
    ...rest
}: FormFieldProps) => {
    const form = useFormContext()
    const layout = layoutProp ?? form?.layout ?? 'vertical'
    const labelWidth = lwProp ?? form?.labelWidth ?? 120
    const labelAlign = laProp ?? form?.labelAlign ?? 'left'
    const uid = useId()
    const fieldId = htmlFor ?? `${uid}-field`
    const descriptionId = description ? `${uid}-description` : undefined
    const messageId = error || hint ? `${uid}-message` : undefined
    const describedBy = [descriptionId, messageId].filter(Boolean).join(' ') || undefined

    // Fragment 는 props 를 버리고, 자식이 여럿이면 어디에 붙일지 모른다. 그때는 주입하지 않고
    // 라벨이 없는 id 를 가리키지 않도록 htmlFor 도 비운다.
    const injectable = isValidElement(children) && typeof children.type !== 'symbol'
    const props = injectable ? (children as ReactElement<Record<string, unknown>>).props : {}
    const control = injectable
        ? cloneElement(children as ReactElement<Record<string, unknown>>, {
              id: (props.id as string | undefined) ?? fieldId,
              'aria-describedby': (props['aria-describedby'] as string | undefined) ?? describedBy,
              'aria-invalid': (props['aria-invalid'] as boolean | undefined) ?? (error ? true : undefined),
              'aria-required': (props['aria-required'] as boolean | undefined) ?? (required || undefined),
              invalid: (props.invalid as boolean | undefined) ?? (error ? true : undefined),
          })
        : children
    const labelFor = injectable ? ((props.id as string | undefined) ?? fieldId) : htmlFor

    return (
        <div
            ref={ref}
            data-ds-form-field=""
            data-layout={layout}
            style={{
                ...(span ? { gridColumn: `span ${span}` } : null),
                ...(layout === 'horizontal' ? ({ '--_lw': `${labelWidth}px` } as CSSProperties) : null),
                ...style,
            }}
            {...rest}
        >
            {label && (
                <div data-slot="label" data-align={labelAlign}>
                    <Label
                        htmlFor={labelFor}
                        required={required}
                        optional={optional}
                        tooltip={tooltip}
                        size={layout === 'horizontal' ? 'md' : 'sm'}
                    >
                        {label}
                    </Label>
                    {description && layout !== 'inline' && (
                        <span id={descriptionId} data-slot="desc">
                            {description}
                        </span>
                    )}
                </div>
            )}
            <div data-slot="body">
                {control}
                {(error || hint) && (
                    <span id={messageId} data-slot={error ? 'error' : 'hint'} role={error ? 'alert' : undefined}>
                        {error || hint}
                    </span>
                )}
            </div>
        </div>
    )
}

export type FormProps = {
    layout?: FormContextValue['layout']
    labelWidth?: number
    labelAlign?: 'left' | 'right'
    /** 하위 입력 컨트롤의 기본 크기 */
    size?: FieldSize
    /** 하위 입력을 모두 막는다 (fieldset disabled) */
    disabled?: boolean
    /** 하위 입력을 읽기 전용으로 (조회 화면) */
    readOnly?: boolean
    /** 격자 열 수. 객체면 컨테이너 폭 기준 반응형 { 0: 1, 640: 2, 960: 4 } */
    columns?: number | Record<number, number>
    /** 열 사이 간격 (px) */
    gap?: number
    ref?: Ref<HTMLFormElement>
} & FormHTMLAttributes<HTMLFormElement>

export const Form = ({
    layout = 'vertical',
    labelWidth,
    labelAlign,
    size,
    disabled,
    readOnly,
    columns,
    gap,
    style,
    children,
    ref,
    ...rest
}: FormProps) => {
    const cols = typeof columns === 'number' ? columns : undefined
    const responsive = typeof columns === 'object' ? columns : undefined
    const id = useId().replace(/:/g, '')
    const respCss = responsive
        ? Object.entries(responsive)
              .sort(([a], [b]) => +a - +b)
              .map(([w, n]) =>
                  +w === 0
                      ? `[data-ds-form-grid="${id}"]{grid-template-columns:repeat(${n},minmax(0,1fr))}`
                      : `@container ds-form (min-width:${w}px){[data-ds-form-grid="${id}"]{grid-template-columns:repeat(${n},minmax(0,1fr))}}`,
              )
              .join('')
        : ''
    return (
        <FormContext.Provider value={{ layout, labelWidth, labelAlign, size, disabled, readOnly }}>
            <form
                ref={ref}
                data-ds-form=""
                data-layout={layout}
                data-readonly={readOnly ? '' : undefined}
                style={{ containerType: responsive ? 'inline-size' : undefined, containerName: responsive ? 'ds-form' : undefined, ...style }}
                {...rest}
            >
                {respCss && <style>{respCss}</style>}
                <fieldset
                    disabled={disabled}
                    data-ds-form-grid={responsive ? id : ''}
                    style={{
                        ...(cols ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` } : null),
                        ...(gap !== undefined ? { gap } : null),
                    }}
                >
                    {children}
                </fieldset>
            </form>
        </FormContext.Provider>
    )
}
