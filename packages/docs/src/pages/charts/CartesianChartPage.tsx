import { CartesianChart } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { W, plan, actual, yieldPct } from '../shared/chartData'
import { full } from '../shared/demoStyles'

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
