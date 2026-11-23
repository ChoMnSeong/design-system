import type { DocMetaMap } from '../types'
import FormFieldUsage from '../usage/FormFieldUsage?raw'
import LabelUsage from '../usage/LabelUsage?raw'
import FilterBarUsage from '../usage/FilterBarUsage?raw'

export const formsMeta: DocMetaMap = {
    'c-formfield': {
        components: ['FormField', 'Form'],
        usage: FormFieldUsage,
        composition: `
Form                    layout · labelWidth · size · disabled · readOnly · columns
└── FormField           label · required · description · hint · error · span
    └── 입력 컨트롤 하나  id · aria-describedby · aria-invalid · aria-required · invalid 주입`,
        compositionNote: 'FormField 의 자식이 요소 하나일 때만 id · aria 속성을 넣어 줍니다. Fragment 나 여러 요소면 넣지 않으니 htmlFor 와 id 를 직접 맞추세요.',
        a11y: [
            '라벨은 <label htmlFor> 로 입력에 연결됩니다. id 가 없으면 자동으로 만들어 자식에 넣습니다.',
            'description · hint · error 는 aria-describedby 로 입력에 이어지고, error 가 있으면 aria-invalid 가 붙고 문구는 role="alert" 로 읽힙니다.',
            'required 면 자식에 aria-required 가 붙고 라벨의 * 대신 스크린 리더에는 "(필수)" 가 읽힙니다.',
            'Form 의 disabled 는 <fieldset disabled> 로 하위 입력을 모두 막습니다.',
        ],
    },
    'c-label': {
        components: ['Label'],
        usage: LabelUsage,
        a11y: [
            '<label> 로 그립니다. htmlFor 를 입력의 id 와 맞추세요.',
            'required 의 * 는 aria-hidden 이고, 대신 숨은 "(필수)" 가 읽힙니다.',
            'tooltip 의 (i) 아이콘은 Tab 으로 잡히고 role="img" 와 aria-label(문자열 tooltip, 아니면 "도움말") 을 가집니다.',
        ],
    },
    'c-filterbar': {
        components: ['FilterBar'],
        usage: FilterBarUsage,
        composition: `
FilterBar
├── fields              조건 입력들 (FormField 로 감싸면 라벨이 붙음)
├── appliedChips        적용된 조건 칩
│   └── { label, onRemove? }
└── extra               조회 · 초기화 버튼 옆 추가 동작`,
        compositionNote: 'fields 를 <>…</> 로 묶어 넘겨도 조건 하나하나를 세어 collapsedRows 를 넘는 조건은 "조건 N개 더보기" 로 접습니다.',
        a11y: [
            'role="search" 인 <form> 으로 그립니다. 입력에서 Enter 를 누르면 제출되어 onSearch 가 불립니다.',
            '조회는 type="submit", 초기화는 type="reset" 버튼이라 폼의 기본 동작으로 onSearch · onReset 이 불립니다.',
            '"조건 N개 더보기" 버튼은 aria-expanded 로 펼침 상태를 알립니다.',
        ],
    },
}
