import { useState, type CSSProperties, type ReactNode } from 'react'

/* 비율 고정 이미지 · 가격 · 별점 · 순위 · 이어보기 */

/* ───────── Media ───────── */

export type MediaRatio = '1' | '4/3' | '16/9' | '2/3' | '3/4' | number

export type MediaProps = {
    src?: string
    /** 대체 텍스트 (장식이면 "") */
    alt: string
    ratio?: MediaRatio
    /** blur: placeholderSrc 를 흐리게 · color: placeholderColor 단색 */
    placeholder?: 'blur' | 'color' | 'none'
    placeholderSrc?: string
    placeholderColor?: string
    lazy?: boolean
    fit?: 'cover' | 'contain'
    radius?: number | string
    /** 이미지 위에 얹는 요소 (배지 · 찜 버튼 · 이어보기 막대) */
    overlay?: ReactNode
    style?: CSSProperties
    className?: string
}

export const Media = ({ src, alt, ratio = '1', placeholder = 'blur', placeholderSrc, placeholderColor, lazy = true, fit = 'cover', radius, overlay, style, className }: MediaProps) => {
    const [loaded, setLoaded] = useState(false)
    const r = typeof ratio === 'number' ? String(ratio) : ratio.replace('/', ' / ')
    const showPh = !loaded && placeholder !== 'none'
    return (
        <div data-ds-media="" data-placeholder={placeholder} className={className} style={{ ...style, '--_ratio': r, '--_fit': fit, '--_r': typeof radius === 'number' ? `${radius}px` : radius } as CSSProperties}>
            {showPh && <div data-slot="ph" aria-hidden style={placeholder === 'color' ? { background: placeholderColor } : { backgroundImage: placeholderSrc ? `url(${placeholderSrc})` : undefined, background: placeholderSrc ? undefined : placeholderColor }} />}
            {src && <img src={src} alt={alt} loading={lazy ? 'lazy' : 'eager'} decoding="async" data-loading={loaded ? undefined : ''} onLoad={() => setLoaded(true)} />}
            {overlay && <div data-slot="overlay">{overlay}</div>}
        </div>
    )
}

/* ───────── Price ───────── */

export type PriceProps = {
    value: number
    /** 정가 — 있으면 취소선 + 할인율 */
    listPrice?: number
    currency?: string
    locale?: string
    /** 'KRW' 는 "62,300원", 그 밖은 Intl 통화 형식 */
    unitPrice?: ReactNode
    /** 쿠폰 적용가 */
    coupon?: number
    soldOut?: boolean
    size?: 'sm' | 'md' | 'lg'
    /** 정가를 같은 줄 앞에 (목록 카드용) */
    layout?: 'stacked' | 'inline'
    style?: CSSProperties
}

export const formatPrice = (n: number, currency = 'KRW', locale = 'ko-KR') =>
    currency === 'KRW' ? `${n.toLocaleString(locale)}원` : new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n)

export const Price = ({ value, listPrice, currency = 'KRW', locale = 'ko-KR', unitPrice, coupon, soldOut, size = 'md', layout = 'stacked', style }: PriceProps) => {
    const rate = listPrice && listPrice > value ? Math.round((1 - value / listPrice) * 100) : 0
    const krw = currency === 'KRW'
    const valueNode = krw ? <>{value.toLocaleString(locale)}<small>원</small></> : formatPrice(value, currency, locale)
    const list = rate > 0 && <span data-slot="list"><span data-ds-sr-only="">정가 </span>{formatPrice(listPrice!, currency, locale)}</span>
    return (
        <span data-ds-price="" data-size={size} data-sold-out={soldOut ? '' : undefined} style={style}>
            {layout === 'stacked' && list}
            <span data-slot="row">
                {rate > 0 && <span data-slot="rate" aria-label={`${rate}% 할인`}>{rate}%</span>}
                <span data-slot="value">{valueNode}</span>
                {layout === 'inline' && list}
                {soldOut && <span data-slot="soldout">품절</span>}
            </span>
            {coupon != null && !soldOut && <span data-slot="coupon">쿠폰 적용 시 {formatPrice(coupon, currency, locale)}</span>}
            {unitPrice && <span data-slot="unit">{unitPrice}</span>}
        </span>
    )
}

/* ───────── RatingDisplay ───────── */

export type RatingDisplayProps = {
    value: number
    count?: number
    /** [5점, 4점, 3점, 2점, 1점] 개수 또는 비율 */
    distribution?: number[]
    /** inline: ★4.6 (1,284) · compact: 4.6 · 리뷰 1,284 · summary: 큰 숫자 + 분포 */
    layout?: 'inline' | 'compact' | 'summary'
    max?: number
    size?: number
    style?: CSSProperties
}

const Stars = ({ value, max, size }: { value: number; max: number; size: number }) => (
    <span data-slot="stars" style={{ fontSize: size }} aria-hidden>
        {'★'.repeat(max)}
        <span style={{ width: `${(value / max) * 100}%` }}>{'★'.repeat(max)}</span>
    </span>
)

export const RatingDisplay = ({ value, count, distribution, layout = 'inline', max = 5, size = 14, style }: RatingDisplayProps) => {
    const label = `별점 ${value.toFixed(1)}점${count != null ? `, 리뷰 ${count.toLocaleString()}개` : ''}`
    if (layout === 'summary') {
        const total = distribution?.reduce((a, b) => a + b, 0) || 1
        return (
            <div data-ds-rating-display="" data-layout="summary" style={style} role="group" aria-label={label}>
                <div data-slot="big">
                    <strong>{value.toFixed(1)}</strong>
                    <Stars value={value} max={max} size={18} />
                    {count != null && <span>리뷰 {count.toLocaleString()}개</span>}
                </div>
                {distribution && (
                    <div data-slot="dist">
                        {distribution.map((n, i) => {
                            const pct = Math.round((n / total) * 100)
                            return (
                                <div key={i}>
                                    <span>{max - i}점</span>
                                    <i><i style={{ width: `${pct}%` }} /></i>
                                    <span style={{ textAlign: 'right' }}>{pct}%</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        )
    }
    return (
        <span data-ds-rating-display="" style={style} role="img" aria-label={label}>
            {layout === 'compact' ? <span style={{ color: 'var(--ds-palette-warning-500)' }}>★</span> : <Stars value={value} max={max} size={size} />}
            <b>{value.toFixed(1)}</b>
            {count != null && (layout === 'compact' ? <span>· 리뷰 {count.toLocaleString()}</span> : <span>({count.toLocaleString()})</span>)}
        </span>
    )
}

/* ───────── RankNumber ───────── */

export type RankNumberProps = {
    value: number
    /** outline: 큰 외곽선 숫자 (TOP 10) · solid · badge: 작은 사각 배지 */
    appearance?: 'outline' | 'solid' | 'badge'
    size?: number
    style?: CSSProperties
}

export const RankNumber = ({ value, appearance = 'outline', size = 64, style }: RankNumberProps) => (
    <span data-ds-rank="" data-appearance={appearance} aria-label={`${value}위`} style={{ ...style, '--_s': `${size}px` } as CSSProperties}>
        {value}
    </span>
)

/* ───────── WatchProgress ───────── */

export type WatchProgressProps = {
    /** 0 ~ 1 */
    value: number
    /** 남은 시간 문구 (예: "38분 남음") */
    remaining?: ReactNode
    label?: ReactNode
    /** 썸네일 아래쪽에 겹쳐 놓기 */
    overlay?: boolean
    style?: CSSProperties
}

export const WatchProgress = ({ value, remaining, label, overlay, style }: WatchProgressProps) => {
    const pct = Math.round(Math.max(0, Math.min(1, value)) * 100)
    return (
        <div data-ds-watch="" data-overlay={overlay ? '' : undefined} style={style}>
            <div data-slot="bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="시청 진행"><i style={{ width: `${pct}%` }} /></div>
            {!overlay && (label || remaining) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}><span>{label}</span><span>{remaining}</span></div>
            )}
        </div>
    )
}
