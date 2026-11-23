import { useMemo, useState } from 'react'
import { LuBell, LuFileText, LuMonitor, LuPanelLeft, LuBoxes, LuClipboardList, LuFactory, LuGauge, LuLayoutDashboard, LuSearch, LuSettings, LuShieldCheck, LuWrench } from 'react-icons/lu'
import { AppShell, Avatar, Badge, Button, CommandPalette, DataGrid, Kbd, KpiCard, Menu, PageHeader as DsPageHeader, StatusIndicator, type CommandItem, type GridColumn, type NavItem } from '@ensnif/design-system'

const NAV: NavItem[] = [
    { id: 'dash', label: '대시보드', icon: <LuLayoutDashboard size={18} /> },
    { id: 'prod', label: '생산', icon: <LuFactory size={18} />, group: '운영', children: [{ id: 'prod-status', label: '생산 현황' }, { id: 'prod-wo', label: '작업지시', badge: <Badge size="xs" tone="danger">3</Badge> }, { id: 'prod-result', label: '실적 등록' }] },
    { id: 'quality', label: '품질', icon: <LuShieldCheck size={18} />, group: '운영', children: [{ id: 'q-insp', label: '검사 기록' }, { id: 'q-spc', label: 'SPC' }] },
    { id: 'equip', label: '설비', icon: <LuWrench size={18} />, group: '운영', children: [{ id: 'e-status', label: '가동 상태' }, { id: 'e-pm', label: '예방 보전' }] },
    { id: 'master', label: '기준정보', icon: <LuBoxes size={18} />, group: '관리' },
    { id: 'report', label: '보고서', icon: <LuClipboardList size={18} />, group: '관리' },
]

type Row = { id: string; item: string; line: string; plan: number; actual: number; status: string }

const ROWS: Row[] = Array.from({ length: 12 }, (_, i) => {
    const plan = [1200, 800, 600, 1000][i % 4]!
    return { id: `WO-2611-${String(42 + i).padStart(4, '0')}`, item: ['브래킷 A형', '하우징 커버', '샤프트 Ø32', '플랜지 B'][i % 4]!, line: `${(i % 3) + 1}라인`, plan, actual: Math.round(plan * (0.55 + ((i * 37) % 45) / 100)), status: ['작업중', '완료', '대기', '작업중'][i % 4]! }
})

const COLS: GridColumn<Row>[] = [
    { field: 'id', headerName: '작업지시', width: 130 },
    { field: 'item', headerName: '품목', width: 120 },
    { field: 'line', headerName: '라인', width: 70 },
    { field: 'plan', headerName: '계획', width: 80, align: 'right', valueFormatter: 'number' },
    { field: 'actual', headerName: '실적', width: 80, align: 'right', valueFormatter: 'number' },
    { field: 'status', headerName: '상태', width: 80, cellRenderer: 'badge', cellRendererParams: { toneMap: { 작업중: 'info', 완료: 'success', 대기: 'neutral' } } },
]

export const AppShellDemo = () => {
    const [kiosk, setKiosk] = useState(false)
    const [active, setActive] = useState('prod-status')
    const [collapsed, setCollapsed] = useState(false)
    const [paletteOpen, setPaletteOpen] = useState(false)
    const [query, setQuery] = useState('')
    const flat = (items: NavItem[], parent?: NavItem): Array<NavItem & { parentLabel?: string; parentIcon?: React.ReactNode }> =>
        items.flatMap((n) => (n.children?.length ? flat(n.children, n) : [{ ...n, parentLabel: parent ? String(parent.label) : undefined, parentIcon: parent?.icon }]))
    const commands = useMemo<CommandItem[]>(() => [
        ...flat(NAV).map((n) => ({
            id: `nav:${n.id}`,
            label: String(n.label),
            description: n.parentLabel,
            icon: n.icon ?? n.parentIcon,
            group: '메뉴',
            onSelect: () => { setActive(n.id); setQuery('') },
        })),
        ...ROWS.map((r) => ({
            id: `wo:${r.id}`,
            label: r.id,
            description: `${r.item} · ${r.line} · ${r.status}`,
            icon: <LuFileText size={16} />,
            group: '작업지시',
            keywords: [r.item, r.line, r.status],
            onSelect: () => { setActive('prod-wo'); setQuery(r.id) },
        })),
        { id: 'act:collapse', label: collapsed ? '메뉴 펼치기' : '메뉴 접기', icon: <LuPanelLeft size={16} />, group: '동작', shortcut: '⌘B', onSelect: () => setCollapsed((c) => !c) },
        { id: 'act:kiosk', label: '모니터 모드', icon: <LuMonitor size={16} />, group: '동작', onSelect: () => setKiosk(true) },
    ], [collapsed])
    const cur = flat(NAV).find((n) => n.id === active)
    const title = String(cur?.label ?? '생산 현황')
    const crumb = cur?.parentLabel ? `${cur.parentLabel} / ${title}` : title
    const totals = useMemo(() => ({ plan: ROWS.reduce((a, r) => a + r.plan, 0), actual: ROWS.reduce((a, r) => a + r.actual, 0) }), [])
    const rate = Math.round((totals.actual / totals.plan) * 100)
    return (
        <div style={{ width: '100%', height: 640, border: '1px solid var(--ds-color-border-default)', borderRadius: 12, overflow: 'hidden' }}>
            <AppShell
                kiosk={kiosk}
                sidebarCollapsed={collapsed}
                onSidebarCollapsedChange={setCollapsed}
                brand={<><span style={{ width: 22, height: 22, flex: 'none', borderRadius: 6, background: 'var(--ds-palette-primary-600)', display: 'grid', placeItems: 'center', color: '#fff' }}><LuGauge size={14} /></span>{!collapsed && <span>MES</span>}</>}
                headerSearch={
                    <Button appearance="outline" tone="neutral" size="sm" iconLeft={<LuSearch size={15} />} onClick={() => setPaletteOpen(true)} aria-haspopup="dialog" style={{ width: 280, justifyContent: 'flex-start', color: 'var(--ds-color-foreground-tertiary)' }}>
                        <span style={{ flex: 1, textAlign: 'left' }}>메뉴 · 작업지시 검색</span>
                        <Kbd size="xs" keys={['⌘', 'K']} />
                    </Button>
                }
                headerActions={
                    <>
                        <Button appearance="ghost" tone="neutral" size="sm" onClick={() => setKiosk(true)}>모니터 모드</Button>
                        <Button appearance="ghost" tone="neutral" size="sm" iconOnly iconLeft={<LuBell size={18} />} aria-label="알림 3개" badge={3} />
                        <Button appearance="ghost" tone="neutral" size="sm" iconOnly iconLeft={<LuSettings size={18} />} aria-label="설정" />
                        <Menu
                            align="end"
                            trigger={<button type="button" aria-label="사용자 메뉴" style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px', borderRadius: 8 }}><Avatar size="sm" name="김도윤" /><span style={{ fontSize: 13 }}>김도윤</span></button>}
                            items={[{ type: 'label', label: '1공장 · 생산관리' }, { label: '내 정보' }, { label: '공장 전환' }, { type: 'separator' }, { label: '로그아웃', tone: 'danger' }]}
                        />
                    </>
                }
                navigation={NAV}
                activeNavId={active}
                onNavigate={(n) => setActive(n.id)}
                footer={<><StatusIndicator tone="success" size="sm" label="PLC 연결" /><span>마지막 갱신 15:10:22</span><span style={{ marginLeft: 'auto' }}>v0.3.0</span></>}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <DsPageHeader
                        breadcrumb={crumb}
                        title={title}
                        extra={<Badge size="sm" tone="success" dot>가동</Badge>}
                        meta="1공장 · 2026-11-21 주간"
                        actions={kiosk ? <Button size="sm" appearance="outline" tone="neutral" onClick={() => setKiosk(false)}>모니터 끝내기</Button> : <><Button size="sm" appearance="outline" tone="neutral">내보내기</Button><Button size="sm">실적 등록</Button></>}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
                        <KpiCard label="계획" value={totals.plan.toLocaleString()} unit="EA" />
                        <KpiCard label="실적" value={totals.actual.toLocaleString()} unit="EA" target={totals.plan} delta={{ value: '+4.2%' }} trend="up-good" />
                        <KpiCard label="달성률" value={rate} unit="%" sparkline={[72, 75, 71, 78, 80, 77, rate]} />
                        <KpiCard label="불량률" value="1.8" unit="%" delta={{ value: '-0.3%p' }} trend="down-good" />
                    </div>
                    {query && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                            검색: <Badge tone="accent">{query}</Badge>
                            <Button size="xs" appearance="ghost" tone="neutral" onClick={() => setQuery('')}>지우기</Button>
                        </div>
                    )}
                    <DataGrid rows={ROWS} columns={COLS} quickFilter={query} density="compact" statusBar={['count']} aria-label="작업지시 목록" />
                </div>
            </AppShell>
            <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} items={commands} recent="docs-appshell-recent" placeholder="메뉴 · 작업지시 · 동작 검색" />
        </div>
    )
}
