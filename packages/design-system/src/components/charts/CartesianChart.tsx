import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode, type Ref } from 'react'
import { niceMax, smoothPath } from './chartUtils.js'
import type { Tone } from '../types.js'

/** 시리즈 색 순서 (tone 미지정 시) */
export const CHART_COLORS = [
    'var(--ds-palette-primary-500)',
    'var(--ds-palette-info-500)',
    'var(--ds-palette-success-500)',
    'var(--ds-palette-warning-500)',
    'var(--ds-palette-danger-500)',
    'var(--ds-palette-primary-300)',
    'var(--ds-palette-neutral-400)',
    'var(--ds-palette-info-300)',
]
export const chartColor = (t?: Tone | string, i = 0): string => {
    if (!t) return CHART_COLORS[i % CHART_COLORS.length]!
    switch (t) {
        case 'accent':
            return 'var(--ds-palette-primary-500)'
        case 'neutral':
            return 'var(--ds-palette-neutral-400)'
        case 'success':
        case 'warning':
        case 'danger':
        case 'info':
            return `var(--ds-palette-${t}-500)`
        default:
            return t // CSS 색
    }
}

export type ChartSeries = {
    /** bar: 막대 · line: 선 · area: 선 아래 채움 */
    type?: 'bar' | 'line' | 'area'
    /** data 행에서 값을 읽을 키 */
    key: string
    /** 범례 · tooltip 이름 (없으면 key) */
    label?: string
    /** 톤 또는 CSS 색 (없으면 순서대로 팔레트) */
    tone?: Tone | string
    /** 같은 stack 이름끼리 쌓는다 */
    stack?: string
    /** 값을 읽을 세로축 (right: 오른쪽 보조축) */
    axis?: 'left' | 'right'
    /** 곡선으로 (선 · 영역) */
    smooth?: boolean
    /** 계단선. true 는 after (선 · 영역) */
    step?: boolean | 'before' | 'after'
    /** 점선으로 (선 · 영역) */
    dashed?: boolean
    /** 처음부터 숨김 (범례를 눌러 켠다) */
    hidden?: boolean
    /** 점 표시. 없으면 16개 이하일 때만 */
    showDots?: boolean
}
export type AxisOpts = { format?: (n: number) => string; min?: number; max?: number; ticks?: number; label?: string; hidden?: boolean }
export type ReferenceLine = { value: number; label?: string; axis?: 'left' | 'right'; tone?: Tone | string; dashed?: boolean }
export type Band = { from: number; to: number; axis?: 'left' | 'right'; tone: Tone | string; label?: string }

export type CartesianChartProps = {
    /** x축 범주 라벨 */
    labels: string[]
    /** labels 와 같은 순서의 행. 값이 null 이면 빈칸 */
    data: Array<Record<string, number | null | undefined>>
    /** 그릴 시리즈 (data 키 · 모양 · 축) */
    series: ChartSeries[]
    /** 축별 형식 · 범위 · 눈금 수 · 숨김 */
    axes?: { left?: AxisOpts; right?: AxisOpts; x?: { format?: (l: string, i: number) => string; hidden?: boolean; every?: number } }
    /** grouped: 나란히 · stacked: 쌓기 · overlap: 겹치기 */
    barMode?: 'grouped' | 'stacked' | 'overlap'
    /** normal: 값 그대로 · percent: 100% 기준으로 쌓기 */
    stackMode?: 'normal' | 'percent'
    /** horizontal 이면 가로 막대 (선 · 영역은 안 그림) */
    orientation?: 'vertical' | 'horizontal'
    /** 기준선 (목표 · 한계값) */
    referenceLines?: ReferenceLine[]
    /** 값 구간 음영 (허용 범위 등) */
    bands?: Band[]
    /** x 위치(라벨 · 인덱스)의 세로 표시선 (세로 차트만) */
    annotations?: Array<{ x: string | number; label: string; tone?: Tone | string }>
    /** 범례 위치. 항목을 누르면 시리즈 숨김 */
    legend?: 'top' | 'bottom' | 'none'
    /** shared: 열의 모든 시리즈 · single: 올린 시리즈만 */
    tooltip?: 'shared' | 'single' | 'none'
    /** 아래에 전체 미니 차트 + 구간 선택 (긴 기간) */
    brush?: boolean
    /** 막대 · 점을 눌렀을 때 (시리즈, 인덱스) */
    onPointClick?: (series: ChartSeries, index: number) => void
    /** 스켈레톤 표시 */
    loading?: boolean
    /** labels · series 가 비었을 때 보일 내용 */
    empty?: ReactNode
    /** 그림 영역 높이 (px) */
    height?: number
    /** compact: 눈금 3개 · 막대 사이 좁게 */
    density?: 'compact' | 'default'
    /** 값 축 격자선 */
    showGrid?: boolean
    /** 빈 값(null)을 건너 이어 그린다 */
    connectNulls?: boolean
    /** 막대 · 점 위에 값 글자 */
    showValues?: boolean
    /** 막대 모서리 둥글게 */
    rounded?: boolean
    /** 막대 사이 간격 비율 (칸 너비 대비 0~1) */
    barGap?: number
    /** 작은 값도 보이게 하는 막대 최소 길이 (px) */
    minBarHeight?: number
    /** 막대 색을 값으로 정한다 */
    barTone?: (value: number, seriesKey: string, index: number) => Tone | string | undefined
    /** 차트 svg 의 접근성 이름 */
    'aria-label'?: string
    /** 바깥 요소 class */
    className?: string
    /** 바깥 요소 style */
    style?: CSSProperties
    /** DOM 요소 ref */
    ref?: Ref<HTMLDivElement>
}

const fmtDefault = (n: number) => (Math.abs(n) >= 1000 ? n.toLocaleString('ko-KR', { maximumFractionDigits: 1 }) : String(Math.round(n * 100) / 100))

const useWidth = () => {
    const ref = useRef<HTMLDivElement | null>(null)
    const [w, setW] = useState(600)
    useEffect(() => {
        if (!ref.current) return
        const ro = new ResizeObserver((e) => setW(Math.max(160, Math.round(e[0]!.contentRect.width))))
        ro.observe(ref.current)
        return () => ro.disconnect()
    }, [])
    return [ref, w] as const
}

const stepPath = (pts: [number, number][], mode: 'before' | 'after') =>
    pts
        .map((p, i) => {
            if (i === 0) return `M ${p[0]} ${p[1]}`
            const prev = pts[i - 1]!
            return mode === 'after' ? `H ${p[0]} V ${p[1]}` : `V ${p[1]} H ${p[0]}`.replace(/^/, prev ? '' : '')
        })
        .join(' ')

/** 막대 · 선 · 영역을 한 좌표축에 섞어 그리는 기본 차트 */
export const CartesianChart = ({
    labels: allLabels,
    data: allData,
    series,
    axes = {},
    barMode = 'grouped',
    stackMode = 'normal',
    orientation = 'vertical',
    referenceLines = [],
    bands = [],
    annotations = [],
    legend = 'top',
    tooltip = 'shared',
    brush,
    onPointClick,
    loading,
    empty = '표시할 데이터가 없습니다',
    height = 260,
    density = 'default',
    showGrid = true,
    connectNulls,
    showValues,
    rounded = true,
    barGap,
    minBarHeight = 0,
    barTone,
    'aria-label': ariaLabel,
    className,
    style,
    ref,
}: CartesianChartProps) => {
    const [wrapRef, width] = useWidth()
    const [hidden, setHidden] = useState<Set<string>>(() => new Set(series.filter((s) => s.hidden).map((s) => s.key)))
    const [hover, setHover] = useState<number | null>(null)
    const [hoverSeries, setHoverSeries] = useState<string | null>(null)
    const [win, setWin] = useState<[number, number]>([0, allLabels.length - 1])
    useEffect(() => setWin([0, allLabels.length - 1]), [allLabels.length])

    const labels = brush ? allLabels.slice(win[0], win[1] + 1) : allLabels
    const data = brush ? allData.slice(win[0], win[1] + 1) : allData
    const visible = series.filter((s) => !hidden.has(s.key))
    const horizontal = orientation === 'horizontal'
    const compact = density === 'compact'

    // 쌓기 계산
    const stacked = barMode === 'stacked' || stackMode === 'percent' || series.some((s) => s.stack)
    const stackKey = (s: ChartSeries) => (s.stack ?? (barMode === 'stacked' || stackMode === 'percent' ? `__${s.type ?? 'bar'}_${s.axis ?? 'left'}` : `__solo_${s.key}`))
    const { base, top } = useMemo(() => {
        const base: Record<string, number[]> = {}
        const top: Record<string, number[]> = {}
        const totals: Record<string, number[]> = {}
        if (stackMode === 'percent') {
            for (const s of visible) {
                const k = stackKey(s)
                totals[k] ??= labels.map(() => 0)
                data.forEach((r, i) => (totals[k]![i]! += Math.abs(Number(r[s.key] ?? 0))))
            }
        }
        const posAcc: Record<string, number[]> = {}
        const negAcc: Record<string, number[]> = {}
        for (const s of visible) {
            const k = stackKey(s)
            posAcc[k] ??= labels.map(() => 0)
            negAcc[k] ??= labels.map(() => 0)
            base[s.key] = []
            top[s.key] = []
            data.forEach((r, i) => {
                let v = Number(r[s.key] ?? 0)
                if (stackMode === 'percent') v = totals[k]![i] ? (v / totals[k]![i]!) * 100 : 0
                const acc = v >= 0 ? posAcc[k]! : negAcc[k]!
                const b = stacked && !k.startsWith('__solo') ? acc[i]! : 0
                base[s.key]![i] = b
                top[s.key]![i] = b + v
                if (stacked && !k.startsWith('__solo')) acc[i] = b + v
            })
        }
        return { base, top }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, visible.map((s) => s.key).join(), stackMode, barMode])

    const domain = (axis: 'left' | 'right') => {
        const ss = visible.filter((s) => (s.axis ?? 'left') === axis)
        if (!ss.length) return null
        const opts = axes[axis] ?? {}
        const vals = ss.flatMap((s) => [...(top[s.key] ?? []).filter((_, i) => data[i]![s.key] != null), ...(stacked ? (base[s.key] ?? []) : [])]).filter((v) => Number.isFinite(v))
        const refs = [...referenceLines.filter((r) => (r.axis ?? 'left') === axis).map((r) => r.value), ...bands.filter((b) => (b.axis ?? 'left') === axis).flatMap((b) => [b.from, b.to])]
        // 막대·영역이 있으면 0 에서 시작, 선만 있으면 값 범위에 맞춘다 (수율 95~99% 가 평평해 보이지 않게)
        const fromZero = ss.some((s) => (s.type ?? 'bar') !== 'line') || stacked
        const vmin = Math.min(...vals, ...refs)
        const vmax = Math.max(...vals, ...refs)
        const padV = (vmax - vmin || Math.abs(vmax) || 1) * 0.15
        let lo = opts.min ?? (fromZero ? Math.min(0, vmin) : vmin - padV)
        let hi = opts.max ?? (fromZero ? Math.max(vmax, 0) : vmax + padV)
        if (stackMode === 'percent' && axis === 'left') hi = opts.max ?? 100
        if (opts.max === undefined && stackMode !== 'percent' && fromZero) hi = niceMax(hi || 1)
        if (opts.min === undefined && lo < 0 && fromZero) lo = -niceMax(-lo)
        if (!fromZero) { const step = (hi - lo) / 4; const mag = 10 ** Math.floor(Math.log10(step || 1)); lo = Math.floor(lo / mag) * mag; hi = Math.ceil(hi / mag) * mag }
        if (hi === lo) hi = lo + 1
        return { lo, hi, fmt: opts.format ?? (stackMode === 'percent' && axis === 'left' ? (n: number) => `${Math.round(n)}%` : fmtDefault), ticks: opts.ticks ?? (compact ? 3 : 4), hidden: opts.hidden, label: opts.label }
    }
    const L = domain('left')
    const R = domain('right')

    const pad = { top: legend === 'top' ? 8 : 12, right: R && !R.hidden ? 48 : 16, bottom: axes.x?.hidden ? 8 : 26, left: L && !L.hidden ? 48 : 12 }
    if (horizontal) pad.left = 84
    const W = width
    const H = height
    const iw = W - pad.left - pad.right
    const ih = H - pad.top - pad.bottom
    const n = labels.length

    // 값 → 화면 좌표 (세로 차트 기준; 가로는 축을 바꿔 그린다)
    const valPos = (d: NonNullable<typeof L>, v: number) => (horizontal ? pad.left + ((v - d.lo) / (d.hi - d.lo)) * iw : pad.top + ih - ((v - d.lo) / (d.hi - d.lo)) * ih)
    const band = (horizontal ? ih : iw) / Math.max(1, n)
    const catPos = (i: number) => (horizontal ? pad.top : pad.left) + band * i + band / 2
    const dom = (s: ChartSeries) => ((s.axis ?? 'left') === 'right' ? R : L)!

    const barSeries = visible.filter((s) => (s.type ?? 'bar') === 'bar')
    const groups = barMode === 'grouped' ? [...new Set(barSeries.map((s) => (s.stack ? s.stack : s.key)))] : ['all']
    const inner = band * (1 - (barGap ?? (compact ? 0.25 : 0.32)))
    const bw = barMode === 'overlap' ? inner * 0.7 : inner / Math.max(1, groups.length)

    const colorOf = (s: ChartSeries) => chartColor(s.tone, series.indexOf(s))

    if (loading) {
        return (
            <div ref={ref} data-ds-chart="" className={className} style={{ height, ...style }} aria-busy="true">
                <span data-ds-skeleton="" style={{ width: '100%', height: '100%' }} />
            </div>
        )
    }
    if (!allLabels.length || !series.length) {
        return (
            <div ref={ref} data-ds-chart="" data-empty="" className={className} style={{ height, ...style }}>
                {empty}
            </div>
        )
    }

    const legendEl =
        legend !== 'none' ? (
            <div data-slot="legend" role="group" aria-label="범례 (눌러서 숨김)">
                {series.map((s, i) => (
                    <button
                        key={s.key}
                        type="button"
                        aria-pressed={!hidden.has(s.key)}
                        data-slot="legend-item"
                        onClick={() => setHidden((h) => { const x = new Set(h); if (x.has(s.key)) x.delete(s.key); else x.add(s.key); return x })}
                    >
                        <span data-slot="swatch" data-type={s.type ?? 'bar'} style={{ background: chartColor(s.tone, i) }} />
                        {s.label ?? s.key}
                    </button>
                ))}
            </div>
        ) : null

    const ticks = (d: NonNullable<typeof L>) => Array.from({ length: d.ticks + 1 }, (_, i) => d.lo + ((d.hi - d.lo) * i) / d.ticks)
    const xEvery = axes.x?.every ?? Math.max(1, Math.ceil(n / Math.max(2, Math.floor((horizontal ? ih : iw) / (horizontal ? 18 : 56)))))
    const tipIndex = tooltip !== 'none' ? hover : null

    return (
        <div ref={ref} data-ds-chart="" className={className} style={style}>
            {legend === 'top' && legendEl}
            <div ref={wrapRef} data-slot="plot" style={{ position: 'relative' }}>
                <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel} onMouseLeave={() => { setHover(null); setHoverSeries(null) }}>
                    {/* 구간 · 격자 */}
                    {bands.map((b, i) => {
                        const d = (b.axis ?? 'left') === 'right' ? R : L
                        if (!d) return null
                        const a = valPos(d, b.from)
                        const c = valPos(d, b.to)
                        return (
                            <g key={`b${i}`}>
                                {horizontal ? <rect x={Math.min(a, c)} y={pad.top} width={Math.abs(c - a)} height={ih} fill={chartColor(b.tone)} opacity={0.1} /> : <rect x={pad.left} y={Math.min(a, c)} width={iw} height={Math.abs(c - a)} fill={chartColor(b.tone)} opacity={0.1} />}
                                {b.label && (
                                    <text x={horizontal ? (a + c) / 2 : pad.left + 6} y={horizontal ? pad.top - 2 : Math.min(a, c) + 14} data-slot="band-label" style={{ fill: chartColor(b.tone) }} textAnchor={horizontal ? 'middle' : 'start'}>
                                        {b.label}
                                    </text>
                                )}
                            </g>
                        )
                    })}
                    {showGrid && L &&
                        ticks(L).map((t, i) => {
                            const p = valPos(L, t)
                            return horizontal ? <line key={i} x1={p} x2={p} y1={pad.top} y2={pad.top + ih} data-slot="grid" /> : <line key={i} x1={pad.left} x2={pad.left + iw} y1={p} y2={p} data-slot="grid" />
                        })}
                    {L && L.lo < 0 && (horizontal ? <line x1={valPos(L, 0)} x2={valPos(L, 0)} y1={pad.top} y2={pad.top + ih} data-slot="zero" /> : <line x1={pad.left} x2={pad.left + iw} y1={valPos(L, 0)} y2={valPos(L, 0)} data-slot="zero" />)}
                    {!horizontal && <line x1={pad.left} x2={pad.left + iw} y1={pad.top + ih} y2={pad.top + ih} data-slot="axis" />}
                    {/* 축 눈금 */}
                    {L && !L.hidden &&
                        ticks(L).map((t, i) =>
                            horizontal ? (
                                <text key={i} x={valPos(L, t)} y={H - 8} textAnchor="middle" data-slot="tick">{L.fmt(t)}</text>
                            ) : (
                                <text key={i} x={pad.left - 6} y={valPos(L, t) + 4} textAnchor="end" data-slot="tick">{L.fmt(t)}</text>
                            ),
                        )}
                    {R && !R.hidden && !horizontal && ticks(R).map((t, i) => <text key={i} x={W - pad.right + 6} y={valPos(R, t) + 4} textAnchor="start" data-slot="tick">{R.fmt(t)}</text>)}
                    {!axes.x?.hidden &&
                        labels.map((l, i) =>
                            i % xEvery === 0 ? (
                                horizontal ? (
                                    <text key={i} x={pad.left - 8} y={catPos(i) + 4} textAnchor="end" data-slot="tick">{axes.x?.format ? axes.x.format(l, i) : l}</text>
                                ) : (
                                    <text key={i} x={catPos(i)} y={H - 8} textAnchor="middle" data-slot="tick">{axes.x?.format ? axes.x.format(l, i) : l}</text>
                                )
                            ) : null,
                        )}
                    {/* hover 열 */}
                    {tipIndex !== null && (horizontal ? <rect x={pad.left} y={pad.top + band * tipIndex} width={iw} height={band} data-slot="hover-band" /> : <rect x={pad.left + band * tipIndex} y={pad.top} width={band} height={ih} data-slot="hover-band" />)}
                    {/* 막대 */}
                    {barSeries.map((s) => {
                        const d = dom(s)
                        const gi = barMode === 'grouped' ? groups.indexOf(s.stack ?? s.key) : 0
                        const oi = barMode === 'overlap' ? barSeries.indexOf(s) : 0
                        return (
                            <g key={s.key} data-series={s.key}>
                                {data.map((r, i) => {
                                    const raw = r[s.key]
                                    if (raw == null) return null
                                    const a = valPos(d, base[s.key]![i]!)
                                    let b = valPos(d, top[s.key]![i]!)
                                    if (Math.abs(b - a) < minBarHeight) b = a + (horizontal ? minBarHeight : -minBarHeight)
                                    const off = barMode === 'overlap' ? (oi ? inner * 0.15 : -inner * 0.15) : -inner / 2 + gi * bw
                                    const c = catPos(i) + off + (barMode === 'overlap' ? -bw / 2 : 0)
                                    const fill = chartColor(barTone?.(Number(raw), s.key, i) ?? s.tone, series.indexOf(s))
                                    const rect = horizontal
                                        ? { x: Math.min(a, b), y: c, width: Math.abs(b - a), height: Math.max(1, bw - 2) }
                                        : { x: c, y: Math.min(a, b), width: Math.max(1, bw - 2), height: Math.abs(b - a) }
                                    return (
                                        <g key={i}>
                                            <rect
                                                {...rect}
                                                rx={rounded ? Math.min(3, bw / 4) : 0}
                                                fill={fill}
                                                opacity={hoverSeries && hoverSeries !== s.key ? 0.45 : 1}
                                                data-slot="bar"
                                                style={onPointClick ? { cursor: 'pointer' } : undefined}
                                                onMouseEnter={() => { setHover(i); setHoverSeries(s.key) }}
                                                onClick={() => onPointClick?.(s, (brush ? win[0] : 0) + i)}
                                            />
                                            {showValues && (
                                                <text data-slot="value" x={horizontal ? Math.max(a, b) + 4 : c + bw / 2 - 1} y={horizontal ? c + bw / 2 + 3 : Math.min(a, b) - 4} textAnchor={horizontal ? 'start' : 'middle'}>
                                                    {d.fmt(Number(raw))}
                                                </text>
                                            )}
                                        </g>
                                    )
                                })}
                            </g>
                        )
                    })}
                    {/* 선 · 영역 (세로 차트만) */}
                    {!horizontal &&
                        visible
                            .filter((s) => s.type === 'line' || s.type === 'area')
                            .map((s) => {
                                const d = dom(s)
                                const segs: [number, number][][] = [[]]
                                const basePts: [number, number][][] = [[]]
                                data.forEach((r, i) => {
                                    if (r[s.key] == null) {
                                        if (!connectNulls && segs[segs.length - 1]!.length) {
                                            segs.push([])
                                            basePts.push([])
                                        }
                                        return
                                    }
                                    segs[segs.length - 1]!.push([catPos(i), valPos(d, top[s.key]![i]!)])
                                    basePts[basePts.length - 1]!.push([catPos(i), valPos(d, base[s.key]![i]!)])
                                })
                                const color = colorOf(s)
                                const path = (pts: [number, number][]) =>
                                    s.step ? stepPath(pts, s.step === 'before' ? 'before' : 'after') : s.smooth ? smoothPath(pts) : pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ')
                                const dim = hoverSeries && hoverSeries !== s.key ? 0.35 : 1
                                return (
                                    <g key={s.key} data-series={s.key} opacity={dim}>
                                        {s.type === 'area' &&
                                            segs.map((pts, k) =>
                                                pts.length > 1 ? <path key={`a${k}`} d={`${path(pts)} L ${[...basePts[k]!].reverse().map((p) => `${p[0]} ${p[1]}`).join(' L ')} Z`} fill={color} opacity={0.18} stroke="none" /> : null,
                                            )}
                                        {segs.map((pts, k) => (pts.length > 1 ? <path key={k} d={path(pts)} fill="none" stroke={color} strokeWidth={2} strokeDasharray={s.dashed ? '5 4' : undefined} strokeLinejoin="round" strokeLinecap="round" /> : null))}
                                        {(s.showDots ?? n <= 16) &&
                                            data.map((r, i) =>
                                                r[s.key] == null ? null : (
                                                    <circle
                                                        key={i}
                                                        cx={catPos(i)}
                                                        cy={valPos(d, top[s.key]![i]!)}
                                                        r={hover === i ? 4.5 : 3}
                                                        fill="var(--ds-surface-card-background)"
                                                        stroke={color}
                                                        strokeWidth={2}
                                                        style={onPointClick ? { cursor: 'pointer' } : undefined}
                                                        onClick={() => onPointClick?.(s, (brush ? win[0] : 0) + i)}
                                                        onMouseEnter={() => setHoverSeries(s.key)}
                                                    />
                                                ),
                                            )}
                                        {showValues && data.map((r, i) => (r[s.key] == null ? null : <text key={`v${i}`} data-slot="value" x={catPos(i)} y={valPos(d, top[s.key]![i]!) - 8} textAnchor="middle">{d.fmt(Number(r[s.key]))}</text>))}
                                    </g>
                                )
                            })}
                    {/* 기준선 */}
                    {referenceLines.map((r, i) => {
                        const d = (r.axis ?? 'left') === 'right' ? R : L
                        if (!d) return null
                        const p = valPos(d, r.value)
                        const c = chartColor(r.tone ?? 'warning')
                        return (
                            <g key={`r${i}`}>
                                {horizontal ? <line x1={p} x2={p} y1={pad.top} y2={pad.top + ih} stroke={c} strokeWidth={1.5} strokeDasharray={r.dashed === false ? undefined : '5 4'} /> : <line x1={pad.left} x2={pad.left + iw} y1={p} y2={p} stroke={c} strokeWidth={1.5} strokeDasharray={r.dashed === false ? undefined : '5 4'} />}
                                {r.label && (
                                    <text x={horizontal ? p + 4 : pad.left + iw - 4} y={horizontal ? pad.top + 10 : p - 5} textAnchor={horizontal ? 'start' : 'end'} data-slot="ref-label" style={{ fill: c }}>
                                        {r.label}
                                    </text>
                                )}
                            </g>
                        )
                    })}
                    {/* 주석 */}
                    {!horizontal &&
                        annotations.map((a, i) => {
                            const idx = typeof a.x === 'number' ? a.x - (brush ? win[0] : 0) : labels.indexOf(a.x)
                            if (idx < 0 || idx >= n) return null
                            const x = catPos(idx)
                            const c = chartColor(a.tone ?? 'danger')
                            return (
                                <g key={`n${i}`}>
                                    <line x1={x} x2={x} y1={pad.top} y2={pad.top + ih} stroke={c} strokeWidth={1} strokeDasharray="2 3" />
                                    <text x={x + 4} y={pad.top + 10} data-slot="ref-label" style={{ fill: c }}>{a.label}</text>
                                </g>
                            )
                        })}
                    {/* hover 판정용 투명 열 */}
                    {tooltip !== 'none' &&
                        labels.map((_, i) =>
                            horizontal ? (
                                <rect key={`h${i}`} x={pad.left} y={pad.top + band * i} width={iw} height={band} fill="transparent" onMouseEnter={() => setHover(i)} style={{ pointerEvents: 'all' }} />
                            ) : (
                                <rect key={`h${i}`} x={pad.left + band * i} y={pad.top} width={band} height={ih} fill="transparent" onMouseEnter={() => { setHover(i); if (tooltip === 'shared') setHoverSeries(null) }} style={{ pointerEvents: barSeries.length && tooltip === 'single' ? 'none' : 'all' }} />
                            ),
                        )}
                </svg>
                {tipIndex !== null && (
                    <div
                        data-slot="tooltip"
                        role="status"
                        style={{
                            left: horizontal ? pad.left + iw / 2 : Math.min(W - 160, Math.max(0, catPos(tipIndex) + 12)),
                            top: horizontal ? catPos(tipIndex) + 10 : pad.top,
                        }}
                    >
                        <b>{labels[tipIndex]}</b>
                        {visible
                            .filter((s) => tooltip === 'shared' || !hoverSeries || s.key === hoverSeries)
                            .map((s) => {
                                const v = data[tipIndex]![s.key]
                                return (
                                    <span key={s.key}>
                                        <i style={{ background: colorOf(s) }} />
                                        {s.label ?? s.key}
                                        <em>{v == null ? '—' : dom(s).fmt(Number(v))}</em>
                                    </span>
                                )
                            })}
                    </div>
                )}
            </div>
            {legend === 'bottom' && legendEl}
            {brush && allLabels.length > 8 && <Brush total={allLabels.length} win={win} onChange={setWin} labels={allLabels} />}
        </div>
    )
}

/** 긴 기간에서 볼 구간을 고른다 (양 끝 손잡이 · 가운데 끌기 · 키보드) */
const Brush = ({ total, win, onChange, labels }: { total: number; win: [number, number]; onChange: (w: [number, number]) => void; labels: string[] }) => {
    const ref = useRef<HTMLDivElement | null>(null)
    const drag = (mode: 'lo' | 'hi' | 'mid') => (e: ReactPointerEvent) => {
        e.preventDefault()
        const rect = ref.current!.getBoundingClientRect()
        const start = e.clientX
        const [a0, b0] = win
        const move = (ev: PointerEvent) => {
            const di = Math.round(((ev.clientX - start) / rect.width) * total)
            if (mode === 'lo') onChange([Math.max(0, Math.min(b0 - 2, a0 + di)), b0])
            else if (mode === 'hi') onChange([a0, Math.min(total - 1, Math.max(a0 + 2, b0 + di))])
            else {
                const d = Math.max(-a0, Math.min(total - 1 - b0, di))
                onChange([a0 + d, b0 + d])
            }
        }
        const up = () => {
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
    }
    const pct = (i: number) => `${(i / (total - 1)) * 100}%`
    return (
        <div ref={ref} data-slot="brush" aria-label={`보는 구간 ${labels[win[0]]} ~ ${labels[win[1]]}`}>
            <div data-slot="brush-win" style={{ left: pct(win[0]), right: `calc(100% - ${pct(win[1])})` }} onPointerDown={drag('mid')}>
                <span
                    data-slot="brush-handle"
                    role="slider"
                    tabIndex={0}
                    aria-label="구간 시작"
                    aria-valuenow={win[0]}
                    aria-valuetext={labels[win[0]]}
                    onPointerDown={(e) => { e.stopPropagation(); drag('lo')(e) }}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowLeft') onChange([Math.max(0, win[0] - 1), win[1]])
                        if (e.key === 'ArrowRight') onChange([Math.min(win[1] - 2, win[0] + 1), win[1]])
                    }}
                />
                <span
                    data-slot="brush-handle"
                    data-end=""
                    role="slider"
                    tabIndex={0}
                    aria-label="구간 끝"
                    aria-valuenow={win[1]}
                    aria-valuetext={labels[win[1]]}
                    onPointerDown={(e) => { e.stopPropagation(); drag('hi')(e) }}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowLeft') onChange([win[0], Math.max(win[0] + 2, win[1] - 1)])
                        if (e.key === 'ArrowRight') onChange([win[0], Math.min(total - 1, win[1] + 1)])
                    }}
                />
            </div>
        </div>
    )
}
