import {
    cloneElement,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactElement,
    type ReactNode,
    type RefObject,
} from 'react'
import { useOutsideClick } from '../useOutsideClick.js'
import { createPortal } from 'react-dom'

export type PopoverPositionerProps = {
    /** 표시 여부 */
    open: boolean
    /** 위치 기준 요소 ref */
    triggerRef: RefObject<HTMLElement | null>
    /** 띄울 내용 */
    children: ReactNode
    /** 트리거와 간격 (px) */
    offset?: number
    /** 트리거와 맞출 끝. 옆 배치면 세로 기준 */
    align?: 'start' | 'center' | 'end'
    /** 나오는 쪽. auto 는 아래 공간이 모자라면 위 */
    placement?: 'auto' | 'bottom' | 'top' | 'left' | 'right'
    /** 폭을 트리거와 같게 */
    matchTriggerWidth?: boolean
    /** 최소 폭 (px) */
    minWidth?: number
    /** 띄운 상자 인라인 스타일 */
    style?: CSSProperties
    /** 쌓임 순서 */
    zIndex?: number | string
    /** 말풍선 꼬리 */
    arrow?: boolean
}

type Pos = {
    top: number
    left: number
    width: number
    placement: 'bottom' | 'top' | 'left' | 'right'
}

/** 트리거 기준으로 내용을 띄우는 저수준 배치 컴포넌트. 열고 닫기는 부모가 정한다. */
export const PopoverPositioner = ({
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
    arrow,
}: PopoverPositionerProps) => {
    const [pos, setPos] = useState<Pos | null>(null)
    offset = arrow ? offset + 6 : offset

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
            data-side={pos.placement}
            data-align={align}
            data-arrow={arrow ? '' : undefined}
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
            {arrow && <span data-ds-popover-arrow="" aria-hidden />}
        </div>
    )

    return createPortal(portalNode, document.body)
}

/* ───────────────────────── 고수준 Popover ───────────────────────── */

export type PopoverSide = 'auto' | 'top' | 'bottom' | 'left' | 'right'

export type PopoverProps =
    | (PopoverPositionerProps & { trigger?: undefined })
    | {
          /** 이 요소를 누르면(또는 올리면) 열린다 */
          trigger: ReactElement<any>
          /** 패널 내용 */
          children: ReactNode
          /** 제어 모드 열림 */
          open?: boolean
          /** 비제어 초기 열림 */
          defaultOpen?: boolean
          /** 열림이 바뀔 때 (새 상태) */
          onOpenChange?: (open: boolean) => void
          /** 나오는 쪽. auto 는 아래 공간이 모자라면 위 */
          side?: PopoverSide
          /** @deprecated side 를 쓴다 */
          placement?: PopoverSide
          /** 트리거와 맞출 끝 */
          align?: 'start' | 'center' | 'end'
          /** 트리거와 간격 (px) */
          offset?: number
          /** 폭을 트리거와 같게 */
          matchTriggerWidth?: boolean
          /** 최소 폭 (px) */
          minWidth?: number
          /** 쌓임 순서 */
          zIndex?: number | string
          /** 말풍선 꼬리 */
          arrow?: boolean
          /** click(기본) · hover · focus */
          openOn?: 'click' | 'hover' | 'focus'
          /** hover 일 때 열림 · 닫힘 지연(ms) */
          openDelay?: number
          /** hover 일 때 닫힘 지연 (ms) */
          closeDelay?: number
          /** 열려 있는 동안 바깥을 막고 포커스를 안에 가둔다 */
          modal?: boolean
          /** 기본 패널 표면(배경 · 테두리 · 그림자 · 여백). false 면 children 을 그대로 */
          surface?: boolean
          /** 패널 인라인 스타일 */
          style?: CSSProperties
          /** 패널 접근성 이름 */
          'aria-label'?: string
          /** trigger 와 함께 쓰지 않는다 */
          triggerRef?: undefined
      }

/** 트리거 옆에 띄우는 패널. trigger 가 없으면 위치만 잡는다 */
export const Popover = (props: PopoverProps) => {
    if (!props.trigger) return <PopoverPositioner {...(props as PopoverPositionerProps)} />
    return <TriggeredPopover {...props} />
}

let popSeq = 0
const TriggeredPopover = ({
    trigger,
    children,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    side,
    placement,
    align = 'center',
    offset = 6,
    matchTriggerWidth,
    minWidth,
    zIndex,
    arrow,
    openOn = 'click',
    openDelay = 120,
    closeDelay = 150,
    modal,
    surface = true,
    style,
    'aria-label': ariaLabel,
}: Extract<PopoverProps, { trigger: ReactElement<any> }>) => {
    const [inner, setInner] = useState(defaultOpen)
    const open = openProp ?? inner
    const setOpen = (o: boolean) => {
        if (openProp === undefined) setInner(o)
        onOpenChange?.(o)
    }
    const triggerRef = useRef<HTMLElement | null>(null)
    const panelRef = useRef<HTMLDivElement | null>(null)
    const idRef = useRef(`ds-pop-${++popSeq}`)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
    useOutsideClick([triggerRef, panelRef], () => setOpen(false), open && openOn === 'click')

    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false)
                triggerRef.current?.focus()
            }
            if (modal && e.key === 'Tab' && panelRef.current) {
                const f = panelRef.current.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')
                if (!f.length) return
                const first = f[0]!
                const last = f[f.length - 1]!
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault()
                    last.focus()
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault()
                    first.focus()
                }
            }
        }
        window.addEventListener('keydown', onKey)
        if (modal) setTimeout(() => panelRef.current?.querySelector<HTMLElement>('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')?.focus(), 0)
        return () => window.removeEventListener('keydown', onKey)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, modal])

    const hoverOpen = (o: boolean) => {
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => setOpen(o), o ? openDelay : closeDelay)
    }
    const p = (trigger.props ?? {}) as Record<string, (e: unknown) => void>
    const enhanced = cloneElement(trigger, {
        ref: (n: HTMLElement | null) => {
            triggerRef.current = n
            const r = (trigger as { ref?: unknown }).ref
            if (typeof r === 'function') r(n)
            else if (r && typeof r === 'object') (r as { current: unknown }).current = n
        },
        'aria-expanded': open,
        'aria-controls': open ? idRef.current : undefined,
        'aria-haspopup': 'dialog',
        ...(openOn === 'click'
            ? { onClick: (e: unknown) => { p.onClick?.(e); setOpen(!open) } }
            : openOn === 'hover'
              ? {
                    onMouseEnter: (e: unknown) => { p.onMouseEnter?.(e); hoverOpen(true) },
                    onMouseLeave: (e: unknown) => { p.onMouseLeave?.(e); hoverOpen(false) },
                    onFocus: (e: unknown) => { p.onFocus?.(e); setOpen(true) },
                    onBlur: (e: unknown) => { p.onBlur?.(e); hoverOpen(false) },
                }
              : {
                    onFocus: (e: unknown) => { p.onFocus?.(e); setOpen(true) },
                    onBlur: (e: unknown) => { p.onBlur?.(e); setOpen(false) },
                }),
    } as never)

    return (
        <>
            {enhanced}
            {open && modal && <div data-ds-popover-scrim="" onClick={() => setOpen(false)} />}
            <PopoverPositioner
                open={open}
                triggerRef={triggerRef}
                placement={side ?? placement ?? 'auto'}
                align={align}
                offset={offset}
                matchTriggerWidth={matchTriggerWidth}
                minWidth={minWidth}
                zIndex={zIndex}
                arrow={arrow}
            >
                <div
                    ref={panelRef}
                    id={idRef.current}
                    role="dialog"
                    aria-modal={modal || undefined}
                    aria-label={ariaLabel}
                    data-ds-popover-panel={surface ? '' : undefined}
                    style={style}
                    onMouseEnter={openOn === 'hover' ? () => hoverOpen(true) : undefined}
                    onMouseLeave={openOn === 'hover' ? () => hoverOpen(false) : undefined}
                >
                    {children}
                </div>
            </PopoverPositioner>
        </>
    )
}
