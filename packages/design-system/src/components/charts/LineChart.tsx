import { CartesianChart } from './CartesianChart.js'
import { refLines, toRows, type SimpleChartCommon } from './chartSeries.js'
import type { ChartPoint } from './chartUtils.js'

export type LineChartProps = SimpleChartCommon & {
    /** 선 아래 채움 */
    fill?: boolean
    /** 곡선으로 */
    smooth?: boolean
    /** 점 표시. 없으면 16개 이하일 때만 */
    showDots?: boolean
    /** 모든 선을 점선으로 (시리즈 dashed 가 우선) */
    dashed?: boolean
    /** @deprecated 선 굵기는 2px 고정 */
    lineWidth?: number
    /** 점 위에 값 글자 */
    showValueOnDot?: boolean
    /** @deprecated axes 로 흡수. 'right' 는 시리즈를 오른쪽 축에, 'none' 은 축 숨김 */
    yAxisPosition?: 'left' | 'right' | 'none'
    /** x축 라벨 표시 */
    showXAxis?: boolean
    /** 계단선 (설비 상태 · 단가처럼 값이 바뀌는 시점이 중요한 경우) */
    step?: boolean | 'before' | 'after'
    /** 빈 값(null)을 건너 이어 그린다 */
    connectNulls?: boolean
    /** @deprecated series 로 통합 */
    compareData?: ChartPoint[]
    /** compareData 선 색 */
    compareColor?: string
    /** compareData 범례 · tooltip 이름 */
    compareLabel?: string
}

/** 선 차트 (추이 · 다중 시리즈 · 계단선) */
export const LineChart = ({
    data,
    labels,
    series,
    height = 240,
    showGrid = true,
    showLabels = true,
    color,
    formatValue,
    interactive = true,
    fill,
    smooth,
    showDots,
    dashed,
    showValueOnDot,
    yAxisPosition = 'left',
    showXAxis = true,
    step,
    connectNulls,
    referenceLines,
    referenceLine,
    compareData,
    compareColor,
    compareLabel = '비교',
    legend,
    tooltip,
    ...rest
}: LineChartProps) => {
    const r = toRows(data, labels, series, '값', color)
    if (compareData?.length && !series?.length) {
        compareData.forEach((p, i) => r.rows[i] && (r.rows[i]!.cmp = p.value))
        r.series.push({ key: 'cmp', label: compareLabel, tone: compareColor ?? 'neutral', dashed: true })
    }
    const axis = yAxisPosition === 'right' ? 'right' : 'left'
    return (
        <CartesianChart
            labels={r.labels}
            data={r.rows}
            series={r.series.map((s) => ({ ...s, type: fill ? 'area' : 'line', smooth, step, showDots, dashed: s.dashed ?? dashed, axis: s.axis ?? axis }))}
            axes={{ [axis]: { format: formatValue, hidden: !showLabels || yAxisPosition === 'none' }, x: { hidden: !showLabels || !showXAxis } }}
            showGrid={showGrid}
            showValues={showValueOnDot}
            connectNulls={connectNulls}
            referenceLines={refLines(referenceLines, referenceLine)}
            legend={legend ?? (r.series.length > 1 ? 'top' : 'none')}
            tooltip={interactive ? (tooltip ?? 'shared') : 'none'}
            height={height}
            {...rest}
        />
    )
}
