import {
    Fragment,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type KeyboardEvent,
    type ReactNode,
} from 'react'
import { useOutsideClick } from './useOutsideClick.js'
import { Popover } from './Popover.js'
import { IconCheck, IconChevronDown, IconClose, IconSearch } from './icons.js'
import type { BorderVariant } from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'
import { fieldIconSize, type FieldSize, type Option } from './types.js'
import { FieldAction, FieldBox, FieldSpinner, useFormSize } from './Field.js'

export type SelectOption = Option

/** @deprecated SelectOption(Option) 을 쓴다. */
export type ComboBoxOption = Option

export type OptionState = { selected: boolean; active: boolean }

export type SelectProps = {
    options?: Option[]
    value?: string | string[] | null
    defaultValue?: string | string[] | null
    /** single 이면 string | null, multiple 이면 string[] */
    onValueChange?: (value: any) => void
    /** @deprecated onValueChange 를 쓴다. single 에서만 호출된다. */
    onChange?: (value: string) => void
    placeholder?: string
    emptyMessage?: ReactNode
    multiple?: boolean
    /** 입력해서 거른다. Select 는 false, ComboBox 는 true. */
    searchable?: boolean
    /** 목록에 없는 값을 새로 만든다. onCreate 에 입력값이 넘어간다. */
    creatable?: boolean
    onCreate?: (input: string) => void
    /** 서버 검색. 입력이 바뀔 때(250ms 뒤) 불린다. */
    loadOptions?: (query: string) => Promise<Option[]>
    loadingMessage?: ReactNode
    /** 그룹 제목. 없으면 option.group 을 쓴다. */
    groupBy?: (o: Option) => string | undefined
    renderOption?: (o: Option, state: OptionState) => ReactNode
    /** 옵션이 많을 때 보이는 행만 그린다 (행 높이 32px 고정). */
    virtualized?: boolean
    clearable?: boolean
    /** multiple 에서 트리거에 보일 태그 수. 넘치면 +N */
    maxTagCount?: number
    size?: FieldSize
    variant?: BorderVariant
    invalid?: boolean
    readOnly?: boolean
    disabled?: boolean
    width?: string | number
    fullWidth?: boolean
    style?: CSSProperties
    id?: string
    'aria-label'?: string
    'aria-labelledby'?: string
}

const ROW = 32
const textOf = (o: Option) =>
    `${typeof o.label === 'string' || typeof o.label === 'number' ? o.label : ''} ${o.value} ${
        typeof o.description === 'string' ? o.description : ''
    }`.toLowerCase()

const highlightText = (label: ReactNode, q: string): ReactNode => {
    if (!q || typeof label !== 'string') return label
    const i = label.toLowerCase().indexOf(q.toLowerCase())
    if (i < 0) return label
    return (
        <>
            {label.slice(0, i)}
            <mark>{label.slice(i, i + q.length)}</mark>
            {label.slice(i + q.length)}
        </>
    )
}

export const Select = ({
    options: staticOptions = [],
    value: valueProp,
    defaultValue,
    onValueChange,
    onChange,
    placeholder = '선택',
    emptyMessage = '결과 없음',
    multiple = false,
    searchable = false,
    creatable = false,
    onCreate,
    loadOptions,
    loadingMessage = '검색 중…',
    groupBy,
    renderOption,
    virtualized,
    clearable,
    maxTagCount,
    size: sizeProp,
    variant: variantProp,
    invalid,
    readOnly,
    disabled,
    width,
    fullWidth,
    style,
    id: idProp,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
}: SelectProps) => {
    const variant = useBorderVariant(variantProp)
    const size = useFormSize(sizeProp)
    const autoId = useId()
    const id = idProp ?? `ds-select-${autoId}`
    const listId = `${id}-list`

    const [inner, setInner] = useState<string | string[] | null>(
        defaultValue ?? (multiple ? [] : null),
    )
    const current = valueProp !== undefined ? valueProp : inner
    const selectedValues: string[] = Array.isArray(current) ? current : current ? [current] : []

    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [active, setActive] = useState(0)
    const [remote, setRemote] = useState<Option[] | null>(null)
    const [loading, setLoading] = useState(false)
    /** 선택한 원격 옵션의 라벨을 기억한다 (검색어가 바뀌면 목록에서 사라지므로). */
    const known = useRef(new Map<string, Option>())

    const boxRef = useRef<HTMLSpanElement | null>(null)
    const listRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const triggerRef = useRef<HTMLElement | null>(null)

    const options = remote ?? staticOptions
    for (const o of options) known.current.set(o.value, o)
    const find = (v: string) => known.current.get(v)

    useOutsideClick([listRef, boxRef], () => close(), open)

    // 서버 검색
    useEffect(() => {
        if (!loadOptions || !open) return
        let alive = true
        setLoading(true)
        const t = setTimeout(() => {
            loadOptions(query)
                .then((r) => alive && setRemote(r))
                .finally(() => alive && setLoading(false))
        }, 250)
        return () => {
            alive = false
            clearTimeout(t)
        }
    }, [loadOptions, query, open])

    const filtered = useMemo(() => {
        if (loadOptions || !searchable || !query) return options
        const q = query.toLowerCase()
        return options.filter((o) => textOf(o).includes(q))
    }, [options, query, searchable, loadOptions])

    const canCreate =
        creatable &&
        query.trim() !== '' &&
        !options.some((o) => textOf(o).trim() === query.trim().toLowerCase())

    // 그룹 순서를 지키며 평탄화
    const rows = useMemo(() => {
        const key = (o: Option) => (groupBy ? groupBy(o) : o.group)
        const out: Array<{ kind: 'group'; label: string } | { kind: 'opt'; o: Option; i: number }> = []
        const groups = new Map<string, Option[]>()
        const order: string[] = []
        for (const o of filtered) {
            const g = key(o) ?? ''
            if (!groups.has(g)) {
                groups.set(g, [])
                order.push(g)
            }
            groups.get(g)!.push(o)
        }
        let i = 0
        for (const g of order) {
            if (g) out.push({ kind: 'group', label: g })
            for (const o of groups.get(g)!) out.push({ kind: 'opt', o, i: i++ })
        }
        return out
    }, [filtered, groupBy])
    const optCount = filtered.length + (canCreate ? 1 : 0)

    const emit = (next: string | string[] | null) => {
        if (valueProp === undefined) setInner(next)
        onValueChange?.(next)
        if (!multiple && typeof next === 'string') onChange?.(next)
    }

    const choose = (o: Option) => {
        if (o.disabled) return
        if (multiple) {
            emit(
                selectedValues.includes(o.value)
                    ? selectedValues.filter((v) => v !== o.value)
                    : [...selectedValues, o.value],
            )
            setQuery('')
            inputRef.current?.focus()
        } else {
            emit(o.value)
            close()
        }
    }
    const create = () => {
        const text = query.trim()
        if (!text) return
        onCreate?.(text)
        setQuery('')
        if (!multiple) close()
    }

    function close() {
        setOpen(false)
        setQuery('')
        if (loadOptions) setRemote(null)
    }
    const openList = () => {
        if (disabled || readOnly) return
        setOpen(true)
        const first = filtered.findIndex((o) => selectedValues.includes(o.value))
        setActive(first < 0 ? 0 : first)
    }

    // 활성 행이 보이게 스크롤
    useEffect(() => {
        if (!open || !listRef.current) return
        const el = listRef.current.querySelector<HTMLElement>(`[data-index="${active}"]`)
        el?.scrollIntoView?.({ block: 'nearest' })
    }, [active, open])

    const onKey = (e: KeyboardEvent) => {
        if (disabled || readOnly) return
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                if (!open) openList()
                else setActive((a) => Math.min(a + 1, optCount - 1))
                break
            case 'ArrowUp':
                e.preventDefault()
                if (!open) openList()
                else setActive((a) => Math.max(a - 1, 0))
                break
            case 'Home':
                if (open) {
                    e.preventDefault()
                    setActive(0)
                }
                break
            case 'End':
                if (open) {
                    e.preventDefault()
                    setActive(optCount - 1)
                }
                break
            case 'Enter':
                if (!open) {
                    e.preventDefault()
                    openList()
                } else {
                    e.preventDefault()
                    if (active < filtered.length) choose(filtered[active]!)
                    else if (canCreate) create()
                }
                break
            case ' ':
                if (!searchable) {
                    e.preventDefault()
                    if (!open) openList()
                    else if (active < filtered.length) choose(filtered[active]!)
                }
                break
            case 'Escape':
                if (open) {
                    e.preventDefault()
                    close()
                }
                break
            case 'Tab':
                close()
                break
            case 'Backspace':
                if (multiple && searchable && query === '' && selectedValues.length) {
                    emit(selectedValues.slice(0, -1))
                }
                break
        }
    }

    const iconSize = fieldIconSize[size]
    const single = !multiple ? find(selectedValues[0] ?? '') : undefined
    const shownTags =
        multiple && maxTagCount !== undefined ? selectedValues.slice(0, maxTagCount) : selectedValues
    const hiddenCount = selectedValues.length - shownTags.length
    const activeId = open && optCount ? `${id}-opt-${active}` : undefined

    const comboProps = {
        role: 'combobox' as const,
        'aria-expanded': open,
        'aria-controls': listId,
        'aria-haspopup': 'listbox' as const,
        'aria-activedescendant': activeId,
        'aria-invalid': invalid || undefined,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
        'aria-disabled': disabled || undefined,
        'aria-readonly': readOnly || undefined,
        onKeyDown: onKey,
    }

    const tags = multiple && (
        <>
            {shownTags.map((v) => (
                <span key={v} data-ds-chip="">
                    {find(v)?.label ?? v}
                    {!disabled && !readOnly && (
                        <button
                            type="button"
                            tabIndex={-1}
                            aria-label={`${typeof find(v)?.label === 'string' ? find(v)!.label : v} 제거`}
                            onClick={(e) => {
                                e.stopPropagation()
                                emit(selectedValues.filter((x) => x !== v))
                            }}
                        >
                            <IconClose size={12} />
                        </button>
                    )}
                </span>
            ))}
            {hiddenCount > 0 && (
                <span data-ds-chip="" data-more="">
                    +{hiddenCount}
                </span>
            )}
        </>
    )

    const showClear = clearable && selectedValues.length > 0 && !disabled && !readOnly

    // 가상화: 행 높이 고정. 그룹 제목도 한 행으로 센다.
    const [scrollTop, setScrollTop] = useState(0)
    const VIEW = 8
    const virtual = virtualized && rows.length > 50
    const start = virtual ? Math.max(0, Math.floor(scrollTop / ROW) - 4) : 0
    const end = virtual ? Math.min(rows.length, start + VIEW + 12) : rows.length

    return (
        <>
            <FieldBox
                ref={boxRef}
                size={size}
                variant={variant}
                invalid={invalid}
                readOnly={readOnly}
                disabled={disabled}
                fullWidth={fullWidth}
                data-ds-select=""
                data-multiple={multiple ? '' : undefined}
                style={{ width: fullWidth ? undefined : width, cursor: disabled ? 'not-allowed' : 'pointer', ...style }}
                onMouseDown={(e) => {
                    if (disabled || readOnly) return
                    if ((e.target as HTMLElement).closest('button[data-slot="action"],[data-ds-chip] button')) return
                    if (searchable) {
                        if (e.target !== inputRef.current) e.preventDefault()
                        inputRef.current?.focus()
                        if (!open) openList()
                    } else {
                        e.preventDefault()
                        triggerRef.current?.focus()
                        open ? close() : openList()
                    }
                }}
            >
                {searchable && <span data-slot="adorn"><IconSearch size={iconSize} /></span>}
                {tags}
                {searchable ? (
                    <input
                        ref={(n) => {
                            inputRef.current = n
                            triggerRef.current = n
                        }}
                        id={id}
                        data-slot="control"
                        autoComplete="off"
                        disabled={disabled}
                        readOnly={readOnly}
                        value={
                            open || multiple
                                ? query
                                : typeof single?.label === 'string'
                                  ? single.label
                                  : (single?.value ?? '')
                        }
                        placeholder={multiple && selectedValues.length ? '' : placeholder}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            setActive(0)
                            if (!open) setOpen(true)
                        }}
                        aria-autocomplete="list"
                        {...comboProps}
                    />
                ) : (
                    <span
                        ref={triggerRef}
                        id={id}
                        tabIndex={disabled ? -1 : 0}
                        data-slot="control"
                        data-placeholder={!single && !(multiple && selectedValues.length) ? '' : undefined}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, outline: 'none', overflow: 'hidden' }}
                        {...comboProps}
                    >
                        {multiple ? (selectedValues.length ? null : placeholder) : single ? (
                            <>
                                {single.icon}
                                <span data-slot="value">{single.label}</span>
                            </>
                        ) : (
                            placeholder
                        )}
                    </span>
                )}
                {loading && open && <FieldSpinner />}
                {showClear && (
                    <FieldAction
                        aria-label="선택 지우기"
                        tabIndex={-1}
                        onClick={() => emit(multiple ? [] : null)}
                    >
                        <IconClose size={iconSize} />
                    </FieldAction>
                )}
                <span data-slot="adorn" data-chevron={open ? 'open' : ''} aria-hidden>
                    <IconChevronDown size={iconSize} />
                </span>
            </FieldBox>
            <Popover open={open} triggerRef={boxRef} offset={4} matchTriggerWidth minWidth={160}>
                <div
                    ref={listRef}
                    id={listId}
                    role="listbox"
                    aria-multiselectable={multiple || undefined}
                    data-ds-listbox=""
                    onMouseDown={(e) => e.preventDefault()}
                    onScroll={virtual ? (e) => setScrollTop(e.currentTarget.scrollTop) : undefined}
                >
                    {loading && !remote ? (
                        <div data-ds-listbox-empty="">
                            <span data-ds-field-spinner="" data-ds-spinner="" /> {loadingMessage}
                        </div>
                    ) : rows.length === 0 && !canCreate ? (
                        <div data-ds-listbox-empty="">{emptyMessage}</div>
                    ) : (
                        <>
                            {virtual && <div style={{ height: start * ROW }} />}
                            {rows.slice(start, end).map((r, k) =>
                                r.kind === 'group' ? (
                                    <div key={`g-${r.label}-${k}`} role="presentation" data-ds-option-group="">
                                        {r.label}
                                    </div>
                                ) : (
                                    <Fragment key={r.o.value}>
                                        {(() => {
                                            const sel = selectedValues.includes(r.o.value)
                                            const act = r.i === active
                                            return (
                                                <div
                                                    id={`${id}-opt-${r.i}`}
                                                    role="option"
                                                    aria-selected={sel}
                                                    aria-disabled={r.o.disabled || undefined}
                                                    data-ds-option=""
                                                    data-index={r.i}
                                                    data-active={act ? '' : undefined}
                                                    onMouseEnter={() => setActive(r.i)}
                                                    onClick={() => choose(r.o)}
                                                >
                                                    {renderOption ? (
                                                        renderOption(r.o, { selected: sel, active: act })
                                                    ) : (
                                                        <>
                                                            {multiple && (
                                                                <span data-slot="check" aria-hidden>
                                                                    {sel && <IconCheck size={11} />}
                                                                </span>
                                                            )}
                                                            {r.o.icon && <span data-slot="icon">{r.o.icon}</span>}
                                                            <span data-slot="label">
                                                                {highlightText(r.o.label, query)}
                                                            </span>
                                                            {r.o.description && (
                                                                <span data-slot="desc">{r.o.description}</span>
                                                            )}
                                                            {!multiple && sel && (
                                                                <span data-slot="tick" aria-hidden>
                                                                    <IconCheck size={14} />
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            )
                                        })()}
                                    </Fragment>
                                ),
                            )}
                            {virtual && <div style={{ height: (rows.length - end) * ROW }} />}
                            {canCreate && (
                                <>
                                    <div data-ds-menu-separator="" role="presentation" />
                                    <div
                                        id={`${id}-opt-${filtered.length}`}
                                        role="option"
                                        aria-selected={false}
                                        data-ds-option=""
                                        data-create=""
                                        data-index={filtered.length}
                                        data-active={active === filtered.length ? '' : undefined}
                                        onMouseEnter={() => setActive(filtered.length)}
                                        onClick={create}
                                    >
                                        ＋ "{query.trim()}" 추가
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </Popover>
        </>
    )
}

/** 입력해서 고르는 Select. searchable 이 기본으로 켜져 있다. */
export const ComboBox = (props: SelectProps) => <Select searchable placeholder="검색" {...props} />

export type MultiSelectProps = Omit<SelectProps, 'multiple' | 'value' | 'defaultValue' | 'onValueChange'> & {
    value?: string[]
    defaultValue?: string[]
    onValueChange?: (value: string[]) => void
}

/** 여러 개를 고르는 Select. */
export const MultiSelect = (props: MultiSelectProps) => <Select multiple {...props} />
