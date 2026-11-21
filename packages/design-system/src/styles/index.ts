import { BUTTON_CSS } from './button.js'
import { MENU_CSS } from './menu.js'
import { ACTION_CSS } from './action.js'
import { FIELD_CSS, FORM_CSS } from './field.js'
import { SELECT_CSS } from './select.js'
import { CHOICE_CSS } from './choice.js'
import { MISC_CSS } from './misc.js'
import { DATE_CSS, UPLOAD_CSS } from './date.js'
import { DATATABLE_CSS } from './datatable.js'
import { CARD_CSS, NAV_CSS, PRIMITIVE_CSS, SHELL_CSS, TABS_CSS } from './layout.js'
import { FEEDBACK_CSS, OVERLAY_CSS, POPOVER_CSS, TOAST_CSS, COMMAND_CSS } from './feedback.js'
import { DISPLAY_CSS, PROGRESS_CSS, TABLE_CSS, TREE_CSS } from './display.js'

/** 인라인 style 로 표현할 수 없는 hover·의사 요소·variant 분기를 모은 컴포넌트 스타일. */
export const COMPONENT_CSS = [BUTTON_CSS, MENU_CSS, ACTION_CSS, FIELD_CSS, SELECT_CSS, CHOICE_CSS, MISC_CSS, DATE_CSS, FORM_CSS, UPLOAD_CSS, DISPLAY_CSS, PROGRESS_CSS, TABLE_CSS, TREE_CSS, DATATABLE_CSS, FEEDBACK_CSS, POPOVER_CSS, OVERLAY_CSS, TOAST_CSS, COMMAND_CSS, CARD_CSS, PRIMITIVE_CSS, TABS_CSS, SHELL_CSS, NAV_CSS].join('\n')

export { BUTTON_CSS, MENU_CSS, ACTION_CSS, FIELD_CSS, SELECT_CSS, CHOICE_CSS, MISC_CSS, DATE_CSS, FORM_CSS, UPLOAD_CSS, DISPLAY_CSS, PROGRESS_CSS, TABLE_CSS, TREE_CSS, DATATABLE_CSS, FEEDBACK_CSS, POPOVER_CSS, OVERLAY_CSS, TOAST_CSS, COMMAND_CSS, CARD_CSS, PRIMITIVE_CSS, TABS_CSS, SHELL_CSS, NAV_CSS }
