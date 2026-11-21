import { useState } from 'react'
import {
    Button,
    ContextMenu,
    IconChevronDown,
    IconClose,
    IconPlus,
    Menu,
    MenuCheckboxItem,
    MenuItem,
    MenuLabel,
    MenuRadioGroup,
    MenuRadioItem,
    MenuSeparator,
    MenuSub,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const MenuPage = () => {
    const [showName, setShowName] = useState(true)
    const [unit, setUnit] = useState('day')
    return (
        <>
            <PageHeader
                title="Menu · ContextMenu"
                description="버튼에 붙는 메뉴와 우클릭 메뉴. ↑↓ Home End 로 이동하고 Esc 로 닫습니다. 하위 메뉴는 → 로 엽니다."
            />
            <ComponentPreview
                title="Menu"
                code={`<Menu trigger={<Button appearance="outline" tone="neutral" size="sm">표시 열</Button>}>
    <MenuLabel>편집</MenuLabel>
    <MenuItem icon={<IconPlus />} shortcut="E">편집</MenuItem>
    <MenuSub label="내보내기">…</MenuSub>
    <MenuSeparator />
    <MenuCheckboxItem checked={showName} onCheckedChange={setShowName}>품목명 표시</MenuCheckboxItem>
    <MenuRadioGroup value={unit} onValueChange={setUnit}>
        <MenuRadioItem value="day">일 단위</MenuRadioItem>
        <MenuRadioItem value="week">주 단위</MenuRadioItem>
    </MenuRadioGroup>
    <MenuSeparator />
    <MenuItem disabled>잠긴 항목</MenuItem>
    <MenuItem tone="danger">삭제</MenuItem>
</Menu>`}
            >
                <Menu
                    trigger={
                        <Button
                            appearance="outline"
                            tone="neutral"
                            size="sm"
                            iconRight={<IconChevronDown size={14} />}
                        >
                            표시 열
                        </Button>
                    }
                    minWidth={240}
                >
                    <MenuLabel>편집</MenuLabel>
                    <MenuItem icon={<IconPlus size={16} />} shortcut="E">
                        편집
                    </MenuItem>
                    <MenuItem shortcut="Ctrl D">복제</MenuItem>
                    <MenuSub label="내보내기">
                        <MenuItem>엑셀</MenuItem>
                        <MenuItem>PDF</MenuItem>
                        <MenuItem>CSV</MenuItem>
                    </MenuSub>
                    <MenuSeparator />
                    <MenuCheckboxItem checked={showName} onCheckedChange={setShowName}>
                        품목명 표시
                    </MenuCheckboxItem>
                    <MenuRadioGroup value={unit} onValueChange={setUnit}>
                        <MenuRadioItem value="day">일 단위</MenuRadioItem>
                        <MenuRadioItem value="week">주 단위</MenuRadioItem>
                    </MenuRadioGroup>
                    <MenuSeparator />
                    <MenuItem disabled>잠긴 항목</MenuItem>
                    <MenuItem tone="danger" icon={<IconClose size={16} />}>
                        삭제
                    </MenuItem>
                </Menu>
            </ComponentPreview>
            <ComponentPreview
                title="ContextMenu"
                description="대상에서 우클릭(키보드는 Shift+F10)하면 포인터 위치에 열립니다."
                code={`<ContextMenu items={[
    { label: '상세 열기' },
    { label: '실적 등록' },
    { label: '작업지시 복사' },
    { type: 'separator' },
    { label: '삭제', tone: 'danger' },
]}>
    <div tabIndex={0}>WO-0047 하우징 커버</div>
</ContextMenu>`}
            >
                <ContextMenu
                    items={[
                        { label: '상세 열기' },
                        { label: '실적 등록' },
                        { label: '작업지시 복사' },
                        { type: 'separator' },
                        { label: '삭제', tone: 'danger' },
                    ]}
                >
                    <div
                        tabIndex={0}
                        style={{
                            display: 'flex',
                            gap: '14px',
                            padding: '10px 12px',
                            width: '100%',
                            fontSize: '13px',
                            border: '1px dashed var(--ds-color-border-default)',
                            borderRadius: 'var(--ds-radius-md)',
                        }}
                    >
                        <b>WO-0047</b>
                        <span>하우징 커버</span>
                        <span style={{ marginLeft: 'auto', color: 'var(--ds-color-foreground-tertiary)' }}>
                            여기서 우클릭
                        </span>
                    </div>
                </ContextMenu>
            </ComponentPreview>
        </>
    )
}
