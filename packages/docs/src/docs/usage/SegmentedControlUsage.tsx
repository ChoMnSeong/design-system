import { useState } from 'react'
import { SegmentedControl } from '@ensnif/design-system'

export default function Example() {
    const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week')
    return (
        <SegmentedControl
            aria-label="집계 기간"
            value={period}
            onValueChange={setPeriod}
            options={[
                { value: 'day', label: '일' },
                { value: 'week', label: '주' },
                { value: 'month', label: '월' },
            ]}
        />
    )
}
