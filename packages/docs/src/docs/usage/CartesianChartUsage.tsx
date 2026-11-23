import { CartesianChart } from '@ensnif/design-system'

export default function Example() {
    return (
        <CartesianChart
            labels={['1월', '2월', '3월', '4월', '5월', '6월']}
            data={[
                { qty: 4200, rate: 1.8 },
                { qty: 4550, rate: 1.5 },
                { qty: 4380, rate: 2.1 },
                { qty: 4710, rate: 1.2 },
                { qty: 4900, rate: 1.4 },
                { qty: 5120, rate: 0.9 },
            ]}
            series={[
                { type: 'bar', key: 'qty', label: '생산량' },
                { type: 'line', key: 'rate', label: '불량률', axis: 'right', tone: 'danger' },
            ]}
            axes={{ left: { format: (n) => `${n.toLocaleString()}개` }, right: { format: (n) => `${n}%` } }}
            aria-label="월별 생산량과 불량률"
        />
    )
}
