import { useState } from 'react'
import { Slider } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const SliderPage = () => {
    const [v, setV] = useState(62)
    const [r, setR] = useState<[number, number]>([20, 70])
    return (
        <>
            <PageHeader title="Slider" description="값 하나 또는 [시작, 끝] 범위. marks · showTooltip · orientation · tone." />
            <ComponentPreview title="기본 · always tooltip" code={`<Slider value={v} onValueChange={setV} showTooltip="always" formatValue={(n) => \`\${n}%\`} />`}>
                <div style={{ width: '100%', paddingTop: 28 }}>
                    <Slider value={v} onValueChange={setV} showTooltip="always" formatValue={(n) => `${n}%`} aria-label="가동률 목표" />
                </div>
            </ComponentPreview>
            <ComponentPreview title="범위 · marks" code={`<Slider value={r} onValueChange={setR} marks={[0,25,50,75,100].map((n) => ({ value: n, label: n }))} />`}>
                <div style={{ width: '100%', paddingTop: 28 }}>
                    <Slider value={r} onValueChange={setR} marks={[0, 25, 50, 75, 100].map((n) => ({ value: n, label: n }))} aria-label="온도 범위" />
                </div>
            </ComponentPreview>
            <ComponentPreview title="vertical · tone" code={`<Slider orientation="vertical" tone="success" defaultValue={40} />`}>
                <Slider orientation="vertical" tone="success" defaultValue={40} aria-label="볼륨" />
                <Slider orientation="vertical" tone="danger" defaultValue={80} aria-label="경고 임계" />
            </ComponentPreview>
        </>
    )
}
