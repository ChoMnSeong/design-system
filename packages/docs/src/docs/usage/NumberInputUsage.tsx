import { useState } from 'react'
import { NumberInput } from '@ensnif/design-system'

export default function Example() {
    const [qty, setQty] = useState<number | null>(1200)
    return (
        <NumberInput
            aria-label="투입 수량"
            value={qty}
            onValueChange={setQty}
            min={0}
            max={5000}
            step={10}
            unit="EA"
        />
    )
}
