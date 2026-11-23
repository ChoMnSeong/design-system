import { OptionPicker, QuantityInput } from '@ensnif/design-system'
import { useState } from 'react'

export default function Example() {
    const [size, setSize] = useState<string>()
    const [qty, setQty] = useState(1)
    return (
        <div style={{ display: 'grid', gap: 16 }}>
            <OptionPicker
                label="사이즈"
                options={[
                    { value: 'S', label: 'S', stock: 12 },
                    { value: 'M', label: 'M', stock: 2 },
                    { value: 'L', label: 'L', stock: 0 },
                    { value: 'XL', label: 'XL', stock: 7 },
                ]}
                value={size}
                onChange={setSize}
            />
            <QuantityInput value={qty} onChange={setQty} max={12} />
        </div>
    )
}
