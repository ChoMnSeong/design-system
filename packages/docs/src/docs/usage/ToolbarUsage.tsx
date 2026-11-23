import { Button, Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarSpacer } from '@ensnif/design-system'

export default function Example() {
    return (
        <Toolbar aria-label="작업지시 도구" overflow="menu" overflowItems={[{ label: '열 설정' }, { label: '인쇄' }]}>
            <ToolbarGroup aria-label="편집">
                <Button>추가</Button>
                <Button>복사</Button>
                <Button tone="danger">삭제</Button>
            </ToolbarGroup>
            <ToolbarSeparator />
            <Button>엑셀 내보내기</Button>
            <ToolbarSpacer />
            <Button appearance="solid" tone="accent">저장</Button>
        </Toolbar>
    )
}
