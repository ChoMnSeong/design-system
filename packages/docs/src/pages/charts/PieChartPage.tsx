import { useState } from 'react'
import { DonutChart, PieChart } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const PiePage = () => {
    const [picked, setPicked] = useState<string>('')
    const DEF = [
        { label: '치수불량', value: 42 },
        { label: '스크래치', value: 28 },
        { label: '변형', value: 14 },
        { label: '이물', value: 9 },
        { label: '도장', value: 4 },
        { label: '기타', value: 3 },
    ]
    return (
        <>
            <PageHeader title="PieChart · DonutChart" description="legend right · bottom, labelType, minSlice(기타로 묶음), onSliceClick, hover 강조, 기본 categorical 색." />
            <ComponentPreview title="Pie · Donut" code={`<PieChart data={…} labelType="percent" minSlice={5} onSliceClick={…} /> <DonutChart data={…} centerValue="100" centerLabel="불량 건수" legend="bottom" />`}>
                <PieChart data={DEF} labelType="percent" minSlice={5} onSliceClick={(d) => setPicked(d.label)} />
                <DonutChart data={DEF} centerValue="100" centerLabel="불량 건수" legend="bottom" size={180} />
                {picked && <span style={{ fontSize: 13 }}>선택: {picked}</span>}
            </ComponentPreview>
        </>
    )
}
