import { Button, ContextMenu, Menu, MenuCheckboxItem, MenuItem, MenuSeparator, MenuSub } from '@ensnif/design-system'

export default function Example() {
    return (
        <div style={{ display: 'flex', gap: 12 }}>
            <Menu trigger={<Button appearance="outline" tone="neutral">작업</Button>} aria-label="작업지시 작업">
                <MenuItem shortcut="⌘D">복제</MenuItem>
                <MenuSub label="라인 이동">
                    <MenuItem>1라인</MenuItem>
                    <MenuItem>2라인</MenuItem>
                </MenuSub>
                <MenuCheckboxItem defaultChecked>긴급 표시</MenuCheckboxItem>
                <MenuSeparator />
                <MenuItem tone="danger">삭제</MenuItem>
            </Menu>
            <ContextMenu items={[{ label: '상세 보기', onSelect: () => {} }, { type: 'separator' }, { label: '삭제', tone: 'danger', onSelect: () => {} }]}>
                <div tabIndex={0} style={{ padding: 12, border: '1px dashed' }}>WO-2411-001 (오른쪽 클릭)</div>
            </ContextMenu>
        </div>
    )
}
