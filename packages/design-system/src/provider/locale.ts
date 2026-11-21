import { createContext, useContext } from 'react'

export type LocaleSettings = {
    /** 달력·숫자 표기 로케일. 기본 'ko-KR' */
    locale: string
    /** 주 시작 요일. 0 일요일 · 1 월요일. 기본 0 */
    weekStartsOn: 0 | 1
}

export const DEFAULT_LOCALE: LocaleSettings = { locale: 'ko-KR', weekStartsOn: 0 }

export const LocaleContext = createContext<LocaleSettings>(DEFAULT_LOCALE)

/** Provider 의 locale · weekStartsOn. 컴포넌트 prop 이 있으면 그쪽을 쓴다. */
export const useLocale = () => useContext(LocaleContext)
