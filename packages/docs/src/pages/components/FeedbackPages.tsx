import { useState } from 'react'
import {
    Alert,
    Button,
    CommandPalette,
    Dialog,
    DialogActions,
    Drawer,
    Empty,
    HoverCard,
    IconSearch,
    Input,
    Popover,
    Skeleton,
    Spinner,
    ToastProvider,
    Tooltip,
    confirm,
    useToast,
    type Tone,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const grid = (n: number) => ({ display: 'grid', gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, gap: 10, width: '100%' }) as const

export const AlertPage = () => (
    <>
        <PageHeader title="Alert" description="appearance soft · solid · outline · accent-left × tone 6종. actions · closable · banner · size." />
        <ComponentPreview title="soft × tone" code={`<Alert tone="danger" title="soft · danger">PLC 연결이 끊겼습니다.</Alert>`}>
            <div style={grid(2)}>
                {([['info', '11월 마감은 12/03 18:00입니다.'], ['success', '실적 128건이 반영되었습니다.'], ['warning', '안전재고 미달 품목 3건'], ['danger', 'PLC 연결이 끊겼습니다.'], ['accent', '새 화면이 추가되었습니다.'], ['neutral', '읽기 전용 기간입니다.']] as Array<[Tone, string]>).map(([t, m]) => (
                    <Alert key={t} tone={t} title={`soft · ${t}`}>{m}</Alert>
                ))}
            </div>
        </ComponentPreview>
        <ComponentPreview title="solid · outline · accent-left · actions · banner" code={`<Alert appearance="solid" tone="danger" title="solid">설비 정지 2건</Alert>
<Alert tone="danger" closable title="actions" actions={<Button size="sm" tone="danger">품질보류 처리</Button>}>…</Alert>
<Alert banner appearance="solid" tone="accent" actions={…}>12/01 시스템 점검</Alert>`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
                <div style={grid(3)}>
                    <Alert appearance="solid" tone="danger" title="solid">설비 정지 2건</Alert>
                    <Alert appearance="outline" tone="warning" title="outline">검사 대기 6건</Alert>
                    <Alert appearance="accent-left" tone="info" title="accent-left">기준 정보 변경</Alert>
                </div>
                <Alert tone="danger" closable title="actions · closable" actions={<><Button size="sm" tone="danger">품질보류 처리</Button><Button size="sm" appearance="ghost" tone="neutral">자세히</Button></>}>
                    하우징 커버 불량률 1.98%로 기준 1.5%를 넘었습니다.
                </Alert>
                <Alert banner appearance="solid" tone="accent" actions={<Button size="sm" appearance="outline" tone="neutral" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.5)' }}>자세히</Button>}>
                    12/01 02:00~04:00 시스템 점검이 예정되어 있습니다.
                </Alert>
            </div>
        </ComponentPreview>
    </>
)

export const ToastPage = () => (
    <ToastProvider placement="bottom-right" max={4}>
        <ToastDemo />
    </ToastProvider>
)

const ToastDemo = () => {
    const { toast, success, error, promise, dismiss } = useToast()
    return (
        <>
            <PageHeader title="Toast" description="ToastProvider placement 6종 · max. toast(opts) · success/error · update · promise · dismiss. action · persistent · progress · id 지정." />
            <ComponentPreview
                title="호출"
                code={`const { toast, success, promise } = useToast()
success({ title: '저장했습니다', progress: true })
toast({ tone: 'warning', title: '안전재고 미달', action: { label: '보기', onClick: open } })
toast({ id: 'plc', tone: 'danger', title: 'PLC 연결 끊김', persistent: true })
promise(save(), { loading: '저장 중…', success: '저장 완료', error: '저장 실패' })`}
            >
                <Button onClick={() => success({ title: '저장했습니다', description: '작업지시 WO-2611-0042', progress: true })}>성공</Button>
                <Button appearance="outline" tone="warning" onClick={() => toast({ tone: 'warning', title: '안전재고 미달 3건', action: { label: '보기', onClick: () => {} } })}>action</Button>
                <Button appearance="outline" tone="danger" onClick={() => toast({ id: 'plc', tone: 'danger', title: 'PLC 연결 끊김', description: '같은 id 는 하나만 남습니다', persistent: true })}>persistent · id</Button>
                <Button appearance="outline" tone="neutral" onClick={() => void promise(new Promise((r) => setTimeout(r, 1500)), { loading: '실적 반영 중…', success: '128건 반영', error: '반영 실패' }).catch(() => {})}>promise</Button>
                <Button appearance="ghost" tone="neutral" onClick={() => { error({ title: '실패 예시' }); setTimeout(() => dismiss(), 1500) }}>dismiss 전체</Button>
            </ComponentPreview>
        </>
    )
}

export const DialogPage = () => {
    const [dirty, setDirty] = useState('')
    const [result, setResult] = useState<string>('')
    return (
        <>
            <PageHeader title="Dialog · confirm()" description="open · onOpenChange 또는 trigger 로 비제어. size xs~xl · fullscreen, tone, scrollBehavior, draggable, onBeforeClose. confirm() 은 Promise<boolean>." />
            <ComponentPreview
                title="기본 · draggable · onBeforeClose"
                code={`<Dialog trigger={<Button>열기</Button>} title="작업지시 수정" draggable onBeforeClose={() => !dirty || window.confirm('저장하지 않고 닫을까요?')} footer={…}>…</Dialog>`}
            >
                <Dialog
                    trigger={<Button>작업지시 수정</Button>}
                    title="작업지시 수정"
                    description="제목 줄을 끌어 옮길 수 있습니다."
                    draggable
                    onBeforeClose={() => !dirty || window.confirm('저장하지 않은 변경이 있습니다. 닫을까요?')}
                    footer={
                        <DialogActions>
                            <Button appearance="outline" tone="neutral">취소</Button>
                            <Button>저장</Button>
                        </DialogActions>
                    }
                >
                    <Input fullWidth placeholder="비고 (입력하면 닫을 때 확인)" value={dirty} onChange={(e) => setDirty(e.target.value)} />
                </Dialog>
                <Dialog trigger={<Button appearance="outline" tone="neutral">긴 본문 (outside 스크롤)</Button>} title="검사 기준서" size="lg" scrollBehavior="outside">
                    {Array.from({ length: 40 }, (_, i) => <p key={i}>{i + 1}. 치수 공차 ±0.05mm 이내, 표면 스크래치 0.2mm 이하.</p>)}
                </Dialog>
            </ComponentPreview>
            <ComponentPreview
                title="confirm()"
                code={`const ok = await confirm({ title: '작업지시 3건을 삭제할까요?', description: '투입 자재 이력도 삭제됩니다.', tone: 'danger', confirmText: '삭제' })`}
            >
                <Button
                    appearance="soft"
                    tone="danger"
                    onClick={async () => {
                        const ok = await confirm({ title: '작업지시 3건을 삭제할까요?', description: '투입 자재 이력도 삭제됩니다.', tone: 'danger', confirmText: '삭제' })
                        setResult(ok ? '삭제함' : '취소함')
                    }}
                >
                    삭제
                </Button>
                {result && <span style={{ fontSize: 13 }}>결과: {result}</span>}
            </ComponentPreview>
        </>
    )
}

export const DrawerPage = () => {
    const [open, setOpen] = useState<null | 'right' | 'bottom' | 'detail'>(null)
    return (
        <>
            <PageHeader title="Drawer" description="side 4방향, size sm~xl, resizable, modal=false(페이지와 함께 쓰는 상세 패널)." />
            <ComponentPreview title="기본" code={`<Drawer open={open} onOpenChange={setOpen} title="설비 상세" size="md" resizable>…</Drawer>`}>
                <Button onClick={() => setOpen('right')}>오른쪽 · resizable</Button>
                <Button appearance="outline" tone="neutral" onClick={() => setOpen('bottom')}>아래</Button>
                <Button appearance="outline" tone="neutral" onClick={() => setOpen('detail')}>modal=false</Button>
                <Drawer open={open === 'right'} onOpenChange={(o) => !o && setOpen(null)} title="설비 상세" description="PRESS-03 · 2라인" resizable footer={<Button onClick={() => setOpen(null)}>확인</Button>}>
                    가장자리를 끌어 폭을 바꿀 수 있습니다.
                </Drawer>
                <Drawer open={open === 'bottom'} onOpenChange={(o) => !o && setOpen(null)} side="bottom" size="sm" title="필터">
                    모바일 하단 시트처럼 씁니다.
                </Drawer>
                <Drawer open={open === 'detail'} onOpenChange={(o) => !o && setOpen(null)} modal={false} size="sm" title="상세 패널">
                    뒤 페이지를 계속 조작할 수 있습니다.
                </Drawer>
            </ComponentPreview>
        </>
    )
}

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

const CMD_ITEMS = [
    { id: 'wo', label: '작업지시 등록', group: '생산', shortcut: 'Ctrl N', onSelect: () => {} },
    { id: 'perf', label: '실적 등록', group: '생산', onSelect: () => {} },
    { id: 'insp', label: '수입검사 결과 입력', group: '품질', onSelect: () => {} },
    { id: 'eq', label: '설비 가동 현황', group: '설비', description: 'PRESS · WELD · CNC', onSelect: () => {} },
    { id: 'close', label: '월 마감', group: '관리', disabled: true, description: '마감 권한 필요', onSelect: () => {} },
]

export const CommandPalettePage = () => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <PageHeader title="CommandPalette" description="hotkey(기본 mod+k) · loadItems · recent · footer · filter(점수) · size. 항목 disabled." />
            <ComponentPreview title="기본" code={`<CommandPalette open={open} onOpenChange={setOpen} items={items} recent loadItems={searchWo} />`}>
                <Button appearance="outline" tone="neutral" shortcut="Ctrl K" onClick={() => setOpen(true)}>명령 팔레트</Button>
                <CommandPalette
                    open={open}
                    onOpenChange={setOpen}
                    items={CMD_ITEMS}
                    recent="docs-cmd-recent"
                    loadItems={(q) => new Promise((r) => setTimeout(() => r(q ? [{ id: `wo-${q}`, label: `WO-2611-${q.padStart(4, '0')} 열기`, group: '작업지시 검색', onSelect: () => {} }] : []), 300))}
                />
            </ComponentPreview>
        </>
    )
}

export const SkeletonPage = () => (
    <>
        <PageHeader title="Skeleton · Spinner · Empty" description="Skeleton animation · Table · Card 프리셋. Spinner size 토큰 · tone · overlay. Empty preset · size · compact." />
        <ComponentPreview title="Skeleton" code={`<Skeleton circle height={40} /> <Skeleton lines={2} /> <Skeleton.Table rows={3} /> <Skeleton.Card />`}>
            <div style={grid(3)}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Skeleton circle height={40} />
                    <Skeleton lines={2} height={12} style={{ flex: 1 }} />
                </div>
                <Skeleton.Table rows={3} columns={3} />
                <Skeleton.Card />
            </div>
        </ComponentPreview>
        <ComponentPreview title="Spinner" code={`<Spinner size="xs" /> … <Spinner size="lg" tone="danger" /> <Spinner overlay label="불러오는 중" />`}>
            {(['xs', 'sm', 'md', 'lg'] as const).map((s) => <Spinner key={s} size={s} />)}
            <Spinner size="md" tone="success" />
            <Spinner size="md" tone="danger" />
            <div style={{ position: 'relative', width: 180, height: 64, border: '1px solid var(--ds-color-border-subtle)', borderRadius: 8 }}>
                <Spinner overlay label="불러오는 중" />
            </div>
        </ComponentPreview>
        <ComponentPreview title="Empty · preset" code={`<Empty preset="noData" action={<Button size="sm">작업지시 등록</Button>} />`}>
            <div style={grid(4)}>
                <Empty preset="noData" description="등록된 작업지시가 없습니다" action={<Button size="sm" appearance="soft">작업지시 등록</Button>} />
                <Empty preset="noResult" action={<Button size="sm" appearance="ghost" tone="neutral">조건 초기화</Button>} />
                <Empty preset="error" action={<Button size="sm" appearance="outline" tone="neutral">다시 시도</Button>} />
                <Empty preset="noPermission" size="sm" />
            </div>
        </ComponentPreview>
        <ComponentPreview title="compact" code={`<Empty preset="noResult" appearance="compact" />`}>
            <Empty preset="noResult" appearance="compact" description="필터를 바꿔 보세요" style={{ width: '100%' }} />
        </ComponentPreview>
    </>
)
