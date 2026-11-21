import type { HTMLAttributes, Ref } from 'react'
import type { Tone } from './types.js'

const SIZE: Record<string, number> = { xs: 12, sm: 16, md: 24, lg: 32 }

export type SpinnerProps = {
    /** xs 12 · sm 16 · md 24 · lg 32 또는 px */
    size?: 'xs' | 'sm' | 'md' | 'lg' | number | string
    thickness?: number
    /** @deprecated tone 을 쓴다 */
    color?: string
    tone?: Tone
    /** 스크린리더용 이름. overlay 면 화면에도 보인다 */
    label?: string
    /** 부모 영역 전체를 반투명하게 덮는다 (부모는 position: relative) */
    overlay?: boolean
    ref?: Ref<HTMLSpanElement>
} & HTMLAttributes<HTMLSpanElement>

export const Spinner = ({ size = 'sm', thickness, color, tone = 'accent', label = '불러오는 중', overlay, style, ref, ...rest }: SpinnerProps) => {
    const px = typeof size === 'number' ? size : (SIZE[size] ?? size)
    const dim = typeof px === 'number' ? `${px}px` : px
    const t = thickness ?? (typeof px === 'number' && px >= 24 ? 3 : 2)
    const spin = (
        <span
            ref={overlay ? undefined : ref}
            role={overlay ? undefined : 'status'}
            aria-label={overlay ? undefined : label}
            data-ds-spinner=""
            data-ds-spinner-ring=""
            data-tone={tone}
            style={{ width: dim, height: dim, borderWidth: t, ...(color ? { color } : null), ...(overlay ? null : style) }}
            {...(overlay ? null : rest)}
        />
    )
    if (!overlay) return spin
    return (
        <span ref={ref} role="status" aria-live="polite" data-ds-spinner-overlay="" style={style} {...rest}>
            {spin}
            {label}
        </span>
    )
}
