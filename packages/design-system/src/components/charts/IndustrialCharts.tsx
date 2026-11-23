import { pressable } from './chartUtils.js'
import { Button } from '../actions/Button.js'
import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { CartesianChart, chartColor } from './CartesianChart.js'
import type { Tone } from '../types.js'

const useWidth = (initial = 640) => {
    const ref = useRef<HTMLDivElement | null>(null)
    const [w, setW] = useState(initial)
    useEffect(() => {
        if (!ref.current) return
        const ro = new ResizeObserver((e) => setW(Math.max(200, Math.round(e[0]!.contentRect.width))))
        ro.observe(ref.current)
        return () => ro.disconnect()
    }, [])
    return [ref, w] as const
}
const fmtN = (n: number) => n.toLocaleString('ko-KR', { maximumFractionDigits: 2 })

/* ───────────────────────── Pareto ───────────────────────── */

export type ParetoChartProps = {
    /** 항목별 값 (불량 유형 · 건수) */
    data: Array<{ label: string; value: number }>
    /** desc: 큰 값부터 · none: 입력 순서 */
    sort?: 'desc' | 'none'
    /** 누적 기준선 (0.8 = 80%). 이 안의 항목을 강조한다 */
    vitalFew?: number
    /** 건수 형식 (왼쪽 축 · tooltip) */
    formatValue?: (n: number) => string
    /** 누적 비율 형식 (오른쪽 축 · tooltip) */
    formatPercent?: (n: number) => string
    /** 그림 영역 높이 (px) */
    height?: number
    /** 차트 svg 의 접근성 이름 */
    'aria-label'?: string
    /** 차트 요소 style */
    style?: CSSProperties
}

/** 불량 유형별 건수 막대 + 누적 비율 선. 상위 몇 개가 대부분을 차지하는지 본다 */
export const ParetoChart = ({ data, sort = 'desc', vitalFew = 0.8, formatValue = fmtN, formatPercent = (n) => `${Math.round(n)}%`, height = 260, ...rest }: ParetoChartProps) => {
    const rows = sort === 'desc' ? [...data].sort((a, b) => b.value - a.value) : data
    const total = rows.reduce((a, d) => a + d.value, 0) || 1
    let acc = 0
    const cum = rows.map((d) => (acc += d.value) / total * 100)
    const vitalIdx = cum.findIndex((c) => c >= vitalFew * 100)
    return (
        <CartesianChart
            labels={rows.map((d) => d.label)}
            data={rows.map((d, i) => ({ v: d.value, c: cum[i]! }))}
            series={[
                { type: 'bar', key: 'v', label: '건수' },
                { type: 'line', key: 'c', label: '누적 비율', axis: 'right', tone: 'warning' },
            ]}
            axes={{ left: { format: formatValue }, right: { min: 0, max: 100, format: formatPercent } }}
            referenceLines={[{ value: vitalFew * 100, axis: 'right', label: `${Math.round(vitalFew * 100)}%`, tone: 'danger' }]}
            barTone={(_v, _k, i) => (i <= vitalIdx ? 'accent' : 'var(--ds-palette-primary-200)')}
            height={height}
            {...rest}
        />
    )
}

/* ───────────────────────── Control (SPC) ───────────────────────── */

export type ControlRule = { id: string; label: string; test: (z: number[], i: number) => boolean }

/** Western Electric 규칙 (z = (x - CL) / σ) */
export const WESTERN_ELECTRIC: ControlRule[] = [
    { id: 'we1', label: '규칙 1: 3σ 밖 1점', test: (z, i) => Math.abs(z[i]!) > 3 },
    { id: 'we2', label: '규칙 2: 2σ 밖 3점 중 2점 (같은 쪽)', test: (z, i) => i >= 2 && [1, -1].some((s) => [z[i], z[i - 1], z[i - 2]].filter((v) => v! * s > 2).length >= 2) },
    { id: 'we3', label: '규칙 3: 1σ 밖 5점 중 4점 (같은 쪽)', test: (z, i) => i >= 4 && [1, -1].some((s) => z.slice(i - 4, i + 1).filter((v) => v * s > 1).length >= 4) },
    { id: 'we4', label: '규칙 4: 중심선 한쪽 연속 8점', test: (z, i) => i >= 7 && [1, -1].some((s) => z.slice(i - 7, i + 1).every((v) => v * s > 0)) },
]
/** Nelson 규칙 일부 (추세 · 지그재그) 를 Western Electric 에 더한다 */
export const NELSON: ControlRule[] = [
    ...WESTERN_ELECTRIC,
    { id: 'n3', label: '규칙 5: 연속 6점 증가 또는 감소', test: (z, i) => i >= 5 && (z.slice(i - 5, i + 1).every((v, k, a) => !k || v > a[k - 1]!) || z.slice(i - 5, i + 1).every((v, k, a) => !k || v < a[k - 1]!)) },
    { id: 'n4', label: '규칙 6: 14점 지그재그', test: (z, i) => i >= 13 && z.slice(i - 13, i + 1).every((v, k, a) => k < 2 || (v - a[k - 1]!) * (a[k - 1]! - a[k - 2]!) < 0) },
]

export type ControlChartProps = {
    /** 측정값 (숫자 배열 또는 x 라벨 · y 값) */
    data: number[] | Array<{ x: string; y: number }>
    /** 중심선 (없으면 평균) */
    cl?: number
    /** 관리 상한 (없으면 CL + 3σ) */
    ucl?: number
    /** 관리 하한 (없으면 CL - 3σ) */
    lcl?: number
    /** 규격 한계 (고객 요구) */
    usl?: number
    /** 규격 하한 */
    lsl?: number
    /** 이상 판정 규칙 (이름 또는 직접 목록) */
    rules?: 'western-electric' | 'nelson' | ControlRule[]
    /** ±1σ · ±2σ 음영 */
    sigmaZones?: boolean
    /** 규칙을 어긴 점이 있을 때 (점 인덱스, 규칙) */
    onViolation?: (points: number[], rule: ControlRule) => void
    /** 축 · 한계선 라벨 값 형식 */
    formatValue?: (n: number) => string
    /** 그림 영역 높이 (px) */
    height?: number
    /** 차트 svg 의 접근성 이름 */
    'aria-label'?: string
    /** 차트 요소 style */
    style?: CSSProperties
}

/** 관리도 (X 차트). 한계선을 넘거나 규칙을 어긴 점을 빨갛게 표시한다 */
export const ControlChart = ({ data, cl, ucl, lcl, usl, lsl, rules = 'western-electric', sigmaZones = true, onViolation, formatValue = (n) => n.toFixed(2), height = 260, ...rest }: ControlChartProps) => {
    const pts = data.map((d, i) => (typeof d === 'number' ? { x: String(i + 1), y: d } : d))
    const ys = pts.map((p) => p.y)
    const mean = cl ?? ys.reduce((a, b) => a + b, 0) / (ys.length || 1)
    // 이동 범위로 σ 추정 (개별값 관리도 I-MR)
    const mr = ys.slice(1).map((v, i) => Math.abs(v - ys[i]!))
    const sigma = (mr.reduce((a, b) => a + b, 0) / (mr.length || 1)) / 1.128 || 1
    const U = ucl ?? mean + 3 * sigma
    const Lc = lcl ?? mean - 3 * sigma
    const s = (U - mean) / 3
    const z = ys.map((v) => (v - mean) / s)
    const ruleSet = rules === 'western-electric' ? WESTERN_ELECTRIC : rules === 'nelson' ? NELSON : rules
    const violations = useMemo(() => {
        const out = new Map<string, number[]>()
        z.forEach((_, i) => ruleSet.forEach((r) => r.test(z, i) && out.set(r.id, [...(out.get(r.id) ?? []), i])))
        return out
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ys.join(), mean, s, ruleSet])
    const bad = new Set([...violations.values()].flat())
    useEffect(() => {
        if (!onViolation) return
        for (const r of ruleSet) {
            const p = violations.get(r.id)
            if (p?.length) onViolation(p, r)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [violations])
    return (
        <div data-ds-control-chart="">
            <CartesianChart
                labels={pts.map((p) => p.x)}
                data={pts.map((p, i) => ({ y: p.y, bad: bad.has(i) ? p.y : null }))}
                series={[
                    { type: 'line', key: 'y', label: '측정값', tone: 'accent', showDots: true },
                    { type: 'line', key: 'bad', label: '이상 점', tone: 'danger', showDots: true },
                ]}
                axes={{ left: { format: formatValue } }}
                referenceLines={[
                    { value: U, label: `UCL ${formatValue(U)}`, tone: 'danger' },
                    { value: mean, label: `CL ${formatValue(mean)}`, tone: 'success', dashed: false },
                    { value: Lc, label: `LCL ${formatValue(Lc)}`, tone: 'danger' },
                    ...(usl !== undefined ? [{ value: usl, label: `USL ${formatValue(usl)}`, tone: 'neutral' as Tone }] : []),
                    ...(lsl !== undefined ? [{ value: lsl, label: `LSL ${formatValue(lsl)}`, tone: 'neutral' as Tone }] : []),
                ]}
                bands={sigmaZones ? [{ from: mean - 2 * s, to: mean + 2 * s, tone: 'success' }, { from: mean - s, to: mean + s, tone: 'success' }] : []}
                legend="none"
                height={height}
                {...rest}
            />
            {violations.size > 0 && (
                <ul data-slot="violations" aria-label="관리 이탈">
                    {ruleSet
                        .filter((r) => violations.get(r.id)?.length)
                        .map((r) => (
                            <li key={r.id}>
                                <b>{r.label}</b> · {violations.get(r.id)!.map((i) => pts[i]!.x).join(', ')}
                            </li>
                        ))}
                </ul>
            )}
        </div>
    )
}

/* ───────────────────────── Bullet ───────────────────────── */

export type BulletChartProps = {
    /** 실적 값 */
    value: number
    /** 목표 눈금 */
    target?: number
    /** 뒤 배경 구간 (불량 · 보통 · 양호). to 는 누적 상한 */
    ranges?: Array<{ to: number; label?: string }>
    /** 끝 값 (없으면 값 · 목표 · 구간 최대 + 5%) */
    max?: number
    /** 실적 막대 톤 */
    tone?: Tone
    /** 앞쪽 이름 */
    label?: ReactNode
    /** 값 · 목표 글자 형식 */
    formatValue?: (n: number) => string
    /** horizontal: 가로 · vertical: 세로 */
    orientation?: 'horizontal' | 'vertical'
    /** 바깥 요소 style */
    style?: CSSProperties
}

/** 목표 대비 실적을 한 줄로 (KPI 표 셀 · 대시보드) */
export const BulletChart = ({ value, target, ranges = [], max: maxProp, tone = 'accent', label, formatValue = fmtN, orientation = 'horizontal', style }: BulletChartProps) => {
    const max = maxProp ?? Math.max(value, target ?? 0, ...ranges.map((r) => r.to)) * 1.05
    const pct = (v: number) => `${Math.max(0, Math.min(100, (v / max) * 100))}%`
    const shades = ['0.22', '0.13', '0.06']
    const vertical = orientation === 'vertical'
    let prev = 0
    return (
        <div data-ds-bullet="" data-orientation={orientation} style={style} role="meter" aria-valuenow={value} aria-valuemax={max} aria-label={typeof label === 'string' ? label : undefined}>
            {label && <span data-slot="label">{label}</span>}
            <div data-slot="track">
                {ranges.map((r, i) => {
                    const from = prev
                    prev = r.to
                    return <span key={i} data-slot="range" title={r.label} style={vertical ? { bottom: pct(from), height: `calc(${pct(r.to)} - ${pct(from)})`, opacity: 1 } : { left: pct(from), width: `calc(${pct(r.to)} - ${pct(from)})` }} data-shade={shades[i] ?? '0.04'} />
                })}
                <span data-slot="bar" style={{ [vertical ? 'height' : 'width']: pct(value), background: chartColor(tone) }} />
                {target !== undefined && <span data-slot="target" style={vertical ? { bottom: pct(target) } : { left: pct(target) }} />}
            </div>
            <span data-slot="value">
                {formatValue(value)}
                {target !== undefined && <small> / {formatValue(target)}</small>}
            </span>
        </div>
    )
}

/* ───────────────────────── Waterfall ───────────────────────── */

export type WaterfallChartProps = {
    /** 단계 목록 (total: 합계 막대 · delta: 증감) */
    steps: Array<{ label: string; value: number; type?: 'total' | 'delta' }>
    /** 증가 · 감소 톤 (원가처럼 증가가 나쁘면 increase='danger') */
    increase?: Tone
    /** 감소 막대 톤 */
    decrease?: Tone
    /** 막대 끝을 잇는 점선 */
    connectors?: boolean
    /** 축 눈금 · 막대 값 형식 */
    formatValue?: (n: number) => string
    /** 높이 (px) */
    height?: number
    /** 바깥 요소 style */
    style?: CSSProperties
}

/** 시작 → 증감 → 끝 (원가 · 재고 · 수량 변동) */
export const WaterfallChart = ({ steps, increase = 'success', decrease = 'danger', connectors = true, formatValue = fmtN, height = 260, style }: WaterfallChartProps) => {
    const [ref, W] = useWidth()
    let run = 0
    const bars = steps.map((s) => {
        if (s.type === 'total') {
            run = s.value
            return { ...s, from: 0, to: s.value }
        }
        const from = run
        run += s.value
        return { ...s, from, to: run }
    })
    // 합계 막대가 커도 증감이 보이도록, 값이 모두 양수면 축을 데이터 근처에서 시작한다 (합계 막대는 축 아래를 잘라 끊김 표시를 단다)
    const dmin = Math.min(...bars.filter((b) => b.type !== 'total').map((b) => Math.min(b.from, b.to)))
    const dmax = Math.max(...bars.map((b) => Math.max(b.from, b.to)))
    const span = dmax - dmin || dmax
    const rawLo = dmin > 0 ? Math.max(0, dmin - span * 1.5) : Math.min(0, dmin)
    const rawHi = dmax + span * 0.25
    // 눈금은 1 · 2 · 5 × 10ⁿ 단위로 끊어 읽기 쉬운 값에 둔다
    const step = (() => {
        const raw = (rawHi - rawLo) / 4 || 1
        const p10 = 10 ** Math.floor(Math.log10(raw))
        return ([1, 2, 2.5, 5, 10].find((m) => m * p10 >= raw) ?? 10) * p10
    })()
    const lo = Math.floor(rawLo / step) * step
    const hi = Math.ceil(rawHi / step) * step
    const ticks = Array.from({ length: Math.round((hi - lo) / step) + 1 }, (_, i) => lo + step * i)
    const pad = { t: 20, r: 12, b: 26, l: 48 }
    const H = height
    const ih = H - pad.t - pad.b
    const bw = (W - pad.l - pad.r) / bars.length
    const y = (v: number) => pad.t + ih - ((v - lo) / (hi - lo)) * ih
    // 막대는 축 범위 안에서만 그린다. 축이 0 이 아닌 곳에서 시작하면 합계 막대 아래를 자르고 끊김 표시를 단다
    const yc = (v: number) => y(Math.min(hi, Math.max(lo, v)))
    return (
        <div ref={ref} data-ds-chart="" style={style}>
            <svg width={W} height={H} role="img" aria-label={bars.map((b) => `${b.label} ${b.value}`).join(', ')}>
                {ticks.map((v) => {
                    return (
                        <g key={v}>
                            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} data-slot="grid" />
                            <text x={pad.l - 6} y={y(v) + 4} textAnchor="end" data-slot="tick">{formatValue(Math.round(v))}</text>
                        </g>
                    )
                })}
                {bars.map((b, i) => {
                    const x = pad.l + bw * i + bw * 0.18
                    const w = bw * 0.64
                    const fill = b.type === 'total' ? chartColor('neutral') : chartColor(b.value >= 0 ? increase : decrease)
                    return (
                        <g key={i}>
                            <rect x={x} y={Math.min(yc(b.from), yc(b.to))} width={w} height={Math.max(1, Math.abs(yc(b.to) - yc(b.from)))} rx={2} fill={fill}>
                                <title>{`${b.label}: ${b.type === 'total' ? '' : b.value > 0 ? '+' : ''}${formatValue(b.value)}`}</title>
                            </rect>
                            {Math.min(b.from, b.to) < lo && (
                                <path
                                    d={`M ${x - 2} ${pad.t + ih - 10} l ${w / 4 + 2} -4 l ${w / 4} 4 l ${w / 4} -4 l ${w / 4 + 2} 4 M ${x - 2} ${pad.t + ih - 5} l ${w / 4 + 2} -4 l ${w / 4} 4 l ${w / 4} -4 l ${w / 4 + 2} 4`}
                                    fill="none"
                                    stroke="var(--ds-surface-card-background)"
                                    strokeWidth={2}
                                    data-slot="axis-break"
                                    aria-hidden
                                />
                            )}
                            <text x={x + w / 2} y={Math.min(yc(b.from), yc(b.to)) - 5} textAnchor="middle" data-slot="value">
                                {b.type === 'total' ? formatValue(b.value) : `${b.value > 0 ? '+' : ''}${formatValue(b.value)}`}
                            </text>
                            {connectors && i < bars.length - 1 && <line x1={x + w} x2={x + bw} y1={yc(b.to)} y2={yc(b.to)} stroke="var(--ds-color-border-strong)" strokeDasharray="3 3" />}
                            <text x={x + w / 2} y={H - 8} textAnchor="middle" data-slot="tick">{b.label}</text>
                        </g>
                    )
                })}
            </svg>
        </div>
    )
}

/* ───────────────────────── Heatmap ───────────────────────── */

export type HeatmapProps = {
    /** 행 이름 */
    rows: string[]
    /** 열 이름 */
    columns: string[]
    /** [행][열] 값. null 은 빈 칸 */
    values: Array<Array<number | null>>
    /** sequential: 낮음 → 높음 · diverging: 가운데(0) 기준 양쪽 */
    scale?: 'sequential' | 'diverging'
    /** 색 범위 최솟값 (없으면 데이터 최소) */
    min?: number
    /** 색 범위 최댓값 (없으면 데이터 최대) */
    max?: number
    /** sequential 색 톤 */
    tone?: Tone
    /** 칸 · 범례 값 형식 */
    formatValue?: (n: number) => string
    /** 칸 안에 값 글자 */
    showValues?: boolean
    /** 칸을 눌렀을 때 (행, 열 인덱스) */
    onCellClick?: (row: number, col: number) => void
    /** 칸 높이 (px) */
    cellHeight?: number
    /** 바깥 요소 style */
    style?: CSSProperties
    /** 표 접근성 이름 */
    'aria-label'?: string
}

/** 시간대 × 설비, 요일 × 라인 같은 2차원 밀도 */
export const Heatmap = ({ rows, columns, values, scale = 'sequential', min, max, tone = 'accent', formatValue = fmtN, showValues = true, onCellClick, cellHeight = 32, style, 'aria-label': ariaLabel }: HeatmapProps) => {
    const flat = values.flat().filter((v): v is number => v != null)
    const lo = min ?? Math.min(...flat)
    const hi = max ?? Math.max(...flat)
    const color = (v: number) => {
        if (scale === 'diverging') {
            const m = Math.max(Math.abs(lo), Math.abs(hi)) || 1
            const t = Math.min(1, Math.abs(v) / m)
            return `color-mix(in oklab, ${chartColor(v >= 0 ? 'info' : 'danger')} ${Math.round(t * 85)}%, var(--ds-surface-card-background))`
        }
        const t = (v - lo) / (hi - lo || 1)
        return `color-mix(in oklab, ${chartColor(tone)} ${Math.round(8 + t * 82)}%, var(--ds-surface-card-background))`
    }
    return (
        <div data-ds-heatmap="" style={style}>
            <table role="grid" aria-label={ariaLabel}>
                <thead>
                    <tr>
                        <th />
                        {columns.map((c) => (
                            <th key={c} scope="col">{c}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, ri) => (
                        <tr key={r}>
                            <th scope="row">{r}</th>
                            {columns.map((c, ci) => {
                                const v = values[ri]?.[ci]
                                const t = v == null ? 0 : (v - lo) / (hi - lo || 1)
                                return (
                                    <td
                                        key={c}
                                        title={v == null ? `${r} · ${c}: 없음` : `${r} · ${c}: ${formatValue(v)}`}
                                        {...pressable(onCellClick && (() => onCellClick(ri, ci)), v == null ? `${r} · ${c}: 없음` : `${r} · ${c}: ${formatValue(v)}`)}
                                        role={onCellClick ? 'gridcell' : undefined}
                                        style={{ height: cellHeight, background: v == null ? undefined : color(v), color: t > 0.6 && scale === 'sequential' ? '#fff' : undefined, cursor: onCellClick ? 'pointer' : undefined }}
                                    >
                                        {showValues && v != null ? formatValue(v) : null}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div data-slot="scale" aria-hidden>
                <span>{formatValue(lo)}</span>
                <i style={{ background: scale === 'diverging' ? `linear-gradient(90deg, ${chartColor('danger')}, var(--ds-surface-card-background), ${chartColor('info')})` : `linear-gradient(90deg, color-mix(in oklab, ${chartColor(tone)} 8%, var(--ds-surface-card-background)), ${chartColor(tone)})` }} />
                <span>{formatValue(hi)}</span>
            </div>
        </div>
    )
}

/* ───────────────────────── StatusTimeline ───────────────────────── */

export type StatusSegment = { from: Date | string; to: Date | string; status: string; note?: string }

export type StatusTimelineProps = {
    /** 행(설비)별 이름 · 상태 구간 */
    rows: Array<{ id: string; label: ReactNode; segments: StatusSegment[] }>
    /** 상태 키별 이름 · 색 */
    statusMap: Record<string, { label: string; tone?: Tone; color?: string }>
    /** 시간 축 범위 (시작, 끝) */
    range: [Date | string, Date | string]
    /** 현재 시각 세로선 */
    now?: Date | string
    /** 강조할 행 · 구간 */
    highlight?: { rowId: string; from: Date | string; to: Date | string }
    /** 구간을 눌렀을 때 (행 id, 구간) */
    onSegmentClick?: (rowId: string, seg: StatusSegment) => void
    /** 드래그로 구간 확대, 더블클릭으로 되돌림 */
    zoom?: boolean
    /** 행 높이 (px) */
    rowHeight?: number
    /** 바깥 요소 style */
    style?: CSSProperties
}

const t = (d: Date | string) => (typeof d === 'string' ? new Date(d) : d).getTime()
const hhmm = (ms: number) => {
    const d = new Date(ms)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** 설비별 가동 · 대기 · 정지 구간 (하루 · 교대) */
/** StatusTimeline 확대의 최소 폭 (10분) */
const MIN_SPAN = 10 * 60 * 1000

export const StatusTimeline = ({ rows, statusMap, range, now, highlight, onSegmentClick, zoom, rowHeight = 28, style }: StatusTimelineProps) => {
    const [view, setView] = useState<[number, number]>([t(range[0]), t(range[1])])
    useEffect(() => setView([t(range[0]), t(range[1])]), [range[0], range[1]])
    const [sel, setSel] = useState<[number, number] | null>(null)
    // 버튼(키보드)으로도 확대 · 축소 · 이동: 끌기와 같은 view 를 바꾼다
    const full: [number, number] = [t(range[0]), t(range[1])]
    const isFull = view[0] <= full[0] && view[1] >= full[1]
    const zoomBy = (k: number) => setView(([va, vb]) => {
        const span = Math.min(full[1] - full[0], Math.max(MIN_SPAN, (vb - va) * k))
        const c = (va + vb) / 2
        const s0 = Math.min(Math.max(full[0], c - span / 2), full[1] - span)
        return [s0, s0 + span]
    })
    const panBy = (k: number) => setView(([va, vb]) => {
        const span = vb - va
        const s0 = Math.min(Math.max(full[0], va + span * k), full[1] - span)
        return [s0, s0 + span]
    })
    const track = useRef<HTMLDivElement | null>(null)
    const [a, b] = view
    const pct = (ms: number) => ((Math.max(a, Math.min(b, ms)) - a) / (b - a)) * 100
    const ticks = Array.from({ length: 7 }, (_, i) => a + ((b - a) * i) / 6)
    const startZoom = (e: ReactPointerEvent) => {
        if (!zoom || !track.current) return
        const r = track.current.getBoundingClientRect()
        const at = (x: number) => a + ((x - r.left) / r.width) * (b - a)
        const s0 = at(e.clientX)
        const move = (ev: PointerEvent) => setSel([s0, at(ev.clientX)])
        const up = (ev: PointerEvent) => {
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
            const s1 = at(ev.clientX)
            setSel(null)
            if (Math.abs(s1 - s0) > (b - a) / 50) setView([Math.min(s0, s1), Math.max(s0, s1)])
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
    }
    return (
        <div data-ds-status-timeline="" style={style}>
            <div data-slot="legend">
                {Object.entries(statusMap).map(([k, v]) => (
                    <span key={k}>
                        <i style={{ background: v.color ?? chartColor(v.tone) }} />
                        {v.label}
                    </span>
                ))}
                {zoom && (
                    <span data-slot="zoom" role="group" aria-label="시간 확대">
                        <small>드래그해 확대 · 더블클릭으로 원래대로</small>
                        <Button size="xs" appearance="ghost" tone="neutral" onClick={() => zoomBy(0.5)} disabled={b - a <= MIN_SPAN}>확대</Button>
                        <Button size="xs" appearance="ghost" tone="neutral" onClick={() => zoomBy(2)} disabled={isFull}>축소</Button>
                        <Button size="xs" appearance="ghost" tone="neutral" shape="square" aria-label="앞 시간으로" onClick={() => panBy(-0.25)} disabled={a <= full[0]}>‹</Button>
                        <Button size="xs" appearance="ghost" tone="neutral" shape="square" aria-label="뒤 시간으로" onClick={() => panBy(0.25)} disabled={b >= full[1]}>›</Button>
                        <Button size="xs" appearance="ghost" tone="neutral" onClick={() => setView(full)} disabled={isFull}>원래대로</Button>
                    </span>
                )}
            </div>
            <div data-slot="grid" style={{ gridTemplateRows: `repeat(${rows.length}, ${rowHeight}px) 22px` }}>
                {rows.map((r) => (
                    <div key={r.id} data-slot="row">
                        <span data-slot="row-label">{r.label}</span>
                        <div data-slot="lane" ref={r === rows[0] ? track : undefined} onPointerDown={startZoom} onDoubleClick={() => zoom && setView([t(range[0]), t(range[1])])}>
                            {r.segments.map((s, i) => {
                                if (t(s.to) < a || t(s.from) > b) return null
                                const def = statusMap[s.status] ?? { label: s.status, tone: 'neutral' as Tone }
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        data-slot="seg"
                                        style={{ left: `${pct(t(s.from))}%`, width: `${pct(t(s.to)) - pct(t(s.from))}%`, background: def.color ?? chartColor(def.tone) }}
                                        title={`${def.label} ${hhmm(t(s.from))}–${hhmm(t(s.to))}${s.note ? ` · ${s.note}` : ''}`}
                                        aria-label={`${typeof r.label === 'string' ? r.label : r.id} ${def.label} ${hhmm(t(s.from))}부터 ${hhmm(t(s.to))}까지`}
                                        onClick={() => onSegmentClick?.(r.id, s)}
                                    />
                                )
                            })}
                            {highlight?.rowId === r.id && <span data-slot="highlight" style={{ left: `${pct(t(highlight.from))}%`, width: `${pct(t(highlight.to)) - pct(t(highlight.from))}%` }} />}
                            {sel && r === rows[0] && <span data-slot="selection" style={{ left: `${pct(Math.min(...sel))}%`, width: `${Math.abs(pct(sel[1]) - pct(sel[0]))}%` }} />}
                        </div>
                    </div>
                ))}
                <div data-slot="row">
                    <span />
                    <div data-slot="axis">
                        {ticks.map((tk, i) => (
                            <span key={i} style={{ left: `${(i / 6) * 100}%` }}>{hhmm(tk)}</span>
                        ))}
                    </div>
                </div>
                {now && t(now) >= a && t(now) <= b && <span data-slot="now" style={{ left: `calc(var(--_lw) + (100% - var(--_lw)) * ${pct(t(now)) / 100})` }} title={`현재 ${hhmm(t(now))}`} />}
            </div>
        </div>
    )
}

/* ───────────────────────── Gantt ───────────────────────── */

export type GanttTask = {
    /** 작업 id (parent · dependencies 에서 참조) */
    id: string
    /** 왼쪽 목록에 보일 이름 */
    name: ReactNode
    /** 시작일 */
    start: Date | string
    /** 종료일 */
    end: Date | string
    /** 0~100 */
    progress?: number
    /** 상위 작업 id (접을 수 있는 트리) */
    parent?: string
    /** milestone 이면 start 위치에 마름모 */
    type?: 'task' | 'milestone'
    /** 막대 톤 (없으면 상위 작업은 neutral) */
    tone?: Tone
}

export type GanttChartProps = {
    /** 작업 목록 (parent 로 트리) */
    tasks: GanttTask[]
    /** 선후 관계 화살표 (FS · SS · FF) */
    dependencies?: Array<{ from: string; to: string; type?: 'FS' | 'SS' | 'FF' }>
    /** 시간 축 단위 (칸 폭 · 머리글 간격) */
    scale?: 'day' | 'week' | 'month'
    /** 오늘 세로선 */
    today?: Date | string
    /** 막대를 끌어 일정 이동 (양끝은 기간 조정) */
    onTaskChange?: (task: GanttTask) => void
    /** 제어 모드 접힌 작업 id */
    collapsed?: string[]
    /** 접힘이 바뀔 때 (접힌 id 목록) */
    onCollapsedChange?: (ids: string[]) => void
    /** 행 높이 (px) */
    rowHeight?: number
    /** 바깥 요소 style */
    style?: CSSProperties
}

const DAY = 86400000
const iso = (ms: number) => new Date(ms).toISOString().slice(0, 10)

/** 작업 일정 (금형 제작 · 설비 셋업 · 프로젝트) */
export const GanttChart = ({ tasks, dependencies = [], scale = 'day', today, onTaskChange, collapsed: colProp, onCollapsedChange, rowHeight = 32, style }: GanttChartProps) => {
    const [colInner, setColInner] = useState<string[]>([])
    const collapsed = new Set(colProp ?? colInner)
    const toggle = (id: string) => {
        const n = new Set(collapsed)
        if (n.has(id)) n.delete(id)
        else n.add(id)
        if (colProp === undefined) setColInner([...n])
        onCollapsedChange?.([...n])
    }
    const [drag, setDrag] = useState<{ id: string; dx: number; mode: 'move' | 'start' | 'end' } | null>(null)
    const unit = scale === 'day' ? 36 : scale === 'week' ? 14 : 4 // px per day
    const lo = Math.min(...tasks.map((x) => t(x.start))) - DAY
    const hi = Math.max(...tasks.map((x) => t(x.end))) + DAY * 2
    const days = Math.ceil((hi - lo) / DAY)
    const x = (ms: number) => ((ms - lo) / DAY) * unit
    const kids = (id?: string) => tasks.filter((k) => k.parent === id)
    const order: Array<{ task: GanttTask; depth: number }> = []
    const walk = (pid: string | undefined, depth: number) => {
        for (const k of kids(pid)) {
            order.push({ task: k, depth })
            if (!collapsed.has(k.id)) walk(k.id, depth + 1)
        }
    }
    walk(undefined, 0)
    const rowOf = new Map(order.map((o, i) => [o.task.id, i]))
    const width = days * unit
    const height = order.length * rowHeight

    const startDrag = (task: GanttTask, mode: 'move' | 'start' | 'end') => (e: ReactPointerEvent) => {
        if (!onTaskChange || task.type === 'milestone') return
        e.preventDefault()
        e.stopPropagation()
        const sx = e.clientX
        const move = (ev: PointerEvent) => setDrag({ id: task.id, dx: ev.clientX - sx, mode })
        const up = (ev: PointerEvent) => {
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
            setDrag(null)
            const dd = Math.round((ev.clientX - sx) / unit)
            if (!dd) return
            const s = t(task.start) + (mode !== 'end' ? dd * DAY : 0)
            const en = t(task.end) + (mode !== 'start' ? dd * DAY : 0)
            if (en <= s) return
            onTaskChange({ ...task, start: iso(s), end: iso(en) })
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
    }
    // 키보드로 일정 바꾸기: ← → 하루씩 옮기기, Shift + ← → 끝 날짜 늘이기 · 줄이기
    const onTaskKey = (task: GanttTask) => (e: React.KeyboardEvent) => {
        if (!onTaskChange || task.type === 'milestone') return
        const dd = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
        if (!dd) return
        e.preventDefault()
        const s = t(task.start) + (e.shiftKey ? 0 : dd * DAY)
        const en = t(task.end) + dd * DAY
        if (en <= s) return
        onTaskChange({ ...task, start: iso(s), end: iso(en) })
    }
    const headers = Array.from({ length: days }, (_, i) => lo + i * DAY).filter((d) => (scale === 'day' ? true : scale === 'week' ? new Date(d).getDay() === 1 : new Date(d).getDate() === 1))

    return (
        <div data-ds-gantt="" style={style}>
            <div data-slot="names">
                <div data-slot="head">작업</div>
                {order.map(({ task, depth }) => (
                    <div key={task.id} data-slot="name" style={{ height: rowHeight, paddingLeft: 8 + depth * 16 }}>
                        {kids(task.id).length ? (
                            <button type="button" aria-expanded={!collapsed.has(task.id)} onClick={() => toggle(task.id)} data-slot="toggle">
                                {collapsed.has(task.id) ? '▸' : '▾'}
                            </button>
                        ) : (
                            <span data-slot="toggle" />
                        )}
                        <span>{task.name}</span>
                    </div>
                ))}
            </div>
            <div data-slot="scroll">
                <div data-slot="head" style={{ width }}>
                    {headers.map((d) => (
                        <span key={d} style={{ left: x(d) }}>
                            {scale === 'month' ? `${new Date(d).getMonth() + 1}월` : `${new Date(d).getMonth() + 1}/${new Date(d).getDate()}`}
                        </span>
                    ))}
                </div>
                <svg width={width} height={height} role={onTaskChange ? 'group' : 'img'} aria-label={onTaskChange ? '작업 일정 (막대를 선택하고 ← → 로 옮기기, Shift + ← → 로 끝 날짜 조정)' : '작업 일정'}>
                    {headers.map((d) => (
                        <line key={d} x1={x(d)} x2={x(d)} y1={0} y2={height} data-slot="grid" />
                    ))}
                    {order.map((_, i) => (
                        <line key={`r${i}`} x1={0} x2={width} y1={(i + 1) * rowHeight} y2={(i + 1) * rowHeight} data-slot="grid" />
                    ))}
                    {dependencies.map((d, i) => {
                        const fa = tasks.find((k) => k.id === d.from)
                        const ta = tasks.find((k) => k.id === d.to)
                        if (!fa || !ta || !rowOf.has(fa.id) || !rowOf.has(ta.id)) return null
                        const y1 = rowOf.get(fa.id)! * rowHeight + rowHeight / 2
                        const y2 = rowOf.get(ta.id)! * rowHeight + rowHeight / 2
                        const x1 = d.type === 'SS' ? x(t(fa.start)) : x(t(fa.end))
                        const x2 = d.type === 'FF' ? x(t(ta.end)) : x(t(ta.start))
                        return <path key={i} d={`M ${x1} ${y1} h 8 V ${y2} H ${x2 - 2}`} fill="none" stroke="var(--ds-color-foreground-tertiary)" strokeWidth={1.2} markerEnd="url(#ds-gantt-arrow)" />
                    })}
                    <defs>
                        <marker id="ds-gantt-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto">
                            <path d="M0 0 L6 3 L0 6 z" fill="var(--ds-color-foreground-tertiary)" />
                        </marker>
                    </defs>
                    {order.map(({ task }, i) => {
                        const d = drag?.id === task.id ? drag : null
                        const sx = x(t(task.start)) + (d && d.mode !== 'end' ? d.dx : 0)
                        const ex = x(t(task.end)) + (d && d.mode !== 'start' ? d.dx : 0)
                        const y = i * rowHeight + rowHeight * 0.22
                        const h = rowHeight * 0.56
                        const c = chartColor(task.tone ?? (kids(task.id).length ? 'neutral' : 'accent'))
                        if (task.type === 'milestone') {
                            const cx = x(t(task.start))
                            const cy = i * rowHeight + rowHeight / 2
                            return <path key={task.id} d={`M ${cx} ${cy - 7} L ${cx + 7} ${cy} L ${cx} ${cy + 7} L ${cx - 7} ${cy} Z`} fill={chartColor('warning')}><title>{`마일스톤 ${iso(t(task.start))}`}</title></path>
                        }
                        return (
                            <g
                                key={task.id}
                                data-slot="task"
                                style={{ cursor: onTaskChange ? 'grab' : undefined }}
                                onPointerDown={startDrag(task, 'move')}
                                {...(onTaskChange
                                    ? {
                                          tabIndex: 0,
                                          role: 'button',
                                          'aria-label': `${typeof task.name === 'string' ? task.name : task.id} ${iso(t(task.start))} ~ ${iso(t(task.end))}, 진행 ${task.progress ?? 0}%`,
                                          'aria-roledescription': '일정 막대',
                                          'aria-keyshortcuts': 'ArrowLeft ArrowRight Shift+ArrowLeft Shift+ArrowRight',
                                          onKeyDown: onTaskKey(task),
                                      }
                                    : {})}
                            >
                                <rect x={sx} y={y} width={Math.max(4, ex - sx)} height={h} rx={4} fill={c} opacity={0.3} />
                                <rect x={sx} y={y} width={Math.max(0, (ex - sx) * ((task.progress ?? 0) / 100))} height={h} rx={4} fill={c} />
                                <title>{`${iso(t(task.start))} ~ ${iso(t(task.end))} · ${task.progress ?? 0}%`}</title>
                                {onTaskChange && (
                                    <>
                                        <rect x={sx - 3} y={y} width={6} height={h} fill="transparent" style={{ cursor: 'ew-resize' }} onPointerDown={startDrag(task, 'start')} />
                                        <rect x={ex - 3} y={y} width={6} height={h} fill="transparent" style={{ cursor: 'ew-resize' }} onPointerDown={startDrag(task, 'end')} />
                                    </>
                                )}
                            </g>
                        )
                    })}
                    {today && <line x1={x(t(today))} x2={x(t(today))} y1={0} y2={height} stroke={chartColor('danger')} strokeWidth={1.5} />}
                </svg>
            </div>
        </div>
    )
}
