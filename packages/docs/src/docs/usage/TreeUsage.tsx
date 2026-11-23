import { useState } from 'react'
import { Tree, type TreeNode } from '@ensnif/design-system'

const plant: TreeNode[] = [
    { id: 'p1', label: '1공장', children: [
        { id: 'l1', label: '1라인', badge: 4, children: [
            { id: 'm1', label: '프레스 #1' },
            { id: 'm2', label: '프레스 #2' },
        ] },
        { id: 'l2', label: '2라인', badge: 2 },
    ] },
    { id: 'p2', label: '2공장', children: [{ id: 'l3', label: '도장 라인' }] },
]

export default function Example() {
    const [selected, setSelected] = useState<string[]>(['m1'])
    return <Tree data={plant} defaultExpanded={['p1', 'l1']} selected={selected} onSelectedChange={setSelected} searchable aria-label="공장 설비" />
}
