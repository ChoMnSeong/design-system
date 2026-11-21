import { cloneElement, isValidElement, useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from 'react'
import { PopoverPositioner } from './Popover.js'

export type TooltipProps = {
    content: ReactNode
    children: ReactElement<any>
    delay?: number
    side?: 'top' | 'bottom' | 'left' | 'right'
    align?: 'start' | 'center' | 'end'
    arrow?: boolean
    maxWidth?: number
    disabled?: boolean
    tone?: 'neutral' | 'accent' | 'danger'
}

/** 짧은 설명 말풍선. 마우스 오버와 키보드 포커스 모두에서 열리고 Esc 로 닫힌다. */
export const Tooltip = ({
    content,
    children,
    delay = 200,
    side = 'top',
    align = 'center',
    arrow = true,
    maxWidth = 240,
    disabled,
    tone = 'neutral',
}: TooltipProps) => {
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLElement | null>(null)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const id = useId()
    const clear = () => {
        if (timer.current) clearTimeout(timer.current)
    }
    const show = () => {
        clear()
        timer.current = setTimeout(() => setOpen(true), delay)
    }
    const hide = () => {
        clear()
        setOpen(false)
    }
    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open])
    useEffect(() => () => clear(), [])

    if (!isValidElement(children) || disabled || content == null || content === '') return children
    const p = (children.props ?? {}) as Record<string, ((e: unknown) => void) | string | undefined>
    const call = (k: string, e: unknown) => (typeof p[k] === 'function' ? (p[k] as (e: unknown) => void)(e) : undefined)
    const enhanced = cloneElement(children, {
        ref: (node: HTMLElement | null) => {
            triggerRef.current = node
            const r = (children as { ref?: unknown }).ref
            if (typeof r === 'function') r(node)
            else if (r && typeof r === 'object' && 'current' in r) (r as { current: HTMLElement | null }).current = node
        },
        'aria-describedby': [p['aria-describedby'], open ? id : undefined].filter(Boolean).join(' ') || undefined,
        onMouseEnter: (e: unknown) => { call('onMouseEnter', e); show() },
        onMouseLeave: (e: unknown) => { call('onMouseLeave', e); hide() },
        onFocus: (e: unknown) => { call('onFocus', e); show() },
        onBlur: (e: unknown) => { call('onBlur', e); hide() },
    } as never)

    return (
        <>
            {enhanced}
            <PopoverPositioner open={open} triggerRef={triggerRef} offset={6} align={align} placement={side} zIndex="var(--ds-z-index-tooltip)" arrow={arrow}>
                <div id={id} role="tooltip" data-ds-tooltip="" data-tone={tone === 'neutral' ? undefined : tone} style={{ maxWidth }}>
                    {content}
                </div>
            </PopoverPositioner>
        </>
    )
}
