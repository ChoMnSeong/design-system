import { ControlChart, ParetoChart } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { full } from '../shared/demoStyles'

const MEAS = [10.02, 9.98, 10.05, 10.01, 9.97, 10.03, 10.0, 10.06, 10.08, 10.07, 10.09, 10.1, 10.11, 10.34, 10.04, 9.99, 10.02, 10.0]

export const ParetoPage = () => (
    <>
        <PageHeader title="ParetoChart · ControlChart" description="파레토: 정렬 + 누적 비율 + vitalFew 강조. 관리도: CL·UCL·LCL 자동 계산(I-MR), USL·LSL, Western Electric · Nelson 규칙, σ 구간 음영." />
        <ComponentPreview title="ParetoChart" code={`<ParetoChart data={[{ label: '치수불량', value: 42 }, …]} vitalFew={0.8} />`}>
            <div style={full}>
                <ParetoChart data={[{ label: '치수불량', value: 42 }, { label: '스크래치', value: 28 }, { label: '변형', value: 14 }, { label: '이물', value: 9 }, { label: '도장', value: 4 }, { label: '포장', value: 3 }]} formatValue={(n) => `${n}건`} />
            </div>
        </ComponentPreview>
        <ComponentPreview title="ControlChart" code={`<ControlChart data={measurements} usl={10.3} lsl={9.7} rules="western-electric" />`}>
            <div style={full}>
                <ControlChart data={MEAS.map((y, i) => ({ x: `L${118 + i}`, y }))} usl={10.3} lsl={9.7} rules="western-electric" />
            </div>
        </ComponentPreview>
    </>
)
