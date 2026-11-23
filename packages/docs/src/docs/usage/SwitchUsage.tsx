import { useState } from 'react'
import { Switch } from '@ensnif/design-system'

export default function Example() {
    const [on, setOn] = useState(true)
    return (
        <Switch
            label="설비 알람 받기"
            checked={on}
            onCheckedChange={setOn}
            tone="success"
        />
    )
}
