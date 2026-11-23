import { Children, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { LuChevronLeft, LuChevronRight, LuPause, LuPlay } from 'react-icons/lu'
import { Display } from '../layout/Container.js'

/* 큰 배너 · 슬라이드 · 가로로 넘기는 줄 */

export type PerView = number | { /** 폭 768 미만 */ sm?: number; /** 폭 768 ~ 1279 */ md?: number; /** 폭 1280 이상 */ lg?: number }

/** sm < 768 ≤ md < 1280 ≤ lg */
export const usePerView = (pv: PerView) => {
    const pick = useCallback(() => {
        if (typeof pv === 'number') return pv
        const w = typeof window === 'undefined' ? 1280 : window.innerWidth
        return (w >= 1280 ? pv.lg ?? pv.md ?? pv.sm : w >= 768 ? pv.md ?? pv.sm ?? pv.lg : pv.sm ?? pv.md ?? pv.lg) ?? 1
    }, [typeof pv === 'number' ? pv : JSON.stringify(pv)])
    const [n, setN] = useState(pick)
    useEffect(() => {
        const on = () => setN(pick())
        on()
        window.addEventListener('resize', on)
        return () => window.removeEventListener('resize', on)
    }, [pick])
    return n
}

/* ───────── Hero ───────── */

export type HeroProps = {
    /** overlay: 이미지 위 왼쪽 아래 글 · split: 반반 · center: 가운데 */
    layout?: 'overlay' | 'split' | 'center'
    /** 이미지 주소, 또는 { video, poster } */
    media?: string | { video: string; poster?: string } | ReactNode
    /** 이미지 대체 텍스트 (영상이면 aria-label) */
    mediaAlt?: string
    /** 아래쪽 어둡게 강도 0~1 */
    scrim?: number
    /** 제목 위 작은 글 */
    eyebrow?: ReactNode
    /** 큰 제목 (h2) */
    title: ReactNode
    /** 제목 크기. hero 타이포 역할 sm · md · lg */
    titleSize?: 'sm' | 'md' | 'lg'
    /** 제목 아래 설명 */
    description?: ReactNode
    /** 아래쪽 버튼 자리 */
    actions?: ReactNode
    /** 최소 높이. 숫자면 px (기본 overlay · center 520, split 360) */
    height?: number | string
    /** 모서리 둥글기. 숫자면 px */
    radius?: number | string
    /** 바깥 요소 스타일 */
    style?: CSSProperties
}

/** 큰 배너. 이미지 · 영상 위나 옆에 제목과 버튼을 놓는다 */
export const Hero = ({ layout = 'overlay', media, mediaAlt = '', scrim = 0.7, eyebrow, title, titleSize = 'sm', description, actions, height, radius, style }: HeroProps) => {
    const m =
        typeof media === 'string' ? <img src={media} alt={mediaAlt} /> :
        media && typeof media === 'object' && 'video' in (media as any) ? <video src={(media as any).video} poster={(media as any).poster} autoPlay muted loop playsInline aria-label={mediaAlt} /> :
        (media as ReactNode)
    return (
        <section data-ds-hero="" data-layout={layout} style={{ ...style, '--_h': typeof height === 'number' ? `${height}px` : height, '--_r': typeof radius === 'number' ? `${radius}px` : radius, '--_scrim': scrim } as CSSProperties}>
            {m && <div data-slot="media">{m}{layout !== 'split' && scrim > 0 && <div data-slot="scrim" />}</div>}
            <div data-slot="body">
                {eyebrow && <div data-slot="eyebrow">{eyebrow}</div>}
                <Display size={titleSize} as="h2" style={{ color: 'inherit' }}>{title}</Display>
                {description && <p data-slot="desc">{description}</p>}
                {actions && <div data-slot="actions">{actions}</div>}
            </div>
        </section>
    )
}

/* ───────── Carousel ───────── */

export type CarouselProps = {
    /** 슬라이드들 (자식 하나가 한 장) */
    children: ReactNode
    /** 자동 넘김 간격(ms). 마우스를 올리거나 포커스가 있으면 멈춘다 */
    autoplay?: number
    /** 끝에서 처음으로 이어 넘기기. 끄면 양 끝 화살표 비활성 */
    loop?: boolean
    /** 한 번에 보이는 장 수. 객체면 화면 폭별 */
    perView?: PerView
    /** 슬라이드 사이 간격(px) */
    gap?: number
    /** dots: 점 · count: "1 / 5" (autoplay 면 멈춤 버튼) · thumbs: 썸네일 */
    indicator?: 'dots' | 'count' | 'thumbs' | 'none'
    /** indicator="thumbs" 일 때 썸네일 주소 */
    thumbs?: string[]
    /** 좌우 화살표 버튼 (넘길 장이 있을 때) */
    arrows?: boolean
    /** 제어 모드 현재 장 번호 (0부터) */
    index?: number
    /** 비제어 초기 장 번호 */
    defaultIndex?: number
    /** 장이 바뀔 때 (새 번호) */
    onIndexChange?: (i: number) => void
    /** 모서리 둥글기(px) */
    radius?: number
    /** 캐러셀 영역 이름 (스크린 리더) */
    'aria-label'?: string
    /** 바깥 요소 스타일 */
    style?: CSSProperties
}

/** 한 장씩 넘기는 슬라이드. 스와이프 · 좌우 화살표 키로 넘긴다 */
export const Carousel = ({ children, autoplay, loop = true, perView = 1, gap = 0, indicator = 'dots', thumbs, arrows = true, index: indexProp, defaultIndex = 0, onIndexChange, radius, style, ...rest }: CarouselProps) => {
    const slides = Children.toArray(children)
    const pv = usePerView(perView)
    const pages = Math.max(1, slides.length - pv + 1)
    const [inner, setInner] = useState(defaultIndex)
    const idx = Math.min(indexProp ?? inner, pages - 1)
    const [paused, setPaused] = useState(false)
    const [playing, setPlaying] = useState(!!autoplay)
    const go = useCallback((i: number) => {
        const n = loop ? (i + pages) % pages : Math.max(0, Math.min(pages - 1, i))
        setInner(n)
        onIndexChange?.(n)
    }, [loop, pages, onIndexChange])
    useEffect(() => {
        if (!autoplay || !playing || paused) return
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
        const t = setInterval(() => go(idx + 1), autoplay)
        return () => clearInterval(t)
    }, [autoplay, playing, paused, idx, go])
    const touch = useRef<number | null>(null)
    return (
        <div
            data-ds-carousel=""
            role="region"
            aria-roledescription="carousel"
            aria-label={rest['aria-label']}
            style={{ ...style, '--_pv': pv, '--_gap': `${gap}px`, '--_r': radius != null ? `${radius}px` : undefined, '--_ind': indicator === 'dots' ? '10px' : indicator === 'thumbs' ? '37px' : '0px' } as CSSProperties}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onKeyDown={(e) => { if (e.key === 'ArrowLeft') go(idx - 1); if (e.key === 'ArrowRight') go(idx + 1) }}
        >
            <div data-slot="viewport" onTouchStart={(e) => (touch.current = e.touches[0]!.clientX)} onTouchEnd={(e) => { if (touch.current == null) return; const d = e.changedTouches[0]!.clientX - touch.current; if (Math.abs(d) > 40) go(idx + (d < 0 ? 1 : -1)); touch.current = null }}>
                <div data-slot="track" aria-live={playing && !paused ? 'off' : 'polite'} style={{ transform: `translateX(calc(${-idx} * (100% + ${gap}px) / ${pv}))` }}>
                    {slides.map((s, i) => (
                        <div key={i} data-slot="slide" role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${slides.length}`} aria-hidden={i < idx || i >= idx + pv || undefined} inert={i < idx || i >= idx + pv ? true : undefined}>
                            {s}
                        </div>
                    ))}
                </div>
            </div>
            {arrows && pages > 1 && (
                <>
                    <button type="button" data-slot="arrow" data-dir="prev" aria-label="이전" disabled={!loop && idx === 0} onClick={() => go(idx - 1)}><LuChevronLeft size={20} /></button>
                    <button type="button" data-slot="arrow" data-dir="next" aria-label="다음" disabled={!loop && idx === pages - 1} onClick={() => go(idx + 1)}><LuChevronRight size={20} /></button>
                </>
            )}
            {indicator === 'dots' && pages > 1 && (
                <div data-slot="dots">
                    {Array.from({ length: pages }, (_, i) => <button key={i} type="button" aria-label={`${i + 1}번 슬라이드`} aria-current={i === idx} onClick={() => go(i)} />)}
                </div>
            )}
            {indicator === 'count' && (
                <div data-slot="count">
                    {autoplay && <button type="button" aria-label={playing ? '자동 넘김 멈춤' : '자동 넘김 재생'} onClick={() => setPlaying((p) => !p)}>{playing ? <LuPause size={12} /> : <LuPlay size={12} />}</button>}
                    {idx + 1} / {pages}
                </div>
            )}
            {indicator === 'thumbs' && (
                <div data-slot="thumbs">
                    {slides.map((_, i) => <button key={i} type="button" aria-label={`${i + 1}번 슬라이드`} aria-current={i === idx} onClick={() => go(i)}>{thumbs?.[i] && <img src={thumbs[i]} alt="" />}</button>)}
                </div>
            )}
        </div>
    )
}

/* ───────── Rail ───────── */

export type RailProps = {
    /** 머리 제목 (h3) */
    title?: ReactNode
    /** 제목 아래 보조 글 */
    subtitle?: ReactNode
    /** 오른쪽 위 '전체 보기' 등 */
    action?: ReactNode
    /** 줄에 놓을 카드들 (자식 하나가 한 칸) */
    children: ReactNode
    /** 한 화면에 보이는 칸 수. 객체면 화면 폭별 */
    perView?: PerView
    /** 다음 칸이 비치는 비율 */
    peek?: number
    /** 칸 사이 간격(px) */
    gap?: number
    /** 스크롤이 멈출 때 칸을 맞추는 위치 */
    snap?: 'start' | 'center'
    /** 머리 오른쪽에 이전·다음 버튼 */
    arrows?: boolean
    /** 바깥 요소 스타일 */
    style?: CSSProperties
}

/** 가로로 스크롤해 넘기는 카드 줄 */
export const Rail = ({ title, subtitle, action, children, perView = { sm: 2, md: 4, lg: 5 }, peek = 0.3, gap = 12, snap = 'start', arrows = false, style }: RailProps) => {
    const pv = usePerView(perView)
    const ref = useRef<HTMLDivElement>(null)
    const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.9, behavior: 'smooth' })
    return (
        <section data-ds-rail="" style={{ ...style, '--_pv': pv, '--_peek': peek, '--_gap': `${gap}px`, '--_snap': snap } as CSSProperties}>
            {(title || action || arrows) && (
                <div data-slot="head">
                    <div>
                        {title && <h3>{title}</h3>}
                        {subtitle && <p>{subtitle}</p>}
                    </div>
                    <div data-slot="action">
                        {action}
                        {arrows && (
                            <>
                                <button type="button" data-slot="nav" aria-label="이전" onClick={() => scroll(-1)}><LuChevronLeft size={16} /></button>
                                <button type="button" data-slot="nav" aria-label="다음" onClick={() => scroll(1)}><LuChevronRight size={16} /></button>
                            </>
                        )}
                    </div>
                </div>
            )}
            <div data-slot="track" ref={ref} role="list">
                {Children.toArray(children).map((c, i) => <div key={i} role="listitem">{c}</div>)}
            </div>
        </section>
    )
}
