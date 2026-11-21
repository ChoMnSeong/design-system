import {
    useEffect,
    useLayoutEffect,
    useState,
    type CSSProperties,
    type ReactNode,
    type RefObject,
} from 'react'
import { createPortal } from 'react-dom'

export type PopoverProps = {
    open: boolean
    triggerRef: RefObject<HTMLElement | null>
    children: ReactNode
    offset?: number
    align?: 'start' | 'center' | 'end'
    placement?: 'auto' | 'bottom' | 'top' | 'left' | 'right'
    matchTriggerWidth?: boolean
    minWidth?: number
    style?: CSSProperties
    zIndex?: number | string
}

type Pos = {
    top: number
    left: number
    width: number
    placement: 'bottom' | 'top' | 'left' | 'right'
}

export const Popover = ({
    open,
    triggerRef,
    children,
    offset = 6,
    align = 'start',
    placement = 'auto',
    matchTriggerWidth,
    minWidth,
    style,
    zIndex = 'var(--ds-z-index-popover)',
}: PopoverProps) => {
    const [pos, setPos] = useState<Pos | null>(null)

    useLayoutEffect(() => {
        if (!open) {
            setPos(null)
            return
        }
        const update = () => {
            const el = triggerRef.current
            if (!el) return
            const rect = el.getBoundingClientRect()
            const viewportHeight = window.innerHeight
            const spaceBelow = viewportHeight - rect.bottom
            const resolvedPlacement: Pos['placement'] =
                placement === 'auto'
                    ? spaceBelow < 280 && rect.top > 280
                        ? 'top'
                        : 'bottom'
                    : placement

            const triggerWidth = rect.width
            if (resolvedPlacement === 'left' || resolvedPlacement === 'right') {
                // 옆으로 펼칠 때 align 은 세로 기준이다 (start = 위 맞춤).
                let top = rect.top + window.scrollY
                if (align === 'center') top = rect.top + rect.height / 2 + window.scrollY
                if (align === 'end') top = rect.bottom + window.scrollY
                const left =
                    resolvedPlacement === 'right'
                        ? rect.right + offset + window.scrollX
                        : rect.left - offset + window.scrollX
                setPos({ top, left, width: triggerWidth, placement: resolvedPlacement })
                return
            }

            const top =
                resolvedPlacement === 'bottom'
                    ? rect.bottom + offset + window.scrollY
                    : rect.top - offset + window.scrollY

            let left = rect.left + window.scrollX
            if (align === 'center')
                left = rect.left + rect.width / 2 + window.scrollX
            if (align === 'end')
                left = rect.right + window.scrollX

            setPos({ top, left, width: triggerWidth, placement: resolvedPlacement })
        }
        update()
        // passive: 핸들러가 preventDefault 를 쓰지 않으므로 브라우저가 스크롤을 기다리지 않게 한다.
        const scrollOpts = { capture: true, passive: true } as const
        window.addEventListener('scroll', update, scrollOpts)
        window.addEventListener('resize', update, { passive: true })
        return () => {
            window.removeEventListener('scroll', update, scrollOpts)
            window.removeEventListener('resize', update)
        }
    }, [open, triggerRef, offset, align, placement])

    useEffect(() => {
        if (!open || !pos) return
    }, [open, pos])

    if (!open || !pos || typeof document === 'undefined') return null

    const side = pos.placement === 'left' || pos.placement === 'right'
    const transformY = side
        ? align === 'center'
            ? 'translateY(-50%)'
            : align === 'end'
              ? 'translateY(-100%)'
              : 'none'
        : pos.placement === 'top'
          ? 'translateY(-100%)'
          : 'none'
    const transformX = side
        ? pos.placement === 'left'
            ? 'translateX(-100%)'
            : 'none'
        : align === 'center'
          ? 'translateX(-50%)'
          : align === 'end'
            ? 'translateX(-100%)'
            : 'none'
    const transform = [transformX, transformY]
        .filter((s) => s !== 'none')
        .join(' ')

    const portalNode = (
        <div
            data-ds-popover
            style={{
                position: 'absolute',
                top: `${pos.top}px`,
                left: `${pos.left}px`,
                ...(matchTriggerWidth ? { width: `${pos.width}px` } : null),
                ...(minWidth ? { minWidth: `${minWidth}px` } : null),
                transform: transform || undefined,
                zIndex,
                ...style,
            }}
        >
            {children}
        </div>
    )

    return createPortal(portalNode, document.body)
}
