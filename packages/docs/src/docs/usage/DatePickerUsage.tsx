import { useState } from 'react'
import { DatePicker, DateRangePicker, type DateRange } from '@ensnif/design-system'

export default function Example() {
    const [due, setDue] = useState<string | null>('2026-11-30')
    const [period, setPeriod] = useState<DateRange>(['2026-11-01', '2026-11-30'])
    return (
        <>
            <DatePicker aria-label="납기일" value={due} onValueChange={setDue} minDate="2026-11-01" clearable />
            <DateRangePicker aria-label="작업 기간" value={period} onValueChange={setPeriod} maxRange={31} />
        </>
    )
}
