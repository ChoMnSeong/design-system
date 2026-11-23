import { Stat } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const StatPage = () => (
    <>
        <PageHeader title="Stat" description="appearance plain · card, delta(trend 로 좋고 나쁨), target 달성률, sparkline, loading." />
        <ComponentPreview title="기본" code={`<Stat label="생산량" value="12,480" delta={{ value: '+4.2%' }} />
<Stat label="가동률" value="96.0%" target={95} sparkline={[…]} />
<Stat label="불량률" value="1.8%" trend="down-good" delta={{ value: '+0.3%p' }} />`}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, width: '100%' }}>
                <Stat appearance="card" label="생산량" value="12,480" delta={{ value: '+4.2%' }} helper="전일 대비" />
                <Stat appearance="card" label="가동률" value="96.0" target={95} sparkline={[88, 91, 90, 94, 93, 95, 96]} />
                <Stat appearance="card" label="불량률" value="1.8%" trend="down-good" delta={{ value: '+0.3%p' }} />
                <Stat appearance="card" label="설비 OEE" value="" loading />
            </div>
        </ComponentPreview>
    </>
)
