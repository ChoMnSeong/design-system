import {
    cloneElement,
    isValidElement,
    useEffect,
    useId,
    useRef,
    useState,
    type HTMLAttributes,
    type PointerEvent as ReactPointerEvent,
    type ReactElement,
    type ReactNode,
    type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { IconClose, IconError, IconInfo, IconSuccess, IconWarning } from './icons.js'
import type { Tone } from './types.js'
import { Button } from './Button.js'

/* ───────────────────────── 공통 모달 동작 ───────────────────────── */

const FOCUSABLE = 'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/** 열리고 닫히는 상태 (제어 · 비제어 · onBeforeClose) */
export const useOverlayState = (opts: {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    onClose?: () => void
    onBeforeClose?: () => boolean | Promise<boolean>
}) => {
    const [inner, setInner] = useState(!!opts.defaultOpen)
    const open = opts.open ?? inner
    const set = (o: boolean) => {
        if (opts.open === undefined) setInner(o)
        opts.onOpenChange?.(o)
        if (!o) opts.onClose?.()
    }
    const requestClose = async () => {
        if (opts.onBeforeClose && !(await opts.onBeforeClose())) return
        set(false)
    }
    return { open, setOpen: set, requestClose }
}

/** 포커스 가두기 · Esc · 스크롤 잠금 · 닫힌 뒤 원래 위치로 포커스 복귀 */
export const useModalBehavior = (
    open: boolean,
    panelRef: RefObject<HTMLElement | null>,
    onEscape: () => void,
    { lockScroll = true, trap = true, initialFocus }: { lockScroll?: boolean; trap?: boolean; initialFocus?: RefObject<HTMLElement | null> } = {},
) => {
    const escRef = useRef(onEscape)
    escRef.current = onEscape
    useEffect(() => {
        if (!open) return
        const prev = document.activeElement as HTMLElement | null
        const overflow = document.body.style.overflow
        if (lockScroll) document.body.style.overflow = 'hidden'
        const t = setTimeout(() => {
            const target = initialFocus?.current ?? panelRef.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panelRef.current
            target?.focus()
        }, 0)
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.stopPropagation()
                escRef.current()
            }
            if (trap && e.key === 'Tab' && panelRef.current) {
                const f = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
                if (!f.length) return e.preventDefault()
                const first = f[0]!
                const last = f[f.length - 1]!
                if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
                    e.preventDefault()
                    last.focus()
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault()
                    first.focus()
                }
            }
        }
        document.addEventListener('keydown', onKey)
        return () => {
            clearTimeout(t)
            document.removeEventListener('keydown', onKey)
            if (lockScroll) document.body.style.overflow = overflow
            prev?.focus?.()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])
}

const TONE_ICON: Record<Tone, ReactNode> = {
    accent: <IconInfo size={20} />,
    neutral: <IconInfo size={20} />,
    info: <IconInfo size={20} />,
    success: <IconSuccess size={20} />,
    warning: <IconWarning size={20} />,
    danger: <IconError size={20} />,
}

/* ───────────────────────── Dialog ───────────────────────── */

export type DialogProps = {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    /** @deprecated onOpenChange(false) 와 같다 */
    onClose?: () => void
    /** 누르면 열리는 요소 (비제어형) */
    trigger?: ReactElement<any>
    title?: ReactNode
    description?: ReactNode
    children?: ReactNode
    footer?: ReactNode
    /** xs 320 · sm 400 · md 520 · lg 680 · xl 880 · fullscreen */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'
    /** 제목 앞 아이콘 색. 위험한 확인은 danger */
    tone?: Tone
    /** inside: 본문만 스크롤 · outside: 대화상자 전체가 페이지처럼 스크롤 */
    scrollBehavior?: 'inside' | 'outside'
    /** 제목 줄을 끌어 옮긴다 */
    draggable?: boolean
    initialFocus?: RefObject<HTMLElement | null>
    /** false 를 돌려주면 닫지 않는다 (저장 안 한 변경 확인 등) */
    onBeforeClose?: () => boolean | Promise<boolean>
    closeOnBackdrop?: boolean
    closeOnEsc?: boolean
    hideClose?: boolean
}

export const Dialog = ({
    open: openProp,
    defaultOpen,
    onOpenChange,
    onClose,
    trigger,
    title,
    description,
    children,
    footer,
    size = 'md',
    tone,
    scrollBehavior = 'inside',
    draggable,
    initialFocus,
    onBeforeClose,
    closeOnBackdrop = true,
    closeOnEsc = true,
    hideClose,
}: DialogProps) => {
    const { open, setOpen, requestClose } = useOverlayState({ open: openProp, defaultOpen, onOpenChange, onClose, onBeforeClose })
    const panelRef = useRef<HTMLDivElement | null>(null)
    const titleId = useId()
    const descId = useId()
    const [drag, setDrag] = useState({ x: 0, y: 0 })
    useEffect(() => {
        if (open) setDrag({ x: 0, y: 0 })
    }, [open])
    useModalBehavior(open, panelRef, () => closeOnEsc && void requestClose(), { initialFocus })

    const startDrag = (e: ReactPointerEvent) => {
        if (!draggable || (e.target as HTMLElement).closest('button')) return
        const sx = e.clientX - drag.x
        const sy = e.clientY - drag.y
        const move = (ev: PointerEvent) => setDrag({ x: ev.clientX - sx, y: ev.clientY - sy })
        const up = () => {
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
    }

    const triggerEl =
        trigger && isValidElement(trigger)
            ? cloneElement(trigger, {
                  'aria-haspopup': 'dialog',
                  onClick: (e: unknown) => {
                      ;(trigger.props as { onClick?: (e: unknown) => void }).onClick?.(e)
                      setOpen(true)
                  },
              } as never)
            : null

    const node =
        open && typeof document !== 'undefined'
            ? createPortal(
                  <div
                      data-ds-modal-root=""
                      data-scroll={scrollBehavior}
                      onMouseDown={(e) => {
                          if (closeOnBackdrop && e.target === e.currentTarget) void requestClose()
                      }}
                  >
                      <div
                          ref={panelRef}
                          role={tone === 'danger' || tone === 'warning' ? 'alertdialog' : 'dialog'}
                          aria-modal="true"
                          aria-labelledby={title ? titleId : undefined}
                          aria-describedby={description ? descId : undefined}
                          tabIndex={-1}
                          data-ds-dialog=""
                          data-size={size}
                          data-tone={tone}
                          style={drag.x || drag.y ? { transform: `translate(${drag.x}px, ${drag.y}px)` } : undefined}
                      >
                          {(title || description) && (
                              <header data-slot="header" data-draggable={draggable ? '' : undefined} onPointerDown={startDrag}>
                                  {tone && (
                                      <span data-slot="tone-icon" aria-hidden>
                                          {TONE_ICON[tone]}
                                      </span>
                                  )}
                                  <div>
                                      {title && <h2 id={titleId}>{title}</h2>}
                                      {description && <p id={descId}>{description}</p>}
                                  </div>
                              </header>
                          )}
                          {children && <div data-slot="body">{children}</div>}
                          {footer && <footer data-slot="footer">{footer}</footer>}
                          {!hideClose && (
                              <button type="button" data-slot="close" aria-label="닫기" onClick={() => void requestClose()}>
                                  <IconClose size={18} />
                              </button>
                          )}
                      </div>
                  </div>,
                  document.body,
              )
            : null

    return (
        <>
            {triggerEl}
            {node}
        </>
    )
}

export type DialogActionsProps = HTMLAttributes<HTMLDivElement>
export const DialogActions = ({ style, ...rest }: DialogActionsProps) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', ...style }} {...rest} />
)

/* ───────────────────────── confirm() ───────────────────────── */

export type ConfirmOptions = {
    title: ReactNode
    description?: ReactNode
    tone?: Tone
    confirmText?: ReactNode
    cancelText?: ReactNode
}

/**
 * 확인 대화상자를 띄우고 결과를 기다린다.
 * const ok = await confirm({ title: '삭제할까요?', tone: 'danger', confirmText: '삭제' })
 * 테마 CSS 변수가 문서 루트에 있어야 한다 (Provider applyTo="root", 기본값).
 */
export const confirm = (opts: ConfirmOptions): Promise<boolean> =>
    new Promise((resolve) => {
        const host = document.createElement('div')
        document.body.appendChild(host)
        const root = createRoot(host)
        const done = (v: boolean) => {
            resolve(v)
            setTimeout(() => {
                root.unmount()
                host.remove()
            }, 0)
        }
        const Confirm = () => {
            const [open, setOpen] = useState(true)
            const finish = (v: boolean) => {
                setOpen(false)
                done(v)
            }
            return (
                <Dialog
                    open={open}
                    onOpenChange={(o) => !o && finish(false)}
                    size="sm"
                    tone={opts.tone}
                    title={opts.title}
                    description={opts.description}
                    footer={
                        <DialogActions>
                            <Button appearance="outline" tone="neutral" onClick={() => finish(false)}>
                                {opts.cancelText ?? '취소'}
                            </Button>
                            <Button tone={opts.tone && opts.tone !== 'neutral' ? opts.tone : 'accent'} onClick={() => finish(true)} data-autofocus="">
                                {opts.confirmText ?? '확인'}
                            </Button>
                        </DialogActions>
                    }
                />
            )
        }
        root.render(<Confirm />)
    })
