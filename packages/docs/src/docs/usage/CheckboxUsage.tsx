import { useState } from 'react'
import { Checkbox, CheckboxGroup } from '@ensnif/design-system'

export default function Example() {
    const [shifts, setShifts] = useState<string[]>(['day'])
    return (
        <>
            <Checkbox label="불량 건만 보기" description="판정이 NG 인 LOT 만" />
            <CheckboxGroup
                aria-label="근무조"
                selectAll
                value={shifts}
                onValueChange={setShifts}
                options={[
                    { value: 'day', label: '주간' },
                    { value: 'night', label: '야간' },
                    { value: 'weekend', label: '주말 특근' },
                ]}
            />
        </>
    )
}
