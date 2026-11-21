import { useState } from 'react'
import { SegmentedControl, Slider } from '@ensnif/design-system'
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

export const SegmentedControlPage = () => (
    <>
        <PageHeader title="SegmentedControl" description="보기·기간처럼 짧고 배타적인 선택. ←→ 키로 옮깁니다." />
        <ComponentPreview title="기본 · size" code={`<SegmentedControl options={[{ value: 'd', label: '일' }, …]} />`}>
            <SegmentedControl
                aria-label="기간"
                options={[
                    { value: 'd', label: '일' },
                    { value: 'w', label: '주' },
                    { value: 'm', label: '월' },
                    { value: 'q', label: '분기' },
                ]}
            />
            <SegmentedControl
                size="sm"
                aria-label="조"
                defaultValue="night"
                options={[
                    { value: 'day', label: '주간' },
                    { value: 'night', label: '야간' },
                ]}
            />
        </ComponentPreview>
    </>
)
