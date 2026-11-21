import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useOutsideClick } from './useOutsideClick.js'
import { Popover } from './Popover.js'
import { IconCalendar, IconClose } from './icons.js'
import type { BorderVariant } from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'
import { fieldIconSize, type FieldSize } from './types.js'
import { FieldAction, FieldBox, useFormSize } from './Field.js'
import { Calendar, type CalendarPicker } from './Calendar.js'
import { TimeColumns } from './TimePicker.js'
import { addDays, diffDays, formatDate, parseISODate, startOfWeek, toISODate } from '../utils/date.js'
import { useLocale } from '../provider/locale.js'

const DEFAULT_FORMAT: Record<CalendarPicker, string> = {
    date: 'YYYY-MM-DD',
    week: 'GGGG-[W]ww',
    month: 'YYYY-MM',
    quarter: 'YYYY-[Q]Q',
    year: 'YYYY',
}

export type DatePreset<V> = { label: ReactNode; value: V | (() => V) }

type Common = {
    placeholder?: string
    disabled?: boolean
    readOnly?: boolean
    invalid?: boolean
    variant?: BorderVariant
    size?: FieldSize
    locale?: string
    weekStartsOn?: 0 | 1
    minDate?: string
    maxDate?: string
    disabledDates?: (date: Date) => boolean
    holidays?: string[] | ((date: Date) => boolean)
    /** 표시 서식. 토큰은 utils/date 의 formatDate 참고. 기본은 picker 에 맞춘 값 */
    format?: string
    clearable?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    width?: number | string
    fullWidth?: boolean
    style?: CSSProperties
    'aria-label'?: string
}

const useOpen = (openProp: boolean | undefined, onOpenChange?: (o: boolean) => void) => {
    const [inner, setInner] = useState(false)
    const open = openProp ?? inner
    const setOpen = (o: boolean) => {
        if (openProp === undefined) setInner(o)
        onOpenChange?.(o)
    }
    return [open, setOpen] as const
}

const resolve = <V,>(v: V | (() => V)) => (typeof v === 'function' ? (v as () => V)() : v)

/* ───────────────────────── DatePicker ───────────────────────── */

export type DatePickerProps = Common & {
    /** 'YYYY-MM-DD' (showTime 이면 'YYYY-MM-DDTHH:mm') */
    value?: string | null
    defaultValue?: string | null
    onValueChange?: (value: string | null) => void
    /** @deprecated onValueChange 를 쓴다 */
    onChange?: (value: string) => void
    picker?: CalendarPicker
    /** 시간도 고른다. minuteStep 으로 분 간격 */
    showTime?: boolean | { minuteStep?: number }
    presets?: DatePreset<string>[]
}

export const DatePicker = ({
    value: valueProp,
    defaultValue = null,
    onValueChange,
    onChange,
    picker = 'date',
    showTime,
    presets,
    placeholder = '날짜 선택',
    disabled,
    readOnly,
    invalid,
    variant: variantProp,
    size: sizeProp,
    locale,
    weekStartsOn: wsProp,
    minDate,
    maxDate,
    disabledDates,
    holidays,
    format,
    clearable,
    open: openProp,
    onOpenChange,
    width,
    fullWidth,
    style,
    'aria-label': ariaLabel = '날짜',
}: DatePickerProps) => {
    const variant = useBorderVariant(variantProp)
    const size = useFormSize(sizeProp)
    const loc = useLocale()
    const ws = wsProp ?? loc.weekStartsOn
    const [inner, setInner] = useState(defaultValue)
    const value = valueProp !== undefined ? valueProp : inner
    const [open, setOpen] = useOpen(openProp, onOpenChange)
    const boxRef = useRef<HTMLSpanElement | null>(null)
    const popRef = useRef<HTMLDivElement | null>(null)
    useOutsideClick([boxRef, popRef], () => setOpen(false), open)

    const date = parseISODate(value)
    const fmt = format ?? `${DEFAULT_FORMAT[picker]}${showTime ? ' HH:mm' : ''}`
    const iso = value?.slice(0, 10)
    const outOfRange = !!iso && ((!!minDate && iso < minDate) || (!!maxDate && iso > maxDate))
    const time = value && value.length > 10 ? value.slice(11, 16) : '00:00'

    const emit = (v: string | null) => {
        if (valueProp === undefined) setInner(v)
        onValueChange?.(v)
        if (v) onChange?.(v)
    }

    return (
        <>
            <FieldBox
                ref={boxRef}
                size={size}
                variant={variant}
                invalid={invalid || outOfRange}
                readOnly={readOnly}
                disabled={disabled}
                fullWidth={fullWidth}
                data-ds-picker-trigger=""
                style={{ width, ...style }}
            >
                <span data-slot="adorn" aria-hidden>
                    <IconCalendar size={fieldIconSize[size]} />
                </span>
                <button
                    type="button"
                    data-slot="control"
                    data-placeholder={!date ? '' : undefined}
                    aria-label={`${ariaLabel}${date ? `, ${formatDate(date, fmt)}` : ''}`}
                    aria-haspopup="dialog"
                    aria-expanded={open}
                    disabled={disabled || readOnly}
                    onClick={() => setOpen(!open)}
                >
                    {date ? formatDate(date, fmt) : placeholder}
                </button>
                {clearable && value && !disabled && !readOnly && (
                    <FieldAction aria-label="날짜 지우기" onClick={() => emit(null)}>
                        <IconClose size={fieldIconSize[size]} />
                    </FieldAction>
                )}
            </FieldBox>
            <Popover open={open} triggerRef={boxRef} offset={4}>
                <div ref={popRef} data-ds-picker-panel="" role="dialog" aria-label={ariaLabel}>
                    {presets && (
                        <div data-slot="presets">
                            {presets.map((p, i) => {
                                const v = resolve(p.value)
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        data-selected={v === iso ? '' : undefined}
                                        onClick={() => {
                                            emit(v)
                                            setOpen(false)
                                        }}
                                    >
                                        {p.label}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                    <Calendar
                        picker={picker}
                        value={iso ?? null}
                        locale={locale}
                        weekStartsOn={ws}
                        minDate={minDate}
                        maxDate={maxDate}
                        disabledDates={disabledDates}
                        holidays={holidays}
                        showToday
                        onValueChange={(d: string) => {
                            emit(showTime ? `${d}T${time}` : d)
                            if (!showTime) setOpen(false)
                        }}
                    />
                    {showTime && (
                        <TimeColumns
                            value={time}
                            minuteStep={typeof showTime === 'object' ? showTime.minuteStep : 1}
                            height={252}
                            onChange={(t) => emit(`${iso ?? toISODate(new Date())}T${t}`)}
                        />
                    )}
                </div>
            </Popover>
        </>
    )
}

/* ───────────────────────── DateRangePicker ───────────────────────── */

export type DateRange = [string | null, string | null]

export type DateRangePickerProps = Common & {
    value?: DateRange
    defaultValue?: DateRange
    onValueChange?: (value: DateRange) => void
    /** 최대 기간(일). 시작일을 고르면 그 범위 밖은 막힌다 */
    maxRange?: number
    numberOfMonths?: 1 | 2
    presets?: DatePreset<DateRange>[]
}

/** 자주 쓰는 기간 프리셋 (오늘 · 어제 · 이번 주 · 최근 7일 · 이번 달 · 지난달) */
export const defaultRangePresets = (weekStartsOn: 0 | 1 = 0): DatePreset<DateRange>[] => {
    const t = () => new Date()
    const iso = toISODate
    return [
        { label: '오늘', value: () => [iso(t()), iso(t())] },
        { label: '어제', value: () => [iso(addDays(t(), -1)), iso(addDays(t(), -1))] },
        { label: '이번 주', value: () => [iso(startOfWeek(t(), weekStartsOn)), iso(addDays(startOfWeek(t(), weekStartsOn), 6))] },
        { label: '최근 7일', value: () => [iso(addDays(t(), -6)), iso(t())] },
        { label: '이번 달', value: () => [iso(new Date(t().getFullYear(), t().getMonth(), 1)), iso(new Date(t().getFullYear(), t().getMonth() + 1, 0))] },
        { label: '지난달', value: () => [iso(new Date(t().getFullYear(), t().getMonth() - 1, 1)), iso(new Date(t().getFullYear(), t().getMonth(), 0))] },
    ]
}

export const DateRangePicker = ({
    value: valueProp,
    defaultValue = [null, null],
    onValueChange,
    maxRange,
    numberOfMonths = 2,
    presets,
    placeholder,
    disabled,
    readOnly,
    invalid,
    variant: variantProp,
    size: sizeProp,
    locale,
    weekStartsOn: wsProp,
    minDate,
    maxDate,
    disabledDates,
    holidays,
    format = 'YYYY-MM-DD',
    clearable,
    open: openProp,
    onOpenChange,
    width,
    fullWidth,
    style,
    'aria-label': ariaLabel = '기간',
}: DateRangePickerProps) => {
    const variant = useBorderVariant(variantProp)
    const size = useFormSize(sizeProp)
    const loc = useLocale()
    const ws = wsProp ?? loc.weekStartsOn
    const [inner, setInner] = useState<DateRange>(defaultValue)
    const value = valueProp ?? inner
    const [open, setOpen] = useOpen(openProp, onOpenChange)
    const boxRef = useRef<HTMLSpanElement | null>(null)
    const popRef = useRef<HTMLDivElement | null>(null)
    useOutsideClick([boxRef, popRef], () => setOpen(false), open)

    const [s, e] = value.map(parseISODate) as [Date | null, Date | null]
    const tooLong = !!s && !!e && !!maxRange && diffDays(s, e) + 1 > maxRange
    const emit = (v: DateRange) => {
        if (valueProp === undefined) setInner(v)
        onValueChange?.(v)
    }
    const list = presets ?? defaultRangePresets(ws)

    return (
        <>
            <FieldBox
                ref={boxRef}
                size={size}
                variant={variant}
                invalid={invalid || tooLong}
                readOnly={readOnly}
                disabled={disabled}
                fullWidth={fullWidth}
                data-ds-picker-trigger=""
                style={{ width, ...style }}
            >
                <span data-slot="adorn" aria-hidden>
                    <IconCalendar size={fieldIconSize[size]} />
                </span>
                <button
                    type="button"
                    data-slot="control"
                    data-placeholder={!s ? '' : undefined}
                    aria-label={ariaLabel}
                    aria-haspopup="dialog"
                    aria-expanded={open}
                    disabled={disabled || readOnly}
                    onClick={() => setOpen(!open)}
                >
                    {s ? (
                        <>
                            {formatDate(s, format)}
                            <span data-slot="sep" aria-hidden>→</span>
                            {e ? formatDate(e, format) : '…'}
                        </>
                    ) : (
                        (placeholder ?? '시작일 → 종료일')
                    )}
                </button>
                {clearable && s && !disabled && !readOnly && (
                    <FieldAction aria-label="기간 지우기" onClick={() => emit([null, null])}>
                        <IconClose size={fieldIconSize[size]} />
                    </FieldAction>
                )}
            </FieldBox>
            <Popover open={open} triggerRef={boxRef} offset={4}>
                <div ref={popRef} data-ds-picker-panel="" role="dialog" aria-label={ariaLabel}>
                    {list.length > 0 && (
                        <div data-slot="presets">
                            {list.map((p, i) => {
                                const v = resolve(p.value)
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        data-selected={v[0] === value[0] && v[1] === value[1] ? '' : undefined}
                                        onClick={() => {
                                            emit(v)
                                            setOpen(false)
                                        }}
                                    >
                                        {p.label}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                    <Calendar
                        mode="range"
                        value={value}
                        numberOfMonths={numberOfMonths}
                        maxRange={maxRange}
                        locale={locale}
                        weekStartsOn={ws}
                        minDate={minDate}
                        maxDate={maxDate}
                        disabledDates={disabledDates}
                        holidays={holidays}
                        onValueChange={(v: DateRange) => {
                            emit(v)
                            if (v[0] && v[1]) setOpen(false)
                        }}
                    />
                </div>
            </Popover>
        </>
    )
}
