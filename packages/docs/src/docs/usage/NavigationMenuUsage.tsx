import { useState } from 'react'
import { NavigationMenu, type NavItem } from '@ensnif/design-system'

const items: NavItem[] = [
    { id: 'dashboard', label: '대시보드', group: '생산' },
    { id: 'orders', label: '작업지시', group: '생산', badge: 3 },
    { id: 'quality', label: '품질', group: '품질', children: [
        { id: 'inspect', label: '검사 실적' },
        { id: 'defect', label: '불량 현황' },
    ] },
    { id: 'admin', label: '권한 관리', group: '설정', hidden: true },
]

export default function Example() {
    const [active, setActive] = useState('inspect')
    const withClick = (list: NavItem[]): NavItem[] =>
        list.map((n) => ({ ...n, onClick: () => setActive(n.id), children: n.children && withClick(n.children) }))
    return <NavigationMenu items={withClick(items)} activeId={active} searchable aria-label="주 메뉴" />
}
