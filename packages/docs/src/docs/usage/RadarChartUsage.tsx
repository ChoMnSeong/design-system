import { RadarChart } from '@ensnif/design-system'

export default function Example() {
    return (
        <RadarChart
            axes={['품질', '납기', '원가', '안전', '설비']}
            series={[
                { label: '1공장', values: [92, 85, 78, 96, 88] },
                { label: '2공장', values: [84, 91, 82, 90, 79] },
            ]}
            max={100}
            legend="bottom"
            size={280}
        />
    )
}
