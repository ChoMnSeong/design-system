import { createContext, useContext, type HTMLAttributes, type Ref } from 'react'
import type { ButtonAppearance, ButtonSize } from './Button.js'
import { space, type SpaceToken, type Tone } from '../types.js'

export type ButtonGroupContextValue = {
    /** 자식 Button 의 기본 크기 */
    size?: ButtonSize
    /** 자식 Button 의 기본 appearance */
    appearance?: ButtonAppearance
    /** 자식 Button 의 기본 톤 */
    tone?: Tone
}

/** 자식 Button 의 기본 size · appearance · tone. Button 의 prop 이 있으면 그쪽이 이긴다. */
export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null)
export const useButtonGroup = () => useContext(ButtonGroupContext)

export type ButtonGroupProps = ButtonGroupContextValue & {
    /** 버튼을 테두리끼리 붙여 하나의 덩어리로 보이게 한다. */
    attached?: boolean
    /** horizontal: 가로로 나열 · vertical: 세로로 쌓기 */
    orientation?: 'horizontal' | 'vertical'
    /** attached=false 일 때 버튼 사이 간격. */
    gap?: SpaceToken
    /** 부모 폭을 채우고 버튼을 같은 폭으로 나눔 */
    fullWidth?: boolean
    /** DOM 요소 ref */
    ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

/** 여러 Button 을 묶고 기본 크기·모양·톤을 내려주는 그룹 */
export const ButtonGroup = ({
    size,
    appearance,
    tone,
    attached = false,
    orientation = 'horizontal',
    gap = 2,
    fullWidth,
    style,
    ref,
    children,
    ...rest
}: ButtonGroupProps) => (
    <ButtonGroupContext.Provider value={{ size, appearance, tone }}>
        <div
            ref={ref}
            role="group"
            data-ds-button-group=""
            data-attached={attached ? '' : undefined}
            data-orientation={orientation}
            data-full-width={fullWidth ? '' : undefined}
            style={{ ...(attached ? null : { gap: space(gap) }), ...style }}
            {...rest}
        >
            {children}
        </div>
    </ButtonGroupContext.Provider>
)
