import type { CSSProperties, ReactNode } from 'react'
import type { Tone } from '../types.js'
import { chartColor } from './CartesianChart.js'

const SIZE: Record<string, number> = { sm: 96, md: 140, lg: 200 }

export type GaugeProps = {
    value: number
    min?: number
    max?: number
    /** sm 96 · md 140 · lg 200 또는 px */
    size?: 'sm' | 'md' | 'lg' | number
    thickness?: number
    /** 호 각도 */
    arc?: 180 | 240 | 270
    tone?: Tone
    /** 구간 색 (불량 · 주의 · 정상). 값이 속한 구간 색으로 채운다 */
    ranges?: Array<{ from: number; to: number; tone: Tone }>
    /** 목표 눈금 */
    target?: number
    /** @deprecated tone · ranges 를 쓴다 (직접 색은 유지) */
    color?: string
    trackColor?: string
    label?: ReactNode
    formatValue?: (n: number, max: number) => string
    style?: CSSProperties
    'aria-label'?: string
}

export const Gauge = ({
    value,
    min = 0,
    max = 100,
    size = 'md',
    thickness,
    arc = 240,
    tone = 'accent',
    ranges,
    target,
    color,
    trackColor,
    label,
    formatValue = (n, m) => `${Math.round((n / m) * 100)}%`,
    style,
    'aria-label': ariaLabel,
}: GaugeProps) => {
    const S = typeof size === 'number' ? size : SIZE[size]!
    const t = thickness ?? Math.max(8, Math.round(S / 12))
    const r = S / 2 - t / 2 - 2
    const c = S / 2
    const span = (arc * Math.PI) / 180
    const a0 = -span / 2
    const frac = (v: number) => Math.max(0, Math.min(1, (v - min) / (max - min)))
    const ang = (v: number) => a0 + span * frac(v)
    const pt = (a: number, rad = r) => [c + rad * Math.sin(a), c - rad * Math.cos(a)] as const
    const path = (from: number, to: number) => {
        const [x0, y0] = pt(from)
        const [x1, y1] = pt(to)
        return `M ${x0} ${y0} A ${r} ${r} 0 ${to - from > Math.PI ? 1 : 0} 1 ${x1} ${y1}`
    }
    const inRange = ranges?.find((g) => value >= g.from && value <= g.to)
    const fill = color ?? chartColor(inRange?.tone ?? tone)
    const h = arc === 180 ? S / 2 + t : arc === 240 ? S * 0.86 : S
    return (
        <div data-ds-gauge="" style={{ width: S, ...style }} role="meter" aria-valuenow={value} aria-valuemin={min} aria-valuemax={max} aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}>
            <svg width={S} height={h} viewBox={`0 0 ${S} ${h}`} aria-hidden>
                <path d={path(a0, a0 + span)} fill="none" stroke={trackColor ?? 'var(--ds-color-border-subtle)'} strokeWidth={t} strokeLinecap="round" />
                {ranges?.map((g, i) => (
                    <path key={i} d={path(ang(g.from), ang(g.to))} fill="none" stroke={chartColor(g.tone)} strokeOpacity={0.22} strokeWidth={t} />
                ))}
                {frac(value) > 0 && <path d={path(a0, ang(value))} fill="none" stroke={fill} strokeWidth={t} strokeLinecap="round" />}
                {target !== undefined && (() => {
                    const [x0, y0] = pt(ang(target), r - t / 2 - 3)
                    const [x1, y1] = pt(ang(target), r + t / 2 + 3)
                    return <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="var(--ds-color-foreground-primary)" strokeWidth={2.5} strokeLinecap="round" />
                })()}
            </svg>
            <div data-slot="center" style={{ top: arc === 180 ? S / 2 - S * 0.16 : S / 2 - S * 0.12 }}>
                <b style={{ fontSize: Math.round(S / 6.5) }}>{formatValue(value - min, max - min)}</b>
                {label && <span>{label}</span>}
            </div>
        </div>
    )
}
