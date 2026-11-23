import type { DocMetaMap } from '../types'
import AreaChartUsage from '../usage/AreaChartUsage?raw'
import BarChartUsage from '../usage/BarChartUsage?raw'
import CartesianChartUsage from '../usage/CartesianChartUsage?raw'
import GaugeUsage from '../usage/GaugeUsage?raw'
import LineChartUsage from '../usage/LineChartUsage?raw'
import MiniChartsUsage from '../usage/MiniChartsUsage?raw'
import PieChartUsage from '../usage/PieChartUsage?raw'
import RadarChartUsage from '../usage/RadarChartUsage?raw'
import RadialChartUsage from '../usage/RadialChartUsage?raw'

/** LineChart · BarChart · AreaChart 공용 데이터 모양 */
const SERIES_TREE = `
labels: string[]            x축 라벨
series: Series[]            여러 시리즈 (있으면 data 대신)
├── label                   범례 · tooltip 이름
├── values                  labels 순서의 값 (null 은 빈칸)
├── tone | color            색 (없으면 순서대로 팔레트)
├── dashed                  점선
├── axis                    'left' | 'right' (오른쪽 보조축)
├── stack                   같은 이름끼리 쌓기
└── type                    'bar' | 'line' | 'area'

data: ChartPoint[]          단일 시리즈 단축형
├── label
└── value`

/** CartesianChart 위에 그린 차트들의 공통 접근성 */
const CARTESIAN_A11Y = [
    '차트 svg 는 role="img" 이고 aria-label 로 접근성 이름을 줍니다. 무엇을 보여 주는지 적어 주세요.',
    '범례 항목은 <button> 이고 aria-pressed 로 시리즈가 보이는지 알립니다. Tab 으로 잡히고 Enter · Space 로 시리즈를 숨기거나 켭니다.',
    'tooltip 은 마우스를 올릴 때만 role="status" 로 나타납니다. 막대 · 점 클릭(onPointClick)도 마우스 전용이므로, 같은 동작은 표 · 버튼 같은 다른 수단으로도 열어 두세요.',
    'loading 중에는 aria-busy="true" 가 붙습니다.',
]

export const chartsMeta: DocMetaMap = {
    'c-linechart': {
        components: ['LineChart'],
        usage: LineChartUsage,
        composition: SERIES_TREE,
        compositionNote: '시리즈가 하나면 data 만, 여럿이면 labels + series 를 씁니다. 시리즈가 둘 이상이면 범례가 위에 자동으로 나옵니다.',
        a11y: CARTESIAN_A11Y,
    },
    'c-barchart': {
        components: ['BarChart'],
        usage: BarChartUsage,
        composition: SERIES_TREE,
        compositionNote: 'series 의 type 을 line 으로 주면 막대와 선을 섞어 그립니다. 같은 stack 이름끼리 쌓습니다.',
        a11y: CARTESIAN_A11Y,
    },
    'c-areachart': {
        components: ['AreaChart'],
        usage: AreaChartUsage,
        composition: SERIES_TREE,
        compositionNote: 'AreaChart 는 data 단축형 없이 labels + series 만 받습니다. stackMode 로 겹치기 · 쌓기 · 100% 쌓기를 고릅니다.',
        a11y: CARTESIAN_A11Y,
    },
    'c-cartesian': {
        components: ['CartesianChart'],
        usage: CartesianChartUsage,
        composition: `
labels: string[]                      x축 범주
data: Record<string, number | null>[] labels 와 같은 순서의 행
series: ChartSeries[]
├── key                               data 행에서 값을 읽을 키
├── type                              'bar' | 'line' | 'area'
├── label                             범례 · tooltip 이름
├── tone                              톤 또는 CSS 색
├── axis                              'left' | 'right'
├── stack                             같은 이름끼리 쌓기
├── smooth · step · dashed · showDots 선 모양
└── hidden                            처음부터 숨김 (범례로 켬)
referenceLines: { value, label, axis, tone, dashed }[]
bands: { from, to, axis, tone, label }[]
annotations: { x, label, tone }[]`,
        compositionNote: '한 행(data[i])에 여러 시리즈 값을 키로 담고, series 의 key 로 골라 그립니다. LineChart · BarChart · AreaChart 는 이 컴포넌트를 감싼 단축형입니다.',
        a11y: [
            ...CARTESIAN_A11Y,
            'brush 를 켜면(라벨 9개 이상) 아래 구간 손잡이가 role="slider" 로 Tab 에 잡히고, ← → 로 구간 시작 · 끝을 한 칸씩 옮깁니다. aria-valuetext 로 해당 라벨을 읽습니다.',
        ],
        functions: [
            {
                name: 'chartColor',
                signature: 'chartColor(t?: Tone | string, i?: number): string',
                description: '톤 이름을 차트 팔레트 색으로 바꿉니다. 톤이 없으면 i 번째 기본 시리즈 색을, CSS 색이면 그대로 돌려줍니다. 차트 옆에 직접 그린 범례 색을 맞출 때 씁니다.',
            },
        ],
    },
    'c-pie': {
        components: ['PieChart', 'DonutChart'],
        usage: PieChartUsage,
        composition: `
data: PieDatum[]
├── label            범례 · tooltip 이름
├── value            값 (합계 대비 비율로 조각 크기)
└── tone | color     색 (없으면 순서대로 팔레트)

DonutChart
├── centerValue      가운데 큰 값
└── centerLabel      가운데 값 아래 설명`,
        compositionNote: 'minSlice 를 주면 그 비율(%) 미만 조각을 "기타" 하나로 묶습니다.',
        a11y: [
            'svg 는 role="img" 입니다. aria-label 이 없으면 "가동 79.2%, 대기 11.2%" 처럼 조각별 이름과 비율을 이어 붙여 읽습니다.',
            'DonutChart 가운데 값 · 설명은 aria-hidden 이라 읽히지 않습니다. 필요하면 aria-label 에 함께 적어 주세요.',
            'tooltip 은 조각에 마우스를 올릴 때만 role="status" 로 나타나고, 조각 클릭(onSliceClick)도 마우스 전용입니다.',
        ],
    },
    'c-radarchart': {
        components: ['RadarChart'],
        usage: RadarChartUsage,
        composition: `
axes: string[]          축 이름 (12시부터 시계방향)
series: RadarSeries[]
├── label (name)        범례 · tooltip 이름
├── values              axes 순서의 값
└── tone | color        색
max: number | number[]  공통 최댓값 또는 축별 최댓값`,
        compositionNote: '단위가 다른 지표를 함께 놓을 때는 max 를 축 순서의 배열로 줍니다.',
    },
    'c-radialchart': {
        components: ['RadialChart'],
        usage: RadialChartUsage,
        composition: `
data: RadialDatum[]     첫 항목이 가장 안쪽 링
├── label               범례 · tooltip 이름
├── value               max 대비 비율이 호 길이
└── color               직접 색 (없으면 기본 팔레트)
max                     한 바퀴에 해당하는 값 (없으면 data 최댓값)`,
    },
    'c-gauge': {
        components: ['Gauge'],
        usage: GaugeUsage,
        a11y: [
            'role="meter" 에 aria-valuenow · aria-valuemin · aria-valuemax 를 붙여 현재 값을 알립니다.',
            '접근성 이름은 aria-label, 없으면 문자열 label 을 씁니다. label 이 문자열이 아니면 aria-label 을 넘기세요.',
            '호 그림(svg)은 aria-hidden 이고, 가운데 값 글자는 그대로 읽힙니다.',
        ],
    },
    'c-minicharts': {
        components: ['SegmentMeter', 'UptimeBar', 'InlineBar', 'StepChart', 'MiniGauge', 'TargetScatter', 'Sparkline'],
        usage: MiniChartsUsage,
        a11y: [
            'SegmentMeter 는 role="img" 이고, aria-label 이 없으면 구간 이름과 값을 이어 붙여 읽습니다.',
            'UptimeBar 의 칸 목록은 role="list" 이고 각 칸은 "날짜 상태" aria-label 을 가진 버튼이라 Tab 으로 하나씩 훑을 수 있습니다. 포커스가 간 칸에도 tooltip 이 뜹니다.',
            'InlineBar 와 MiniGauge(arc)는 role="meter" 와 aria-valuenow · aria-valuemax 로 값을 알립니다. MiniGauge lollipop 은 그림을 숨기고 값 글자만 읽힙니다.',
            'StepChart 는 "상태 단계: 가동 → 대기" 처럼, TargetScatter 는 "측정점 N개" 로 role="img" 이름을 붙입니다.',
            'Sparkline 은 aria-label 을 주면 role="img" 로 읽히고, 없으면 aria-hidden 으로 숨겨집니다.',
        ],
    },
}
