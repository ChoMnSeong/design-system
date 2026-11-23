import { Gauge } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

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
