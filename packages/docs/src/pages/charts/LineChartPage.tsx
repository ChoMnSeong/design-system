import { Grid, LineChart } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { W, yieldPct } from '../shared/chartData'
import { full } from '../shared/demoStyles'

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
