import { useState } from 'react'
import { Slider } from '@ensnif/design-system'

export default function Example() {
    const [price, setPrice] = useState<[number, number]>([10000, 50000])
    return (
        <Slider
            aria-label="가격"
            value={price}
            onValueChange={setPrice}
            min={0}
            max={100000}
            step={1000}
            formatValue={(n) => `${n.toLocaleString()}원`}
            marks={[{ value: 0, label: '0' }, { value: 100000, label: '10만' }]}
        />
    )
}
