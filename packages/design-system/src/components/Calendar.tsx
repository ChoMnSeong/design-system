import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { IconChevronLeft, IconChevronRight } from './icons.js'
import { useLocale } from '../provider/locale.js'
import {
    addDays,
    addMonths,
    diffDays,
    monthGrid,
    parseISODate,
    quarterOf,
    sameDay,
    startOfWeek,
    toISODate,
} from '../utils/date.js'

export type CalendarMode = 'single' | 'range' | 'multiple'
/** 'date' 날짜 · 'week' 주(그 주 시작일을 값으로) · 'month' · 'quarter' · 'year' (해당 기간 첫날을 값으로) */
export type CalendarPicker = 'date' | 'week' | 'month' | 'quarter' | 'year'

export type DayState = {
    selected: boolean
    inRange: boolean
    rangeStart: boolean
    rangeEnd: boolean
    today: boolean
    outside: boolean
    disabled: boolean
    holiday: boolean
    weekend: 0 | 6 | null
}

type RangeValue = [string | null, string | null]

export type CalendarProps = {
    mode?: CalendarMode
    picker?: CalendarPicker
    /** single: 'YYYY-MM-DD', range: [시작, 끝], multiple: 날짜 배열 */
    value?: string | null | RangeValue | string[]
    defaultValue?: string | null | RangeValue | string[]
    onValueChange?: (value: any) => void
    /** @deprecated onValueChange 를 쓴다 (single 에서만 호출) */
    onChange?: (value: string) => void
    locale?: string
    weekStartsOn?: 0 | 1
    minDate?: string
    maxDate?: string
    disabledDates?: (date: Date) => boolean
    /** 공휴일. 빨간 글자로 보인다 */
    holidays?: string[] | ((date: Date) => boolean)
    /** 점 표시. renderDay 로도 그릴 수 있다 (별칭으로 유지) */
    markedDates?: string[]
    /** 날짜 칸 안을 직접 그린다 (예: 생산량). 날짜 숫자 아래에 붙는다 */
    renderDay?: (date: Date, state: DayState) => ReactNode
    /** 나란히 보일 달 수 (range 에서 2 를 많이 쓴다) */
    numberOfMonths?: number
    /** range 에서 최대 일수 */
    maxRange?: number
    /** 머리에 "오늘" 버튼 */
    showToday?: boolean
    /** 칸 높이. renderDay 를 쓰면 46 이 알맞다 */
    cellHeight?: number
    style?: CSSProperties
    'aria-label'?: string
}

const toList = (v: CalendarProps['value']): string[] =>
    v == null ? [] : Array.isArray(v) ? (v.filter(Boolean) as string[]) : [v]

export const Calendar = ({
    mode = 'single',
    picker = 'date',
    value: valueProp,
    defaultValue,
    onValueChange,
    onChange,
    locale: localeProp,
    weekStartsOn: wsProp,
    minDate,
    maxDate,
    disabledDates,
    holidays,
    markedDates = [],
    renderDay,
    numberOfMonths = 1,
    maxRange,
    showToday,
    cellHeight,
    style,
    'aria-label': ariaLabel = '달력',
}: CalendarProps) => {
    const ctx = useLocale()
    const locale = localeProp ?? ctx.locale
    const weekStartsOn = wsProp ?? ctx.weekStartsOn
    const [inner, setInner] = useState<CalendarProps['value']>(defaultValue ?? (mode === 'single' ? null : mode === 'range' ? [null, null] : []))
    const value = valueProp !== undefined ? valueProp : inner
    const list = toList(value)
    const range: RangeValue = mode === 'range' ? ((value as RangeValue) ?? [null, null]) : [null, null]
    const rs = parseISODate(range[0])
    const re = parseISODate(range[1])

    const today = new Date()
    const anchor = parseISODate(list[0]) ?? today
    const [view, setView] = useState({ y: anchor.getFullYear(), m: anchor.getMonth() })
    const [hover, setHover] = useState<Date | null>(null)
    const [focusDate, setFocusDate] = useState<Date>(anchor)
    const gridRef = useRef<HTMLDivElement | null>(null)
    const focusPending = useRef(false)

    const isHoliday = (d: Date) =>
        typeof holidays === 'function' ? holidays(d) : !!holidays?.includes(toISODate(d))
    const isDisabled = (d: Date) => {
        const iso = toISODate(d)
        if (minDate && iso < minDate.slice(0, 10)) return true
        if (maxDate && iso > maxDate.slice(0, 10)) return true
        if (disabledDates?.(d)) return true
        if (mode === 'range' && maxRange && rs && !re && Math.abs(diffDays(rs, d)) > maxRange - 1) return true
        return false
    }

    const emit = (next: CalendarProps['value']) => {
        if (valueProp === undefined) setInner(next as never)
        onValueChange?.(next)
        if (mode === 'single' && typeof next === 'string') onChange?.(next)
    }

    const pick = (d: Date) => {
        if (isDisabled(d)) return
        let date = d
        if (picker === 'week') date = startOfWeek(d, weekStartsOn)
        const iso = toISODate(date)
        if (mode === 'single') emit(iso)
        else if (mode === 'multiple') emit(list.includes(iso) ? list.filter((x) => x !== iso) : [...list, iso].sort())
        else if (!rs || re) emit([iso, null])
        else if (date < rs) emit([iso, range[0]])
        else emit([range[0], iso])
    }

    const weekdays = useMemo(() => {
        const base = new Date(2024, 0, weekStartsOn === 1 ? 1 : 7)
        return Array.from({ length: 7 }, (_, i) => addDays(base, i).toLocaleDateString(locale, { weekday: 'short' }))
    }, [locale, weekStartsOn])

    // 키보드 이동 뒤 포커스를 해당 칸으로
    useEffect(() => {
        if (!focusPending.current) return
        focusPending.current = false
        gridRef.current?.querySelector<HTMLElement>(`[data-date="${toISODate(focusDate)}"]`)?.focus()
    }, [focusDate, view])

    const moveFocus = (d: Date) => {
        focusPending.current = true
        setFocusDate(d)
        const first = new Date(view.y, view.m, 1)
        const last = addMonths(first, numberOfMonths)
        if (d < first || d >= last) setView({ y: d.getFullYear(), m: d.getMonth() })
    }
    const onGridKey = (e: KeyboardEvent) => {
        const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
        if (e.key in steps) {
            e.preventDefault()
            moveFocus(addDays(focusDate, steps[e.key]!))
        } else if (e.key === 'PageUp' || e.key === 'PageDown') {
            e.preventDefault()
            const n = e.key === 'PageUp' ? -1 : 1
            moveFocus(new Date(focusDate.getFullYear(), focusDate.getMonth() + n, focusDate.getDate()))
        } else if (e.key === 'Home') {
            e.preventDefault()
            moveFocus(startOfWeek(focusDate, weekStartsOn))
        } else if (e.key === 'End') {
            e.preventDefault()
            moveFocus(addDays(startOfWeek(focusDate, weekStartsOn), 6))
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            pick(focusDate)
        }
    }

    const head = (label: ReactNode, onPrev: () => void, onNext: () => void, prevLabel: string, nextLabel: string, showNav = true) => (
        <div data-slot="head">
            <span data-slot="title" aria-live="polite">{label}</span>
            {showNav && (
                <span data-slot="nav">
                    <button type="button" data-slot="navbtn" aria-label={prevLabel} onClick={onPrev}>
                        <IconChevronLeft size={16} />
                    </button>
                    {showToday && (
                        <button
                            type="button"
                            data-slot="navbtn"
                            data-text=""
                            onClick={() => {
                                setView({ y: today.getFullYear(), m: today.getMonth() })
                                setFocusDate(today)
                            }}
                        >
                            오늘
                        </button>
                    )}
                    <button type="button" data-slot="navbtn" aria-label={nextLabel} onClick={onNext}>
                        <IconChevronRight size={16} />
                    </button>
                </span>
            )}
        </div>
    )

    /* ── 월 · 분기 · 연도 선택 ── */
    if (picker === 'month' || picker === 'quarter' || picker === 'year') {
        const sel = parseISODate(list[0])
        const yearBase = Math.floor(view.y / 12) * 12
        const cells =
            picker === 'year'
                ? Array.from({ length: 12 }, (_, i) => ({ d: new Date(yearBase + i, 0, 1), label: `${yearBase + i}` }))
                : picker === 'quarter'
                  ? Array.from({ length: 4 }, (_, i) => ({ d: new Date(view.y, i * 3, 1), label: `${i + 1}분기` }))
                  : Array.from({ length: 12 }, (_, i) => ({
                        d: new Date(view.y, i, 1),
                        label: new Date(2024, i, 1).toLocaleDateString(locale, { month: 'short' }),
                    }))
        const isSel = (d: Date) =>
            !!sel &&
            (picker === 'year'
                ? sel.getFullYear() === d.getFullYear()
                : picker === 'quarter'
                  ? sel.getFullYear() === d.getFullYear() && quarterOf(sel) === quarterOf(d)
                  : sel.getFullYear() === d.getFullYear() && sel.getMonth() === d.getMonth())
        return (
            <div data-ds-calendar="" data-picker={picker} style={style} role="group" aria-label={ariaLabel}>
                {head(
                    picker === 'year' ? `${yearBase} – ${yearBase + 11}` : `${view.y}년`,
                    () => setView((v) => ({ ...v, y: v.y - (picker === 'year' ? 12 : 1) })),
                    () => setView((v) => ({ ...v, y: v.y + (picker === 'year' ? 12 : 1) })),
                    picker === 'year' ? '이전 12년' : '이전 해',
                    picker === 'year' ? '다음 12년' : '다음 해',
                )}
                <div data-slot="cells" data-cols={picker === 'quarter' ? 2 : 3}>
                    {cells.map(({ d, label }) => {
                        const dis = (minDate && toISODate(d) < minDate.slice(0, 7)) || false
                        return (
                            <button
                                key={label}
                                type="button"
                                data-slot="cell"
                                aria-pressed={isSel(d)}
                                data-selected={isSel(d) ? '' : undefined}
                                disabled={dis}
                                onClick={() => emit(toISODate(d))}
                            >
                                {label}
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }

    /* ── 날짜 · 주 ── */
    const months = Array.from({ length: numberOfMonths }, (_, k) => addMonths(new Date(view.y, view.m, 1), k))
    const hoverEnd = mode === 'range' && rs && !re ? hover : null
    const lo = rs && (re ?? hoverEnd) ? (rs <= (re ?? hoverEnd)! ? rs : (re ?? hoverEnd)!) : null
    const hi = rs && (re ?? hoverEnd) ? (rs <= (re ?? hoverEnd)! ? (re ?? hoverEnd)! : rs) : null
    const selWeek = picker === 'week' ? parseISODate(list[0]) : null

    return (
        <div
            data-ds-calendar=""
            data-picker={picker}
            data-months={numberOfMonths}
            style={{ ...(cellHeight ? ({ '--_ch': `${cellHeight}px` } as CSSProperties) : null), ...style }}
            role="group"
            aria-label={ariaLabel}
        >
            <div data-slot="months" ref={gridRef}>
                {months.map((mStart, mi) => (
                    <div key={mi} data-slot="month">
                        {head(
                            mStart.toLocaleDateString(locale, { year: 'numeric', month: 'long' }),
                            () => setView((v) => ({ y: v.m === 0 ? v.y - 1 : v.y, m: (v.m + 11) % 12 })),
                            () => setView((v) => ({ y: v.m === 11 ? v.y + 1 : v.y, m: (v.m + 1) % 12 })),
                            '이전 달',
                            '다음 달',
                            numberOfMonths === 1 || mi === numberOfMonths - 1,
                        )}
                        <div data-slot="grid" role="grid" aria-label={mStart.toLocaleDateString(locale, { year: 'numeric', month: 'long' })} onKeyDown={onGridKey}>
                            <div role="row" data-slot="row" data-weekdays="">
                                {weekdays.map((w, i) => {
                                    const dow = (i + weekStartsOn) % 7
                                    return (
                                        <span key={w} role="columnheader" data-slot="wd" data-dow={dow === 0 || dow === 6 ? dow : undefined}>
                                            {w}
                                        </span>
                                    )
                                })}
                            </div>
                            {Array.from({ length: 6 }, (_, r) => (
                                <div role="row" data-slot="row" key={r}>
                                    {monthGrid(mStart.getFullYear(), mStart.getMonth(), weekStartsOn)
                                        .slice(r * 7, r * 7 + 7)
                                        .map((d) => {
                                            const iso = toISODate(d)
                                            const outside = d.getMonth() !== mStart.getMonth()
                                            const dow = d.getDay()
                                            const inWeek = !!selWeek && diffDays(selWeek, d) >= 0 && diffDays(selWeek, d) < 7
                                            const state: DayState = {
                                                selected:
                                                    mode === 'range'
                                                        ? sameDay(d, rs) || sameDay(d, re)
                                                        : picker === 'week'
                                                          ? inWeek
                                                          : list.includes(iso),
                                                inRange: !!lo && !!hi && d > lo && d < hi,
                                                rangeStart: sameDay(d, lo),
                                                rangeEnd: sameDay(d, hi),
                                                today: sameDay(d, today),
                                                outside,
                                                disabled: isDisabled(d),
                                                holiday: isHoliday(d),
                                                weekend: dow === 0 ? 0 : dow === 6 ? 6 : null,
                                            }
                                            if (outside && numberOfMonths > 1) return <span key={iso} data-slot="day" data-empty="" role="gridcell" />
                                            const tabbable = sameDay(d, focusDate) && !outside
                                            return (
                                                <span
                                                    key={iso}
                                                    role="gridcell"
                                                    aria-selected={state.selected || state.rangeStart || state.rangeEnd}
                                                    data-slot="day"
                                                    data-date={iso}
                                                    tabIndex={tabbable ? 0 : -1}
                                                    aria-disabled={state.disabled || undefined}
                                                    aria-current={state.today ? 'date' : undefined}
                                                    aria-label={d.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                                                    data-selected={state.selected || state.rangeStart || state.rangeEnd ? '' : undefined}
                                                    data-in-range={state.inRange || (inWeek && !state.selected) ? '' : undefined}
                                                    data-range-start={mode === 'range' && state.rangeStart ? '' : undefined}
                                                    data-range-end={mode === 'range' && state.rangeEnd ? '' : undefined}
                                                    data-today={state.today ? '' : undefined}
                                                    data-outside={outside ? '' : undefined}
                                                    data-disabled={state.disabled ? '' : undefined}
                                                    data-holiday={state.holiday || dow === 0 ? '' : undefined}
                                                    data-saturday={dow === 6 ? '' : undefined}
                                                    onClick={() => {
                                                        setFocusDate(d)
                                                        pick(d)
                                                    }}
                                                    onMouseEnter={() => setHover(d)}
                                                    onMouseLeave={() => setHover(null)}
                                                >
                                                    <span data-slot="num">{d.getDate()}</span>
                                                    {renderDay?.(d, state)}
                                                    {markedDates.includes(iso) && <span data-slot="mark" aria-hidden />}
                                                </span>
                                            )
                                        })}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
