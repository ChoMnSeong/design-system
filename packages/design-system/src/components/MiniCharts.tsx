import { useState, type CSSProperties, type ReactNode } from 'react'
import { chartColor } from './CartesianChart.js'
import type { Tone } from './types.js'

const fmt = (n: number) => n.toLocaleString('ko-KR', { maximumFractionDigits: 1 })

/* ───────────────────────── SegmentMeter ───────────────────────── */

export type SegmentMeterProps = {
    segments: Array<{ value: number; label?: ReactNode; tone?: Tone; color?: string; delta?: ReactNode }>
    /** 없으면 합계 */
    max?: number
    /** 남은 칸: track(회색) · hatch(빗금) · none */
    remainder?: 'track' | 'hatch' | 'none'
    /** 위쪽 표시 + 아래 눈금 (목표 · 한계) */
    markers?: Array<{ at: number; label?: ReactNode; icon?: ReactNode }>
    showScale?: boolean | { min?: number; max?: number; format?: (n: number) => string }
    /** 범례: true 한 줄 · 'rows' 값 · 증감을 행으로 */
    legend?: boolean | 'rows'
    size?: 'sm' | 'md' | 'lg'
    gap?: number
    'aria-label'?: string
    style?: CSSProperties
}

/** 여러 구간을 한 막대로 (설비 상태 비율 · 용량 사용) */
export const SegmentMeter = ({ segments, max: maxProp, remainder = 'track', markers = [], showScale, legend = true, size = 'md', gap = 2, 'aria-label': ariaLabel, style }: SegmentMeterProps) => {
    const total = segments.reduce((a, s) => a + s.value, 0)
    const max = maxProp ?? total
    const pct = (v: number) => (v / (max || 1)) * 100
    const scale = typeof showScale === 'object' ? showScale : {}
    const f = scale.format ?? fmt
    return (
        <div data-ds-segment-meter="" data-size={size} style={style} role="img" aria-label={ariaLabel ?? segments.map((s) => `${typeof s.label === 'string' ? s.label : ''} ${fmt(s.value)}`).join(', ')}>
            {markers.length > 0 && (
                <div data-slot="markers">
                    {markers.map((m, i) => (
                        <span key={i} style={{ left: `${pct(m.at)}%` }}>
                            {m.icon}
                            {m.label}
                        </span>
                    ))}
                </div>
            )}
            <div data-slot="bar" data-remainder={remainder} style={{ gap }}>
                {segments.map((s, i) => (
                    <span key={i} data-slot="seg" style={{ width: `${pct(s.value)}%`, background: s.color ?? chartColor(s.tone, i) }} title={`${typeof s.label === 'string' ? s.label : ''} ${fmt(s.value)}`} />
                ))}
                {remainder !== 'none' && max > total && <span data-slot="rest" style={{ flex: 1 }} />}
                {markers.map((m, i) => (
                    <i key={`m${i}`} data-slot="marker-line" style={{ left: `${pct(m.at)}%` }} />
                ))}
            </div>
            {showScale && (
                <div data-slot="scale">
                    <span>{f(scale.min ?? 0)}</span>
                    {markers.map((m, i) => (
                        <span key={i} style={{ position: 'absolute', left: `${pct(m.at)}%`, transform: 'translateX(-50%)' }}>{f(m.at)}</span>
                    ))}
                    <span>{f(scale.max ?? max)}</span>
                </div>
            )}
            {legend && (
                <ul data-slot="legend" data-rows={legend === 'rows' ? '' : undefined}>
                    {segments.map((s, i) => (
                        <li key={i}>
                            <i style={{ background: s.color ?? chartColor(s.tone, i) }} />
                            <span>{s.label}</span>
                            <b>{fmt(s.value)}</b>
                            {legend === 'rows' && s.delta !== undefined && <em>{s.delta}</em>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

/* ───────────────────────── UptimeBar ───────────────────────── */

export type UptimeCell = { at?: string; status: string; note?: ReactNode }

export type UptimeBarProps = {
    data: Array<string | UptimeCell>
    statusMap: Record<string, { label: string; tone?: Tone; color?: string }>
    /** 칸 수. 데이터가 적으면 앞쪽을 no-data 로 채운다 */
    cells?: number
    /** 오른쪽 위 가동률. 함수면 직접 */
    showUptime?: boolean | ((data: UptimeCell[]) => ReactNode)
    /** 가동으로 셀 상태 키 (가동률 계산) */
    upStatus?: string
    tooltip?: (cell: UptimeCell, index: number) => ReactNode
    highlight?: number
    size?: 'sm' | 'md'
    onCellClick?: (cell: UptimeCell, index: number) => void
    label?: ReactNode
    style?: CSSProperties
}

/** 최근 N일 가동 이력 칸 막대 (상태 페이지형) */
export const UptimeBar = ({ data, statusMap, cells = 90, showUptime = true, upStatus = Object.keys(statusMap)[0], tooltip, highlight, size = 'md', onCellClick, label, style }: UptimeBarProps) => {
    const list: UptimeCell[] = data.map((d) => (typeof d === 'string' ? { status: d } : d)).slice(-cells)
    const pad = Math.max(0, cells - list.length)
    const up = list.length ? (list.filter((c) => c.status === upStatus).length / list.length) * 100 : 0
    const [hover, setHover] = useState<number | null>(null)
    return (
        <div data-ds-uptime="" data-size={size} style={style}>
            {(label || showUptime) && (
                <div data-slot="head">
                    <span>{label}</span>
                    {showUptime && <b>{typeof showUptime === 'function' ? showUptime(list) : `${up.toFixed(1)}%`}</b>}
                </div>
            )}
            <div data-slot="cells" role="list" aria-label={`${typeof label === 'string' ? label : '가동 이력'} ${list.length}칸`}>
                {Array.from({ length: pad }, (_, i) => (
                    <span key={`p${i}`} data-slot="cell" data-empty="" role="listitem" aria-label="데이터 없음" />
                ))}
                {list.map((c, i) => {
                    const def = statusMap[c.status] ?? { label: c.status, tone: 'neutral' as Tone }
                    return (
                        <button
                            key={i}
                            type="button"
                            data-slot="cell"
                            role="listitem"
                            data-highlight={highlight === i ? '' : undefined}
                            style={{ background: def.color ?? chartColor(def.tone) }}
                            aria-label={`${c.at ?? `${i + 1}`} ${def.label}`}
                            onMouseEnter={() => setHover(i)}
                            onMouseLeave={() => setHover(null)}
                            onFocus={() => setHover(i)}
                            onBlur={() => setHover(null)}
                            onClick={() => onCellClick?.(c, i)}
                        />
                    )
                })}
                {hover !== null && list[hover] && (
                    <div data-slot="tip" style={{ left: `${((pad + hover + 0.5) / cells) * 100}%` }}>
                        {tooltip ? tooltip(list[hover]!, hover) : (
                            <>
                                <b>{list[hover]!.at ?? `${hover + 1}`}</b> {statusMap[list[hover]!.status]?.label ?? list[hover]!.status}
                                {list[hover]!.note && <span> · {list[hover]!.note}</span>}
                            </>
                        )}
                    </div>
                )}
            </div>
            <div data-slot="foot">
                <span>{cells}일 전</span>
                <span>오늘</span>
            </div>
        </div>
    )
}

/* ───────────────────────── InlineBar ───────────────────────── */

export type InlineBarProps = {
    value: number
    max?: number
    tone?: Tone
    /** 목표 세로 눈금 */
    target?: number
    /** 가운데 0 기준 좌우 (증감률) */
    diverging?: boolean
    showValue?: boolean | 'start' | 'end'
    suffix?: ReactNode
    width?: number | string
    format?: (n: number) => string
    style?: CSSProperties
}

/** 표 셀 · 행 안의 작은 막대 */
export const InlineBar = ({ value, max = 100, tone, target, diverging, showValue = 'start', suffix, width = '100%', format = fmt, style }: InlineBarProps) => {
    const t = tone ?? (diverging ? (value >= 0 ? 'success' : 'danger') : 'accent')
    const p = Math.min(100, (Math.abs(value) / (max || 1)) * 100)
    const val = showValue && (
        <span data-slot="value">
            {diverging && value > 0 ? '+' : ''}
            {format(value)}
            {suffix && <small>{suffix}</small>}
        </span>
    )
    return (
        <span data-ds-inline-bar="" data-diverging={diverging ? '' : undefined} style={{ width, ...style }} role="meter" aria-valuenow={value} aria-valuemax={max}>
            {(showValue === true || showValue === 'start') && val}
            <span data-slot="track">
                {diverging ? (
                    <span data-slot="fill" style={{ background: chartColor(t), width: `${p / 2}%`, [value >= 0 ? 'left' : 'right']: '50%' }} />
                ) : (
                    <span data-slot="fill" style={{ background: chartColor(t), width: `${p}%` }} />
                )}
                {diverging && <i data-slot="zero" />}
                {target !== undefined && <i data-slot="target" style={{ left: `${Math.min(100, (target / max) * 100)}%` }} />}
            </span>
            {showValue === 'end' && val}
        </span>
    )
}

/* ───────────────────────── StepChart ───────────────────────── */

export type StepChartProps = {
    data: Array<{ from: Date | string; to: Date | string; level: string }>
    /** 위 → 아래 순서 */
    levels: string[]
    levelTone?: Record<string, Tone>
    highlight?: string | string[]
    connector?: 'dashed' | 'solid' | 'none'
    xDomain?: [Date | string, Date | string]
    xFormat?: (d: Date) => string
    compact?: boolean
    height?: number
    style?: CSSProperties
}

const ms = (d: Date | string) => (typeof d === 'string' ? new Date(d) : d).getTime()

/** 상태 단계 그래프 (가동 → 대기 → 정지 를 높이로) */
export const StepChart = ({ data, levels, levelTone = {}, highlight, connector = 'dashed', xDomain, xFormat = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`, compact, height = 140, style }: StepChartProps) => {
    const W = 600
    const padL = compact ? 4 : 52
    const padB = compact ? 4 : 20
    const lo = xDomain ? ms(xDomain[0]) : Math.min(...data.map((d) => ms(d.from)))
    const hi = xDomain ? ms(xDomain[1]) : Math.max(...data.map((d) => ms(d.to)))
    const x = (t: number) => padL + ((t - lo) / (hi - lo || 1)) * (W - padL - 4)
    const rowH = (height - padB - 8) / levels.length
    const y = (lv: string) => 4 + levels.indexOf(lv) * rowH + rowH / 2
    const hl = new Set(Array.isArray(highlight) ? highlight : highlight ? [highlight] : [])
    return (
        <div data-ds-chart="" data-ds-step-chart="" style={style}>
            <svg viewBox={`0 0 ${W} ${height}`} width="100%" height={height} preserveAspectRatio="none" role="img" aria-label={`상태 단계: ${data.map((d) => d.level).join(' → ')}`}>
                {!compact &&
                    levels.map((lv) => (
                        <g key={lv}>
                            <line x1={padL} x2={W} y1={y(lv)} y2={y(lv)} data-slot="grid" />
                            <text x={padL - 6} y={y(lv) + 4} textAnchor="end" data-slot="tick" style={hl.has(lv) ? { fill: chartColor(levelTone[lv] ?? 'danger'), fontWeight: 700 } : undefined}>{lv}</text>
                        </g>
                    ))}
                {data.map((d, i) => {
                    const c = chartColor(levelTone[d.level] ?? (hl.has(d.level) ? 'danger' : 'accent'))
                    const next = data[i + 1]
                    return (
                        <g key={i}>
                            <line x1={x(ms(d.from))} x2={x(ms(d.to))} y1={y(d.level)} y2={y(d.level)} stroke={c} strokeWidth={hl.has(d.level) ? 6 : 4} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                            {next && connector !== 'none' && <line x1={x(ms(d.to))} x2={x(ms(next.from))} y1={y(d.level)} y2={y(next.level)} stroke="var(--ds-color-border-strong)" strokeDasharray={connector === 'dashed' ? '3 3' : undefined} vectorEffect="non-scaling-stroke" />}
                        </g>
                    )
                })}
                {!compact &&
                    [0, 0.25, 0.5, 0.75, 1].map((f) => {
                        const tt = lo + (hi - lo) * f
                        return <text key={f} x={x(tt)} y={height - 4} textAnchor={f === 0 ? 'start' : f === 1 ? 'end' : 'middle'} data-slot="tick">{xFormat(new Date(tt))}</text>
                    })}
            </svg>
        </div>
    )
}

/* ───────────────────────── MiniGauge (arc · lollipop) ───────────────────────── */

export type MiniGaugeProps = {
    value: number
    min?: number
    max?: number
    /** arc: 반원 · lollipop: 가로 막대 + 점 */
    variant?: 'arc' | 'lollipop'
    zones?: Array<{ from: number; to: number; tone?: Tone; color?: string }>
    marker?: 'needle' | 'segment' | 'dot'
    /** 구간 경계 눈금 */
    ticks?: number[]
    statusLabel?: (value: number, zone?: { tone?: Tone }) => ReactNode
    format?: (n: number) => string
    unit?: ReactNode
    width?: number
    style?: CSSProperties
}

/** 작은 게이지 (온도 · 압력 · 가동률). 원형은 Gauge 를 쓴다 */
export const MiniGauge = ({ value, min = 0, max = 100, variant = 'arc', zones = [], marker = variant === 'arc' ? 'needle' : 'dot', ticks = [], statusLabel, format = fmt, unit, width = 160, style }: MiniGaugeProps) => {
    const f = (v: number) => Math.max(0, Math.min(1, (v - min) / (max - min)))
    const zone = zones.find((z) => value >= z.from && value <= z.to)
    const zc = (z?: { tone?: Tone; color?: string }) => z?.color ?? chartColor(z?.tone ?? 'accent')
    if (variant === 'lollipop') {
        const H = 28
        return (
            <div data-ds-mini-gauge="" data-variant="lollipop" style={{ width, ...style }}>
                <div data-slot="value"><b>{format(value)}</b>{unit && <span>{unit}</span>}{statusLabel && <em style={{ color: zc(zone) }}>{statusLabel(value, zone)}</em>}</div>
                <svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} aria-hidden>
                    {zones.map((z, i) => <rect key={i} x={f(z.from) * width} y={H / 2 - 3} width={(f(z.to) - f(z.from)) * width} height={6} fill={zc(z)} opacity={0.28} />)}
                    {!zones.length && <rect x={0} y={H / 2 - 3} width={width} height={6} rx={3} fill="var(--ds-color-border-subtle)" />}
                    <line x1={0} x2={f(value) * width} y1={H / 2} y2={H / 2} stroke={zc(zone)} strokeWidth={2} />
                    {ticks.map((t, i) => <line key={i} x1={f(t) * width} x2={f(t) * width} y1={H / 2 - 7} y2={H / 2 + 7} stroke="var(--ds-color-foreground-tertiary)" />)}
                    <circle cx={Math.max(6, Math.min(width - 6, f(value) * width))} cy={H / 2} r={6} fill={zc(zone)} stroke="var(--ds-surface-card-background)" strokeWidth={2} />
                </svg>
            </div>
        )
    }
    const r = width / 2 - 10
    const cx = width / 2
    const cy = r + 8
    const pt = (fr: number, rad = r) => [cx - rad * Math.cos(Math.PI * fr), cy - rad * Math.sin(Math.PI * fr)] as const
    const arcPath = (a: number, b: number) => {
        const [x0, y0] = pt(a)
        const [x1, y1] = pt(b)
        return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`
    }
    const v = f(value)
    return (
        <div data-ds-mini-gauge="" data-variant="arc" style={{ width, ...style }} role="meter" aria-valuenow={value} aria-valuemin={min} aria-valuemax={max}>
            <svg width={width} height={cy + 6} viewBox={`0 0 ${width} ${cy + 6}`} aria-hidden>
                <path d={arcPath(0, 1)} fill="none" stroke="var(--ds-color-border-subtle)" strokeWidth={10} />
                {zones.map((z, i) => <path key={i} d={arcPath(f(z.from), f(z.to))} fill="none" stroke={zc(z)} strokeWidth={10} opacity={0.35} />)}
                {marker === 'segment' && <path d={arcPath(0, v)} fill="none" stroke={zc(zone)} strokeWidth={10} />}
                {ticks.map((t, i) => {
                    const [a, b] = pt(f(t), r - 8)
                    const [c, d] = pt(f(t), r + 8)
                    return <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="var(--ds-color-foreground-tertiary)" />
                })}
                {marker === 'needle' && (() => {
                    const [nx, ny] = pt(v, r - 4)
                    return (
                        <>
                            <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="var(--ds-color-foreground-primary)" strokeWidth={2.5} strokeLinecap="round" />
                            <circle cx={cx} cy={cy} r={4} fill="var(--ds-color-foreground-primary)" />
                        </>
                    )
                })()}
                {marker === 'dot' && (() => {
                    const [nx, ny] = pt(v)
                    return <circle cx={nx} cy={ny} r={7} fill={zc(zone)} stroke="var(--ds-surface-card-background)" strokeWidth={2} />
                })()}
            </svg>
            <div data-slot="value" data-center="">
                <b>{format(value)}</b>{unit && <span>{unit}</span>}
                {statusLabel && <em style={{ color: zc(zone) }}>{statusLabel(value, zone)}</em>}
            </div>
        </div>
    )
}

/* ───────────────────────── TargetScatter ───────────────────────── */

export type TargetPoint = { x: number; y: number; id?: string; label?: ReactNode }

export type TargetScatterProps = {
    points: TargetPoint[]
    /** 공차 원 (안쪽부터) */
    rings?: Array<{ r: number; label?: string; tone?: Tone }>
    /** 바깥 반경 */
    domain?: number
    /** ring: 들어간 원 색 · 함수: 직접 */
    colorBy?: 'ring' | ((p: TargetPoint) => Tone)
    /** 아래 분포 막대 */
    distribution?: 'x' | 'y' | false
    onPointClick?: (p: TargetPoint) => void
    size?: number
    style?: CSSProperties
}

/** 과녁형 산포 (위치 편차 · 동심도) */
export const TargetScatter = ({ points, rings = [], domain: domainProp, colorBy = 'ring', distribution = false, onPointClick, size = 240, style }: TargetScatterProps) => {
    const domain = domainProp ?? Math.max(...rings.map((r) => r.r), ...points.map((p) => Math.hypot(p.x, p.y))) * 1.1
    const c = size / 2
    const s = (v: number) => (v / domain) * (size / 2 - 8)
    const toneOf = (p: TargetPoint): Tone => {
        if (typeof colorBy === 'function') return colorBy(p)
        const d = Math.hypot(p.x, p.y)
        const i = rings.findIndex((r) => d <= r.r)
        return i === -1 ? 'danger' : (rings[i]!.tone ?? (i === 0 ? 'success' : 'warning'))
    }
    const bins = 9
    const hist = distribution ? Array.from({ length: bins }, (_, i) => points.filter((p) => Math.min(bins - 1, Math.floor(((distribution === 'x' ? p.x : p.y) / domain + 1) / 2 * bins)) === i).length) : []
    const hmax = Math.max(1, ...hist)
    return (
        <div data-ds-target-scatter="" style={style}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`측정점 ${points.length}개`}>
                <line x1={0} x2={size} y1={c} y2={c} data-slot="axis" />
                <line x1={c} x2={c} y1={0} y2={size} data-slot="axis" />
                {[...rings].reverse().map((r, i) => (
                    <g key={i}>
                        <circle cx={c} cy={c} r={s(r.r)} fill={chartColor(r.tone ?? (rings.indexOf(r) === 0 ? 'success' : 'warning'))} fillOpacity={0.07} stroke={chartColor(r.tone ?? (rings.indexOf(r) === 0 ? 'success' : 'warning'))} strokeDasharray="4 3" />
                        {r.label && <text x={c + s(r.r) * 0.71 + 3} y={c - s(r.r) * 0.71 - 3} data-slot="tick">{r.label}</text>}
                    </g>
                ))}
                {points.map((p, i) => (
                    <circle key={p.id ?? i} cx={c + s(p.x)} cy={c - s(p.y)} r={4.5} fill={chartColor(toneOf(p))} stroke="var(--ds-surface-card-background)" strokeWidth={1.5} style={onPointClick ? { cursor: 'pointer' } : undefined} onClick={() => onPointClick?.(p)}>
                        <title>{`${p.label ?? p.id ?? i + 1}: x ${p.x}, y ${p.y}`}</title>
                    </circle>
                ))}
            </svg>
            {distribution && (
                <div data-slot="dist" style={{ width: size }} aria-label={`${distribution} 분포`}>
                    {hist.map((h, i) => (
                        <span key={i} style={{ height: `${(h / hmax) * 100}%` }} title={`${h}`} />
                    ))}
                </div>
            )}
        </div>
    )
}
