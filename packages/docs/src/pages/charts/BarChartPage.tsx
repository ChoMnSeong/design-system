import { BarChart, Grid } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { W, plan, actual } from '../shared/chartData'
import { full } from '../shared/demoStyles'

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
