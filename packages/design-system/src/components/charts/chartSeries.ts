import type { ReactNode } from 'react'
import type { Tone } from '../types.js'
import type { Band, CartesianChartProps, ChartSeries, ReferenceLine } from './CartesianChart.js'
import type { ChartPoint } from './chartUtils.js'

/** Line · Bar · Area 공용 다중 시리즈 (값 배열형) */
export type Series = {
    /** 범례 · tooltip 에 보일 이름 */
    label: string
    /** labels 순서의 값. null 이면 빈칸 */
    values: Array<number | null>
    /** 시리즈 색 톤 */
    tone?: Tone
    /** 직접 색 (tone 보다 우선) */
    color?: string
    /** 점선으로 (선 · 영역) */
    dashed?: boolean
    /** 값을 읽을 세로축 (right: 오른쪽 보조축) */
    axis?: 'left' | 'right'
    /** 같은 stack 이름끼리 쌓는다 */
    stack?: string
    /** 시리즈 모양 (BarChart 에서 막대 · 선 섞기) */
    type?: 'bar' | 'line' | 'area'
}

export type SimpleChartCommon = {
    /** 단일 시리즈 단축형 */
    data?: ChartPoint[]
    /** x축 라벨 (series 와 함께) */
    labels?: string[]
    /** 다중 시리즈. 있으면 data 대신 쓴다 */
    series?: Series[]
    /** 그림 영역 높이 (px). 'fill' 이면 부모 높이를 채운다 */
    height?: number | 'fill'
    /** 값 축 격자선 */
    showGrid?: boolean
    /** 축 눈금 글자 */
    showLabels?: boolean
    /** 단일 시리즈(data) 색 */
    color?: string
    /** 값 축 눈금 · tooltip · 값 글자 형식 */
    formatValue?: (n: number) => string
    /** false 면 tooltip 을 끈다 */
    interactive?: boolean
    /** 기준선 (목표 · 한계값) */
    referenceLines?: ReferenceLine[]
    /** @deprecated referenceLines 를 쓴다 */
    referenceLine?: { value: number; label?: string; color?: string }
    /** 값 구간 음영 (허용 범위 등) */
    bands?: Band[]
    /** 범례 위치 (none: 숨김) */
    legend?: 'top' | 'bottom' | 'none'
    /** shared: 열의 모든 시리즈 · single: 올린 시리즈만 */
    tooltip?: 'shared' | 'single' | 'none'
    /** 스켈레톤 표시 */
    loading?: boolean
    /** 데이터가 없을 때 보일 내용 */
    empty?: ReactNode
    /** 막대 · 점을 눌렀을 때 (시리즈, 인덱스) */
    onPointClick?: (series: ChartSeries, index: number) => void
    /** 차트 svg 의 접근성 이름 */
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
