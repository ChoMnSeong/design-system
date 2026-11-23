import { useState } from 'react'
import { Tag } from '@ensnif/design-system'

const LINES = ['1라인', '2라인', '3라인']

export default function Example() {
    const [picked, setPicked] = useState<string[]>(['1라인'])
    const toggle = (l: string) => setPicked((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]))
    return (
        <div style={{ display: 'flex', gap: 8 }}>
            {LINES.map((l) => (
                <Tag key={l} selected={picked.includes(l)} onClick={() => toggle(l)}>
                    {l}
                </Tag>
            ))}
            <Tag tone="accent" onClose={() => {}}>긴급</Tag>
        </div>
    )
}
