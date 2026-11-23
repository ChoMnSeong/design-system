import { pressable } from './chartUtils.js'
import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { chartColor } from './CartesianChart.js'
import type { Tone } from '../types.js'

export type PieDatum = { label: string; value: number; color?: string; tone?: Tone }

export type PieChartProps = {
    /** 조각 목록 (라벨 · 값 · 색) */
    data: PieDatum[]
    /** 지름 (px) */
    size?: number
    /** 가운데를 비운 도넛 모양 */
    donut?: boolean
    /** 도넛 고리 두께 (px) */
    thickness?: number
    /** right · bottom · none */
    legend?: 'right' | 'bottom' | 'none'
    /** @deprecated legend 를 쓴다 */
    showLegend?: boolean
    /** 조각 사이 간격 각도 (도) */
    padAngle?: number
    /** 첫 조각 시작 각도 (도, 12시부터 시계방향) */
    startAngle?: number
    /** 조각 위 글자: value · percent · none */
    labelType?: 'value' | 'percent' | 'none'
    /** @deprecated labelType="percent" */
    showValueOnSlice?: boolean
    /** 조각 위 글자 형식 (값, 합계) */
    formatValue?: (n: number, total: number) => string
    /** 이 비율(%) 미만 조각은 '기타' 로 묶는다 */
    minSlice?: number
    /** 조각을 눌렀을 때 (조각, 인덱스) */
    onSliceClick?: (datum: PieDatum, index: number) => void
    /** 조각에 마우스를 올리면 값 · 비율 표시 */
    tooltip?: boolean
    /** 강조할 조각 (제어형) */
    activeIndex?: number
    /** 접근성 이름 (없으면 조각별 비율) */
    'aria-label'?: string
    /** 바깥 요소 style */
    style?: CSSProperties
    /** 바깥 요소 class */
    className?: string
}

const arc = (cx: number, cy: number, r: number, ri: number, a0: number, a1: number) => {
    const p = (rad: number, a: number) => [cx + rad * Math.sin(a), cy - rad * Math.cos(a)]
    const large = a1 - a0 > Math.PI ? 1 : 0
    const [x0, y0] = p(r, a0)
    const [x1, y1] = p(r, a1)
    if (ri <= 0) return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`
    const [x2, y2] = p(ri, a1)
    const [x3, y3] = p(ri, a0)
    return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${ri} ${ri} 0 ${large} 0 ${x3} ${y3} Z`
}

/** 항목 비율을 조각으로 보여 주는 원형 차트 */
export const PieChart = ({
    data: dataProp,
    size = 200,
    donut,
    thickness = 28,
    legend,
    showLegend,
    padAngle = 0,
    startAngle = 0,
    labelType,
    showValueOnSlice,
    formatValue,
    minSlice,
    onSliceClick,
    tooltip = true,
    activeIndex,
    'aria-label': ariaLabel,
    style,
    className,
    children,
}: PieChartProps & { children?: ReactNode }) => {
    const [hover, setHover] = useState<number | null>(null)
    const data = useMemo(() => {
        const total = dataProp.reduce((a, d) => a + d.value, 0) || 1
        if (!minSlice) return dataProp
        const keep = dataProp.filter((d) => (d.value / total) * 100 >= minSlice)
        const rest = dataProp.filter((d) => (d.value / total) * 100 < minSlice)
        return rest.length > 1 ? [...keep, { label: `기타 ${rest.length}`, value: rest.reduce((a, d) => a + d.value, 0), tone: 'neutral' as Tone }] : dataProp
    }, [dataProp, minSlice])
    const total = data.reduce((a, d) => a + d.value, 0) || 1
    const lt = labelType ?? (showValueOnSlice ? 'percent' : 'none')
    const lg = legend ?? (showLegend === false ? 'none' : 'right')
    const r = size / 2 - 4
    const ri = donut ? r - thickness : 0
    const cx = size / 2
    const pad = (padAngle * Math.PI) / 180
    let a = (startAngle * Math.PI) / 180
    const active = activeIndex ?? hover
    const fmt = (v: number) => (formatValue ? formatValue(v, total) : lt === 'value' ? v.toLocaleString('ko-KR') : `${((v / total) * 100).toFixed(1)}%`)
    const colorOf = (d: PieDatum, i: number) => d.color ?? chartColor(d.tone, i)
    return (
        <div data-ds-pie="" data-legend={lg} className={className} style={style}>
            <div data-slot="plot" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
                    // 키보드로 조각 값 읽기: Tab 으로 와서 ← → 로 조각을 옮기면 tooltip(role=status)이 알린다
                    tabIndex={data.length ? 0 : undefined}
                    onFocus={(e) => { if (e.target === e.currentTarget && hover === null) setHover(0) }}
                    onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHover(null) }}
                    onKeyDown={(e) => {
                        if (e.target !== e.currentTarget || !data.length) return
                        const cur = hover ?? -1
                        const next = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (cur + 1) % data.length : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (cur - 1 + data.length) % data.length : e.key === 'Escape' ? null : undefined
                        if (next === undefined) return
                        e.preventDefault()
                        setHover(next)
                    }}
                    role={onSliceClick ? 'group' : 'img'} aria-label={ariaLabel ?? data.map((d) => `${d.label} ${((d.value / total) * 100).toFixed(1)}%`).join(', ')}>
                    {data.map((d, i) => {
                        const span = (d.value / total) * Math.PI * 2
                        const a0 = a + pad / 2
                        const a1 = a + span - pad / 2
                        a += span
                        const mid = (a0 + a1) / 2
                        const grow = active === i ? 4 : 0
                        const lr = ri ? (r + ri) / 2 : r * 0.62
                        return (
                            <g key={i}>
                                <path
                                    d={arc(cx, cx, r + grow, ri, a0, Math.max(a0 + 0.0001, a1))}
                                    fill={colorOf(d, i)}
                                    opacity={active !== null && active !== i ? 0.55 : 1}
                                    data-slot="slice"
                                    onMouseEnter={() => setHover(i)}
                                    onMouseLeave={() => setHover(null)}
                                    onFocus={() => setHover(i)}
                                    onBlur={() => setHover(null)}
                                    {...pressable(onSliceClick && (() => onSliceClick(dataProp[i] ?? d, i)), `${d.label} ${((d.value / total) * 100).toFixed(1)}%`)}
                                />
                                {lt !== 'none' && span > 0.35 && (
                                    <text x={cx + lr * Math.sin(mid)} y={cx - lr * Math.cos(mid) + 4} textAnchor="middle" data-slot="slice-label">
                                        {fmt(d.value)}
                                    </text>
                                )}
                            </g>
                        )
                    })}
                </svg>
                {children}
                {tooltip && hover !== null && data[hover] && (
                    <div data-slot="tooltip" role="status">
                        <b>{data[hover]!.label}</b>
                        <span>
                            {data[hover]!.value.toLocaleString('ko-KR')} · {((data[hover]!.value / total) * 100).toFixed(1)}%
                        </span>
                    </div>
                )}
            </div>
            {lg !== 'none' && (
                <ul data-slot="legend">
                    {data.map((d, i) => (
                        <li key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} data-active={active === i ? '' : undefined}>
                            <i style={{ background: colorOf(d, i) }} />
                            <span>{d.label}</span>
                            <em>{((d.value / total) * 100).toFixed(1)}%</em>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export type DonutChartProps = Omit<PieChartProps, 'donut'> & {
    /** 가운데 값 아래 설명 */
    centerLabel?: ReactNode
    /** 가운데 큰 값 */
    centerValue?: ReactNode
}

/** 가운데에 값 · 설명을 넣는 도넛 차트 */
export const DonutChart = ({ centerLabel, centerValue, size = 200, thickness = 28, ...rest }: DonutChartProps) => (
    <PieChart {...rest} donut size={size} thickness={thickness}>
        {(centerLabel || centerValue) && (
            <div data-slot="center" aria-hidden>
                {centerValue && <b>{centerValue}</b>}
                {centerLabel && <span>{centerLabel}</span>}
            </div>
        )}
    </PieChart>
)
