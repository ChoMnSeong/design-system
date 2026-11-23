import type { DocMetaMap } from '../types'
import { actionsMeta } from './actions'
import { inputsMeta } from './inputs'
import { formsMeta } from './forms'
import { layoutMeta } from './layout'
import { surfacesMeta } from './surfaces'
import { navigationMeta } from './navigation'
import { dataMeta } from './data'
import { displayMeta } from './display'
import { feedbackMeta } from './feedback'
import { overlayMeta } from './overlay'
import { chartsMeta } from './charts'
import { industrialMeta } from './industrial'
import { commerceMeta } from './commerce'

/** 라우트별 문서 설명. 메뉴 묶음별 파일을 합친다 */
export const docMeta: DocMetaMap = {
    ...actionsMeta,
    ...inputsMeta,
    ...formsMeta,
    ...layoutMeta,
    ...surfacesMeta,
    ...navigationMeta,
    ...dataMeta,
    ...displayMeta,
    ...feedbackMeta,
    ...overlayMeta,
    ...chartsMeta,
    ...industrialMeta,
    ...commerceMeta,
}
