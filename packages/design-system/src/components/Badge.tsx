import type { HTMLAttributes, ReactNode, Ref } from 'react'
import type { BorderVariant } from './borderVariant.js'
import type { Tone } from './types.js'

export type BadgeAppearance = 'solid' | 'soft' | 'outline'

export type BadgeProps = {
    /** 'default' 는 'neutral' 과 같다 */
    tone?: Tone | 'default'
    appearance?: BadgeAppearance
    /** xs 18 · sm 20 · md 22 */
    size?: 'xs' | 'sm' | 'md'
    /** 앞에 상태 점 */
    dot?: boolean
    /** 숫자 children 이 max 를 넘으면 "max+" */
    max?: number
    /** 주의를 끄는 맥동 링 */
    pulse?: boolean
    icon?: ReactNode
    /** @deprecated appearance="solid" */
    solid?: boolean
    /** @deprecated appearance 로 통합 (outlined → outline) */
    variant?: BorderVariant
    ref?: Ref<HTMLSpanElement>
} & HTMLAttributes<HTMLSpanElement>

export const Badge = ({
    tone = 'neutral',
    appearance,
    size = 'md',
    dot,
    max,
    pulse,
    icon,
    solid,
    variant,
    children,
    ref,
    ...rest
}: BadgeProps) => {
    const app: BadgeAppearance = appearance ?? (solid ? 'solid' : variant === 'outlined' ? 'outline' : 'soft')
    const content =
        typeof children === 'number' && max !== undefined && children > max ? `${max}+` : children
    return (
        <span
            ref={ref}
            data-ds-badge=""
            data-tone={tone === 'default' ? 'neutral' : tone}
            data-appearance={app}
            data-size={size}
            data-pulse={pulse ? '' : undefined}
            {...rest}
        >
            {dot && <span data-slot="dot" aria-hidden />}
            {icon && (
                <span data-slot="icon" aria-hidden>
                    {icon}
                </span>
            )}
            {content}
        </span>
    )
}
