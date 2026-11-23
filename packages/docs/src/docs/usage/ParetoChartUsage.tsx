import { ParetoChart } from '@ensnif/design-system'

export default function Example() {
    return (
        <ParetoChart
            data={[
                { label: '스크래치', value: 48 },
                { label: '치수 불량', value: 31 },
                { label: '버(Burr)', value: 22 },
                { label: '도장 얼룩', value: 9 },
                { label: '찍힘', value: 6 },
                { label: '기타', value: 4 },
            ]}
            vitalFew={0.8}
            formatValue={(n) => `${n}건`}
            aria-label="불량 유형별 건수와 누적 비율"
        />
    )
}
