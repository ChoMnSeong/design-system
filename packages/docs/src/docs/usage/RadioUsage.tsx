import { useState } from 'react'
import { Radio, RadioGroup } from '@ensnif/design-system'

export default function Example() {
    const [method, setMethod] = useState('normal')
    return (
        <RadioGroup aria-label="배송 방법" value={method} onValueChange={setMethod}>
            <Radio value="normal" label="일반 배송" description="2~3일 소요" />
            <Radio value="fast" label="빠른 배송" description="내일 도착 · 3,000원" />
            <Radio value="pickup" label="매장 픽업" disabled />
        </RadioGroup>
    )
}
