import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { chartColor } from './CartesianChart.js'
import type { Tone } from '../types.js'

export type PieDatum = { label: string; value: number; color?: string; tone?: Tone }

export type PieChartProps = {
    data: PieDatum[]
    size?: number
    donut?: boolean
    thickness?: number
    /** right · bottom · none */
    legend?: 'right' | 'bottom' | 'none'
    /** @deprecated legend 를 쓴다 */
    showLegend?: boolean
    padAngle?: number
    startAngle?: number
    /** 조각 위 글자: value · percent · none */
    labelType?: 'value' | 'percent' | 'none'
    /** @deprecated labelType="percent" */
    showValueOnSlice?: boolean
    formatValue?: (n: number, total: number) => string
    /** 이 비율(%) 미만 조각은 '기타' 로 묶는다 */
    minSlice?: number
    onSliceClick?: (datum: PieDatum, index: number) => void
    tooltip?: boolean
    /** 강조할 조각 (제어형) */
    activeIndex?: number
    'aria-label'?: string
    style?: CSSProperties
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
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={ariaLabel ?? data.map((d) => `${d.label} ${((d.value / total) * 100).toFixed(1)}%`).join(', ')}>
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
                                    style={onSliceClick ? { cursor: 'pointer' } : undefined}
                                    onMouseEnter={() => setHover(i)}
                                    onMouseLeave={() => setHover(null)}
                                    onClick={() => onSliceClick?.(dataProp[i] ?? d, i)}
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
    centerLabel?: ReactNode
    centerValue?: ReactNode
}

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
