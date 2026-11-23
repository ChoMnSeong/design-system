import { useState } from 'react'
import { ColorPicker } from '@ensnif/design-system'

export default function Example() {
    const [color, setColor] = useState('#3b82f6')
    return (
        <ColorPicker
            value={color}
            onValueChange={setColor}
            swatches={['#ef4444', '#f97316', '#22c55e', '#3b82f6', '#71717a']}
        />
    )
}
