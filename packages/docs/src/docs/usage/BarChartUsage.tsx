import { BarChart } from '@ensnif/design-system'

export default function Example() {
    return (
        <BarChart
            data={[
                { label: '프레스 1호', value: 92 },
                { label: '프레스 2호', value: 78 },
                { label: '사출 1호', value: 88 },
                { label: '사출 2호', value: 81 },
                { label: '도장', value: 95 },
            ]}
            tone={(v) => (v < 85 ? 'danger' : undefined)}
            referenceLines={[{ value: 85, label: '목표 85%', tone: 'danger' }]}
            formatValue={(n) => `${n}%`}
            showValueOnBar
            aria-label="설비별 가동률"
        />
    )
}
