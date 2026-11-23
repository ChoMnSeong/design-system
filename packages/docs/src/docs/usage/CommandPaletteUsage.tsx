import { useState } from 'react'
import { Button, CommandPalette, type CommandItem } from '@ensnif/design-system'

export default function Example() {
    const [open, setOpen] = useState(false)
    const items: CommandItem[] = [
        { id: 'wo-new', label: '작업지시 등록', group: '작업', shortcut: 'Ctrl N', onSelect: () => {} },
        { id: 'wo-list', label: '작업지시 목록', group: '이동', keywords: ['WO'], onSelect: () => {} },
        { id: 'line', label: '라인 현황', group: '이동', description: '1~3라인 가동 상태', onSelect: () => {} },
    ]
    return (
        <>
            <Button appearance="outline" tone="neutral" onClick={() => setOpen(true)}>명령 검색 (Ctrl K)</Button>
            <CommandPalette open={open} onOpenChange={setOpen} items={items} recent />
        </>
    )
}
