import { Button, HoverCard, IconSearch, Input, Popover, Tooltip } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const TooltipPage = () => (
    <>
        <PageHeader title="Popover · Tooltip · HoverCard" description="Popover 는 trigger 슬롯 + side 4방향 + arrow + openOn(click · hover · focus) + modal. Tooltip 은 tone · maxWidth · disabled." />
        <ComponentPreview title="Tooltip · side · tone" code={`<Tooltip content="엑셀로 내보내기" side="right" tone="accent"><Button …/></Tooltip>`}>
            {(['top', 'bottom', 'left', 'right'] as const).map((s) => (
                <Tooltip key={s} content={`side="${s}"`} side={s}>
                    <Button appearance="outline" tone="neutral" size="sm">{s}</Button>
                </Tooltip>
            ))}
            <Tooltip content="강조 안내" tone="accent"><Button size="sm" appearance="soft">accent</Button></Tooltip>
            <Tooltip content="되돌릴 수 없습니다" tone="danger"><Button size="sm" appearance="soft" tone="danger">danger</Button></Tooltip>
            <Tooltip content="긴 설명은 maxWidth 에서 줄바꿈됩니다. 설비 가동률은 계획 가동 시간 대비 실제 가동 시간의 비율입니다." maxWidth={200}><Button size="sm" appearance="ghost" tone="neutral">maxWidth</Button></Tooltip>
        </ComponentPreview>
        <ComponentPreview title="Popover · HoverCard" code={`<Popover trigger={<Button>필터</Button>} side="bottom" arrow>…</Popover>
<HoverCard content={…}><a href="#">김민지</a></HoverCard>`}>
            <Popover trigger={<Button appearance="outline" tone="neutral" size="sm" iconLeft={<IconSearch size={14} />}>빠른 필터</Button>} side="bottom" align="start" arrow aria-label="빠른 필터">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 220 }}>
                    <b style={{ fontSize: 13 }}>빠른 필터</b>
                    <Input size="sm" placeholder="품목명" fullWidth />
                    <Button size="sm">적용</Button>
                </div>
            </Popover>
            <Popover trigger={<Button size="sm" appearance="ghost" tone="neutral">hover</Button>} openOn="hover" side="right" arrow>
                오른쪽에 뜨는 팝오버
            </Popover>
            <HoverCard arrow content={<div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}><b>김민지 · 생산관리</b><span style={{ color: 'var(--ds-color-foreground-tertiary)' }}>1공장 2라인 담당 · 내선 4021</span></div>}>
                <a href="#hovercard" style={{ color: 'var(--ds-tone-accent-text)', fontSize: 14 }}>김민지</a>
            </HoverCard>
        </ComponentPreview>
    </>
)
