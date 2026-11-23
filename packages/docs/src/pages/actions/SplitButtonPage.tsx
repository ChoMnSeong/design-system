import { SplitButton } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

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
