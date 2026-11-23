import type { ReactElement, ReactNode } from 'react'
import { Popover } from './Popover.js'

export type HoverCardProps = {
    /** 카드 내용 */
    content: ReactNode
    /** 마우스를 올릴 대상 요소 */
    children: ReactElement<any>
    /** 열림 지연 (ms) */
    openDelay?: number
    /** 닫힘 지연 (ms) */
    closeDelay?: number
    /** 카드가 나오는 쪽 */
    side?: 'top' | 'bottom' | 'left' | 'right'
    /** 트리거와 맞출 끝 */
    align?: 'start' | 'center' | 'end'
    /** 카드 폭. 숫자는 px */
    width?: number | string
    /** 말풍선 꼬리 */
    arrow?: boolean
    /** 제어 모드 열림 */
    open?: boolean
    /** 열림이 바뀔 때 (새 상태) */
    onOpenChange?: (open: boolean) => void
}

/** 마우스를 올리면 미리보기 카드 (담당자 · 품목 요약). 키보드 포커스에서도 열린다. */
export const HoverCard = ({ content, children, openDelay = 300, closeDelay = 150, side = 'bottom', align = 'center', width = 280, arrow, open, onOpenChange }: HoverCardProps) => (
    <Popover trigger={children} openOn="hover" openDelay={openDelay} closeDelay={closeDelay} side={side} align={align} arrow={arrow} open={open} onOpenChange={onOpenChange} style={{ width, maxWidth: 'none' }}>
        {content}
    </Popover>
)
