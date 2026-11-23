import { AreaChart } from '@ensnif/design-system'

export default function Example() {
    return (
        <AreaChart
            labels={['06시', '08시', '10시', '12시', '14시', '16시', '18시']}
            series={[
                { label: '양품', values: [320, 410, 455, 380, 470, 490, 430], tone: 'success' },
                { label: '재작업', values: [18, 22, 30, 25, 19, 16, 21], tone: 'warning' },
                { label: '불량', values: [6, 9, 12, 8, 7, 5, 9], tone: 'danger' },
            ]}
            stackMode="normal"
            smooth
            aria-label="시간대별 생산 수량"
        />
    )
}
