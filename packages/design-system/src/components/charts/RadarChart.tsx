import { chartColor } from './CartesianChart.js'
import { useId, type CSSProperties, type ReactNode } from 'react'

export type RadarSeries = {
    /** 범례 · tooltip 이름 */
    label?: string
    /** label 별칭 (비교 모드) */
    name?: string
    /** axes 순서의 값 */
    values: number[]
    /** 직접 색 (tone 보다 우선) */
    color?: string
    /** 색 톤 */
    tone?: import('../types.js').Tone
}

export type RadarChartProps = {
    /** 축 이름 (12시부터 시계방향) */
    axes: string[]
    /** 그릴 시리즈 */
    series: RadarSeries[]
    /** 너비 · 높이 (px) */
    size?: number
    /** 하나면 모든 축 공통, 배열이면 축별 최댓값 (단위가 다른 지표 비교) */
    max?: number | number[]
    /** top · bottom · none */
    legend?: 'top' | 'bottom' | 'none'
    /** 점에 마우스를 올리면 값 표시 (title) */
    tooltip?: boolean
    /** 격자 단계 수 */
    levels?: number
    /** @deprecated legend 를 쓴다 */
    showLegend?: boolean
    /** 폴리곤 영역 채움 (기본 true). false면 라인만. */
    fill?: boolean
    /** 데이터 포인트 점 표시 (기본 true). */
    showDots?: boolean
    /** 그리드 모양: polygon(다각형) / circle(동심원) / none. */
    gridShape?: 'polygon' | 'circle' | 'none'
    /** 그리드 다각형 안쪽을 옅게 채움. */
    gridFilled?: boolean
    /** 축 라벨 커스텀 렌더 (값 등 추가 표시 가능). */
    axisLabelRender?: (axis: string, idx: number) => ReactNode
    /** 영역 채움 투명도 (0~1) */
    fillOpacity?: number
    /** 꼭짓점 사이를 부드럽게 */
    curve?: 'linear' | 'smooth'
    /** 오른쪽 요약 칸 (비교 수치 표) */
    aside?: ReactNode
    /** 바깥 요소 style */
    style?: CSSProperties
}

const DEFAULT_COLORS = [
    'var(--ds-palette-primary-500)',
    'var(--ds-palette-primary-700)',
    'var(--ds-palette-primary-300)',
    'var(--ds-palette-primary-400)',
]

const polar = (cx: number, cy: number, r: number, deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const
}

/** 닫힌 곡선 (Catmull-Rom) */
const smoothClosed = (pts: ReadonlyArray<readonly number[]>) => {
    const n = pts.length
    const P = (i: number) => pts[(i + n) % n]!
    let d = `M ${P(0)[0]} ${P(0)[1]}`
    for (let i = 0; i < n; i++) {
        const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2)
        d += ` C ${p1[0]! + (p2[0]! - p0[0]!) / 6} ${p1[1]! + (p2[1]! - p0[1]!) / 6}, ${p2[0]! - (p3[0]! - p1[0]!) / 6} ${p2[1]! - (p3[1]! - p1[1]!) / 6}, ${p2[0]} ${p2[1]}`
    }
    return d + ' Z'
}

/** 여러 지표를 축으로 놓고 비교하는 방사형 차트 */
export const RadarChart = ({
    axes,
    series,
    size = 280,
    max,
    levels = 4,
    showLegend,
    legend,
    tooltip = true,
    fill = true,
    showDots = true,
    gridShape = 'polygon',
    gridFilled = false,
    axisLabelRender,
    fillOpacity = 0.18,
    curve = 'linear',
    aside,
    style,
}: RadarChartProps) => {
    const id = useId().replace(/:/g, '')
    const cx = size / 2
    const cy = size / 2
    const padding = 48
    const radius = size / 2 - padding
    const allValues = series.flatMap((s) => s.values)
    const commonMax = typeof max === 'number' ? max : Math.max(...allValues, 1)
    const maxOf = (i: number) => (Array.isArray(max) ? (max[i] ?? commonMax) : commonMax)
    const angleStep = 360 / Math.max(axes.length, 1)

    const axisPoint = (axisIdx: number, frac: number) => {
        const deg = axisIdx * angleStep
        return polar(cx, cy, radius * frac, deg)
    }

    const polygonPath = (frac: number): string =>
        axes
            .map((_, ai) => {
                const [x, y] = axisPoint(ai, frac)
                return `${ai === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
            })
            .join(' ') + ' Z'

    const seriesPath = (values: number[]): string =>
        values
            .map((v, i) => {
                const [x, y] = axisPoint(i, v / maxOf(i))
                return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
            })
            .join(' ') + ' Z'

    return (
        <div style={{ display: aside ? 'inline-flex' : 'inline-block', gap: 20, alignItems: 'center', ...style }}>
            <div>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                style={{ display: 'block' }}
            >
                {gridShape !== 'none' &&
                    Array.from({ length: levels }, (_, i) => {
                        const frac = (i + 1) / levels
                        if (gridShape === 'circle') {
                            return (
                                <circle
                                    key={`grid-${id}-${i}`}
                                    cx={cx}
                                    cy={cy}
                                    r={radius * frac}
                                    fill={
                                        gridFilled
                                            ? 'var(--ds-palette-primary-500)'
                                            : 'none'
                                    }
                                    fillOpacity={
                                        gridFilled
                                            ? 0.04 + (1 - frac) * 0.05
                                            : 0
                                    }
                                    stroke="var(--ds-color-border-subtle)"
                                    strokeWidth="1"
                                />
                            )
                        }
                        return (
                            <path
                                key={`grid-${id}-${i}`}
                                d={polygonPath(frac)}
                                fill={
                                    gridFilled
                                        ? 'var(--ds-palette-primary-500)'
                                        : 'none'
                                }
                                fillOpacity={
                                    gridFilled
                                        ? 0.04 + (1 - frac) * 0.05
                                        : 0
                                }
                                stroke="var(--ds-color-border-subtle)"
                                strokeWidth="1"
                            />
                        )
                    })}

                {gridShape !== 'none' &&
                    axes.map((_, i) => {
                        const [x, y] = axisPoint(i, 1)
                        return (
                            <line
                                key={`axis-${id}-${i}`}
                                x1={cx}
                                y1={cy}
                                x2={x}
                                y2={y}
                                stroke="var(--ds-color-border-subtle)"
                                strokeWidth="1"
                            />
                        )
                    })}

                {axes.map((label, i) => {
                    const [x, y] = axisPoint(i, 1.18)
                    const rendered = axisLabelRender
                        ? axisLabelRender(label, i)
                        : label
                    if (typeof rendered === 'string') {
                        return (
                            <text
                                key={`label-${id}-${i}`}
                                x={x}
                                y={y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="11"
                                fill="var(--ds-color-foreground-secondary)"
                                fontFamily="inherit"
                                fontWeight="600"
                            >
                                {rendered}
                            </text>
                        )
                    }
                    return (
                        <foreignObject
                            key={`label-${id}-${i}`}
                            x={x - 60}
                            y={y - 18}
                            width={120}
                            height={36}
                            style={{ overflow: 'visible' }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    color: 'var(--ds-color-foreground-secondary)',
                                    fontWeight: 600,
                                    textAlign: 'center',
                                    lineHeight: 1.2,
                                }}
                            >
                                {rendered}
                            </div>
                        </foreignObject>
                    )
                })}

                {series.map((s, idx) => {
                    const color = s.color ?? (s.tone ? chartColor(s.tone) : DEFAULT_COLORS[idx % DEFAULT_COLORS.length]!)
                    return (
                        <g key={`s-${id}-${idx}`}>
                            <path
                                d={curve === 'smooth' ? smoothClosed(s.values.map((v, i) => axisPoint(i, v / maxOf(i)))) : seriesPath(s.values)}
                                fill={fill ? color : 'none'}
                                fillOpacity={fill ? fillOpacity : 0}
                                stroke={color}
                                strokeWidth="2"
                                strokeLinejoin="round"
                            />
                            {showDots &&
                                s.values.map((v, i) => {
                                    const [px, py] = axisPoint(
                                        i,
                                        v / maxOf(i),
                                    )
                                    return (
                                        <circle
                                            key={i}
                                            cx={px}
                                            cy={py}
                                            r="3.5"
                                            fill="var(--ds-color-background-page)"
                                            stroke={color}
                                            strokeWidth="2"
                                        >
                                            {tooltip && <title>{`${s.label ?? s.name} · ${axes[i]}: ${v}`}</title>}
                                        </circle>
                                    )
                                })}
                        </g>
                    )
                })}
            </svg>
            {(legend ?? (showLegend === false ? 'none' : 'bottom')) !== 'none' && (
                <div
                    style={{
                        display: 'flex',
                        gap: '16px',
                        flexWrap: 'wrap',
                        marginTop: '8px',
                        justifyContent: 'center',
                    }}
                >
                    {series.map((s, idx) => {
                        const color =
                            s.color ??
                            (s.tone ? chartColor(s.tone) : DEFAULT_COLORS[idx % DEFAULT_COLORS.length]!)
                        return (
                            <span
                                key={idx}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '12px',
                                    color: 'var(--ds-color-foreground-secondary)',
                                }}
                            >
                                <span
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        background: color,
                                        borderRadius: '50%',
                                    }}
                                />
                                {s.label ?? s.name}
                            </span>
                        )
                    })}
                </div>
            )}
            </div>
            {aside && <div data-slot="aside" style={{ minWidth: 160 }}>{aside}</div>}
        </div>
    )
}
