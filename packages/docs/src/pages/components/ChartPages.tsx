import { useState } from 'react'
import { AreaChart, BarChart, CartesianChart, DonutChart, Gauge, Grid, LineChart, PieChart } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const W = ['W40', 'W41', 'W42', 'W43', 'W44', 'W45', 'W46', 'W47']
const plan = [1200, 1250, 1300, 1300, 1350, 1400, 1400, 1450]
const actual = [1150, 1210, 1180, 1320, 1290, 1380, 1260, 1410]
const yieldPct = [97.2, 96.8, 95.9, 97.5, 96.1, 97.9, 94.6, 98.2]
const full = { width: '100%' } as const

export const LineChartPage = () => (
    <>
        <PageHeader title="LineChart" description="단일 data 또는 labels + series. step · connectNulls · referenceLines · bands · legend · tooltip · onPointClick · loading · empty." />
        <ComponentPreview title="다중 시리즈 · 기준선 · 정상 구간" code={`<LineChart labels={W} series={[{ label: '수율', values: yieldPct }, …]} referenceLines={[{ value: 96, label: '목표' }]} bands={[{ from: 95, to: 100, tone: 'success', label: '정상' }]} />`}>
            <div style={full}>
                <LineChart
                    labels={W}
                    series={[
                        { label: '1라인 수율', values: yieldPct },
                        { label: '2라인 수율', values: [96.1, 96.5, null, 96.9, 97.2, 96.4, 95.8, 97.1], dashed: true },
                    ]}
                    formatValue={(n) => `${n}%`}
                    referenceLines={[{ value: 96, label: '목표 96%' }]}
                    bands={[{ from: 95, to: 100, tone: 'success', label: '정상' }]}
                    annotations={[{ x: 'W46', label: '금형 교체' }]}
                    smooth
                />
            </div>
        </ComponentPreview>
        <ComponentPreview title="step · 단일 data · 빈 상태" code={`<LineChart step data={…} /> <LineChart data={[]} empty="조회된 실적이 없습니다" />`}>
            <Grid columns={2} gap={16} style={full}>
                <LineChart step height={180} data={['06', '08', '10', '12', '14', '16', '18'].map((l, i) => ({ label: `${l}시`, value: [3, 3, 5, 5, 2, 4, 4][i]! }))} formatValue={(n) => `${n}대`} />
                <LineChart height={180} data={[]} empty="조회된 실적이 없습니다" />
            </Grid>
        </ComponentPreview>
    </>
)

export const BarChartPage = () => (
    <>
        <PageHeader title="BarChart" description="orientation · series · barMode(grouped · stacked · overlap) · stackMode(percent) · tone 규칙 · 음수 자동 기준선 · onBarClick." />
        <ComponentPreview title="grouped · 계획 대비 실적" code={`<BarChart labels={W} series={[{ label: '계획', values: plan, tone: 'neutral' }, { label: '실적', values: actual }]} />`}>
            <div style={full}>
                <BarChart labels={W} series={[{ label: '계획', values: plan, color: 'var(--ds-palette-primary-200)' }, { label: '실적', values: actual }]} referenceLines={[{ value: 1300, label: '월 평균' }]} />
            </div>
        </ComponentPreview>
        <ComponentPreview title="stacked percent · 가로 · tone 규칙 · 음수" code={`<BarChart barMode="stacked" stackMode="percent" … /> <BarChart orientation="horizontal" tone={(v) => v < 90 ? 'danger' : undefined} … />`}>
            <Grid columns={3} gap={16} style={full}>
                <BarChart
                    height={220}
                    labels={['1라인', '2라인', '3라인']}
                    barMode="stacked"
                    stackMode="percent"
                    series={[
                        { label: '가동', values: [72, 64, 81], tone: 'success' },
                        { label: '대기', values: [15, 20, 9], tone: 'info' },
                        { label: '정지', values: [13, 16, 10], tone: 'danger' },
                    ]}
                />
                <BarChart height={220} orientation="horizontal" data={[{ label: 'CNC-01', value: 96 }, { label: 'CNC-02', value: 88 }, { label: 'PRESS-03', value: 72 }, { label: 'WELD-01', value: 93 }]} tone={(v) => (v < 90 ? 'danger' : undefined)} formatValue={(n) => `${n}%`} showValueOnBar />
                <BarChart height={220} data={['1월', '2월', '3월', '4월', '5월'].map((l, i) => ({ label: l, value: [12, -8, 5, -14, 9][i]! }))} tone={(v) => (v < 0 ? 'danger' : 'success')} formatValue={(n) => `${n}%`} />
            </Grid>
        </ComponentPreview>
    </>
)

export const AreaChartPage = () => (
    <>
        <PageHeader title="AreaChart" description="stackMode none · normal · percent, referenceLines · bands, tooltip (hover)." />
        <ComponentPreview title="stacked" code={`<AreaChart labels={…} series={…} stackMode="normal" />`}>
            <Grid columns={2} gap={16} style={full}>
                <AreaChart
                    height={220}
                    labels={W}
                    stackMode="normal"
                    series={[
                        { label: '1라인', values: [420, 450, 430, 470, 460, 480, 440, 500] },
                        { label: '2라인', values: [380, 390, 400, 420, 410, 430, 400, 440] },
                        { label: '3라인', values: [350, 370, 350, 430, 420, 470, 420, 470] },
                    ]}
                />
                <AreaChart
                    height={220}
                    labels={W}
                    stackMode="percent"
                    smooth
                    series={[
                        { label: '양품', values: [95, 96, 94, 97, 96, 98, 93, 97], tone: 'success' },
                        { label: '재작업', values: [3, 3, 4, 2, 3, 1, 4, 2], tone: 'warning' },
                        { label: '폐기', values: [2, 1, 2, 1, 1, 1, 3, 1], tone: 'danger' },
                    ]}
                />
            </Grid>
        </ComponentPreview>
    </>
)

export const PiePage = () => {
    const [picked, setPicked] = useState<string>('')
    const DEF = [
        { label: '치수불량', value: 42 },
        { label: '스크래치', value: 28 },
        { label: '변형', value: 14 },
        { label: '이물', value: 9 },
        { label: '도장', value: 4 },
        { label: '기타', value: 3 },
    ]
    return (
        <>
            <PageHeader title="PieChart · DonutChart" description="legend right · bottom, labelType, minSlice(기타로 묶음), onSliceClick, hover 강조, 기본 categorical 색." />
            <ComponentPreview title="Pie · Donut" code={`<PieChart data={…} labelType="percent" minSlice={5} onSliceClick={…} /> <DonutChart data={…} centerValue="100" centerLabel="불량 건수" legend="bottom" />`}>
                <PieChart data={DEF} labelType="percent" minSlice={5} onSliceClick={(d) => setPicked(d.label)} />
                <DonutChart data={DEF} centerValue="100" centerLabel="불량 건수" legend="bottom" size={180} />
                {picked && <span style={{ fontSize: 13 }}>선택: {picked}</span>}
            </ComponentPreview>
        </>
    )
}

export const GaugePage = () => (
    <>
        <PageHeader title="Gauge" description="arc 180 · 240 · 270, size 토큰, ranges(구간 색), target(목표 눈금), tone." />
        <ComponentPreview title="arc · ranges · target" code={`<Gauge value={82.4} target={85} ranges={[{ from: 0, to: 70, tone: 'danger' }, { from: 70, to: 85, tone: 'warning' }, { from: 85, to: 100, tone: 'success' }]} label="OEE" />`}>
            {([180, 240, 270] as const).map((a) => (
                <Gauge
                    key={a}
                    arc={a}
                    value={82.4}
                    target={85}
                    ranges={[
                        { from: 0, to: 70, tone: 'danger' },
                        { from: 70, to: 85, tone: 'warning' },
                        { from: 85, to: 100, tone: 'success' },
                    ]}
                    formatValue={(n) => `${n.toFixed(1)}%`}
                    label={`OEE · arc ${a}`}
                />
            ))}
            <Gauge size="sm" value={96} tone="success" label="가동률" />
        </ComponentPreview>
    </>
)

export const CartesianChartPage = () => (
    <>
        <PageHeader title="CartesianChart" description="막대 · 선 · 영역을 한 차트에. 왼쪽/오른쪽 축, barMode, stackMode, referenceLines, bands, annotations, legend(클릭 숨김), tooltip, brush(긴 기간), onPointClick." />
        <ComponentPreview
            title="주간 생산 계획 대비 실적 · 수율"
            description="막대 = 수량(왼쪽 축) · 선 = 수율(오른쪽 축) · 초록 구간 = 수율 정상 범위"
            code={`<CartesianChart
    labels={W}
    data={W.map((_, i) => ({ plan: plan[i], actual: actual[i], yield: yieldPct[i] }))}
    series={[
        { type: 'bar', key: 'plan', label: '계획', tone: 'var(--ds-palette-primary-200)' },
        { type: 'bar', key: 'actual', label: '실적' },
        { type: 'line', key: 'yield', label: '수율', axis: 'right', tone: 'info' },
    ]}
    axes={{ right: { min: 90, max: 100, format: (n) => \`\${n}%\` } }}
    bands={[{ from: 95, to: 100, axis: 'right', tone: 'success', label: '정상' }]}
/>`}
        >
            <div style={full}>
                <CartesianChart
                    labels={W}
                    data={W.map((_, i) => ({ plan: plan[i]!, actual: actual[i]!, yield: yieldPct[i]!, prev: plan[i]! - 120 }))}
                    series={[
                        { type: 'bar', key: 'plan', label: '계획', tone: 'var(--ds-palette-primary-200)' },
                        { type: 'bar', key: 'actual', label: '실적' },
                        { type: 'line', key: 'yield', label: '수율', axis: 'right', tone: 'info' },
                        { type: 'line', key: 'prev', label: '전년', tone: 'neutral', dashed: true, hidden: true },
                    ]}
                    axes={{ right: { min: 90, max: 100, format: (n) => `${n}%` } }}
                    bands={[{ from: 95, to: 100, axis: 'right', tone: 'success', label: '정상' }]}
                    annotations={[{ x: 'W46', label: '수율 이탈' }]}
                    height={280}
                />
            </div>
        </ComponentPreview>
        <ComponentPreview title="brush · 60일" code={`<CartesianChart brush labels={days} data={…} series={[{ type: 'area', key: 'v' }]} />`}>
            <div style={full}>
                <CartesianChart
                    brush
                    height={200}
                    labels={Array.from({ length: 60 }, (_, i) => `${Math.floor(i / 30) + 10}/${(i % 30) + 1}`)}
                    data={Array.from({ length: 60 }, (_, i) => ({ v: 900 + Math.round(Math.sin(i / 5) * 120 + (i % 7) * 15) }))}
                    series={[{ type: 'area', key: 'v', label: '일 생산량', smooth: true }]}
                    legend="none"
                />
            </div>
        </ComponentPreview>
    </>
)
