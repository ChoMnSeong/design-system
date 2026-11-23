import { CartesianChart } from './CartesianChart.js'
import { refLines, toRows, type Series, type SimpleChartCommon } from './chartSeries.js'

export type AreaSeries = Series

export type AreaChartProps = Omit<SimpleChartCommon, 'data'> & {
    /** x축 라벨 */
    labels: string[]
    /** 그릴 시리즈 (값 배열형) */
    series: AreaSeries[]
    /** @deprecated legend 를 쓴다 */
    showLegend?: boolean
    /** 채움 투명도는 0.18 고정 (값은 무시) */
    fillOpacity?: number
    /** 곡선으로 */
    smooth?: boolean
    /** none: 겹치기 · normal: 쌓기 · percent: 100% 비율로 쌓기 */
    stackMode?: 'none' | 'normal' | 'percent'
}

/** 선 아래를 채운 영역 차트 (다중 시리즈 · 쌓기) */
export const AreaChart = ({
    labels,
    series,
    height = 240,
    showGrid = true,
    showLabels = true,
    showLegend,
    smooth,
    formatValue,
    interactive = true,
    stackMode = 'none',
    referenceLines,
    referenceLine,
    legend,
    tooltip,
    ...rest
}: AreaChartProps) => {
    const r = toRows(undefined, labels, series)
    const stacked = stackMode !== 'none'
    return (
        <CartesianChart
            labels={r.labels}
            data={r.rows}
            series={r.series.map((s) => ({ ...s, type: 'area', smooth, stack: stacked ? 'area' : undefined }))}
            stackMode={stackMode === 'percent' ? 'percent' : 'normal'}
            axes={{ left: { format: formatValue, hidden: !showLabels }, x: { hidden: !showLabels } }}
            showGrid={showGrid}
            referenceLines={refLines(referenceLines, referenceLine)}
            legend={legend ?? (showLegend === false ? 'none' : 'top')}
            tooltip={interactive ? (tooltip ?? 'shared') : 'none'}
            height={height}
            {...rest}
        />
    )
}
