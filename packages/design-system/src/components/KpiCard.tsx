import { useEffect, useState, type ReactNode } from 'react'
import { Card, type CardProps } from './Card.js'
import { Sparkline } from './Sparkline.js'
import { StatusIndicator } from './Avatar.js'
import type { Tone } from './types.js'

export type KpiCardProps = Omit<CardProps, 'children'> & {
    label: ReactNode
    value: ReactNode
    /** 값보다 작게 붙는 단위 */
    unit?: ReactNode
    /** 목표. value 가 숫자면 달성률 막대와 목표 마커를 그린다 */
    target?: number
    targetLabel?: (target: number) => ReactNode
    /** 증감. tone 이 없으면 trend 와 부호로 정한다 */
    delta?: { value: ReactNode; tone?: Tone }
    trend?: 'up-good' | 'down-good'
    sparkline?: number[] | { type: 'line' | 'bar'; data: number[] }
    footer?: ReactNode
}

const num = (v: ReactNode) => (typeof v === 'number' ? v : typeof v === 'string' ? parseFloat(v.replace(/,/g, '')) : NaN)

/** 지표 카드: 값 · 단위 · 증감 · 목표 달성률 · 추이 */
export const KpiCard = ({ label, value, unit, target, targetLabel, delta, trend = 'up-good', sparkline, footer, ...card }: KpiCardProps) => {
    const raw = delta ? num(delta.value) : NaN
    const up = Number.isNaN(raw) ? undefined : raw >= 0
    const dTone: Tone = delta?.tone ?? (up === undefined ? 'neutral' : up === (trend === 'up-good') ? 'success' : 'danger')
    const v = num(value)
    const rate = target !== undefined && !Number.isNaN(v) ? (v / target) * 100 : null
    const good = rate === null ? null : trend === 'up-good' ? rate >= 100 : rate <= 100
    const barTone: Tone = rate === null ? 'accent' : good ? 'success' : Math.abs(100 - rate) <= 5 ? 'warning' : 'danger'
    const sp = Array.isArray(sparkline) ? { type: 'line' as const, data: sparkline } : sparkline
    return (
        <Card {...card} data-ds-kpi="">
            <div data-slot="head">
                <span data-slot="label">{label}</span>
                {delta && (
                    <span data-ds-badge="" data-appearance="soft" data-size="sm" data-tone={dTone}>
                        {up === undefined ? null : up ? '▲' : '▼'} {String(delta.value).replace(/^[+-]/, '')}
                    </span>
                )}
            </div>
            <div data-slot="value">
                <b>{value}</b>
                {unit && <span data-slot="unit">{unit}</span>}
            </div>
            {rate !== null && (
                <>
                    <div data-ds-progress="" data-tone={barTone} role="progressbar" aria-label="목표 달성률" aria-valuenow={Math.round(rate)} aria-valuemin={0} aria-valuemax={100}>
                        <div data-slot="bar" data-size="sm">
                            <span data-slot="fill" data-tone={barTone} style={{ width: `${Math.min(100, rate)}%` }} />
                            <span data-slot="target" style={{ left: '100%' }} aria-hidden />
                        </div>
                    </div>
                    <div data-slot="meta">
                        <span>{targetLabel ? targetLabel(target!) : `목표 ${target!.toLocaleString('ko-KR')}`}</span>
                        <b data-tone={barTone}>{rate.toFixed(1)}%</b>
                    </div>
                </>
            )}
            {sp && <Sparkline data={sp.data} type={sp.type} tone={rate === null ? 'accent' : barTone} height={32} />}
            {footer}
        </Card>
    )
}

export type StatusDef = { label: ReactNode; tone: Tone; pulse?: boolean }

export type StatusCardProps = Omit<CardProps, 'children' | 'title'> & {
    title: ReactNode
    status: string
    /** 상태 값 → 라벨 · 톤. 업무마다 다르므로 직접 정한다 */
    statusMap: Record<string, StatusDef>
    /** 2~4개 */
    metrics?: Array<{ label: ReactNode; value: ReactNode; tone?: Tone }>
    /** 마지막 갱신 시각 → '10초 전' */
    updatedAt?: Date | string
    /** 왼쪽 아래 보조 정보 (작업지시 번호 등) */
    caption?: ReactNode
    actions?: ReactNode
}

const ago = (d: Date) => {
    const s = Math.max(0, Math.round((Date.now() - d.getTime()) / 1000))
    if (s < 60) return `${s}초 전`
    if (s < 3600) return `${Math.floor(s / 60)}분 전`
    if (s < 86400) return `${Math.floor(s / 3600)}시간 전`
    return `${Math.floor(s / 86400)}일 전`
}

/** 설비 · 라인 상태 카드. status 의 tone 이 카드 바탕 · 테두리에 번진다 */
export const StatusCard = ({ title, status, statusMap, metrics = [], updatedAt, caption, actions, ...card }: StatusCardProps) => {
    const def = statusMap[status] ?? { label: status, tone: 'neutral' as Tone }
    const [, tick] = useState(0)
    useEffect(() => {
        if (!updatedAt) return
        const t = setInterval(() => tick((n) => n + 1), 10000)
        return () => clearInterval(t)
    }, [updatedAt])
    const at = updatedAt ? (typeof updatedAt === 'string' ? new Date(updatedAt) : updatedAt) : null
    return (
        <Card tone={def.tone} {...card} data-ds-status-card="" data-status-tone={def.tone}>
            <div data-slot="head">
                <h4>{title}</h4>
                <StatusIndicator tone={def.tone} label={def.label} pulse={def.pulse} size="sm" />
            </div>
            {metrics.length > 0 && (
                <div data-slot="metrics" style={{ gridTemplateColumns: `repeat(${metrics.length}, minmax(0, 1fr))` }}>
                    {metrics.map((m, i) => (
                        <span key={i}>
                            <small>{m.label}</small>
                            <b data-tone={m.tone}>{m.value}</b>
                        </span>
                    ))}
                </div>
            )}
            {(caption || at || actions) && (
                <div data-slot="foot">
                    <span>{caption}</span>
                    {at && (
                        <time dateTime={at.toISOString()} title={at.toLocaleString('ko-KR')}>
                            {ago(at)}
                        </time>
                    )}
                    {actions && <span data-slot="actions">{actions}</span>}
                </div>
            )}
        </Card>
    )
}
