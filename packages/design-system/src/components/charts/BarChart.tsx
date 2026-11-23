import { CartesianChart, type CartesianChartProps } from './CartesianChart.js'
import { refLines, toRows, type SimpleChartCommon } from './chartSeries.js'
import type { Tone } from '../types.js'

export type BarChartProps = SimpleChartCommon & {
    rounded?: boolean
    orientation?: 'vertical' | 'horizontal'
    /** @deprecated orientation="horizontal" */
    horizontal?: boolean
    showValueOnBar?: boolean
    /** @deprecated tone 으로 일반화: (value) => Tone */
    colorByValue?: boolean
    /** 값에 따라 막대 톤 (목표 미달 = danger 등) */
    tone?: (value: number, index: number) => Tone | string | undefined
    /** 막대 사이 간격 비율 0~0.8 (기존 px 값은 무시) */
    barGap?: number
    minBarHeight?: number
    barMode?: CartesianChartProps['barMode']
    stackMode?: CartesianChartProps['stackMode']
    onBarClick?: CartesianChartProps['onPointClick']
}

export const BarChart = ({
    data,
    labels,
    series,
    height = 240,
    showGrid = true,
    showLabels = true,
    color,
    formatValue,
    interactive = true,
    rounded = true,
    orientation,
    horizontal,
    showValueOnBar,
    colorByValue,
    tone,
    barGap,
    minBarHeight,
    barMode,
    stackMode,
    referenceLines,
    referenceLine,
    legend,
    tooltip,
    onBarClick,
    onPointClick,
    ...rest
}: BarChartProps) => {
    const r = toRows(data, labels, series, '값', color)
    const max = Math.max(...r.rows.map((x) => Number(x.s0 ?? 0)))
    const byValue = colorByValue ? (v: number) => (v >= max * 0.75 ? 'var(--ds-palette-primary-600)' : v >= max * 0.5 ? 'var(--ds-palette-primary-500)' : 'var(--ds-palette-primary-300)') : undefined
    return (
        <CartesianChart
            labels={r.labels}
            data={r.rows}
            series={r.series.map((s) => ({ ...s, type: s.type ?? 'bar' }))}
            orientation={orientation ?? (horizontal ? 'horizontal' : 'vertical')}
            barMode={barMode}
            stackMode={stackMode}
            axes={{ left: { format: formatValue, hidden: !showLabels }, x: { hidden: !showLabels } }}
            showGrid={showGrid}
            showValues={showValueOnBar}
            rounded={rounded}
            barGap={barGap !== undefined && barGap <= 0.8 ? barGap : undefined}
            minBarHeight={minBarHeight}
            barTone={tone ? (v, _k, i) => tone(v, i) : byValue}
            referenceLines={refLines(referenceLines, referenceLine)}
            legend={legend ?? (r.series.length > 1 ? 'top' : 'none')}
            tooltip={interactive ? (tooltip ?? (r.series.length > 1 ? 'shared' : 'single')) : 'none'}
            onPointClick={onBarClick ?? onPointClick}
            height={height}
            {...rest}
        />
    )
}
