import type { ReactNode } from 'react'
import type { Tone } from './types.js'
import type { Band, CartesianChartProps, ChartSeries, ReferenceLine } from './CartesianChart.js'
import type { ChartPoint } from './chartUtils.js'

/** Line · Bar · Area 공용 다중 시리즈 (값 배열형) */
export type Series = {
    label: string
    values: Array<number | null>
    tone?: Tone
    /** 직접 색 (tone 보다 우선) */
    color?: string
    dashed?: boolean
    axis?: 'left' | 'right'
    stack?: string
    type?: 'bar' | 'line' | 'area'
}

export type SimpleChartCommon = {
    /** 단일 시리즈 단축형 */
    data?: ChartPoint[]
    labels?: string[]
    series?: Series[]
    height?: number
    showGrid?: boolean
    /** 축 눈금 글자 */
    showLabels?: boolean
    color?: string
    formatValue?: (n: number) => string
    /** false 면 tooltip 을 끈다 */
    interactive?: boolean
    referenceLines?: ReferenceLine[]
    /** @deprecated referenceLines 를 쓴다 */
    referenceLine?: { value: number; label?: string; color?: string }
    bands?: Band[]
    legend?: 'top' | 'bottom' | 'none'
    tooltip?: 'shared' | 'single' | 'none'
    loading?: boolean
    empty?: ReactNode
    onPointClick?: (series: ChartSeries, index: number) => void
    'aria-label'?: string
} & Pick<CartesianChartProps, 'className' | 'style' | 'ref' | 'brush' | 'annotations' | 'density'>

/** data | labels+series → CartesianChart 의 labels · rows · series */
export const toRows = (data: ChartPoint[] | undefined, labels: string[] | undefined, series: Series[] | undefined, fallbackLabel = '값', color?: string) => {
    if (series?.length) {
        const ls = labels ?? series[0]!.values.map((_, i) => String(i + 1))
        const rows: Array<Record<string, number | null>> = ls.map((_, i) => Object.fromEntries(series.map((s, k) => [`s${k}`, s.values[i] ?? null])))
        const out: ChartSeries[] = series.map((s, k) => ({ key: `s${k}`, label: s.label, tone: s.color ?? s.tone, dashed: s.dashed, axis: s.axis, stack: s.stack, type: s.type }))
        return { labels: ls, rows, series: out }
    }
    const d = data ?? []
    const rows: Array<Record<string, number | null>> = d.map((p) => ({ s0: p.value }))
    return { labels: d.map((p) => p.label), rows, series: [{ key: 's0', label: fallbackLabel, tone: color }] as ChartSeries[] }
}

export const refLines = (refs?: ReferenceLine[], legacy?: { value: number; label?: string; color?: string }) =>
    [...(refs ?? []), ...(legacy ? [{ value: legacy.value, label: legacy.label, tone: legacy.color }] : [])]
