import type { DocMetaMap } from '../types'
import CardUsage from '../usage/CardUsage?raw'
import CardSlotsUsage from '../usage/CardSlotsUsage?raw'
import KpiCardUsage from '../usage/KpiCardUsage?raw'
import TabsUsage from '../usage/TabsUsage?raw'
import AccordionUsage from '../usage/AccordionUsage?raw'

export const surfacesMeta: DocMetaMap = {
    'c-card': {
        components: ['Card', 'CardHeader', 'CardMetric', 'CardDelta'],
        usage: CardUsage,
        composition: `
Card
├── Card.Media          이미지 (위 · 왼쪽)
├── Card.Header         actions · extra
│   ├── Card.Title
│   └── Card.Description
├── Card.Body
├── Card.Section        구분선으로 나뉜 영역
└── Card.Footer

Card                    대시보드 카드
├── Card.Eyebrow        작은 제목 (아이콘)
├── Card.Actions        오른쪽 위 버튼
├── Card.Metric         큰 숫자 + 단위
├── Card.Delta          증감
├── Card.Visual         차트 · 스파크라인
└── Card.Note           아래 보조 문구 · 링크`,
        compositionNote: '하위 컴포넌트는 Card.Header 처럼 점으로 쓰거나 CardHeader 처럼 따로 가져와 쓸 수 있습니다. 모두 생략할 수 있고, 넣은 것만 순서대로 그립니다.',
        a11y: [
            'interactive(또는 onClick)면 카드 전체가 role="button" 이 되어 Tab 으로 잡히고 Enter · Space 로 눌립니다.',
            'selectable 이면 role="checkbox" 와 aria-checked 로 선택 상태를 알립니다.',
            'collapsible 이면 머리의 접기 버튼에 aria-expanded · aria-controls 가 붙습니다. 이때 카드 자체는 버튼이 되지 않습니다.',
            'disabled 는 aria-disabled, loading 은 aria-busy 로 알립니다.',
        ],
    },
    'c-cardslots': {
        components: ['CardMetric', 'CardDelta', 'CardEyebrow', 'CardActions', 'CardVisual', 'CardNote'],
        usage: CardSlotsUsage,
        composition: `
Card                    surface · tone · status
├── Card.Eyebrow        작은 제목 (icon)
├── Card.Actions        오른쪽 위 아이콘 버튼 묶음
├── Card.Metric         큰 숫자 + 단위 (value · unit · size · format)
├── Card.Delta          증감 + 비교 기준 (value · goodWhen · comparison)
├── Card.Visual         차트 자리 (bleed · height)
└── Card.Note           아래 한 줄 설명 (icon · action)`,
        compositionNote: '슬롯은 모두 생략할 수 있고 넣은 순서대로 그립니다. Card.Delta 는 goodWhen 에 따라 좋으면 success, 나쁘면 danger 톤이 됩니다.',
        a11y: [
            'Card.Delta 는 ▲ · ▼ 기호와 부호로 증감 방향을 글자로도 보여 주어 색에만 기대지 않습니다.',
            'Card.Eyebrow · Card.Note 의 icon 은 aria-hidden 으로 그립니다.',
            'Card.Actions 에 아이콘만 있는 버튼을 넣으면 aria-label 을 주세요.',
        ],
    },
    'c-kpicard': {
        components: ['KpiCard', 'StatusCard'],
        usage: KpiCardUsage,
        composition: `
StatusCard
├── status: string                  statusMap 의 키
├── statusMap: Record<string, StatusDef>
│   └── { label, tone, pulse? }     상태별 라벨 · 톤
└── metrics?: { label, value, tone? }[]   2~4개`,
        compositionNote: 'statusMap 에 없는 status 는 그 값을 라벨로, neutral 톤으로 그립니다. 나머지 props 는 Card 로 넘어갑니다.',
        a11y: [
            'KpiCard 에 target 을 주면 달성률 막대가 role="progressbar" · aria-label="목표 달성률" 로 그려지고 aria-valuenow 로 달성률(%)을 알립니다.',
            'StatusCard 의 상태는 점과 함께 label 글자로 보여 주어 색에만 기대지 않습니다. 제목은 <h4> 로 그립니다.',
            'StatusCard 의 updatedAt 은 dateTime 을 가진 <time> 으로 그리고, 마우스를 올리면 정확한 시각이 보입니다.',
        ],
    },
    'c-tabs': {
        components: ['Tabs', 'Tab', 'TabPanel', 'TabList'],
        usage: TabsUsage,
        composition: `
Tabs                    value · appearance · orientation · overflow
├── TabList             탭 줄 (role="tablist")
│   └── Tab             value · icon · badge · closable (여러 개)
└── TabPanel            value 가 같은 Tab 과 짝 (여러 개)`,
        compositionNote: 'Tab 과 TabPanel 은 value 로 짝을 맞춥니다. 선택되지 않은 패널은 그리지 않고, keepMounted 면 한 번 연 패널을 숨긴 채 유지합니다.',
        a11y: [
            'tablist · tab · tabpanel 역할을 쓰고, Tab 의 aria-selected · aria-controls 와 TabPanel 의 aria-labelledby 로 서로 연결합니다.',
            '선택된 탭만 Tab 으로 잡히고, 가로는 ← →, 세로는 ↑ ↓, Home · End 로 다른 탭으로 옮기면 바로 선택됩니다. 비활성 탭은 건너뜁니다.',
            'closable 탭은 포커스한 채 Delete · Backspace 로 닫습니다.',
            'overflow="menu" 에서 넘친 탭은 aria-label="탭 N개 더 보기" 버튼의 메뉴로 옮겨집니다.',
            'TabPanel 은 tabIndex=0 이라 탭 다음에 패널로 포커스가 이동합니다. TabList 에 aria-label 을 주면 탭 묶음 이름이 됩니다.',
        ],
    },
    'c-accordion': {
        components: ['Accordion', 'AccordionItem'],
        usage: AccordionUsage,
        composition: `
Accordion               type(single · multiple) · value · appearance
└── AccordionItem       value · title · icon · extra · disabled (여러 개)
    └── children        펼치면 보이는 내용`,
        a11y: [
            '제목은 <h3> 안의 <button> 이고, aria-expanded · aria-controls 로 펼침 상태와 내용 영역을 알립니다.',
            '내용은 role="region" 과 aria-labelledby 로 제목과 연결되고, 닫히면 hidden 이 됩니다.',
            '제목 버튼은 Tab 으로 잡히고 Enter · Space 로 엽니다. disabled 항목은 버튼이 비활성이 됩니다.',
        ],
    },
}
