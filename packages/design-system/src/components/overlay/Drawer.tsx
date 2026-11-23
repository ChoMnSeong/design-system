import { useId, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconClose } from '../icons.js'
import { useModalBehavior, useOverlayState } from './Dialog.js'

export type DrawerSide = 'right' | 'left' | 'top' | 'bottom'

const SIZE: Record<string, string> = { sm: '320px', md: '420px', lg: '560px', xl: '720px' }

export type DrawerProps = {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    /** @deprecated onOpenChange(false) */
    onClose?: () => void
    side?: DrawerSide
    /** sm 320 · md 420 · lg 560 · xl 720 또는 CSS 길이 */
    size?: 'sm' | 'md' | 'lg' | 'xl' | string | number
    title?: ReactNode
    description?: ReactNode
    footer?: ReactNode
    children?: ReactNode
    /** 안쪽 가장자리를 끌어 폭을 바꾼다 */
    resizable?: boolean
    /** false 면 배경을 막지 않고 페이지와 함께 쓴다 (상세 패널) */
    modal?: boolean
    onBeforeClose?: () => boolean | Promise<boolean>
    closeOnBackdrop?: boolean
    closeOnEsc?: boolean
}

export const Drawer = ({
    open: openProp,
    defaultOpen,
    onOpenChange,
    onClose,
    side = 'right',
    size = 'md',
    title,
    description,
    footer,
    children,
    resizable,
    modal = true,
    onBeforeClose,
    closeOnBackdrop = true,
    closeOnEsc = true,
}: DrawerProps) => {
    const { open, requestClose } = useOverlayState({ open: openProp, defaultOpen, onOpenChange, onClose, onBeforeClose })
    const panelRef = useRef<HTMLDivElement | null>(null)
    const titleId = useId()
    const [custom, setCustom] = useState<number | null>(null)
    useModalBehavior(open, panelRef, () => closeOnEsc && void requestClose(), { lockScroll: modal, trap: modal })

    const horizontal = side === 'left' || side === 'right'
    const sz = custom !== null ? `${custom}px` : typeof size === 'number' ? `${size}px` : (SIZE[size] ?? size)

    const startResize = (e: ReactPointerEvent) => {
        e.preventDefault()
        const rect = panelRef.current!.getBoundingClientRect()
        const move = (ev: PointerEvent) => {
            const v =
                side === 'right' ? rect.right - ev.clientX : side === 'left' ? ev.clientX - rect.left : side === 'bottom' ? rect.bottom - ev.clientY : ev.clientY - rect.top
            setCustom(Math.max(240, Math.min(horizontal ? window.innerWidth - 40 : window.innerHeight - 40, v)))
        }
        const up = () => {
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
    }

    if (!open || typeof document === 'undefined') return null
    const panelStyle: CSSProperties = horizontal ? { width: sz } : { height: sz }
    return createPortal(
        <div data-ds-drawer-root="" data-modal={modal ? '' : undefined} data-side={side} onMouseDown={(e) => modal && closeOnBackdrop && e.target === e.currentTarget && void requestClose()}>
            <div
                ref={panelRef}
                role="dialog"
                aria-modal={modal || undefined}
                aria-labelledby={title ? titleId : undefined}
                tabIndex={-1}
                data-ds-drawer=""
                data-side={side}
                style={panelStyle}
            >
                {resizable && <span data-slot="resize" role="separator" aria-orientation={horizontal ? 'vertical' : 'horizontal'} aria-label="패널 크기" onPointerDown={startResize} />}
                {(title || description) && (
                    <header data-slot="header">
                        {title && <h2 id={titleId}>{title}</h2>}
                        {description && <p>{description}</p>}
                    </header>
                )}
                <div data-slot="body">{children}</div>
                {footer && <footer data-slot="footer">{footer}</footer>}
                <button type="button" data-slot="close" aria-label="닫기" onClick={() => void requestClose()}>
                    <IconClose size={18} />
                </button>
            </div>
        </div>,
        document.body,
    )
}
