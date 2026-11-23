import { useState } from 'react'
import { Badge, Grid, IconCalendar, IconInfo, IconSearch, IconWarning, NavigationMenu, Switch, type NavItem } from '@ensnif/design-system'
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
