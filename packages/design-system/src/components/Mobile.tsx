import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { LuCaptions, LuMaximize, LuPause, LuPlay, LuSettings, LuSkipForward, LuVolume2, LuVolumeX } from 'react-icons/lu'

/* 보드 12-06 · 영상 재생기 · 모바일 하단 시트 · 하단 탭 */

/* ───────── VideoPlayer ───────── */

export type VideoControl = 'play' | 'seek' | 'volume' | 'speed' | 'quality' | 'cc' | 'full'

export type VideoPlayerProps = {
    src: string
    poster?: string
    title?: ReactNode
    subtitle?: ReactNode
    subtitles?: Array<{ lang: string; label?: string; src: string }>
    /** 구간 건너뛰기 (초) */
    skip?: { from: number; to: number; label?: ReactNode }
    /** 끝나기 전 다음 화 안내 */
    next?: { title: ReactNode; at: number; onPlay?: () => void }
    controls?: VideoControl[]
    qualities?: string[]
    onQualityChange?: (q: string) => void
    startAt?: number
    onProgress?: (time: number, duration: number) => void
    autoPlay?: boolean
    radius?: number
    style?: CSSProperties
}

const fmtT = (s: number) => {
    if (!isFinite(s)) return '0:00'
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = Math.floor(s % 60)
    return `${h ? `${h}:${String(m).padStart(2, '0')}` : m}:${String(x).padStart(2, '0')}`
}

export const VideoPlayer = ({
    src, poster, title, subtitle, subtitles = [], skip, next, controls = ['play', 'seek', 'volume', 'speed', 'quality', 'cc', 'full'], qualities = ['자동', '1080p', '720p', '480p'], onQualityChange, startAt, onProgress, autoPlay, radius, style,
}: VideoPlayerProps) => {
    const v = useRef<HTMLVideoElement>(null)
    const box = useRef<HTMLDivElement>(null)
    const [playing, setPlaying] = useState(false)
    const [t, setT] = useState(0)
    const [dur, setDur] = useState(0)
    const [buf, setBuf] = useState(0)
    const [vol, setVol] = useState(1)
    const [muted, setMuted] = useState(false)
    const [idle, setIdle] = useState(false)
    const [settings, setSettings] = useState(false)
    const [rate, setRate] = useState(1)
    const [quality, setQuality] = useState(qualities[0] ?? '')
    const [cc, setCc] = useState<string>('')
    const idleT = useRef<ReturnType<typeof setTimeout>>(undefined)
    const has = (c: VideoControl) => controls.includes(c)
    const poke = () => { setIdle(false); clearTimeout(idleT.current); idleT.current = setTimeout(() => setIdle(true), 2500) }
    useEffect(() => { if (startAt && v.current) v.current.currentTime = startAt }, [startAt])
    useEffect(() => { if (v.current) v.current.playbackRate = rate }, [rate])
    useEffect(() => {
        const tracks = v.current?.textTracks
        if (tracks) for (let i = 0; i < tracks.length; i++) tracks[i]!.mode = tracks[i]!.language === cc ? 'showing' : 'disabled'
    }, [cc])
    const toggle = () => { const el = v.current; if (!el) return; el.paused ? el.play() : el.pause() }
    const seekTo = (s: number) => { if (v.current) v.current.currentTime = Math.max(0, Math.min(dur, s)) }
    const onKey = (e: React.KeyboardEvent) => {
        poke()
        if (e.key === ' ' || e.key === 'k') { e.preventDefault(); toggle() }
        if (e.key === 'ArrowRight') seekTo(t + 10)
        if (e.key === 'ArrowLeft') seekTo(t - 10)
        if (e.key === 'm') setMuted((m) => !m)
        if (e.key === 'f') box.current?.requestFullscreen?.()
    }
    const inSkip = skip && t >= skip.from && t < skip.to
    const showNext = next && t >= next.at
    return (
        <div data-ds-video="" ref={box} data-idle={idle && playing && !settings ? '' : undefined} tabIndex={0} onKeyDown={onKey} onMouseMove={poke} style={{ ...style, '--_r': radius != null ? `${radius}px` : undefined } as CSSProperties} aria-label="영상 재생기">
            <video
                ref={v}
                src={src}
                poster={poster}
                autoPlay={autoPlay}
                muted={muted}
                playsInline
                onClick={toggle}
                onPlay={() => { setPlaying(true); poke() }}
                onPause={() => setPlaying(false)}
                onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
                onTimeUpdate={(e) => { const el = e.currentTarget; setT(el.currentTime); onProgress?.(el.currentTime, el.duration); if (el.buffered.length) setBuf(el.buffered.end(el.buffered.length - 1)) }}
                onVolumeChange={(e) => setVol(e.currentTarget.volume)}
            >
                {subtitles.map((s) => <track key={s.lang} kind="subtitles" srcLang={s.lang} label={s.label ?? s.lang} src={s.src} />)}
            </video>
            {!playing && t === 0 && <button type="button" data-slot="center" aria-label="재생" onClick={toggle}><LuPlay size={30} /></button>}
            <div data-slot="ui">
                {title && <div data-slot="title">{subtitle && <small>{subtitle}</small>}{title}</div>}
                {inSkip && <button type="button" data-slot="skip" onClick={() => seekTo(skip!.to)}>{skip!.label ?? '오프닝 건너뛰기'}</button>}
                {showNext && !inSkip && (
                    <div data-slot="next">
                        <span><small style={{ display: 'block', opacity: .7 }}>다음 화</small>{next!.title}</span>
                        <button type="button" onClick={next!.onPlay} style={{ all: 'unset', cursor: 'pointer', padding: '6px 12px', background: '#fff', color: '#000', borderRadius: 6, fontWeight: 600 }}>
                            <LuSkipForward size={14} style={{ verticalAlign: '-2px' }} /> 재생
                        </button>
                    </div>
                )}
                {settings && (
                    <div data-slot="settings" role="dialog" aria-label="재생 설정">
                        {has('quality') && <div><span>화질</span><select value={quality} onChange={(e) => { setQuality(e.target.value); onQualityChange?.(e.target.value) }}>{qualities.map((q) => <option key={q}>{q}</option>)}</select></div>}
                        {has('speed') && <div><span>재생 속도</span><select value={rate} onChange={(e) => setRate(Number(e.target.value))}>{[0.5, 0.75, 1, 1.25, 1.5, 2].map((r) => <option key={r} value={r}>{r}x</option>)}</select></div>}
                        {has('cc') && subtitles.length > 0 && <div><span>자막</span><select value={cc} onChange={(e) => setCc(e.target.value)}><option value="">끄기</option>{subtitles.map((s) => <option key={s.lang} value={s.lang}>{s.label ?? s.lang}</option>)}</select></div>}
                    </div>
                )}
                {has('seek') && (
                    <div
                        data-slot="seek"
                        role="slider"
                        tabIndex={0}
                        aria-label="재생 위치"
                        aria-valuemin={0}
                        aria-valuemax={Math.round(dur)}
                        aria-valuenow={Math.round(t)}
                        aria-valuetext={`${fmtT(t)} / ${fmtT(dur)}`}
                        onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); seekTo(((e.clientX - r.left) / r.width) * dur) }}
                    >
                        <div>
                            <i data-buf="" style={{ width: `${dur ? (buf / dur) * 100 : 0}%` }} />
                            <i data-played="" style={{ width: `${dur ? (t / dur) * 100 : 0}%` }} />
                        </div>
                    </div>
                )}
                <div data-slot="bar">
                    {has('play') && <button type="button" aria-label={playing ? '일시정지' : '재생'} onClick={toggle}>{playing ? <LuPause size={20} /> : <LuPlay size={20} />}</button>}
                    {has('volume') && (
                        <>
                            <button type="button" aria-label={muted ? '소리 켜기' : '음소거'} onClick={() => setMuted((m) => !m)}>{muted || vol === 0 ? <LuVolumeX size={20} /> : <LuVolume2 size={20} />}</button>
                            <input data-slot="volume" type="range" min={0} max={1} step={0.05} value={muted ? 0 : vol} aria-label="음량" onChange={(e) => { const n = Number(e.target.value); if (v.current) v.current.volume = n; setMuted(n === 0) }} />
                        </>
                    )}
                    <span data-slot="time">{fmtT(t)} / {fmtT(dur)}</span>
                    <span style={{ flex: 1 }} />
                    {has('cc') && subtitles.length > 0 && <button type="button" aria-label="자막" aria-pressed={!!cc} onClick={() => setCc(cc ? '' : subtitles[0]!.lang)}><LuCaptions size={20} /></button>}
                    {(has('speed') || has('quality')) && <button type="button" aria-label="설정" aria-expanded={settings} onClick={() => setSettings((s) => !s)}><LuSettings size={20} /></button>}
                    {has('full') && <button type="button" aria-label="전체 화면" onClick={() => (document.fullscreenElement ? document.exitFullscreen() : box.current?.requestFullscreen?.())}><LuMaximize size={18} /></button>}
                </div>
            </div>
        </div>
    )
}

/* ───────── BottomSheet ───────── */

export type BottomSheetProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    /** 화면 높이 비율. 끌어서 이 지점들에 멈춘다 */
    snapPoints?: number[]
    defaultSnap?: number
    dim?: boolean
    title?: ReactNode
    children?: ReactNode
    footer?: ReactNode
    /** 포털 없이 부모(position: relative) 안에 그린다 — 미리보기용 */
    inline?: boolean
    'aria-label'?: string
}

export const BottomSheet = ({ open, onOpenChange, snapPoints = [0.5, 0.9], defaultSnap = 0, dim = true, title, children, footer, inline, ...rest }: BottomSheetProps) => {
    const [snap, setSnap] = useState(defaultSnap)
    const [drag, setDrag] = useState<number | null>(null)
    const start = useRef<{ y: number; h: number } | null>(null)
    const ref = useRef<HTMLDivElement>(null)
    const hostH = () => (inline ? ref.current?.parentElement?.clientHeight ?? 600 : window.innerHeight)
    useEffect(() => { if (open) setSnap(defaultSnap) }, [open, defaultSnap])
    useEffect(() => {
        if (!open) return
        const k = (e: KeyboardEvent) => e.key === 'Escape' && onOpenChange(false)
        window.addEventListener('keydown', k)
        ref.current?.focus()
        return () => window.removeEventListener('keydown', k)
    }, [open, onOpenChange])
    if (!open) return null
    const H = hostH()
    const height = drag ?? (snapPoints[snap] ?? 0.5) * H
    const onDown = (e: React.PointerEvent) => { start.current = { y: e.clientY, h: height }; (e.target as HTMLElement).setPointerCapture(e.pointerId) }
    const onMove = (e: React.PointerEvent) => { if (start.current) setDrag(Math.max(0, start.current.h + start.current.y - e.clientY)) }
    const onUp = () => {
        if (!start.current) return
        start.current = null
        const r = (drag ?? height) / H
        setDrag(null)
        if (r < (snapPoints[0] ?? 0.5) * 0.6) return onOpenChange(false)
        let best = 0
        snapPoints.forEach((p, i) => { if (Math.abs(p - r) < Math.abs(snapPoints[best]! - r)) best = i })
        setSnap(best)
    }
    const node = (
        <>
            {dim && <div data-ds-sheet-backdrop="" style={inline ? { position: 'absolute' } : undefined} onClick={() => onOpenChange(false)} />}
            <div ref={ref} data-ds-sheet="" data-inline={inline ? '' : undefined} data-dragging={drag != null ? '' : undefined} role="dialog" aria-modal={dim} aria-label={rest['aria-label'] ?? (typeof title === 'string' ? title : undefined)} tabIndex={-1} style={{ height }}>
                <div data-slot="grip" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} role="button" aria-label="시트 높이 조절" tabIndex={0} onKeyDown={(e) => { if (e.key === 'ArrowUp') setSnap((s) => Math.min(snapPoints.length - 1, s + 1)); if (e.key === 'ArrowDown') snap === 0 ? onOpenChange(false) : setSnap(snap - 1) }} />
                {title && <div data-slot="head">{title}</div>}
                <div data-slot="content">{children}</div>
                {footer && <div data-slot="footer">{footer}</div>}
            </div>
        </>
    )
    return inline || typeof document === 'undefined' ? node : createPortal(node, document.body)
}

/* ───────── MobileTabBar ───────── */

export type MobileTabItem = { key: string; icon: ReactNode; activeIcon?: ReactNode; label: string; badge?: number | string; href?: string }

export type MobileTabBarProps = {
    /** 5개 이하 */
    items: MobileTabItem[]
    value?: string
    onChange?: (key: string) => void
    /** 아래 홈 막대 여백 */
    safeArea?: boolean
    /** 화면 아래 고정 대신 흐름 안에 — 미리보기용 */
    inline?: boolean
    style?: CSSProperties
}

export const MobileTabBar = ({ items, value, onChange, safeArea = true, inline, style }: MobileTabBarProps) => {
    if (items.length > 5) console.warn('MobileTabBar: 탭은 5개 이하를 권장합니다')
    return (
        <nav data-ds-tabbar="" data-safe-area={safeArea ? '' : undefined} data-inline={inline ? '' : undefined} aria-label="주 메뉴" style={{ ...style, '--_n': items.length } as CSSProperties}>
            {items.map((it) => {
                const on = it.key === value
                const inner = (
                    <>
                        {on && it.activeIcon ? it.activeIcon : it.icon}
                        <span>{it.label}</span>
                        {it.badge != null && it.badge !== 0 && <span data-slot="badge" aria-label={`${it.badge}개`}>{typeof it.badge === 'number' && it.badge > 99 ? '99+' : it.badge}</span>}
                    </>
                )
                return it.href ? (
                    <a key={it.key} href={it.href} aria-current={on ? 'page' : undefined} onClick={() => onChange?.(it.key)}>{inner}</a>
                ) : (
                    <button key={it.key} type="button" aria-current={on ? 'page' : undefined} onClick={() => onChange?.(it.key)}>{inner}</button>
                )
            })}
        </nav>
    )
}
