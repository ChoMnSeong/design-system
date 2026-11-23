import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Popover } from '../overlay/Popover.js'
import { useOutsideClick } from '../useOutsideClick.js'
import { FieldAction, FieldBox, useFormSize } from '../form/Field.js'
import { IconClose } from '../icons.js'
import type { BorderVariant } from '../borderVariant.js'
import { useBorderVariant } from '../../provider/useDesignSystem.js'
import { fieldIconSize, type FieldSize } from '../types.js'
import { pad2 } from '../../utils/date.js'

/** 'HH:mm' 또는 'HH:mm:ss' → 초 */
const toSec = (t: string | null | undefined) => {
    if (!t) return null
    const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(t)
    return m ? +m[1]! * 3600 + +m[2]! * 60 + (m[3] ? +m[3] : 0) : null
}
const fromParts = (h: number, m: number, s: number, withSec: boolean) =>
    `${pad2(h)}:${pad2(m)}${withSec ? `:${pad2(s)}` : ''}`

/** 서식: HH H hh mm ss A. 기본 24시간 'HH:mm', 12시간 'A hh:mm' */
export const formatTime = (t: string, fmt: string) => {
    const s = toSec(t)
    if (s === null) return ''
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    const map: Record<string, string> = {
        HH: pad2(h),
        H: String(h),
        hh: pad2(h % 12 || 12),
        mm: pad2(m),
        ss: pad2(sec),
        A: h < 12 ? '오전' : '오후',
    }
    return fmt.replace(/HH|H|hh|mm|ss|A/g, (k) => map[k] ?? k)
}

export type TimeColumnsProps = {
    /** 선택된 시간 ('HH:mm' 또는 'HH:mm:ss') */
    value: string | null
    /** 칸을 고를 때 (새 시간 문자열) */
    onChange: (value: string) => void
    /** 분 열 간격 */
    minuteStep?: number
    /** 초 열 간격. false 면 초 열 없음 */
    secondStep?: number | false
    /** false 면 1~12시와 오전/오후 열 */
    use24Hours?: boolean
    /** 이보다 이른 칸은 막는다 */
    minTime?: string
    /** 이보다 늦은 칸은 막는다 */
    maxTime?: string
    /** 열 높이 */
    height?: number
}

/** 시 · 분 · (초) · (오전/오후) 스크롤 열. TimePicker 와 DatePicker(showTime) 가 같이 쓴다. */
export const TimeColumns = ({
    value,
    onChange,
    minuteStep = 1,
    secondStep = false,
    use24Hours = true,
    minTime,
    maxTime,
    height = 200,
}: TimeColumnsProps) => {
    const cur = toSec(value) ?? 0
    const h = Math.floor(cur / 3600)
    const m = Math.floor((cur % 3600) / 60)
    const s = cur % 60
    const withSec = secondStep !== false
    const lo = toSec(minTime)
    const hi = toSec(maxTime)
    const out = (sec: number) => (lo !== null && sec < lo) || (hi !== null && sec > hi)
    const set = (nh: number, nm: number, ns: number) => onChange(fromParts(nh, nm, ns, withSec))

    const hours = use24Hours ? Array.from({ length: 24 }, (_, i) => i) : Array.from({ length: 12 }, (_, i) => i + 1)
    const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep)
    const seconds = withSec ? Array.from({ length: Math.ceil(60 / (secondStep || 1)) }, (_, i) => i * (secondStep || 1)) : []
    const pm = h >= 12

    const col = (
        label: string,
        items: number[],
        isOn: (n: number) => boolean,
        pick: (n: number) => void,
        disabled: (n: number) => boolean,
        text: (n: number) => string = pad2,
    ) => (
        <Column label={label} height={height}>
            {items.map((n) => (
                <button
                    key={n}
                    type="button"
                    role="option"
                    aria-selected={isOn(n)}
                    data-selected={isOn(n) ? '' : undefined}
                    disabled={disabled(n)}
                    onClick={() => pick(n)}
                >
                    {text(n)}
                </button>
            ))}
        </Column>
    )
    const to24 = (n: number) => (use24Hours ? n : (n % 12) + (pm ? 12 : 0))
    return (
        <div data-ds-time-columns="">
            {!use24Hours && (
                <Column label="오전/오후" height={height}>
                    {['오전', '오후'].map((t, i) => (
                        <button
                            key={t}
                            type="button"
                            role="option"
                            aria-selected={pm === (i === 1)}
                            data-selected={pm === (i === 1) ? '' : undefined}
                            onClick={() => set((h % 12) + (i === 1 ? 12 : 0), m, s)}
                        >
                            {t}
                        </button>
                    ))}
                </Column>
            )}
            {col('시', hours, (n) => to24(n) === h, (n) => set(to24(n), m, s), (n) => {
                const base = to24(n) * 3600
                return (lo !== null && base + 3599 < lo) || (hi !== null && base > hi)
            })}
            {col('분', minutes, (n) => n === m, (n) => set(h, n, s), (n) => out(h * 3600 + n * 60))}
            {withSec && col('초', seconds, (n) => n === s, (n) => set(h, m, n), (n) => out(h * 3600 + m * 60 + n))}
        </div>
    )
}

const Column = ({ label, height, children }: { label: string; height: number; children: ReactNode }) => {
    const ref = useRef<HTMLDivElement | null>(null)
    // 처음 열 때 선택된 칸을 가운데로
    useEffect(() => {
        const el = ref.current?.querySelector<HTMLElement>('[data-selected]')
        if (el && ref.current) ref.current.scrollTop = el.offsetTop - height / 2 + el.offsetHeight / 2
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div ref={ref} role="listbox" aria-label={label} data-slot="col" style={{ height }}>
            {children}
        </div>
    )
}

type RangeTime = [string | null, string | null]

export type TimePickerProps = {
    /** 'HH:mm' (secondStep 이 있으면 'HH:mm:ss'). range 면 [시작, 끝] */
    value?: string | null | RangeTime
    /** 비제어 초기값 */
    defaultValue?: string | null | RangeTime
    /** 값이 바뀔 때 (새 값, range 면 [시작, 끝]) */
    onValueChange?: (value: any) => void
    /** @deprecated onValueChange 를 쓴다 */
    onChange?: (value: string) => void
    /** 분 간격 */
    minuteStep?: number
    /** 초 간격. false 면 초를 고르지 않는다 */
    secondStep?: number | false
    /** false 면 12시간제 (오전/오후) */
    use24Hours?: boolean
    /** 가장 이른 시간. 벗어나면 오류로 보인다 */
    minTime?: string
    /** 가장 늦은 시간. 벗어나면 오류로 보인다 */
    maxTime?: string
    /** 시작·끝 두 시간을 고른다 */
    range?: boolean
    /** 표시 서식. 기본 24시간 'HH:mm', 12시간 'A hh:mm' */
    format?: string
    /** 값이 없을 때 문구 (range 가 아닐 때) */
    placeholder?: string
    /** 값이 있으면 지우기(×) 버튼 */
    clearable?: boolean
    /** 높이 xs 24 · sm 28 · md 36 · lg 44. 없으면 Form 값 */
    size?: FieldSize
    /** outlined 테두리 · filled 채운 배경 · underline 밑줄 · ghost 투명 */
    variant?: BorderVariant
    /** 오류 상태. 범위 밖이거나 시작이 끝보다 늦어도 켜진다 */
    invalid?: boolean
    /** 읽기 전용. 팝오버가 열리지 않는다 */
    readOnly?: boolean
    /** 비활성 */
    disabled?: boolean
    /** 트리거 너비 */
    width?: number | string
    /** 테두리 상자 인라인 스타일 */
    style?: CSSProperties
    /** 접근성 이름. range 면 뒤에 시작·끝 */
    'aria-label'?: string
}

/** 시·분(·초) 열에서 시간을 고르는 입력 */
export const TimePicker = ({
    value: valueProp,
    defaultValue,
    onValueChange,
    onChange,
    minuteStep = 1,
    secondStep = false,
    use24Hours = true,
    minTime,
    maxTime,
    range = false,
    format,
    placeholder = '시간 선택',
    clearable,
    size: sizeProp,
    variant: variantProp,
    invalid,
    readOnly,
    disabled,
    width,
    style,
    'aria-label': ariaLabel = '시간',
}: TimePickerProps) => {
    const variant = useBorderVariant(variantProp)
    const size = useFormSize(sizeProp)
    const [inner, setInner] = useState(defaultValue ?? (range ? [null, null] : null))
    const value = valueProp !== undefined ? valueProp : inner
    const vals: RangeTime = range ? ((value as RangeTime) ?? [null, null]) : [value as string | null, null]
    const [open, setOpen] = useState(false)
    const [side, setSide] = useState<0 | 1>(0)
    const boxRef = useRef<HTMLSpanElement | null>(null)
    const popRef = useRef<HTMLDivElement | null>(null)
    useOutsideClick([boxRef, popRef], () => setOpen(false), open)

    const fmt = format ?? `${use24Hours ? 'HH' : 'A hh'}:mm${secondStep !== false ? ':ss' : ''}`
    const lo = toSec(minTime)
    const hi = toSec(maxTime)
    const outOfRange = vals.some((v) => {
        const s = toSec(v)
        return s !== null && ((lo !== null && s < lo) || (hi !== null && s > hi))
    })
    const reversed = range && vals[0] && vals[1] && toSec(vals[0])! > toSec(vals[1])!

    const emit = (next: string | null | RangeTime) => {
        if (valueProp === undefined) setInner(next as never)
        onValueChange?.(next)
        if (typeof next === 'string') onChange?.(next)
    }
    const text = (v: string | null) => (v ? formatTime(v, fmt) : '')

    return (
        <>
            <FieldBox
                ref={boxRef}
                size={size}
                variant={variant}
                invalid={invalid || outOfRange || !!reversed}
                readOnly={readOnly}
                disabled={disabled}
                data-ds-picker-trigger=""
                style={{ width, cursor: disabled ? 'not-allowed' : 'pointer', ...style }}
            >
                {(range ? [0, 1] : [0]).map((i) => (
                    <span key={i} style={{ display: 'contents' }}>
                        {i === 1 && <span data-slot="adorn" aria-hidden>→</span>}
                        <button
                            type="button"
                            data-slot="control"
                            data-placeholder={!vals[i] ? '' : undefined}
                            aria-label={range ? `${ariaLabel} ${i === 0 ? '시작' : '끝'}` : ariaLabel}
                            aria-haspopup="dialog"
                            aria-expanded={open && side === i}
                            disabled={disabled || readOnly}
                            onClick={() => {
                                setSide(i as 0 | 1)
                                setOpen(!(open && side === i))
                            }}
                        >
                            {text(vals[i]!) || (range ? (i === 0 ? '시작' : '끝') : placeholder)}
                        </button>
                    </span>
                ))}
                {clearable && vals.some(Boolean) && !disabled && !readOnly && (
                    <FieldAction aria-label="시간 지우기" onClick={() => emit(range ? [null, null] : null)}>
                        <IconClose size={fieldIconSize[size]} />
                    </FieldAction>
                )}
            </FieldBox>
            <Popover open={open} triggerRef={boxRef} offset={4}>
                <div ref={popRef} data-ds-picker-panel="" role="dialog" aria-label={ariaLabel}>
                    <TimeColumns
                        value={vals[side]}
                        onChange={(t) => {
                            if (range) {
                                const next: RangeTime = side === 0 ? [t, vals[1]] : [vals[0], t]
                                emit(next)
                            } else emit(t)
                        }}
                        minuteStep={minuteStep}
                        secondStep={secondStep}
                        use24Hours={use24Hours}
                        minTime={minTime}
                        maxTime={maxTime}
                    />
                </div>
            </Popover>
        </>
    )
}
