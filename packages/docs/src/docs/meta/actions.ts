import type { DocMetaMap } from '../types'
import ButtonUsage from '../usage/ButtonUsage?raw'
import ButtonGroupUsage from '../usage/ButtonGroupUsage?raw'
import SplitButtonUsage from '../usage/SplitButtonUsage?raw'
import ToggleUsage from '../usage/ToggleUsage?raw'
import ToolbarUsage from '../usage/ToolbarUsage?raw'

export const actionsMeta: DocMetaMap = {
    'c-button': {
        components: ['Button'],
        usage: ButtonUsage,
        a11y: [
            '<button> 으로 그립니다. type 을 따로 주지 않으므로 폼 안에서 제출 버튼이 아니면 type="button" 을 넘기세요.',
            'iconOnly 버튼은 aria-label 이 있어야 합니다. 문자열 tooltip 을 주면 그 값이 aria-label 로 쓰입니다.',
            'loading 중에는 비활성이 되고 aria-busy 가 붙습니다.',
            'selected 를 주면 토글 버튼이 되어 aria-pressed 로 눌림 상태를 알립니다.',
            'shortcut 은 aria-keyshortcuts 로, confirm 이 있으면 aria-haspopup="dialog" 로 알립니다.',
        ],
    },
    'c-buttongroup': {
        components: ['ButtonGroup'],
        usage: ButtonGroupUsage,
        composition: `
ButtonGroup             size · appearance · tone 을 내려줌
└── Button              자기 prop 이 있으면 그쪽이 이김`,
        a11y: [
            'role="group" 인 <div> 로 묶습니다. 무엇을 하는 묶음인지 aria-label 로 이름을 붙이세요.',
            '방향키 이동은 따로 없고, 안의 Button 은 각각 Tab 으로 잡힙니다.',
        ],
    },
    'c-splitbutton': {
        components: ['SplitButton'],
        usage: SplitButtonUsage,
        composition: `
items: MenuItemDef[]
├── { label, icon?, shortcut?, tone?, disabled?, onSelect? }   항목
├── { type: 'separator' }                                     구분선
└── { type: 'label', label }                                  묶음 제목`,
        compositionNote: '주 동작은 children 과 onClick 으로, 보조 동작은 items 로 받습니다.',
        a11y: [
            '주 버튼과 화살표 버튼을 붙은 ButtonGroup(role="group") 으로 그립니다.',
            '화살표 버튼은 menuLabel(기본 "옵션 더 보기") 을 aria-label 로 쓰고 aria-haspopup="menu" · aria-expanded 를 가집니다.',
            '화살표 버튼에서 ↑ · ↓ 로도 메뉴가 열리고, 메뉴 안에서는 ↑ ↓ Home End 로 옮기며 Esc 로 닫으면 화살표 버튼으로 포커스가 돌아옵니다.',
            'disabled 나 loading 이면 화살표 버튼도 비활성이 됩니다.',
        ],
    },
    'c-toggle': {
        components: ['Toggle', 'ToggleGroup'],
        usage: ToggleUsage,
        composition: `
ToggleGroup             type single · multiple, value
└── Toggle value="…"   value 로 그룹 안 항목을 가리킴`,
        compositionNote: 'value 가 없는 Toggle 은 그룹 안에 있어도 pressed · defaultPressed 로 혼자 켜고 끕니다.',
        a11y: [
            'Toggle 은 <button> 이고 눌림 상태를 aria-pressed 로 알립니다. 아이콘만 있으면 aria-label 을 넘기세요.',
            'ToggleGroup 은 role="group" 입니다. aria-label 로 이름을 붙이세요.',
            'ToggleGroup 안에서 ← → (vertical 이면 ↑ ↓) 로 비활성이 아닌 항목 사이를 옮기고 끝에서 처음으로 돌아갑니다. 포커스만 옮기므로 Enter · Space 로 켭니다.',
        ],
    },
    'c-toolbar': {
        components: ['Toolbar', 'ToolbarGroup', 'ToolbarSeparator'],
        usage: ToolbarUsage,
        composition: `
Toolbar                 안쪽 Button 기본 ghost · neutral · size
├── ToolbarGroup        관련 항목 묶음
│   └── Button · Toggle
├── ToolbarSeparator    세로 구분선
├── ToolbarSpacer       뒤 항목을 오른쪽 끝으로
└── (overflow="menu")   overflowItems 를 ··· 메뉴로`,
        a11y: [
            'role="toolbar" 로 그립니다. aria-label 로 이름을 붙이세요.',
            'Tab 으로 한 번 들어오고(마지막에 있던 항목), ← → 로 항목 사이를 옮기며 Home · End 로 처음 · 끝으로 갑니다. 다음 Tab 은 툴바 밖으로 나갑니다. 글자 입력칸 안에서는 화살표가 커서를 움직입니다.',
            'ToolbarGroup 은 role="group", ToolbarSeparator 는 role="separator" · aria-orientation="vertical" 이고 ToolbarSpacer 는 aria-hidden 입니다.',
            'overflow="menu" 의 ··· 버튼은 overflowLabel(기본 "더 보기") 을 aria-label 로 쓰는 메뉴 버튼입니다.',
        ],
    },
}
