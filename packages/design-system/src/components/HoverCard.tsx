import type { ReactElement, ReactNode } from 'react'
import { Popover } from './Popover.js'

export type HoverCardProps = {
    content: ReactNode
    children: ReactElement<any>
    openDelay?: number
    closeDelay?: number
    side?: 'top' | 'bottom' | 'left' | 'right'
    align?: 'start' | 'center' | 'end'
    width?: number | string
    arrow?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

/** 마우스를 올리면 미리보기 카드 (담당자 · 품목 요약). 키보드 포커스에서도 열린다. */
export const HoverCard = ({ content, children, openDelay = 300, closeDelay = 150, side = 'bottom', align = 'center', width = 280, arrow, open, onOpenChange }: HoverCardProps) => (
    <Popover trigger={children} openOn="hover" openDelay={openDelay} closeDelay={closeDelay} side={side} align={align} arrow={arrow} open={open} onOpenChange={onOpenChange} style={{ width, maxWidth: 'none' }}>
        {content}
    </Popover>
)
