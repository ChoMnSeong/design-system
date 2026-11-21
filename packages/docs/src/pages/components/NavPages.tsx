import { useState } from 'react'
import { Badge, Breadcrumb, Grid, IconCalendar, IconInfo, IconSearch, IconWarning, NavigationMenu, Pagination, Stepper, Switch, type NavItem } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const MENU: NavItem[] = [
    { id: 'dash', label: '생산 현황', icon: <IconInfo size={16} />, group: '생산' },
    {
        id: 'wo',
        label: '작업지시',
        icon: <IconCalendar size={16} />,
        group: '생산',
        badge: <Badge size="xs">12</Badge>,
        children: [
            { id: 'wo-new', label: '작업지시 등록' },
            { id: 'wo-list', label: '작업지시 목록' },
            { id: 'wo-close', label: '일괄 마감', disabled: true },
            { id: 'wo-admin', label: '관리자 전용', hidden: true },
        ],
    },
    { id: 'eq', label: '설비 모니터링', icon: <IconWarning size={16} />, group: '설비', badge: <Badge appearance="solid" tone="danger" size="xs">1</Badge> },
    { id: 'spc', label: 'SPC', icon: <IconSearch size={16} />, group: '품질' },
]

export const NavigationMenuPage = () => {
    const [active, setActive] = useState('wo-list')
    const [collapsed, setCollapsed] = useState(false)
    const items = MENU.map((m) => ({ ...m, onClick: () => setActive(m.id), children: m.children?.map((c) => ({ ...c, onClick: () => setActive(c.id) })) }))
    return (
        <>
            <PageHeader title="NavigationMenu" description="그룹 라벨 · 하위 펼침 · 검색 · 권한(hidden/disabled) · 접힘(아이콘 + 팝오버) · 가로(넘치면 ···) · density · renderLink(라우터)." />
            <ComponentPreview title="세로 · searchable · collapsed" code={`<NavigationMenu items={items} activeId={active} searchable collapsed={collapsed} />`}>
                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', width: '100%' }}>
                    <div style={{ width: collapsed ? 56 : 230, padding: 8, border: '1px solid var(--ds-color-border-subtle)', borderRadius: 10 }}>
                        <NavigationMenu items={items} activeId={active} searchable={!collapsed} collapsed={collapsed} />
                    </div>
                    <Switch label="collapsed" checked={collapsed} onCheckedChange={setCollapsed} />
                </div>
            </ComponentPreview>
            <ComponentPreview title="가로 · density compact" code={`<NavigationMenu orientation="horizontal" items={…} /> <NavigationMenu density="compact" items={…} />`}>
                <Grid columns={2} gap={20} style={{ width: '100%' }}>
                    <div style={{ width: 300, padding: 4, border: '1px solid var(--ds-color-border-subtle)', borderRadius: 10 }}>
                        <NavigationMenu orientation="horizontal" aria-label="상단 메뉴" activeId="p" items={['생산', '품질', '설비', '자재', '기준정보'].map((l, i) => ({ id: i === 0 ? 'p' : l, label: l }))} />
                    </div>
                    <div style={{ width: 200, padding: 6, border: '1px solid var(--ds-color-border-subtle)', borderRadius: 10 }}>
                        <NavigationMenu density="compact" aria-label="재고 메뉴" activeId="in" items={[{ id: 'in', label: '입고' }, { id: 'out', label: '출고' }, { id: 'adj', label: '재고 조정' }, { id: 'cnt', label: '재고 실사' }]} />
                    </div>
                </Grid>
            </ComponentPreview>
        </>
    )
}

export const BreadcrumbPage = () => (
    <>
        <PageHeader title="Breadcrumb" description="separator · maxItems(가운데 ···) · size · icon · menu(형제 페이지) · renderLink." />
        <ComponentPreview title="기본 · maxItems · menu" code={`<Breadcrumb maxItems={3} items={[…, { label: 'BR-A01', menu: [{ label: 'BR-B01' }, …] }]} />`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Breadcrumb items={[{ label: '생산', href: '#' }, { label: '작업지시', href: '#' }, { label: 'WO-2611-0042' }]} />
                <Breadcrumb separator="›" size="sm" items={[{ label: '홈', icon: <IconInfo size={12} />, href: '#' }, { label: '기준정보', href: '#' }, { label: '품목' }]} />
                <Breadcrumb
                    maxItems={3}
                    items={[
                        { label: '홈', href: '#' },
                        { label: '기준정보', href: '#' },
                        { label: '품목', href: '#' },
                        { label: 'BOM', href: '#' },
                        { label: 'BR-A01', menu: [{ label: 'BR-A02' }, { label: 'BR-B01' }, { label: 'HS-C01' }] },
                    ]}
                />
            </div>
        </ComponentPreview>
    </>
)

export const PaginationPage = () => {
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(50)
    const [p2, setP2] = useState(5)
    return (
        <>
            <PageHeader title="Pagination" description="appearance full · simple · compact, size, showEdges, pageSize · pageSizeOptions, totalCount · showTotal, showJumper." />
            <ComponentPreview title="full · 총계 · 페이지 크기 · 이동" code={`<Pagination page={page} onPageChange={setPage} totalCount={1284} pageSize={size} pageSizeOptions={[20, 50, 100]} onPageSizeChange={setSize} showTotal showJumper />`}>
                <Pagination page={page} onPageChange={setPage} totalCount={1284} pageSize={size} pageSizeOptions={[20, 50, 100]} onPageSizeChange={(s) => { setSize(s); setPage(1) }} showTotal showJumper />
            </ComponentPreview>
            <ComponentPreview title="outlined · showEdges / simple · compact" code={`<Pagination variant="outlined" showEdges … /> <Pagination appearance="simple" size="sm" … /> <Pagination appearance="compact" … />`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <Pagination variant="outlined" showEdges page={p2} pageCount={26} onPageChange={setP2} />
                    <div style={{ display: 'flex', gap: 24 }}>
                        <Pagination appearance="simple" size="sm" page={p2} pageCount={26} onPageChange={setP2} />
                        <Pagination appearance="compact" size="sm" page={2} totalCount={1284} pageSize={50} />
                    </div>
                </div>
            </ComponentPreview>
        </>
    )
}

export const StepperPage = () => {
    const [cur, setCur] = useState(2)
    return (
        <>
            <PageHeader title="Stepper" description="status(wait · process · finish · error · skip) · time · appearance number · dot · icon · orientation · size · clickable." />
            <ComponentPreview title="number · status · time" code={`<Stepper current={3} steps={[{ label: '작성', time: '11/18 09:12' }, …, { label: '품질 검토', status: 'error', description: '반려' }, …]} />`}>
                <Stepper
                    style={{ width: '100%' }}
                    current={3}
                    steps={[
                        { label: '작성', description: '생산관리', time: '11/18 09:12' },
                        { label: '팀장 승인', time: '11/18 10:40' },
                        { label: '품질 검토', status: 'error', description: '반려 · 기준서 누락' },
                        { label: '재승인', description: '진행 중' },
                        { label: '확정', description: '대기' },
                    ]}
                />
            </ComponentPreview>
            <ComponentPreview title="dot · sm · clickable / vertical" code={`<Stepper appearance="dot" size="sm" clickable current={cur} onStepClick={setCur} … /> <Stepper orientation="vertical" … />`}>
                <div style={{ display: 'flex', gap: 48, width: '100%', alignItems: 'flex-start' }}>
                    <Stepper style={{ flex: 1 }} appearance="dot" size="sm" clickable current={cur} onStepClick={setCur} steps={['입고', '수입검사', '적치', '출고 대기'].map((label) => ({ label }))} />
                    <Stepper orientation="vertical" current={1} steps={[{ label: '설계', description: '완료' }, { label: '개발', description: '45%' }, { label: '테스트', description: '12/07 예정' }]} />
                </div>
            </ComponentPreview>
        </>
    )
}
