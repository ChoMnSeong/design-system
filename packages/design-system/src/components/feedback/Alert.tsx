import { useState, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import type { BorderVariant } from '../borderVariant.js'
import type { Tone } from '../types.js'
import { IconClose, IconError, IconInfo, IconSuccess, IconWarning } from '../icons.js'

export type AlertProps = {
    tone?: Tone
    title?: ReactNode
    /** 기본 아이콘을 바꾼다. null 이면 아이콘 없음 */
    icon?: ReactNode
    /** soft(기본) · solid · outline · accent-left(왼쪽 색 띠) */
    appearance?: 'soft' | 'solid' | 'outline' | 'accent-left'
    /** @deprecated appearance 로 통합 */
    variant?: BorderVariant
    /** 본문 아래 버튼 */
    actions?: ReactNode
    /** 화면 맨 위 공지처럼 전체 폭, 모서리 없음 */
    banner?: boolean
    size?: 'sm' | 'md'
    /** onClose 없이도 닫기 버튼으로 스스로 숨는다 */
    closable?: boolean
    onClose?: () => void
    ref?: Ref<HTMLDivElement>
} & Omit<HTMLAttributes<HTMLDivElement>, 'title'>

const ICON: Record<Tone, (s: number) => ReactNode> = {
    accent: (s) => <IconInfo size={s} />,
    neutral: (s) => <IconInfo size={s} />,
    info: (s) => <IconInfo size={s} />,
    success: (s) => <IconSuccess size={s} />,
    warning: (s) => <IconWarning size={s} />,
    danger: (s) => <IconError size={s} />,
}

export const Alert = ({
    tone = 'info',
    title,
    icon,
    appearance,
    variant,
    actions,
    banner,
    size = 'md',
    closable,
    onClose,
    children,
    role,
    ref,
    ...rest
}: AlertProps) => {
    const [hidden, setHidden] = useState(false)
    if (hidden) return null
    const app = appearance ?? (variant === 'outlined' ? 'outline' : 'soft')
    const urgent = tone === 'danger' || tone === 'warning'
    return (
        <div
            ref={ref}
            role={role ?? (urgent ? 'alert' : 'status')}
            data-ds-alert=""
            data-tone={tone}
            data-appearance={app}
            data-banner={banner ? '' : undefined}
            data-size={size}
            {...rest}
        >
            {icon !== null && (
                <span data-slot="icon" aria-hidden>
                    {icon ?? ICON[tone](size === 'sm' ? 16 : 18)}
                </span>
            )}
            <div data-slot="body">
                {title && <b data-slot="title">{title}</b>}
                {children && <div data-slot="text">{children}</div>}
                {actions && !banner && <div data-slot="actions">{actions}</div>}
            </div>
            {actions && banner && <div data-slot="actions">{actions}</div>}
            {(closable || onClose) && (
                <button
                    type="button"
                    data-slot="close"
                    aria-label="닫기"
                    onClick={() => {
                        onClose?.()
                        if (closable) setHidden(true)
                    }}
                >
                    <IconClose size={16} />
                </button>
            )}
        </div>
    )
}
