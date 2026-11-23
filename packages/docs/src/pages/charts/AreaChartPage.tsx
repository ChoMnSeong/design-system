import { AreaChart, Grid } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { W } from '../shared/chartData'
import { full } from '../shared/demoStyles'

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
