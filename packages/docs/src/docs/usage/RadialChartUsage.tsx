import { RadialChart } from '@ensnif/design-system'

export default function Example() {
    return (
        <RadialChart
            data={[
                { label: '도장', value: 64 },
                { label: '용접', value: 78 },
                { label: '프레스', value: 91 },
            ]}
            max={100}
            centerValue="78%"
            centerLabel="평균 달성률"
            formatValue={(n) => `${n}%`}
            showLegend
        />
    )
}
