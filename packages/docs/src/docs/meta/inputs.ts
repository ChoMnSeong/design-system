import type { DocMetaMap } from '../types'
import InputUsage from '../usage/InputUsage?raw'
import TextareaUsage from '../usage/TextareaUsage?raw'
import NumberInputUsage from '../usage/NumberInputUsage?raw'
import SelectUsage from '../usage/SelectUsage?raw'
import CheckboxUsage from '../usage/CheckboxUsage?raw'
import RadioUsage from '../usage/RadioUsage?raw'
import SwitchUsage from '../usage/SwitchUsage?raw'
import SliderUsage from '../usage/SliderUsage?raw'
import SegmentedControlUsage from '../usage/SegmentedControlUsage?raw'
import DatePickerUsage from '../usage/DatePickerUsage?raw'
import TimePickerUsage from '../usage/TimePickerUsage?raw'
import ColorPickerUsage from '../usage/ColorPickerUsage?raw'
import FileUploadUsage from '../usage/FileUploadUsage?raw'
import RatingUsage from '../usage/RatingUsage?raw'
import OTPInputUsage from '../usage/OTPInputUsage?raw'

export const inputsMeta: DocMetaMap = {
    'c-input': {
        components: ['Input'],
        usage: InputUsage,
        a11y: [
            '<input> 으로 그리고 나머지 HTML 속성(id · aria-* 등)을 그대로 넘깁니다. 라벨은 FormField 로 감싸거나 aria-label 로 주세요.',
            'invalid 면 aria-invalid 가 붙습니다.',
            '지우기(×) 버튼은 aria-label="지우기" 이고 Tab 순서에서 빠집니다. 누르면 값을 비우고 입력으로 포커스를 돌립니다.',
            'password 의 보이기 버튼은 aria-pressed 로 상태를 알리고 이름이 "비밀번호 보기" · "비밀번호 숨기기" 로 바뀝니다.',
            'showCount 의 글자 수는 aria-live="polite" 로 읽힙니다.',
        ],
    },
    'c-textarea': {
        components: ['Textarea'],
        usage: TextareaUsage,
        a11y: [
            '<textarea> 로 그리고 나머지 HTML 속성을 그대로 넘깁니다. 라벨은 FormField 로 감싸거나 aria-label 로 주세요.',
            'invalid 면 aria-invalid 가 붙습니다.',
        ],
    },
    'c-numberinput': {
        components: ['NumberInput'],
        usage: NumberInputUsage,
        a11y: [
            '입력은 role="spinbutton" 이고 aria-valuenow · aria-valuemin · aria-valuemax 로 값과 범위를 알립니다.',
            '↑ · ↓ 로 step 만큼 올리고 내립니다. readOnly · disabled 면 바뀌지 않습니다.',
            '−/+ 스테퍼 버튼은 aria-label "감소" · "증가" 를 갖고 Tab 순서에서 빠집니다.',
            'invalid 이거나 값이 범위를 벗어나면 aria-invalid 가 붙습니다.',
        ],
    },
    'c-combobox': {
        components: ['Select', 'ComboBox', 'MultiSelect', 'TagInput'],
        usage: SelectUsage,
        composition: `
options: Option[]
└── { value, label, description?, icon?, disabled?, group? }
    group 이 같은 옵션은 그 제목 아래 모여 보임 (groupBy 로 바꿀 수 있음)`,
        compositionNote: 'ComboBox 는 searchable, MultiSelect 는 multiple 이 켜진 Select 입니다. loadOptions 를 주면 options 대신 서버 결과를 씁니다.',
        a11y: [
            '트리거는 role="combobox" 와 aria-expanded · aria-controls · aria-haspopup="listbox" 를, 목록은 role="listbox"(multiple 이면 aria-multiselectable), 항목은 role="option" · aria-selected 를 가집니다. 포커스는 트리거에 둔 채 aria-activedescendant 로 활성 항목을 알립니다.',
            '↑ ↓ 로 열고 옮기며 Home · End 로 처음 · 끝, Enter 로 고르고 Esc 로 닫습니다. 검색이 없는 Select 는 Space 로도 열고 고릅니다. Tab 을 누르면 닫힙니다.',
            '이름은 aria-label 이나 aria-labelledby 로 주세요. invalid · disabled · readOnly 는 aria-invalid · aria-disabled · aria-readonly 로 알립니다.',
            'multiple 에서 입력이 비어 있을 때 Backspace 를 누르면 마지막 태그가 지워집니다. 태그의 × 버튼은 "OO 제거" 라는 이름을 갖고 Tab 순서에서 빠집니다.',
            'TagInput 은 Enter 나 구분자 글자로 태그를 만들고(한글 조합 중에는 무시), 비어 있을 때 Backspace 로 마지막 태그를 지웁니다. 이름은 aria-label 이나 id + 라벨로 줍니다.',
        ],
    },
    'c-checkbox': {
        components: ['Checkbox', 'CheckboxGroup'],
        usage: CheckboxUsage,
        a11y: [
            '<input type="checkbox"> 를 쓰므로 Space 로 켜고 끕니다. label 을 주면 <label> 로 감싸 이름이 연결되고, description 은 aria-describedby 로 이어집니다.',
            'label 없이 쓰면 aria-label 을 넘기세요.',
            'indeterminate 는 input 의 indeterminate 속성을 켜서 "일부 선택" 으로 읽힙니다.',
            'CheckboxGroup 은 role="group" 입니다. aria-label 로 이름을 주세요. selectAll 의 "전체 선택" 은 일부만 선택되면 indeterminate 가 됩니다.',
        ],
    },
    'c-radio': {
        components: ['RadioGroup', 'Radio'],
        usage: RadioUsage,
        composition: `
RadioGroup              name · value · appearance · size · disabled
└── Radio value="…"     label · description

RadioGroup options={[{ value, label, description?, disabled? }]}`,
        compositionNote: 'children 대신 options 배열을 주면 Radio 를 대신 그립니다.',
        a11y: [
            'RadioGroup 은 role="radiogroup" 입니다. aria-label 이나 aria-labelledby 로 이름을 주세요.',
            '각 Radio 는 같은 name 을 가진 <input type="radio"> 라 방향키로 그룹 안을 옮기며 고르는 브라우저 기본 동작을 따릅니다.',
            'label 은 <label> 로 감싸 연결되고, description 은 aria-describedby 로 이어집니다.',
        ],
    },
    'c-switch': {
        components: ['Switch'],
        usage: SwitchUsage,
        a11y: [
            'role="switch" 인 <input type="checkbox"> 로, aria-checked 로 켜짐 상태를 알리고 Space 로 바꿉니다.',
            'label · onLabel · offLabel 을 주면 <label> 로 감싸 이름이 연결됩니다. 라벨이 없으면 aria-label 을 넘기세요.',
            'loading 중에는 스위치 대신 role="status" · aria-label="적용 중" 인 스피너가 보입니다.',
        ],
    },
    'c-slider': {
        components: ['Slider'],
        usage: SliderUsage,
        a11y: [
            '손잡이마다 <input type="range"> 를 써서 방향키 · Home · End 등 브라우저 기본 키보드 동작을 따릅니다.',
            'aria-label 로 이름을 주세요. 범위면 손잡이 이름 뒤에 "시작" · "끝" 이 붙습니다(없으면 "범위 시작" · "범위 끝").',
            'formatValue 결과가 aria-valuetext 로 읽히고, orientation 은 aria-orientation 으로 알립니다.',
        ],
    },
    'c-segmented': {
        components: ['SegmentedControl'],
        usage: SegmentedControlUsage,
        a11y: [
            'role="radiogroup" 안의 각 칸이 role="radio" · aria-checked 를 가진 버튼입니다. aria-label 로 이름을 주세요.',
            '선택된 칸만 Tab 으로 잡히고, ← → 로 비활성이 아닌 칸 사이를 옮기면 바로 선택되며 끝에서 처음으로 돌아갑니다.',
        ],
    },
    'c-datepicker': {
        components: ['DatePicker', 'DateRangePicker'],
        usage: DatePickerUsage,
        a11y: [
            '트리거는 aria-haspopup="dialog" · aria-expanded 를 가진 버튼이고, 이름은 aria-label(기본 "날짜" · "기간") 이고 DatePicker 는 뒤에 고른 날짜가 붙습니다.',
            '패널은 role="dialog" 이고 같은 aria-label 을 씁니다. 패널 바깥을 누르면 닫힙니다.',
            '날짜 · 주 달력은 role="grid" · role="gridcell" 이고 ← → ↑ ↓ 로 하루 · 한 주, PageUp · PageDown 으로 한 달, Home · End 로 주의 처음 · 끝을 옮기며 Enter · Space 로 고릅니다.',
            'picker 가 month · quarter · year 면 칸은 aria-pressed 로 선택을 알리는 버튼입니다.',
            '지우기(×) 버튼은 "날짜 지우기" · "기간 지우기" 라는 이름을 가집니다.',
        ],
    },
    'c-timepicker': {
        components: ['TimePicker'],
        usage: TimePickerUsage,
        a11y: [
            '트리거는 aria-haspopup="dialog" · aria-expanded 를 가진 버튼이고, 이름은 aria-label(기본 "시간") 입니다. range 면 "시작" · "끝" 버튼 두 개가 됩니다.',
            '패널은 role="dialog" 이고 시 · 분 · 초 · 오전/오후 열은 각각 그 이름을 가진 role="listbox", 칸은 role="option" · aria-selected 를 가진 버튼입니다.',
            '열 안의 칸은 버튼이라 Tab 으로 옮기고 Enter · Space 로 고릅니다. minTime · maxTime 밖의 칸은 비활성입니다.',
        ],
    },
    'c-colorpicker': {
        components: ['ColorPicker'],
        usage: ColorPickerUsage,
        a11y: [
            '트리거는 aria-label="색 선택" · aria-expanded 를 가진 버튼입니다.',
            '견본 버튼은 hex 값을 aria-label 로 읽고, hex 입력은 "색상 hex 값", 투명도 슬라이더는 "투명도" 라는 이름을 가집니다.',
            'hex 입력은 Enter 나 포커스가 빠질 때 적용됩니다. 패널 바깥을 누르면 닫힙니다.',
        ],
    },
    'c-fileupload': {
        components: ['FileUpload'],
        usage: FileUploadUsage,
        a11y: [
            'dropzone 은 role="button" 으로 Tab 에 잡히고 Enter · Space 로 파일 선택 창을 엽니다. disabled 면 aria-disabled 가 붙고 Tab 에서 빠집니다.',
            '형식 · 크기 안내 문구는 aria-describedby 로 드롭존과 숨은 file input 에 이어집니다.',
            '파일 목록은 aria-label="첨부 파일" 인 <ul> 이고, 업로드 중에는 role="progressbar" 로 진행률을, 실패하면 role="alert" 로 오류를 알립니다.',
            '파일마다 "OO 목록에서 제거" 라는 이름의 제거 버튼이 있습니다.',
        ],
    },
    'c-rating': {
        components: ['Rating'],
        usage: RatingUsage,
        a11y: [
            'role="radiogroup" · aria-label="평점" 안의 별마다 role="radio" 버튼이고 "1점" · "2점" … 으로 읽히며, 현재 점수 칸에 aria-checked 가 붙습니다.',
            '별은 Tab 으로 옮기고 Enter · Space 로 고릅니다. 방향키 이동은 없습니다.',
            'readOnly 면 별 버튼이 모두 비활성이 됩니다.',
        ],
    },
    'c-otpinput': {
        components: ['OTPInput'],
        usage: OTPInputUsage,
        a11y: [
            'role="group" 으로 묶고 aria-label(기본 "인증번호") 을 붙이며, 칸마다 "인증번호 1번째 자리" 처럼 이름이 붙습니다.',
            '한 글자를 치면 다음 칸으로, 빈 칸에서 Backspace 를 누르면 앞 칸으로 가고 ← → 로 칸 사이를 옮깁니다.',
            '붙여넣으면 맞는 글자만 칸에 나눠 채웁니다. 첫 칸은 autocomplete="one-time-code" 라 문자 인증번호 자동 채우기를 받습니다.',
            'invalid 면 칸마다 aria-invalid 가 붙습니다.',
        ],
    },
}
