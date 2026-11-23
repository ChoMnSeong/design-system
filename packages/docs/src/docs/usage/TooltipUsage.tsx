import { Button, HoverCard, Input, Popover, Tooltip } from '@ensnif/design-system'

export default function Example() {
    return (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Tooltip content="엑셀로 내보내기">
                <Button appearance="outline" tone="neutral">내보내기</Button>
            </Tooltip>
            <Popover trigger={<Button appearance="outline" tone="neutral">필터</Button>} side="bottom" align="start" aria-label="품목 필터">
                <Input size="sm" placeholder="품목명" />
            </Popover>
            <HoverCard content="김도윤 · 생산관리 · 내선 4021">
                <a href="#owner">김도윤</a>
            </HoverCard>
        </div>
    )
}
