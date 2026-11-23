import { DonutChart } from '@ensnif/design-system'

export default function Example() {
    return (
        <DonutChart
            data={[
                { label: '가동', value: 412, tone: 'success' },
                { label: '대기', value: 58, tone: 'warning' },
                { label: '정지', value: 24, tone: 'danger' },
                { label: '계획 보전', value: 26, tone: 'neutral' },
            ]}
            centerValue="79.2%"
            centerLabel="가동률"
            aria-label="설비 상태 비율: 가동 79.2%, 대기 11.2%, 정지 4.6%, 계획 보전 5.0%"
        />
    )
}
