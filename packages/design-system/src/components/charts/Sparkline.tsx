import type { SVGAttributes } from 'react'
import type { Tone } from '../types.js'

export type SparklineProps = {
    data: number[]
    type?: 'line' | 'bar' | 'area'
    width?: number | string
    height?: number
    tone?: Tone
    /** 마지막 점 강조 */
    showLast?: boolean
    /** showLast 별칭 */
    highlightLast?: boolean
    /** 기준선 (목표 등) */
    reference?: number
    'aria-label'?: string
} & Omit<SVGAttributes<SVGSVGElement>, 'type'>

const TONE: Record<Tone, string> = {
    accent: 'var(--ds-palette-primary-500)',
    neutral: 'var(--ds-color-foreground-tertiary)',
    success: 'var(--ds-tone-success-solid)',
    warning: 'var(--ds-tone-warning-solid)',
    danger: 'var(--ds-tone-danger-solid)',
    info: 'var(--ds-tone-info-solid)',
}

/** 축 없는 작은 추이 그래프 (카드 · 표 셀) */
export const Sparkline = ({ data, type = 'line', width = '100%', height = 24, tone = 'accent', showLast: showLastProp, highlightLast, reference, 'aria-label': ariaLabel, ...rest }: SparklineProps) => {
    const showLast = showLastProp ?? highlightLast ?? true
    if (data.length < 2) return null
    const W = 120
    const H = height
    const vals = reference !== undefined ? [...data, reference] : data
    const lo = Math.min(...vals, type === 'bar' ? 0 : Infinity)
    const hi = Math.max(...vals)
    const y = (v: number) => H - 2 - ((v - lo) / (hi - lo || 1)) * (H - 4)
    const x = (i: number) => (i / (data.length - 1)) * W
    const c = TONE[tone]
    const pts = data.map((v, i) => `${x(i)},${y(v)}`).join(' ')
    return (
        <svg
            data-ds-sparkline=""
            width={width}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            role={ariaLabel ? 'img' : undefined}
            aria-label={ariaLabel}
            aria-hidden={ariaLabel ? undefined : true}
            {...rest}
        >
            {reference !== undefined && <line x1={0} x2={W} y1={y(reference)} y2={y(reference)} stroke="var(--ds-color-border-strong)" strokeDasharray="3 3" strokeWidth={1} vectorEffect="non-scaling-stroke" />}
            {type === 'bar' ? (
                data.map((v, i) => {
                    const bw = (W / data.length) * 0.7
                    const bx = (W / data.length) * i + (W / data.length - bw) / 2
                    return <rect key={i} x={bx} y={y(v)} width={bw} height={H - 2 - y(v)} rx={1} fill={c} opacity={i === data.length - 1 ? 1 : 0.55} />
                })
            ) : (
                <>
                    {type === 'area' && <polygon points={`0,${H} ${pts} ${W},${H}`} fill={c} opacity={0.15} />}
                    <polyline points={pts} fill="none" stroke={c} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                    {showLast && <circle cx={x(data.length - 1)} cy={y(data[data.length - 1]!)} r={2.5} fill={c} />}
                </>
            )}
        </svg>
    )
}
