import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { IconError, IconSearch } from '../icons.js'

export type EmptyPreset = 'noData' | 'noResult' | 'error' | 'noPermission'

const svg = (d: ReactNode, s: number) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {d}
    </svg>
)

const PRESETS: Record<EmptyPreset, { icon: (s: number) => ReactNode; title: string; tone?: 'danger' }> = {
    noData: { icon: (s) => svg(<><path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" /></>, s), title: '데이터가 없습니다' },
    noResult: { icon: (s) => <IconSearch size={s} />, title: '조건에 맞는 결과가 없습니다' },
    error: { icon: (s) => <IconError size={s} />, title: '데이터를 불러오지 못했습니다', tone: 'danger' },
    noPermission: { icon: (s) => svg(<><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></>, s), title: '조회 권한이 없습니다' },
}

export type EmptyProps = {
    /** 위쪽 아이콘 (preset 아이콘보다 우선) */
    icon?: ReactNode
    /** 제목 (preset 제목보다 우선) */
    title?: ReactNode
    /** 제목 아래 설명 */
    description?: ReactNode
    /** 아래쪽 버튼 등 동작 */
    action?: ReactNode
    /** 자주 쓰는 빈 상태: 아이콘과 제목 기본값을 채운다 */
    preset?: EmptyPreset
    /** 아이콘 원 sm 36 · md 48 · lg 64 (px), 여백·글자도 비례 */
    size?: 'sm' | 'md' | 'lg'
    /** compact: 아이콘 옆에 글자를 한 줄로 (표 안 · 좁은 카드) */
    appearance?: 'default' | 'compact'
    /** DOM 요소 ref */
    ref?: Ref<HTMLDivElement>
} & Omit<HTMLAttributes<HTMLDivElement>, 'title'>

/** 데이터가 없을 때 보여 주는 빈 상태 */
export const Empty = ({ icon, title, description, action, preset, size = 'md', appearance = 'default', ref, ...rest }: EmptyProps) => {
    const p = preset ? PRESETS[preset] : undefined
    const s = size === 'sm' ? 20 : size === 'lg' ? 32 : 24
    return (
        <div ref={ref} role={preset === 'error' ? 'alert' : undefined} data-ds-empty="" data-size={size} data-appearance={appearance} {...rest}>
            {(icon ?? p) && (
                <span data-slot="icon" data-tone={p?.tone} aria-hidden>
                    {icon ?? p!.icon(s)}
                </span>
            )}
            <div data-slot="text">
                {(title ?? p?.title) && <b>{title ?? p!.title}</b>}
                {description && <span>{description}</span>}
            </div>
            {action && <div data-slot="action">{action}</div>}
        </div>
    )
}
