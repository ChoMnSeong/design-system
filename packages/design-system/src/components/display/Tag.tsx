import type { HTMLAttributes, KeyboardEvent, ReactNode, Ref } from 'react'
import type { BorderVariant } from '../borderVariant.js'
import type { Tone } from '../types.js'
import { IconClose } from '../icons.js'

export type TagProps = {
    /** 색 톤. 'default' 는 'neutral' 과 같다 */
    tone?: Tone | 'default'
    /** solid: 채움 · soft: 연한 배경 · outline: 테두리만 */
    appearance?: 'solid' | 'soft' | 'outline'
    /** sm 22 · md 26 */
    size?: 'sm' | 'md'
    /** 글자 앞 아이콘 */
    icon?: ReactNode
    /** @deprecated icon 을 쓴다 */
    iconLeft?: ReactNode
    /** 닫기 버튼. onClose 와 함께 쓴다 */
    closable?: boolean
    /** 닫기 버튼을 누를 때 */
    onClose?: () => void
    /** 닫기 버튼 접근성 이름 (없으면 "{글자} 삭제") */
    closeLabel?: string
    /** 필터 칩: onClick 이 있으면 버튼처럼 동작하고 selected 로 눌림을 보인다 */
    selected?: boolean
    /** 넘으면 말줄임 + title */
    maxWidth?: number
    /** @deprecated appearance="solid" */
    solid?: boolean
    /** @deprecated appearance 로 통합 */
    variant?: BorderVariant
    /** DOM 요소 ref */
    ref?: Ref<HTMLSpanElement>
} & HTMLAttributes<HTMLSpanElement>

/** 분류·필터용 칩 */
export const Tag = ({
    tone = 'neutral',
    appearance,
    size = 'md',
    icon,
    iconLeft,
    closable,
    onClose,
    closeLabel,
    selected,
    maxWidth,
    solid,
    variant,
    onClick,
    children,
    style,
    title,
    ref,
    ...rest
}: TagProps) => {
    const app = appearance ?? (solid ? 'solid' : variant === 'outlined' ? 'outline' : 'soft')
    const interactive = !!onClick
    const text = typeof children === 'string' ? children : undefined
    return (
        <span
            ref={ref}
            data-ds-tag=""
            data-tone={tone === 'default' ? 'neutral' : tone}
            data-appearance={app}
            data-size={size}
            data-selected={selected ? '' : undefined}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-pressed={interactive && selected !== undefined ? selected : undefined}
            onClick={onClick}
            onKeyDown={
                interactive
                    ? (e: KeyboardEvent<HTMLSpanElement>) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              ;(e.currentTarget as HTMLElement).click()
                          }
                      }
                    : undefined
            }
            title={title ?? (maxWidth ? text : undefined)}
            style={{ ...(maxWidth ? { maxWidth } : null), ...style }}
            {...rest}
        >
            {(icon ?? iconLeft) && (
                <span data-slot="icon" aria-hidden>
                    {icon ?? iconLeft}
                </span>
            )}
            <span data-slot="label">{children}</span>
            {(closable || (onClose && closable !== false)) && (
                <button
                    type="button"
                    data-slot="close"
                    aria-label={closeLabel ?? `${text ?? ''} 삭제`.trim()}
                    onClick={(e) => {
                        e.stopPropagation()
                        onClose?.()
                    }}
                >
                    <IconClose size={size === 'sm' ? 12 : 14} />
                </button>
            )}
        </span>
    )
}
