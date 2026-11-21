import type { HTMLAttributes, ReactNode, Ref } from 'react'
import type { BorderVariant } from './borderVariant.js'
import type { Tone } from './types.js'

export type StatProps = {
    label: ReactNode
    value: ReactNode
    helper?: ReactNode
    /** 증감. tone 이 없으면 trend 와 숫자 부호로 정한다 */
    delta?: { value: ReactNode; tone?: Tone; direction?: 'up' | 'down' }
    icon?: ReactNode
    /** plain: 테두리 없음 · card: 카드 표면 */
    appearance?: 'plain' | 'card'
    /** @deprecated appearance="card" */
    variant?: BorderVariant
    size?: 'sm' | 'md' | 'lg'
    /** 목표. value 가 숫자면 달성률 막대를 그린다 */
    target?: number
    sparkline?: number[]
    /** up-good: 오를수록 좋음(생산량) · down-good: 내릴수록 좋음(불량률) */
    trend?: 'up-good' | 'down-good'
    loading?: boolean
    ref?: Ref<HTMLDivElement>
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

const Spark = ({ data }: { data: number[] }) => {
    if (data.length < 2) return null
    const w = 120
    const h = 28
    const lo = Math.min(...data)
    const hi = Math.max(...data)
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - 2 - ((v - lo) / (hi - lo || 1)) * (h - 4)}`)
    return (
        <svg data-slot="spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden preserveAspectRatio="none">
            <polyline points={pts.join(' ')} fill="none" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={w} cy={pts[pts.length - 1]!.split(',')[1]} r={2.5} />
        </svg>
    )
}

export const Stat = ({
    label,
    value,
    helper,
    delta,
    icon,
    appearance,
    variant,
    size = 'md',
    target,
    sparkline,
    trend = 'up-good',
    loading,
    ref,
    ...rest
}: StatProps) => {
    const app = appearance ?? (variant ? 'card' : 'plain')
    const raw = delta && typeof delta.value === 'string' ? parseFloat(delta.value) : typeof delta?.value === 'number' ? delta.value : NaN
    const dir = delta?.direction ?? (Number.isNaN(raw) ? undefined : raw >= 0 ? 'up' : 'down')
    const deltaTone: Tone =
        delta?.tone ?? (dir ? ((dir === 'up') === (trend === 'up-good') ? 'success' : 'danger') : 'neutral')
    const num = typeof value === 'number' ? value : typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : NaN
    const rate = target && !Number.isNaN(num) ? (num / target) * 100 : null
    return (
        <div ref={ref} data-ds-stat="" data-appearance={app} data-size={size} aria-busy={loading || undefined} {...rest}>
            <div data-slot="head">
                <span data-slot="label">{label}</span>
                {icon && <span data-slot="icon" aria-hidden>{icon}</span>}
            </div>
            {loading ? (
                <>
                    <span data-ds-skeleton="" style={{ width: '70%', height: size === 'lg' ? 34 : 26 }} />
                    <span data-ds-skeleton="" style={{ width: '40%', height: 14 }} />
                </>
            ) : (
                <>
                    <div data-slot="value">{value}</div>
                    {(delta || helper) && (
                        <div data-slot="foot">
                            {delta && (
                                <span data-ds-badge="" data-appearance="soft" data-size="sm" data-tone={deltaTone}>
                                    {dir === 'up' ? '▲' : dir === 'down' ? '▼' : null} {delta.value}
                                </span>
                            )}
                            {helper && <span data-slot="helper">{helper}</span>}
                        </div>
                    )}
                    {rate !== null && (
                        <div data-slot="target">
                            <div data-ds-progress="" data-tone={rate >= 100 ? 'success' : rate >= 90 ? 'warning' : 'danger'} role="progressbar" aria-label="목표 달성률" aria-valuenow={Math.round(rate)} aria-valuemin={0} aria-valuemax={100}>
                                <div data-slot="bar" data-size="sm">
                                    <span data-slot="fill" style={{ width: `${Math.min(100, rate)}%` }} />
                                </div>
                            </div>
                            <span>달성 {rate.toFixed(1)}%</span>
                        </div>
                    )}
                    {sparkline && <Spark data={sparkline} />}
                </>
            )}
        </div>
    )
}
