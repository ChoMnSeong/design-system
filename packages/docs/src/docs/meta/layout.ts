import type { DocMetaMap } from '../types'
import AppShellUsage from '../usage/AppShellUsage?raw'
import PageHeaderUsage from '../usage/PageHeaderUsage?raw'
import ContainerUsage from '../usage/ContainerUsage?raw'
import BoxUsage from '../usage/BoxUsage?raw'
import DashboardGridUsage from '../usage/DashboardGridUsage?raw'
import SplitterUsage from '../usage/SplitterUsage?raw'

export const layoutMeta: DocMetaMap = {
    'c-appshell': {
        components: ['AppShell'],
        usage: AppShellUsage,
        composition: `
AppShell
├── header              머리말 (header 를 주면 아래 셋 대신 그것을 그림)
│   ├── brand           로고 + 이름 · 접기 버튼
│   ├── headerSearch    가운데 (⌘K 검색 등)
│   └── headerActions   오른쪽 (알림 · 사용자 메뉴)
├── sidebar             navigation 또는 sidebar
│   └── sidebarFooter   사이드바 아래
├── main                children
└── footer              맨 아래 상태 줄

navigation: NavItem[]
└── { id, label, icon?, badge?, href?, onClick?, children?, group?, disabled?, hidden? }`,
        compositionNote: 'navigation 을 주면 접힘 상태에 맞춘 NavigationMenu 를 그리고, onNavigate 는 하위 항목이 없는 항목을 누를 때 불립니다. 직접 그리려면 sidebar 를 넘깁니다. kiosk 면 머리말과 사이드바를 숨깁니다.',
        a11y: [
            '머리말 · 본문 · 상태 줄을 <header> · <main> · <footer> 로 그려 랜드마크로 이동할 수 있습니다.',
            'navigation 으로 그린 메뉴는 aria-label="주 메뉴" 인 <nav> 이고, sidebar 를 직접 넘기면 사이드바에 role="navigation" 과 aria-label="주 메뉴" 가 붙습니다.',
            '접기 버튼은 상태에 따라 aria-label 이 "메뉴 접기" · "메뉴 펼치기" 로 바뀌고 aria-expanded 로 펼침 상태를 알립니다.',
            '⌘B · Ctrl+B 로 사이드바를 접고 펼칩니다. 입력창 · textarea · select · contenteditable 에 포커스가 있으면 동작하지 않고, collapseShortcut={false} 로 끌 수 있습니다.',
        ],
        functions: [
            {
                name: 'useAppShell',
                signature: 'useAppShell(): { collapsed: boolean; toggle: () => void }',
                description: '사이드바(sidebar · sidebarFooter) 안에서 접힘 상태를 읽고 toggle 로 접거나 펼칩니다. 사이드바 밖에서는 기본값(collapsed: false)을 돌려줍니다.',
            },
        ],
    },
    'c-pageheader': {
        components: ['PageHeader'],
        usage: PageHeaderUsage,
        a11y: [
            'title 은 <h1> 으로 그립니다. 한 화면에 PageHeader 를 하나만 두세요.',
            'onBack 을 주면 aria-label="뒤로" 인 아이콘 버튼이 제목 앞에 생깁니다.',
        ],
    },
    'c-container': {
        components: ['Container', 'Section'],
        usage: ContainerUsage,
    },
    'c-box': {
        components: ['Box', 'Stack', 'Grid', 'Divider', 'ScrollArea', 'Spacer'],
        usage: BoxUsage,
        a11y: [
            'Divider 는 role="separator" 와 aria-orientation 으로 그립니다. Stack 의 divider={true} 로 넣는 구분선도 같습니다.',
            'ScrollArea 는 tabIndex=0 이라 키보드로 포커스해 방향키로 스크롤할 수 있습니다. 무엇을 담은 영역인지 aria-label 을 주세요.',
            'Spacer 는 aria-hidden 이라 스크린 리더가 읽지 않습니다.',
        ],
    },
    'c-dashboard': {
        components: ['DashboardGrid', 'DashboardGridItem'],
        usage: DashboardGridUsage,
        composition: `
DashboardGrid           columns · rowHeight · gap · areas · editable
└── DashboardGridItem   id · colSpan · rowSpan · area (여러 개)
    └── Card …          칸 안 내용`,
        compositionNote: 'DashboardGrid 의 직계 자식은 DashboardGridItem 이어야 합니다. colSpan · rowSpan 은 { sm, md, lg } 로 단계별로 줄 수 있습니다. editable 에서 바뀐 배치는 onLayoutChange 로 받고, Item 의 id 가 배치 항목의 id 가 됩니다.',
        a11y: [
            'editable 이면 칸마다 오른쪽 아래에 role="button" · aria-label="크기 조절" 인 손잡이가 생기고, Tab 으로 잡아 ← → 로 열 수, ↑ ↓ 로 행 수를 1칸씩 바꿉니다.',
            '위 가운데의 옮기기 손잡이(role="button")를 Tab 으로 잡아 ← ↑ 로 한 칸 앞, → ↓ 로 한 칸 뒤로 옮깁니다. 끌어 놓기도 그대로 됩니다.',
            '옮기거나 크기를 바꾸면 "3번째 / 6개" · "크기 가로 2칸 · 세로 1칸" 처럼 aria-live 로 결과를 알립니다. 칸의 DOM 순서 자체를 바꾸므로 Tab · 화면 낭독기 순서가 화면 순서와 같고, 옮긴 뒤에도 포커스는 그 칸의 손잡이에 남습니다. 바꾼 순서 · 크기는 편집을 끈 뒤에도 유지됩니다.',
        ],
    },
    'c-splitter': {
        components: ['Splitter'],
        usage: SplitterUsage,
        a11y: [
            '손잡이는 role="separator" 와 aria-label="패널 크기 조절" 이고, aria-orientation · aria-valuenow · aria-valuemin · aria-valuemax 로 크기를 알립니다.',
            '손잡이는 tabIndex=0 이라 Tab 으로 잡히고, 가로 배치는 ← →, 세로 배치는 ↑ ↓ 로 24px 씩 크기를 바꿉니다.',
            'collapsible 이면 Enter(또는 두 번 누르기)로 첫 패널을 접고 폅니다.',
        ],
    },
}
