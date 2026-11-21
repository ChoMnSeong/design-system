import {
    Button,
    ButtonGroup,
    IconMoreHorizontal,
    Kbd,
    SplitButton,
    Toggle,
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
    ToolbarSpacer,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const ButtonGroupPage = () => (
    <>
        <PageHeader
            title="ButtonGroup"
            description="관련된 버튼 묶음. size · appearance · tone 이 자식 Button 에 전달됩니다."
        />
        <ComponentPreview
            title="attached"
            code={`<ButtonGroup attached appearance="outline" tone="neutral" aria-label="조회 도구">
    <Button>조회</Button>
    <Button>초기화</Button>
    <Button>엑셀</Button>
</ButtonGroup>`}
        >
            <ButtonGroup attached appearance="outline" tone="neutral" aria-label="조회 도구">
                <Button>조회</Button>
                <Button>초기화</Button>
                <Button>엑셀</Button>
            </ButtonGroup>
            <ButtonGroup attached aria-label="저장">
                <Button>저장</Button>
                <Button>승인요청</Button>
            </ButtonGroup>
        </ComponentPreview>
        <ComponentPreview
            title="spaced"
            code={`<ButtonGroup appearance="soft" size="sm" aria-label="행 작업">
    <Button>추가</Button>
    <Button tone="neutral">복사</Button>
    <Button tone="danger">삭제</Button>
</ButtonGroup>`}
        >
            <ButtonGroup appearance="soft" size="sm" aria-label="행 작업">
                <Button>추가</Button>
                <Button tone="neutral">복사</Button>
                <Button tone="danger">삭제</Button>
            </ButtonGroup>
        </ComponentPreview>
        <ComponentPreview
            title="vertical"
            code={`<ButtonGroup attached orientation="vertical" appearance="outline" tone="neutral" size="sm">
    <Button>위로</Button>
    <Button>아래로</Button>
    <Button>맨 끝</Button>
</ButtonGroup>`}
        >
            <ButtonGroup
                attached
                orientation="vertical"
                appearance="outline"
                tone="neutral"
                size="sm"
                aria-label="이동"
            >
                <Button>위로</Button>
                <Button>아래로</Button>
                <Button>맨 끝</Button>
            </ButtonGroup>
        </ComponentPreview>
    </>
)

export const SplitButtonPage = () => (
    <>
        <PageHeader
            title="SplitButton"
            description="주 동작 + 보조 동작 메뉴. 주 동작은 onClick, 나머지는 items 로 받습니다."
        />
        <ComponentPreview
            title="기본"
            code={`<SplitButton
    onClick={save}
    menuLabel="저장 옵션"
    items={[
        { label: '저장 후 승인요청' },
        { label: '임시저장', shortcut: 'Ctrl ⇧ S' },
        { type: 'separator' },
        { label: '변경 취소', tone: 'danger' },
    ]}
>
    저장
</SplitButton>`}
        >
            <SplitButton
                menuLabel="저장 옵션"
                items={[
                    { label: '저장 후 승인요청' },
                    { label: '임시저장', shortcut: 'Ctrl ⇧ S' },
                    { type: 'separator' },
                    { label: '변경 취소', tone: 'danger' },
                ]}
            >
                저장
            </SplitButton>
            <SplitButton
                appearance="outline"
                tone="neutral"
                size="sm"
                menuLabel="내보내기 옵션"
                items={[{ label: 'PDF' }, { label: 'CSV' }]}
            >
                엑셀
            </SplitButton>
            <SplitButton
                appearance="soft"
                tone="danger"
                size="sm"
                menuLabel="반려 옵션"
                items={[{ label: '사유 입력 후 반려' }, { label: '일괄 반려' }]}
            >
                반려
            </SplitButton>
        </ComponentPreview>
    </>
)

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

export const KbdPage = () => (
    <>
        <PageHeader title="Kbd" description="키보드 키. size xs 18 · sm 20 · md 24. keys 로 조합을 넘기면 '+' 를 자동으로 넣습니다." />
        <ComponentPreview
            title="size"
            code={`<Kbd size="xs">Esc</Kbd>
<Kbd>Enter</Kbd>
<Kbd size="md">Space</Kbd>`}
        >
            <Kbd size="xs">Esc</Kbd>
            <Kbd>Enter</Kbd>
            <Kbd size="md">Space</Kbd>
        </ComponentPreview>
        <ComponentPreview
            title="keys"
            code={`<Kbd keys={['Ctrl', 'K']} />
<Kbd keys={['Ctrl', '⇧', 'S']} />`}
        >
            <Kbd keys={['Ctrl', 'K']} />
            <Kbd keys={['Ctrl', '⇧', 'S']} />
        </ComponentPreview>
    </>
)
