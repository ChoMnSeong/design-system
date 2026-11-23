import { LineChart } from '@ensnif/design-system'

export default function Example() {
    return (
        <LineChart
            labels={['1주', '2주', '3주', '4주', '5주', '6주']}
            series={[
                { label: '1라인', values: [1180, 1240, 1210, 1320, 1295, 1360] },
                { label: '2라인', values: [980, 1020, 1105, 1080, 1150, 1190] },
            ]}
            referenceLines={[{ value: 1200, label: '목표' }]}
            formatValue={(n) => `${n.toLocaleString()}개`}
            aria-label="라인별 주간 생산량"
        />
    )
}
