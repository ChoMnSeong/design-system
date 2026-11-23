import type { DocMetaMap } from '../types'
import GanttChartUsage from '../usage/GanttChartUsage?raw'
import ParetoChartUsage from '../usage/ParetoChartUsage?raw'
import StatusTimelineUsage from '../usage/StatusTimelineUsage?raw'

export const industrialMeta: DocMetaMap = {
    'c-pareto': {
        components: ['ParetoChart', 'ControlChart'],
        usage: ParetoChartUsage,
        a11y: [
            '두 차트 모두 CartesianChart 로 그려 svg 가 role="img" 입니다. aria-label 로 무엇을 보여 주는지 적어 주세요.',
            'ParetoChart 범례(건수 · 누적 비율)는 aria-pressed 버튼이라 Tab · Enter · Space 로 시리즈를 숨기거나 켭니다. ControlChart 는 범례가 없습니다.',
            'ControlChart 는 규칙을 어긴 점이 있으면 차트 아래에 aria-label="관리 이탈" 목록으로 규칙 이름과 해당 점 라벨을 글자로 보여 줍니다.',
        ],
        functions: [
            {
                name: 'WESTERN_ELECTRIC',
                signature: 'const WESTERN_ELECTRIC: ControlRule[]',
                description: 'ControlChart 의 기본 이상 판정 규칙 4개(3σ 밖 1점 · 2σ 밖 3점 중 2점 · 1σ 밖 5점 중 4점 · 한쪽 연속 8점). rules 에 일부만 골라 넘길 수 있습니다.',
            },
            {
                name: 'NELSON',
                signature: 'const NELSON: ControlRule[]',
                description: 'WESTERN_ELECTRIC 에 연속 6점 증가 · 감소와 14점 지그재그 규칙을 더한 목록입니다. rules="nelson" 과 같습니다.',
            },
        ],
    },
    'c-statustimeline': {
        components: ['StatusTimeline', 'BulletChart'],
        usage: StatusTimelineUsage,
        composition: `
statusMap: Record<상태 키, { label, tone | color }>
range: [시작, 끝]
rows[]                    행 = 설비
├── id
├── label
└── segments: StatusSegment[]
    ├── from · to         Date | ISO 문자열
    ├── status            statusMap 의 키
    └── note              tooltip 에 붙는 메모`,
        compositionNote: 'statusMap 에 적은 순서대로 위쪽 범례가 그려집니다. 없는 상태 키는 이름 그대로 neutral 색으로 그립니다.',
        a11y: [
            'StatusTimeline 의 각 구간은 "프레스 1호 가동 06:00부터 10:30까지" 같은 aria-label 을 가진 <button> 이라 Tab 으로 잡히고 Enter · Space 로 onSegmentClick 이 불립니다.',
            'zoom(드래그 확대 · 더블클릭 복귀)은 포인터 전용입니다.',
            'BulletChart 는 role="meter" 와 aria-valuenow · aria-valuemax 로 값을 알리고, label 이 문자열이면 접근성 이름으로 씁니다.',
        ],
    },
    'c-gantt': {
        components: ['GanttChart', 'Heatmap', 'WaterfallChart'],
        usage: GanttChartUsage,
        composition: `
tasks: GanttTask[]
├── id                     parent · dependencies 에서 참조
├── name
├── start · end            Date | ISO 문자열
├── progress               0~100
├── parent                 상위 작업 id (접히는 트리)
├── type                   'task' | 'milestone'
└── tone
dependencies[]
└── { from, to, type }     'FS' | 'SS' | 'FF'

Heatmap
├── rows: string[]
├── columns: string[]
└── values[행][열]          null 은 빈 칸

WaterfallChart
└── steps[]
    └── { label, value, type }   'total' 합계 · 'delta' 증감`,
        compositionNote: 'GanttChart 는 parent 로 이은 작업을 들여 쓴 트리로 그리고, 하위 작업이 있는 행에만 접기 버튼을 붙입니다.',
        a11y: [
            'GanttChart 의 접기 버튼은 aria-expanded 로 펼침 상태를 알립니다. 일정 그림은 role="img" aria-label="작업 일정" 입니다.',
            'GanttChart 막대 끌기(onTaskChange)는 포인터 전용이므로, 날짜를 바꾸는 다른 입력 수단을 함께 두세요.',
            'Heatmap 은 <table> 에 열 · 행 머리(th scope)를 두어 칸마다 행 · 열 이름을 읽을 수 있습니다. aria-label 로 표 이름을 주세요. 칸 클릭(onCellClick)은 마우스 전용입니다.',
            'WaterfallChart 는 role="img" 이고 "시작 120, 자재비 30" 처럼 단계 이름과 값을 이어 붙여 읽습니다.',
        ],
    },
}
