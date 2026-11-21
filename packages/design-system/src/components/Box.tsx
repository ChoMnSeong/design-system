import type { CSSProperties, HTMLAttributes, Ref } from 'react'
import { mergeStyles, type Tone } from './types.js'
import {
    borderVariantContainerStyle,
    type BorderVariant,
    type SurfaceToken,
} from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'

export type BoxSurface = 'page' | 'panel' | 'card' | 'overlay' | 'inset' | 'none'

export type BoxProps = {
    surface?: BoxSurface
    variant?: BorderVariant
    /** px 숫자 또는 CSS 길이. 토큰은 space(3) */
    padding?: number | string
    /** RadiusToken(xs~3xl · full) · CSS 값 */
    radius?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' | (string & {})
    /** 옅은 톤 배경 */
    tone?: Tone
    ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

const fallbackSurface = (s: BoxSurface): SurfaceToken => {
    if (s === 'card' || s === 'panel' || s === 'overlay' || s === 'inset')
        return s
    return 'card'
}

const surfaceStyles = (
    s: BoxSurface,
    variant: BorderVariant,
): CSSProperties => {
    if (s === 'none') {
        if (variant === 'outlined') return {}
        return borderVariantContainerStyle(variant, {
            surfaceToken: 'card',
        })
    }
    if (variant === 'outlined') {
        return {
            background: `var(--ds-surface-${s}-background)`,
            backdropFilter: `var(--ds-surface-${s}-backdrop-filter)`,
            border: `var(--ds-surface-${s}-border)`,
            borderRadius: `var(--ds-surface-${s}-radius)`,
            boxShadow: `var(--ds-surface-${s}-shadow)`,
            color: `var(--ds-surface-${s}-color)`,
        }
    }
    return borderVariantContainerStyle(variant, {
        surfaceToken: fallbackSurface(s),
    })
}

export const Box = ({
    surface = 'none',
    variant: variantProp,
    padding,
    radius,
    tone,
    style,
    ref,
    ...rest
}: BoxProps) => {
    const variant = useBorderVariant(variantProp)
    return (
        <div
            ref={ref}
            style={mergeStyles(
                surfaceStyles(surface, variant),
                padding !== undefined && { padding: typeof padding === 'number' ? `${padding}px` : padding },
                radius !== undefined && {
                    borderRadius: /^(none|xs|sm|md|lg|xl|2xl|3xl|full)$/.test(radius) ? `var(--ds-radius-${radius})` : radius,
                },
                tone && {
                    background: `color-mix(in oklab, var(--ds-tone-${tone}-solid) 9%, var(--ds-surface-card-background))`,
                    border: `1px solid color-mix(in oklab, var(--ds-tone-${tone}-solid) 22%, transparent)`,
                },
                style,
            )}
            {...rest}
        />
    )
}
