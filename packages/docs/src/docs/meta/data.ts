import type { DocMetaMap } from '../types'
import TableUsage from '../usage/TableUsage?raw'
import DataTableUsage from '../usage/DataTableUsage?raw'
import DataGridUsage from '../usage/DataGridUsage?raw'
import DescriptionsUsage from '../usage/DescriptionsUsage?raw'
import TimelineUsage from '../usage/TimelineUsage?raw'
import CalendarUsage from '../usage/CalendarUsage?raw'

export const dataMeta: DocMetaMap = {
    'c-table': {
        components: ['Table', 'TableHeaderCell', 'TableRow', 'TableCell', 'TableHead', 'TableBody', 'TableFooter'],
        usage: TableUsage,
        composition: `
Table                   바깥 스크롤 상자 + <table>
├── TableHead           <thead>
│   └── TableRow
│       └── TableHeaderCell   align · sortDirection
├── TableBody           <tbody>
│   └── TableRow        selected
│       └── TableCell   align
└── TableFooter         <tfoot> 합계 줄`,
        compositionNote: '모두 네이티브 표 요소를 그대로 그리는 얇은 껍데기입니다. 정렬 · 선택 같은 동작은 부모가 상태를 들고 props 로 표시만 넘깁니다.',
        a11y: [
            '<table> · <thead> · <tbody> · <tfoot> · <tr> · <th> · <td> 를 그대로 써서 스크린 리더의 표 탐색이 그대로 동작합니다.',
            'TableHeaderCell 의 sortDirection 은 aria-sort(ascending · descending)로 알리고, 화살표 아이콘은 aria-hidden 입니다.',
            'TableHeaderCell 은 정렬 표시(aria-sort)만 하고 클릭 · 키보드 동작을 넣지 않습니다. 정렬 기능이 필요하면 셀 안에 <button> 을 넣거나 DataTable · DataGrid 를 쓰세요.',
            'TableRow 의 selected 는 aria-selected 로 알립니다.',
        ],
    },
    'c-datatable': {
        components: ['DataTable'],
        usage: DataTableUsage,
        composition: `
columns: DataTableColumn<T>[]
├── id            열 키. accessor 가 없으면 row[id] 가 값
├── header        머리 글자
├── accessor      (row) => 값
├── cell          (row, { value, rowIndex }) => 셀 내용
├── format        값 표시 서식 (cell 이 없을 때)
├── sortable · filter { type: 'text' | 'select' | 'number' }
├── width · minWidth · maxWidth · align · pinned · resizable
├── hideable · hidden          열 설정 패널
├── editor · editorOptions     'input' | 'number' | 'select' | 'date'
├── aggregate     'sum' | 'avg' | 'count' | 'min' | 'max' | (rows) => 내용
├── type: 'bar' · barMax · barTone   값을 막대로
└── columns       하위 열 (다단 헤더)`,
        a11y: [
            '정렬할 수 있는 열 머리는 <button> 이라 Tab 으로 잡히고 Enter · Space 로 정렬을 바꿉니다. 정렬 상태는 <th> 의 aria-sort 로 알립니다.',
            '열 필터 버튼은 "{열} 필터" 라벨과 aria-expanded 를 가지며, 값이 있으면 라벨에 값이 함께 읽힙니다.',
            'selection 이면 행마다 "{키} 선택" 라벨의 체크박스(single 은 라디오)가 붙고 행에 aria-selected 가 붙습니다. 펼침 버튼은 aria-expanded 와 "상세 펼치기 · 접기" 라벨을 가집니다.',
            'editable 이고 editor 가 있는 셀은 Tab 으로 잡히고 Enter · F2 로 편집을 시작합니다. 글자 · 숫자 편집기는 Enter 로 저장, Esc 로 취소합니다.',
            '불러오는 중에는 표 스크롤 영역에 aria-busy 가 붙고, 이미 행이 있으면 "불러오는 중" 라벨의 role="status" 막대가 나옵니다.',
        ],
    },
    'c-datagrid': {
        components: ['DataGrid'],
        usage: DataGridUsage,
        composition: `
columns: GridColumn<T>[]
├── field                 값 키 (valueGetter 가 없으면 row[field])
├── headerName
├── children              하위 열 → 다단 헤더 (열 그룹)
├── width · minWidth · flex
├── pinned                'left' | 'right'
├── sortable · resizable · hide · align
├── menu                  'sort' | 'pin' | 'autosize' | 'hide' | 'group'
├── filter                'text' | 'number' | 'date' | 'set' | (value, row, model) => boolean
│   ├── floatingFilter    머리 아래 필터 줄
│   └── filterValues      set 후보값 (배열 또는 비동기 함수)
├── valueGetter · valueFormatter   'number' | 'percent' | 'date' | 함수
├── editable · cellEditor · cellEditorOptions · validate
├── aggFunc               'sum' | 'avg' | 'min' | 'max' | 'count' | 함수
├── cellRenderer          'bar' | 'sparkline' | 'badge' | 'avatar' | 'delta' | 함수
│   └── cellRendererParams  bar { max, tone } · badge { toneMap } · delta { goodWhen }
└── cellClassRules        { danger: (p) => … } 톤 이름이면 셀 바탕`,
        compositionNote: '열 하나가 정렬 · 필터 · 편집 · 집계 · 표시 방식을 모두 들고 있습니다. 그리드 전체 동작(그룹 · 피벗 · 트리 · 범위 선택 · 가상화)은 DataGrid props 로 켭니다.',
        a11y: [
            '본문 스크롤 영역이 role="grid" 이고 tabIndex=0 이라 Tab 으로 잡힙니다. 처음 화살표를 누르면 첫 칸부터, 이후 화살표로 포커스 셀을 옮기고 aria-activedescendant 로 지금 칸을 알립니다. cellSelection 이면 Shift+화살표로 범위를 넓힙니다.',
            'Enter · F2 로 편집을 시작하고 편집기에서 Enter · Tab 은 저장, Esc 는 취소입니다. Delete · Backspace 는 선택 범위의 값을 지웁니다.',
            'clipboard 면 Ctrl/⌘+C · V 로 복사 · 붙여넣기, undoRedo 면 Ctrl/⌘+Z 되돌리기 · Shift+Z 또는 Y 다시 하기가 됩니다.',
            '정렬할 수 있는 머리 칸은 Tab 으로 잡히고 Enter · Space(Shift 와 함께면 다중)나 클릭으로 정렬하며, 상태는 aria-sort 로 알립니다. 열 메뉴 · 값 필터 버튼은 "{열} 열 메뉴" · "{열} 값 필터" 라벨을 가집니다.',
            '그룹 · 트리 펼침 버튼은 aria-expanded 를 가집니다. 상태 막대는 role="status", 오류는 role="alert", 불러오는 중에는 aria-busy 로 알립니다.',
        ],
    },
    'c-descriptions': {
        components: ['Descriptions'],
        usage: DescriptionsUsage,
        a11y: [
            '<dl> · <dt> · <dd> 로 그려 라벨과 값이 짝으로 읽힙니다.',
            'title 은 제목 요소가 아닌 <div> 로 그립니다. 문서 구조에 제목이 필요하면 바깥에 직접 <h2> 등을 두세요.',
        ],
    },
    'c-timeline': {
        components: ['Timeline'],
        usage: TimelineUsage,
        a11y: [
            '<ol> · <li> 순서 목록으로 그려 항목 수와 순서가 읽힙니다.',
            '점 · 세로선 · 점 안 아이콘은 aria-hidden 이라 tone 과 icon 의 의미는 읽히지 않습니다. 성공 · 실패 같은 구분은 title 이나 description 글자에도 적으세요.',
            'pending 항목은 시간 칸에 "대기" 글자가 함께 그려집니다.',
        ],
    },
    'c-calendar': {
        components: ['Calendar'],
        usage: CalendarUsage,
        a11y: [
            '전체는 role="group"(기본 aria-label "달력")이고, 날짜 보기에서 달마다 role="grid" 에 "2026년 11월" 같은 이름이 붙습니다. 머리의 연월 글자는 aria-live="polite" 로 바뀐 달을 알립니다.',
            '포커스된 날짜 하나만 Tab 으로 잡힙니다. 화살표로 하루 · 한 주, PageUp · PageDown 으로 한 달, Home · End 로 주의 처음 · 끝으로 옮기고 Enter · Space 로 고릅니다.',
            '날짜 칸은 요일까지 든 전체 날짜를 aria-label 로 읽고, 선택은 aria-selected, 오늘은 aria-current="date", 고를 수 없는 날은 aria-disabled 로 알립니다.',
            '월 · 분기 · 연 picker 에서는 칸이 버튼이고 선택 상태를 aria-pressed 로 알립니다. 이전 · 다음 버튼에는 "이전 달" 같은 라벨이 붙습니다.',
        ],
    },
}
