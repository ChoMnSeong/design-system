import { Button, IconMoreHorizontal, Toggle, Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarSpacer } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const ToolbarPage = () => (
    <>
        <PageHeader
            title="Toolbar"
            description="작업 버튼 묶음. 안쪽 Button 은 기본으로 ghost · neutral 이 되고 density 로 크기가 정해집니다."
        />
        <ComponentPreview
            title="default · overflow=menu"
            code={`<Toolbar aria-label="그리드 도구" overflow="menu" overflowItems={[{ label: '열 설정' }, { label: '인쇄' }]}>
    <ToolbarGroup>
        <Button>추가</Button>
        <Button>복사</Button>
        <Button tone="danger">삭제</Button>
    </ToolbarGroup>
    <ToolbarSeparator />
    <Toggle appearance="ghost" iconOnly aria-label="굵게"><b>B</b></Toggle>
    <ToolbarSeparator />
    <Button>엑셀</Button>
</Toolbar>`}
        >
            <div style={{ width: '100%' }}>
                <Toolbar
                    aria-label="그리드 도구"
                    overflow="menu"
                    overflowItems={[{ label: '열 설정' }, { label: '인쇄' }]}
                >
                    <ToolbarGroup>
                        <Button>추가</Button>
                        <Button>복사</Button>
                        <Button tone="danger">삭제</Button>
                    </ToolbarGroup>
                    <ToolbarSeparator />
                    <Toggle appearance="ghost" iconOnly aria-label="굵게" defaultPressed>
                        <b>B</b>
                    </Toggle>
                    <Toggle appearance="ghost" iconOnly aria-label="기울임">
                        <i>I</i>
                    </Toggle>
                    <ToolbarSeparator />
                    <Button>엑셀</Button>
                </Toolbar>
            </div>
        </ComponentPreview>
        <ComponentPreview
            title="compact · sticky"
            code={`<Toolbar density="compact" sticky aria-label="편집 도구">…</Toolbar>`}
        >
            <div style={{ width: '100%' }}>
                <Toolbar density="compact" sticky aria-label="편집 도구">
                    <Button>추가</Button>
                    <Button>복사</Button>
                    <Button tone="danger">삭제</Button>
                    <ToolbarSeparator />
                    <Button>저장</Button>
                    <ToolbarSpacer />
                    <Button
                        shape="square"
                        aria-label="더 보기"
                        iconLeft={<IconMoreHorizontal size={14} />}
                    />
                </Toolbar>
            </div>
        </ComponentPreview>
    </>
)
