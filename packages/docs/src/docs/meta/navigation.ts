import type { DocMetaMap } from '../types'
import NavigationMenuUsage from '../usage/NavigationMenuUsage?raw'
import BreadcrumbUsage from '../usage/BreadcrumbUsage?raw'
import PaginationUsage from '../usage/PaginationUsage?raw'
import StepperUsage from '../usage/StepperUsage?raw'
import TreeUsage from '../usage/TreeUsage?raw'

export const navigationMeta: DocMetaMap = {
    'c-navigationmenu': {
        components: ['NavigationMenu'],
        usage: NavigationMenuUsage,
        composition: `
items: NavItem[]
├── id          고유 id (activeId · expanded 기준)
├── label       표시 이름
├── icon?       접힌 메뉴에서는 이것만 보임
├── badge?      접힌 메뉴에서는 점
├── href?       있으면 <a>, 없으면 <button>
├── onClick?
├── group?      같은 group 이 이어지면 위에 라벨 한 번
├── disabled?
├── hidden?     권한 없음 등으로 숨김
└── children?: NavItem[]
    └── …       하위 항목 (세로 메뉴에서 펼침)`,
        compositionNote: '기본 펼침은 activeId 를 가진 부모입니다. 라우터 링크로 그리려면 renderLink 를 씁니다.',
        a11y: [
            '<nav> 로 그리고 aria-label 을 붙입니다(기본 "주 메뉴").',
            '현재 페이지 항목에 aria-current="page" 가 붙고, 하위 항목을 가진 부모 버튼은 aria-expanded 로 펼침 상태를 알립니다.',
            'collapsed 면 아이콘 버튼만 남고, label 이 문자열이면 그 값이 aria-label · title 이 됩니다. 하위 항목은 Menu 팝오버로 엽니다.',
            '가로 메뉴에서 넘친 항목은 aria-label="메뉴 N개 더보기" 버튼의 메뉴로 옮겨집니다.',
            'searchable 검색창은 searchPlaceholder 를 aria-label 로 씁니다.',
        ],
    },
    'c-breadcrumb': {
        components: ['Breadcrumb'],
        usage: BreadcrumbUsage,
        composition: `
items: BreadcrumbItem[]     마지막이 현재 페이지
├── label
├── href?       있으면 <a>
├── onClick?    href 없이 주면 <button>
├── icon?
└── menu?: MenuItemDef[]    형제 페이지로 바로 가는 드롭다운`,
        a11y: [
            'aria-label="경로" 인 <nav> 안에 <ol> 목록으로 그립니다.',
            '마지막 항목은 링크가 아니며 aria-current="page" 가 붙습니다. 구분자는 aria-hidden 입니다.',
            'maxItems 로 가운데를 접으면 aria-label="숨겨진 경로 N개" 버튼의 메뉴로 열 수 있습니다.',
        ],
    },
    'c-pagination': {
        components: ['Pagination'],
        usage: PaginationUsage,
        a11y: [
            'aria-label="페이지" 인 <nav> 로 그립니다.',
            '번호 버튼은 aria-label="N 페이지" 이고 현재 페이지에 aria-current="page" 가 붙습니다. 생략 기호(…)는 aria-hidden 입니다.',
            '처음 · 이전 페이지 · 다음 페이지 · 끝 버튼은 aria-label 을 가지고, 더 갈 곳이 없으면 비활성이 됩니다.',
            '행 수 Select 는 aria-label="페이지당 행 수", showJumper 입력은 aria-label="이동할 페이지" 이고 Enter 로 이동합니다.',
        ],
        functions: [
            {
                name: 'pageItems',
                signature: "pageItems(page: number, count: number, siblings: number): Array<number | 'gap'>",
                description: '보일 페이지 번호 목록을 계산합니다(예: 1 … 4 5 6 … 26). 직접 페이지 버튼을 그릴 때 씁니다.',
            },
        ],
    },
    'c-stepper': {
        components: ['Stepper'],
        usage: StepperUsage,
        composition: `
steps: StepperStep[]
├── label
├── description?
├── status?     wait · process · finish · error · skip (없으면 current 로 정함)
├── icon?       appearance="icon" 일 때 마커
└── time?       처리 시각 등`,
        a11y: [
            '<ol> 목록으로 그리고 current 단계에 aria-current="step" 이 붙습니다.',
            '마커는 aria-hidden 이고, 단계마다 "대기 · 진행 중 · 완료 · 오류 · 건너뜀" 상태가 화면에 보이지 않는 글자로 함께 읽힙니다.',
            'clickable 이면 단계마다 <button> 이 되어 Tab 으로 잡히고 Enter · Space 로 onStepClick 을 부릅니다.',
        ],
    },
    'c-tree': {
        components: ['Tree'],
        usage: TreeUsage,
        composition: `
data: TreeNode[]
├── id
├── label
├── icon?
├── badge?      오른쪽 끝 (개수 · 수량)
├── actions?    올리거나 선택하면 보이는 동작
├── disabled?
├── hasChildren?    loadChildren 으로 불러올 자식이 있음
└── children?: TreeNode[]
    └── …`,
        a11y: [
            'role="tree" · role="treeitem" 으로 그리고 aria-level · aria-expanded · aria-selected 로 깊이 · 펼침 · 선택을 알립니다. selectable="multiple" 이면 aria-multiselectable 이 붙습니다.',
            '포커스는 한 행만 Tab 으로 잡히고(roving tabindex), ↑ ↓ 로 이동, Home · End 로 처음 · 끝, → 로 펼치기 또는 첫 자식, ← 로 접기 또는 부모로 갑니다.',
            'Enter · Space 로 선택하고, Ctrl · ⌘ 를 함께 누르면 여러 개를 고릅니다. checkable 이면 Space 는 체크를 바꿉니다.',
            'checkable 의 체크 상태는 aria-checked(부분 체크는 "mixed")로 알리고, 안의 체크박스 자체는 aria-hidden 입니다. 자식을 불러오는 동안 aria-busy 가 붙습니다.',
            'aria-label 로 트리 이름을 주세요(기본 "트리"). searchable 검색창은 searchPlaceholder 를 aria-label 로 씁니다.',
        ],
    },
}
