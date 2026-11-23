import { Gauge } from '@ensnif/design-system'

export default function Example() {
    return (
        <Gauge
            value={78}
            target={85}
            ranges={[
                { from: 0, to: 60, tone: 'danger' },
                { from: 60, to: 85, tone: 'warning' },
                { from: 85, to: 100, tone: 'success' },
            ]}
            label="2라인 가동률"
        />
    )
}
