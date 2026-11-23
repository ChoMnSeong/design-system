import { Button, ButtonGroup } from '@ensnif/design-system'
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
