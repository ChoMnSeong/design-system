import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconClose, IconError, IconInfo, IconSuccess, IconWarning } from '../icons.js'
import type { Tone } from '../types.js'

export type ToastTone = Tone

export type ToastOptions = {
    /** 같은 id 로 다시 부르면 새로 쌓지 않고 바꾼다 (중복 방지) */
    id?: string
    /** 굵은 제목 */
    title?: ReactNode
    /** 제목 아래 설명 */
    description?: ReactNode
    /** 색과 아이콘. danger·warning 은 role="alert" */
    tone?: Tone
    /** ms. 0 이면 닫을 때까지 남는다. 기본 4000 */
    duration?: number
    /** 동작 버튼 (누르면 onClick 후 토스트 닫힘) */
    action?: { label: string; onClick: () => void }
    /** duration 과 무관하게 남긴다 (오류 · 확인 필요) */
    persistent?: boolean
    /** 남은 시간 막대 */
    progress?: boolean
    /** 진행 중 표시 (promise 의 loading 단계) */
    loading?: boolean
}

export type ToastItem = ToastOptions & { id: string; createdAt: number }

type Shorthand = (opts: Omit<ToastOptions, 'tone'>) => string
type PromiseMessages<R> = {
    loading: ToastOptions | ReactNode
    success: ToastOptions | ReactNode | ((r: R) => ToastOptions | ReactNode)
    error: ToastOptions | ReactNode | ((e: unknown) => ToastOptions | ReactNode)
}

export type ToastApi = ((opts: ToastOptions) => string) & {
    success: Shorthand
    error: Shorthand
    warning: Shorthand
    info: Shorthand
    update: (id: string, opts: Partial<ToastOptions>) => void
    dismiss: (id?: string) => void
    promise: <R>(p: Promise<R>, msgs: PromiseMessages<R>) => Promise<R>
}

type ToastContextValue = {
    toast: ToastApi
    success: Shorthand
    error: Shorthand
    warning: Shorthand
    info: Shorthand
    update: ToastApi['update']
    dismiss: ToastApi['dismiss']
    promise: ToastApi['promise']
}

const ToastContext = createContext<ToastContextValue | null>(null)

export type ToastPlacement = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

export type ToastProviderProps = {
    /** useToast 를 쓸 앱 영역 */
    children: ReactNode
    /** 토스트가 쌓이는 화면 위치 */
    placement?: ToastPlacement
    /** 한 번에 보일 최대 개수. 넘치면 오래된 것부터 닫는다 */
    max?: number
    /** 알림 위에 마우스가 있거나 포커스가 안에 있으면 저절로 닫히는 시간을 멈춘다 */
    pauseOnHover?: boolean
}

const toOpts = (v: ToastOptions | ReactNode): ToastOptions =>
    v && typeof v === 'object' && !('$$typeof' in (v as object)) && ('title' in (v as object) || 'description' in (v as object)) ? (v as ToastOptions) : { title: v as ReactNode }

/** 토스트 상태를 관리하고 화면에 띄우는 Provider */
export const ToastProvider = ({ children, placement = 'bottom-right', max = 5, pauseOnHover = true }: ToastProviderProps) => {
    const [items, setItems] = useState<ToastItem[]>([])
    const seq = useRef(0)
    const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>())
    // 남은 시간: 멈췄다 다시 갈 때 처음부터가 아니라 남은 만큼만 기다린다
    const deadlines = useRef(new Map<string, number>())
    const remaining = useRef(new Map<string, number>())
    const paused = useRef(false)
    const [isPaused, setPaused] = useState(false)

    const dismiss = useCallback((id?: string) => {
        if (id === undefined) {
            timers.current.forEach(clearTimeout)
            timers.current.clear()
            setItems([])
            return
        }
        const t = timers.current.get(id)
        if (t) clearTimeout(t)
        timers.current.delete(id)
        deadlines.current.delete(id)
        remaining.current.delete(id)
        setItems((prev) => prev.filter((x) => x.id !== id))
    }, [])

    const schedule = useCallback(
        (item: ToastItem) => {
            const old = timers.current.get(item.id)
            if (old) clearTimeout(old)
            const d = item.duration ?? 4000
            if (item.persistent || item.loading || d <= 0) return
            if (paused.current) {
                remaining.current.set(item.id, d)
                return
            }
            deadlines.current.set(item.id, Date.now() + d)
            timers.current.set(item.id, setTimeout(() => dismiss(item.id), d))
        },
        [dismiss],
    )

    const pause = useCallback(() => {
        if (!pauseOnHover || paused.current) return
        paused.current = true
        setPaused(true)
        const now = Date.now()
        timers.current.forEach((t, id) => {
            clearTimeout(t)
            remaining.current.set(id, Math.max(0, (deadlines.current.get(id) ?? now) - now))
        })
        timers.current.clear()
    }, [pauseOnHover])
    const resume = useCallback(() => {
        if (!paused.current) return
        paused.current = false
        setPaused(false)
        const now = Date.now()
        remaining.current.forEach((left, id) => {
            const wait = Math.max(600, left)
            deadlines.current.set(id, now + wait)
            timers.current.set(id, setTimeout(() => dismiss(id), wait))
        })
        remaining.current.clear()
    }, [dismiss])

    const toast = useCallback(
        (opts: ToastOptions): string => {
            const id = opts.id ?? `t-${++seq.current}`
            const item: ToastItem = { ...opts, id, createdAt: Date.now() }
            setItems((prev) => {
                const without = prev.filter((x) => x.id !== id)
                const next = [...without, item]
                return next.length > max ? next.slice(next.length - max) : next
            })
            schedule(item)
            return id
        },
        [max, schedule],
    )

    const update = useCallback(
        (id: string, opts: Partial<ToastOptions>) => {
            setItems((prev) =>
                prev.map((x) => {
                    if (x.id !== id) return x
                    const next = { ...x, ...opts, createdAt: Date.now() }
                    schedule(next)
                    return next
                }),
            )
        },
        [schedule],
    )

    const api = useMemo(() => {
        const fn = ((o: ToastOptions) => toast(o)) as ToastApi
        fn.success = (o) => toast({ ...o, tone: 'success' })
        fn.error = (o) => toast({ ...o, tone: 'danger' })
        fn.warning = (o) => toast({ ...o, tone: 'warning' })
        fn.info = (o) => toast({ ...o, tone: 'info' })
        fn.update = update
        fn.dismiss = dismiss
        fn.promise = async <R,>(p: Promise<R>, msgs: PromiseMessages<R>) => {
            const id = toast({ ...toOpts(msgs.loading), tone: 'info', loading: true })
            try {
                const r = await p
                const m = typeof msgs.success === 'function' ? (msgs.success as (r: R) => ToastOptions | ReactNode)(r) : msgs.success
                update(id, { tone: 'success', loading: false, duration: 4000, ...toOpts(m) })
                return r
            } catch (e) {
                const m = typeof msgs.error === 'function' ? (msgs.error as (e: unknown) => ToastOptions | ReactNode)(e) : msgs.error
                update(id, { tone: 'danger', loading: false, persistent: true, ...toOpts(m) })
                throw e
            }
        }
        return fn
    }, [toast, update, dismiss])

    useEffect(() => () => timers.current.forEach(clearTimeout), [])
    // 알림이 다 사라지면 멈춤 상태도 푼다 (영역이 없어지면 mouseleave 가 오지 않는다)
    useEffect(() => {
        if (items.length === 0 && paused.current) {
            paused.current = false
            setPaused(false)
            remaining.current.clear()
        }
    }, [items.length])

    return (
        <ToastContext.Provider value={{ toast: api, success: api.success, error: api.error, warning: api.warning, info: api.info, update, dismiss, promise: api.promise }}>
            {children}
            {typeof document !== 'undefined' &&
                createPortal(
                    <ol
                        data-ds-toaster=""
                        data-placement={placement}
                        data-paused={isPaused ? '' : undefined}
                        aria-label="알림"
                        onMouseEnter={pause}
                        onMouseLeave={(e) => { if (!e.currentTarget.contains(document.activeElement)) resume() }}
                        onFocus={pause}
                        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node) && !e.currentTarget.matches(':hover')) resume() }}
                    >
                        {(placement.startsWith('top') ? [...items].reverse() : items).map((t) => (
                            <ToastView key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
                        ))}
                    </ol>,
                    document.body,
                )}
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast 는 ToastProvider 안에서 써야 합니다.')
    return ctx
}

const ICON: Record<Tone, ReactNode> = {
    accent: <IconInfo size={18} />,
    neutral: <IconInfo size={18} />,
    info: <IconInfo size={18} />,
    success: <IconSuccess size={18} />,
    warning: <IconWarning size={18} />,
    danger: <IconError size={18} />,
}

const ToastView = ({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) => {
    const tone = item.tone ?? 'neutral'
    const urgent = tone === 'danger' || tone === 'warning'
    const d = item.duration ?? 4000
    return (
        <li data-ds-toast="" data-tone={tone} role={urgent ? 'alert' : 'status'} aria-live={urgent ? 'assertive' : 'polite'}>
            <span data-slot="icon" aria-hidden>
                {item.loading ? <span data-ds-spinner-ring="" style={{ width: 16, height: 16, borderWidth: 2 }} /> : ICON[tone]}
            </span>
            <div data-slot="body">
                {item.title && <b>{item.title}</b>}
                {item.description && <span>{item.description}</span>}
            </div>
            {item.action && (
                <button
                    type="button"
                    data-slot="action"
                    onClick={() => {
                        item.action!.onClick()
                        onDismiss()
                    }}
                >
                    {item.action.label}
                </button>
            )}
            <button type="button" data-slot="close" aria-label="알림 닫기" onClick={onDismiss}>
                <IconClose size={14} />
            </button>
            {item.progress && !item.persistent && !item.loading && d > 0 && (
                <span key={item.createdAt} data-slot="progress" style={{ animationDuration: `${d}ms` }} aria-hidden />
            )}
        </li>
    )
}
