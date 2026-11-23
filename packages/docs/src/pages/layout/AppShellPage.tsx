import { AppShellDemo } from './AppShellDemo'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const AppShellPage = () => (
    <>
        <PageHeader title="AppShell" description="업무 화면 뼈대: 머리말 · 사이드바 메뉴 · 본문 · 상태 줄. 사이드바 접기(⌘B), 현장 모니터용 kiosk 모드." />
        <ComponentPreview title="업무 화면" description="brand · headerSearch · headerActions 로 머리말을, navigation 으로 아이콘 · 선택 표시 · 그룹이 맞춰진 사이드바를 그립니다. 로고 옆 버튼이나 ⌘B · Ctrl+B 로 접으면 아이콘만 남습니다." code={`<AppShell
    brand={<><Logo /> MES</>}
    headerSearch={<Button>⌘K 검색</Button>}
    headerActions={<><Button iconOnly badge={3} /> <Menu trigger={<Avatar />} /></>}
    navigation={items}          // NavItem[] — icon · children · group · badge
    activeNavId={active}
    onNavigate={(n) => setActive(n.id)}
    footer={<StatusIndicator label="PLC 연결" />}
    kiosk={kiosk}
>
    …
</AppShell>`}>
            <AppShellDemo />
        </ComponentPreview>
    </>
)
