import { useState } from 'react'
import { Button, CommandPalette } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const CMD_ITEMS = [
    { id: 'wo', label: '작업지시 등록', group: '생산', shortcut: 'Ctrl N', onSelect: () => {} },
    { id: 'perf', label: '실적 등록', group: '생산', onSelect: () => {} },
    { id: 'insp', label: '수입검사 결과 입력', group: '품질', onSelect: () => {} },
    { id: 'eq', label: '설비 가동 현황', group: '설비', description: 'PRESS · WELD · CNC', onSelect: () => {} },
    { id: 'close', label: '월 마감', group: '관리', disabled: true, description: '마감 권한 필요', onSelect: () => {} },
]

export const CommandPalettePage = () => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <PageHeader title="CommandPalette" description="hotkey(기본 mod+k) · loadItems · recent · footer · filter(점수) · size. 항목 disabled." />
            <ComponentPreview title="기본" code={`<CommandPalette open={open} onOpenChange={setOpen} items={items} recent loadItems={searchWo} />`}>
                <Button appearance="outline" tone="neutral" shortcut="Ctrl K" onClick={() => setOpen(true)}>명령 팔레트</Button>
                <CommandPalette
                    open={open}
                    onOpenChange={setOpen}
                    items={CMD_ITEMS}
                    recent="docs-cmd-recent"
                    loadItems={(q) => new Promise((r) => setTimeout(() => r(q ? [{ id: `wo-${q}`, label: `WO-2611-${q.padStart(4, '0')} 열기`, group: '작업지시 검색', onSelect: () => {} }] : []), 300))}
                />
            </ComponentPreview>
        </>
    )
}
