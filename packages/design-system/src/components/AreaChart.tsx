import { CartesianChart } from './CartesianChart.js'
import { refLines, toRows, type Series, type SimpleChartCommon } from './chartSeries.js'

export type AreaSeries = Series

export type AreaChartProps = Omit<SimpleChartCommon, 'data'> & {
    labels: string[]
    series: AreaSeries[]
    /** @deprecated legend 를 쓴다 */
    showLegend?: boolean
    /** 채움 투명도는 0.18 고정 (값은 무시) */
    fillOpacity?: number
    smooth?: boolean
    stackMode?: 'none' | 'normal' | 'percent'
}

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
