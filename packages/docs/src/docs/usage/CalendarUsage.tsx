import { useState } from 'react'
import { Calendar } from '@ensnif/design-system'

export default function Example() {
    const [date, setDate] = useState<string | null>('2026-11-20')
    return (
        <Calendar
            value={date}
            onValueChange={setDate}
            holidays={['2026-11-25']}
            markedDates={['2026-11-18', '2026-11-27']}
            showToday
            aria-label="납기일"
        />
    )
}
