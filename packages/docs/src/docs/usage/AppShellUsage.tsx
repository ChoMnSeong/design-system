import { useState } from 'react'
import { AppShell, Avatar, Button, type NavItem } from '@ensnif/design-system'

const menu: NavItem[] = [
    { id: 'dashboard', label: '대시보드', group: '생산' },
    { id: 'orders', label: '작업지시', group: '생산', badge: 3 },
    { id: 'quality', label: '품질', group: '품질', children: [
        { id: 'inspect', label: '검사 실적' },
        { id: 'defect', label: '불량 현황' },
    ] },
]

export default function Example() {
    const [active, setActive] = useState('dashboard')
    return (
        <AppShell
            brand={<b>MES</b>}
            headerActions={<Avatar name="김현장" size="sm" />}
            navigation={menu}
            activeNavId={active}
            onNavigate={(n) => setActive(n.id)}
            footer={<span>PLC 연결 · 10초 전 갱신</span>}
        >
            <Button>작업지시 등록</Button>
        </AppShell>
    )
}
