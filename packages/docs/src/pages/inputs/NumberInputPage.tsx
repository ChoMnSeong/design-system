import { useState } from 'react'
import { NumberInput } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const NumberInputPage = () => {
    const [qty, setQty] = useState<number | null>(120)
    return (
        <>
            <PageHeader title="NumberInput" description="천 단위 구분, 소수 자릿수, 단위, 스테퍼 위치. ↑↓ 키로도 바꿉니다." />
            <ComponentPreview
                title="stepper"
                code={`<NumberInput value={qty} onValueChange={setQty} />
<NumberInput stepper="right" unit="kg" defaultValue={1250} />
<NumberInput stepper="none" precision={3} defaultValue={0.025} />
<NumberInput stepper="none" allowNegative={false} clampOnBlur={false} defaultValue={-3} />`}
            >
                <NumberInput value={qty} onValueChange={setQty} aria-label="수량" style={{ width: 150 }} />
                <NumberInput stepper="right" unit="kg" defaultValue={1250} aria-label="중량" style={{ width: 150 }} />
                <NumberInput stepper="none" precision={3} defaultValue={0.025} aria-label="공차" style={{ width: 130 }} />
                <NumberInput stepper="none" allowNegative={false} clampOnBlur={false} defaultValue={-3} aria-label="음수 불가" style={{ width: 120 }} />
            </ComponentPreview>
        </>
    )
}
