import { BUTTON_CSS } from './button.js'
import { MENU_CSS } from './menu.js'
import { ACTION_CSS } from './action.js'
import { FIELD_CSS, FORM_CSS } from './field.js'
import { SELECT_CSS } from './select.js'
import { CHOICE_CSS } from './choice.js'
import { MISC_CSS } from './misc.js'
import { DATE_CSS, UPLOAD_CSS } from './date.js'

/** 인라인 style 로 표현할 수 없는 hover·의사 요소·variant 분기를 모은 컴포넌트 스타일. */
export const COMPONENT_CSS = [BUTTON_CSS, MENU_CSS, ACTION_CSS, FIELD_CSS, SELECT_CSS, CHOICE_CSS, MISC_CSS, DATE_CSS, FORM_CSS, UPLOAD_CSS].join('\n')

export { BUTTON_CSS, MENU_CSS, ACTION_CSS, FIELD_CSS, SELECT_CSS, CHOICE_CSS, MISC_CSS, DATE_CSS, FORM_CSS, UPLOAD_CSS }
