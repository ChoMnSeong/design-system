import { Stat } from '@ensnif/design-system'

export default function Example() {
    return (
        <Stat
            appearance="card"
            label="오늘 생산량"
            value="11,420"
            helper="EA · 1라인"
            delta={{ value: '+4.2%' }}
            target={12000}
            sparkline={[9800, 10400, 10100, 11000, 11420]}
        />
    )
}
