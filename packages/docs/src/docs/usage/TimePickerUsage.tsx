import { useState } from 'react'
import { TimePicker } from '@ensnif/design-system'

export default function Example() {
    const [shift, setShift] = useState<[string | null, string | null]>(['08:30', '17:30'])
    return (
        <TimePicker
            aria-label="근무 시간"
            range
            value={shift}
            onValueChange={setShift}
            minuteStep={10}
            clearable
        />
    )
}
