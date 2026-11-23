import type { HTMLAttributes, ReactNode } from 'react'
import type { Tone } from '../types.js'

export type TimelineItem = {
    title: ReactNode
    time?: ReactNode
    description?: ReactNode
    tone?: Tone
    icon?: ReactNode
}

export type TimelineProps = {
    items: TimelineItem[]
    /** left: 시간 왼쪽 · right: 시간 오른쪽 · alternate: 좌우 번갈아 */
    mode?: 'left' | 'right' | 'alternate'
    /** 마지막에 붙는 대기 항목 (빈 점) */
    pending?: ReactNode
    reverse?: boolean
} & HTMLAttributes<HTMLOListElement>

export const Timeline = ({ items, mode = 'left', pending, reverse, ...rest }: TimelineProps) => {
    const list = reverse ? [...items].reverse() : items
    return (
        <ol data-ds-timeline="" data-mode={mode} {...rest}>
            {list.map((it, i) => (
                <li key={i} data-slot="item" data-tone={it.tone ?? 'accent'} data-side={mode === 'alternate' ? (i % 2 ? 'right' : 'left') : mode}>
                    <span data-slot="time">{it.time}</span>
                    <span data-slot="rail" aria-hidden>
                        <i>{it.icon}</i>
                        <s />
                    </span>
                    <span data-slot="body">
                        <b>{it.title}</b>
                        {it.description && <span data-slot="desc">{it.description}</span>}
                    </span>
                </li>
            ))}
            {pending && (
                <li data-slot="item" data-pending="" data-side={mode === 'alternate' ? (list.length % 2 ? 'right' : 'left') : mode}>
                    <span data-slot="time">대기</span>
                    <span data-slot="rail" aria-hidden>
                        <i />
                    </span>
                    <span data-slot="body">{pending}</span>
                </li>
            )}
        </ol>
    )
}
