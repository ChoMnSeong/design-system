import { useState } from 'react'
import { ComboBox, MultiSelect, Select } from '@ensnif/design-system'

const lines = [
    { value: 'L1', label: '1라인' },
    { value: 'L2', label: '2라인' },
    { value: 'L3', label: '3라인', disabled: true },
]
const items = [
    { value: 'BR-A', label: '브래킷 A형', group: '브래킷' },
    { value: 'BR-B', label: '브래킷 B형', group: '브래킷' },
    { value: 'HG-01', label: '힌지 01', group: '힌지' },
]

export default function Example() {
    const [line, setLine] = useState<string | null>('L1')
    const [picked, setPicked] = useState<string[]>([])
    return (
        <>
            <Select aria-label="라인" options={lines} value={line} onValueChange={setLine} />
            <ComboBox aria-label="품목" options={items} clearable />
            <MultiSelect aria-label="품목 여러 개" options={items} value={picked} onValueChange={setPicked} maxTagCount={2} />
        </>
    )
}
