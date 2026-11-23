import { Children, createContext, isValidElement, useContext, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import type { Tone } from '../types.js'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline'

const initialsOf = (name?: string): string => {
    if (!name) return ''
    const trimmed = name.trim()
    // 한글 이름은 성 한 글자, 영문은 단어 첫 글자 둘
    if (/^[가-힣]/.test(trimmed)) return trimmed.slice(0, 1)
    const parts = trimmed.split(/\s+/)
    return parts.length > 1 ? `${parts[0]![0]}${parts[1]![0]}`.toUpperCase() : trimmed.slice(0, 2).toUpperCase()
}

const STATUS_LABEL: Record<PresenceStatus, string> = { online: '온라인', away: '자리 비움', busy: '다른 용무 중', offline: '오프라인' }

const GroupSize = createContext<AvatarSize | null>(null)

export type AvatarProps = {
    src?: string
    alt?: string
    name?: string
    size?: AvatarSize
    shape?: 'circle' | 'rounded'
    /** 이니셜 배경 톤 */
    tone?: Tone
    /** 오른쪽 아래 접속 상태 점 */
    status?: PresenceStatus
    fallback?: ReactNode
    ref?: Ref<HTMLSpanElement>
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>

export const Avatar = ({
    src,
    alt,
    name,
    size: sizeProp,
    shape = 'circle',
    tone = 'accent',
    status,
    fallback,
    ref,
    ...rest
}: AvatarProps) => {
    const group = useContext(GroupSize)
    const size = sizeProp ?? group ?? 'md'
    const [broken, setBroken] = useState(false)
    const label = alt ?? name
    return (
        <span
            ref={ref}
            data-ds-avatar=""
            data-size={size}
            data-shape={shape}
            data-tone={tone}
            role="img"
            aria-label={[label, status && STATUS_LABEL[status]].filter(Boolean).join(', ') || undefined}
            {...rest}
        >
            {src && !broken ? (
                <img src={src} alt="" onError={() => setBroken(true)} />
            ) : (
                <span aria-hidden>{fallback ?? initialsOf(name)}</span>
            )}
            {status && <span data-slot="status" data-status={status} aria-hidden />}
        </span>
    )
}

export type AvatarGroupProps = {
    max?: number
    /** 겹침 간격(px, 음수) */
    spacing?: number
    /** 자식 Avatar 에 전달 */
    size?: AvatarSize
} & HTMLAttributes<HTMLDivElement>

export const AvatarGroup = ({ max, spacing = -8, size, children, style, ...rest }: AvatarGroupProps) => {
    const list = Children.toArray(children).filter(isValidElement)
    const visible = max ? list.slice(0, max) : list
    const overflow = max ? list.length - max : 0
    return (
        <GroupSize.Provider value={size ?? null}>
            <div role="group" data-ds-avatar-group="" style={{ ['--_gap' as string]: `${spacing}px`, ...style }} {...rest}>
                {visible}
                {overflow > 0 && <Avatar tone="neutral" fallback={`+${overflow}`} aria-label={`외 ${overflow}명`} />}
            </div>
        </GroupSize.Provider>
    )
}

export type StatusIndicatorProps = {
    tone?: Tone
    label?: ReactNode
    /** 퍼지는 링 (가동·정지처럼 살아 있는 상태) */
    pulse?: boolean
    size?: 'sm' | 'md'
} & HTMLAttributes<HTMLSpanElement>

/** 점 + 라벨 상태 표시 (가동 · 대기 · 정지 · 점검) */
export const StatusIndicator = ({ tone = 'neutral', label, pulse, size = 'md', ...rest }: StatusIndicatorProps) => (
    <span data-ds-status="" data-tone={tone} data-size={size} data-pulse={pulse ? '' : undefined} {...rest}>
        <i aria-hidden />
        {label}
    </span>
)
