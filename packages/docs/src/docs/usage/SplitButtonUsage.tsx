import { SplitButton } from '@ensnif/design-system'

export default function Example() {
    return (
        <SplitButton
            appearance="solid"
            tone="accent"
            menuLabel="저장 옵션"
            onClick={() => {}}
            items={[
                { label: '저장 후 승인요청', onSelect: () => {} },
                { label: '임시저장', shortcut: 'Ctrl ⇧ S', onSelect: () => {} },
                { type: 'separator' },
                { label: '변경 취소', tone: 'danger', onSelect: () => {} },
            ]}
        >
            작업지시 저장
        </SplitButton>
    )
}
