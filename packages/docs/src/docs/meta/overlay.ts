import type { DocMetaMap } from '../types'
import DialogUsage from '../usage/DialogUsage?raw'
import DrawerUsage from '../usage/DrawerUsage?raw'
import TooltipUsage from '../usage/TooltipUsage?raw'
import MenuUsage from '../usage/MenuUsage?raw'
import CommandPaletteUsage from '../usage/CommandPaletteUsage?raw'

export const overlayMeta: DocMetaMap = {
    'c-dialog': {
        components: ['Dialog', 'DialogActions'],
        usage: DialogUsage,
        composition: `
Dialog                  trigger 또는 open · onOpenChange
├── title · description 머리 (h2 · p)
├── children            본문
└── footer
    └── DialogActions   오른쪽 정렬 버튼 묶음`,
        compositionNote: '간단한 예 · 아니오 확인은 컴포넌트를 두지 않고 confirm() 을 await 해서 씁니다.',
        a11y: [
            'role="dialog"(tone 이 danger · warning 이면 alertdialog)와 aria-modal 을 달고, title · description 을 aria-labelledby · aria-describedby 로 연결합니다.',
            '열리면 initialFocus → [data-autofocus] → 대화상자 순서로 포커스를 옮기고, Tab · Shift+Tab 은 안에서만 돕니다. 열린 동안 페이지 스크롤을 잠그고, 닫히면 열기 전 요소로 포커스를 돌려줍니다.',
            'Esc(closeOnEsc) · 배경 클릭(closeOnBackdrop) · "닫기" 버튼으로 닫습니다. onBeforeClose 가 false 를 돌려주면 닫지 않습니다.',
            'trigger 로 넘긴 요소에는 aria-haspopup="dialog" 가 붙습니다.',
            'confirm() 은 확인 버튼에 먼저 포커스하고, Esc · 배경 클릭 · 취소는 모두 false 로 끝납니다.',
        ],
        functions: [
            {
                name: 'confirm',
                signature: '(opts: { title, description?, tone?, confirmText?, cancelText? }) => Promise<boolean>',
                description: '확인 대화상자를 띄우고 확인이면 true, 취소 · Esc · 배경 클릭이면 false 로 풀립니다. 테마 CSS 변수가 문서 루트에 있어야 합니다(Provider applyTo="root", 기본값).',
            },
        ],
    },
    'c-drawer': {
        components: ['Drawer'],
        usage: DrawerUsage,
        a11y: [
            'role="dialog" 이고 title 을 aria-labelledby 로 연결합니다. 열리면 패널로 포커스를 옮기고 닫히면 열기 전 요소로 돌려줍니다.',
            'modal(기본)이면 aria-modal 을 달고 Tab 을 패널 안에 가두며 페이지 스크롤을 잠급니다. modal={false} 면 가두기 · 잠금 없이 페이지와 함께 씁니다.',
            'Esc(closeOnEsc) · "닫기" 버튼으로 닫고, 배경 클릭(closeOnBackdrop)은 modal 일 때만 닫습니다.',
            'resizable 손잡이는 role="separator" · "패널 크기" 라벨을 가지며 포인터로만 끌 수 있습니다.',
        ],
    },
    'c-tooltip': {
        components: ['Popover', 'Tooltip', 'HoverCard'],
        usage: TooltipUsage,
        a11y: [
            'Tooltip 은 마우스를 올리거나 키보드 포커스가 오면 delay 뒤에 열리고 Esc 로 닫힙니다. 말풍선은 role="tooltip" 이고 열린 동안 트리거에 aria-describedby 로 연결됩니다.',
            'Tooltip · HoverCard 는 자식 요소에 이벤트를 덧붙이므로 자식은 버튼 · 링크처럼 포커스를 받는 요소여야 키보드로도 열립니다.',
            'Popover 트리거에는 aria-haspopup="dialog" · aria-expanded · aria-controls 가 붙고, 패널은 role="dialog"(이름은 aria-label prop)입니다. Esc 로 닫으면 포커스가 트리거로 돌아갑니다.',
            'Popover modal 이면 열릴 때 패널 안 첫 요소로 포커스를 옮기고 Tab 을 안에서 돌립니다. openOn="click" 은 바깥을 누르면 닫힙니다.',
            'HoverCard 는 openOn="hover" Popover 라 키보드 포커스에서도 열리고 포커스가 빠지면 닫힙니다.',
        ],
    },
    'c-menu': {
        components: ['Menu', 'MenuItem', 'MenuCheckboxItem', 'MenuRadioGroup', 'MenuRadioItem', 'MenuSub', 'ContextMenu'],
        usage: MenuUsage,
        composition: `
Menu                    trigger · items 또는 children
├── MenuLabel           구역 이름
├── MenuItem            icon · shortcut · tone
├── MenuCheckboxItem    checked · onCheckedChange
├── MenuRadioGroup      value · onValueChange
│   └── MenuRadioItem   value
├── MenuSeparator
└── MenuSub             label · 한 단계 아래 메뉴
    └── MenuItem …

ContextMenu             children(대상) · items 또는 content`,
        compositionNote: 'children 대신 items: MenuItemDef[] 로 줄 수도 있습니다. 항목은 { label, icon?, shortcut?, tone?, disabled?, onSelect? } · { type: "separator" } · { type: "label", label } 입니다.',
        a11y: [
            '트리거에 aria-haspopup="menu" · aria-expanded · aria-controls 가 붙습니다. 키보드(Enter · Space · ↑ · ↓)로 열면 첫 항목에, 마우스로 열면 메뉴 자체에 포커스합니다.',
            '메뉴는 role="menu", 항목은 menuitem · menuitemcheckbox · menuitemradio(aria-checked)입니다. ↑ · ↓ 는 순환하며 옮기고 Home · End 는 처음 · 끝으로 가며, 비활성 항목은 건너뜁니다.',
            'Esc 는 메뉴를 닫고 트리거로 포커스를 돌려주며, Tab 도 메뉴를 닫습니다. MenuItem 을 누르면 닫히고, 체크 · 라디오 항목은 closeOnSelect 를 주지 않으면 열어 둡니다.',
            'MenuSub 는 → · Enter · Space 로 열어 첫 항목에 포커스하고, ← · Esc 로 닫아 상위 항목으로 돌아갑니다.',
            'ContextMenu 는 오른쪽 클릭 외에 Shift+F10 · 메뉴 키로도 열리고, 닫히면 대상 요소로 포커스를 돌려줍니다. 키보드로 열려면 대상이 포커스를 받아야 하니 tabIndex={0} 등을 주세요.',
        ],
    },
    'c-commandpalette': {
        components: ['CommandPalette'],
        usage: CommandPaletteUsage,
        composition: `
items: CommandItem[]
├── id            항목 키 (최근 기록에도 쓰임)
├── label         이름 · 검색 대상
├── description   이름 아래 보조 설명
├── icon
├── group         같은 이름끼리 묶어 표시
├── keywords      검색에만 쓰는 추가 단어
├── shortcut      'Ctrl K' 처럼 공백으로 키를 나눔
├── disabled
└── onSelect      실행 (실행 뒤 창이 닫힘)`,
        compositionNote: 'loadItems 로 서버 검색 결과를 받으면 items 뒤에 붙습니다. recent 를 켜면 최근 실행한 항목이 맨 위 "최근" 그룹에 나옵니다.',
        a11y: [
            '창은 role="dialog" · aria-modal · "명령 팔레트" 라벨입니다. 열리면 검색 입력에 포커스하고 Tab 을 창 안에 가두며, Esc · 배경 클릭으로 닫히면 열기 전 요소로 포커스를 돌려줍니다.',
            '검색 입력은 role="combobox" 이고 aria-controls 로 role="listbox" 결과 목록과 연결됩니다. 포커스는 입력에 둔 채 ↑ · ↓ 로 활성 항목을 옮기고(aria-activedescendant) Enter 로 실행합니다.',
            '결과는 role="option"(활성 항목 aria-selected)이고 그룹은 그룹 이름을 aria-label 로 가진 role="group" 입니다. disabled 항목은 aria-disabled 이며 실행되지 않습니다.',
            'hotkey(기본 mod+k: macOS ⌘K, 그 밖 Ctrl+K)로 어디서든 열고 닫습니다. false 면 끕니다.',
        ],
    },
}
