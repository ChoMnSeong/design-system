import {
    Fragment,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type KeyboardEvent,
    type PointerEvent as ReactPointerEvent,
    type ReactNode,
    type Ref,
} from 'react'
import { Input } from '../inputs/Input.js'
import { NumberInput } from '../inputs/NumberInput.js'
import { Select } from '../inputs/Select.js'
import { DatePicker } from '../inputs/DatePicker.js'
import { Pagination } from '../navigation/Pagination.js'
import { Empty } from '../feedback/Empty.js'
import { Popover } from '../overlay/Popover.js'
import { Button } from '../actions/Button.js'
import { InlineBar } from '../charts/MiniCharts.js'
import { Menu, MenuCheckboxItem, MenuLabel } from '../overlay/Menu.js'
import { useOutsideClick } from '../useOutsideClick.js'
import { IconArrowDown, IconArrowUp, IconChevronDown, IconChevronRight, IconSearch } from '../icons.js'
import type { BorderVariant } from '../borderVariant.js'
import type { Density, Option, Tone } from '../types.js'

/* ───────────────────────── 타입 ───────────────────────── */

export type DataTableKey = string | number

export type DataTableFilter =
    | { /** 포함하는 글 */ type: 'text'; /** 입력칸 안내 문구 */ placeholder?: string }
    | { /** 값이 같은 것 */ type: 'select'; /** 선택지 */ options: Option[]; /** 선택 안내 문구 */ placeholder?: string }
    | { /** 비교식 (">100", "<=5", "10..20") */ type: 'number' }

export type Aggregate<T> = 'sum' | 'avg' | 'count' | 'min' | 'max' | ((rows: T[]) => ReactNode)

export type DataTableColumn<T> = {
    /** 열 키. accessor 가 없으면 row[id] 를 값으로 */
    id: string
    /** 머리 글 */
    header: ReactNode
    /** 행에서 값을 꺼낸다 (정렬 · 검색 · 필터 기준) */
    accessor?: (row: T) => unknown
    /** 셀을 직접 그린다 (행, { 값, 행 번호 }) */
    cell?: (row: T, ctx: { value: unknown; rowIndex: number }) => ReactNode
    /** 머리를 눌러 정렬 (오름 → 내림 → 해제) */
    sortable?: boolean
    /** 열 폭(px) */
    width?: number
    /** 폭 조절 최소(px) */
    minWidth?: number
    /** 폭 조절 최대(px) */
    maxWidth?: number
    /** 셀 글 정렬 */
    align?: 'left' | 'right' | 'center'
    /** 머리에 필터 버튼을 단다 */
    filter?: DataTableFilter
    /** 가로 스크롤해도 왼쪽 · 오른쪽에 고정 */
    pinned?: 'left' | 'right'
    /** 머리 끝을 끌어 폭 조절 (더블클릭하면 원래대로) */
    resizable?: boolean
    /** 열 설정에서 숨길 수 있는지. 기본 true */
    hideable?: boolean
    /** 처음에 숨김 */
    hidden?: boolean
    /** editable 표에서 더블클릭 · Enter · F2 로 여는 편집기 */
    editor?: 'input' | 'number' | 'select' | 'date'
    /** select 편집기 선택지 */
    editorOptions?: Option[]
    /** 그룹 소계 · 합계 행 집계. 함수면 (행들) → 표시 */
    aggregate?: Aggregate<T>
    /** 값 표시 서식 (cell 이 없을 때) */
    format?: (value: unknown, row: T) => ReactNode
    /** 다단 헤더: 하위 열 */
    columns?: DataTableColumn<T>[]
    /** 'bar' 면 값을 InlineBar 로 그린다 (barMax · barTone) */
    type?: 'bar'
    /** bar 막대 최댓값 */
    barMax?: number
    /** bar 막대 톤 (값, 행) */
    barTone?: (value: number, row: T) => Tone | undefined
}

export type DataTableSort = { /** 정렬 열 id */ columnId: string; /** 오름 · 내림차순 */ direction: 'asc' | 'desc' } | null

export type DataTableQuery = {
    /** 정렬 (없으면 null) */
    sort: DataTableSort
    /** 열 id → 필터 입력값 */
    filters: Record<string, string>
    /** 검색어 */
    search: string
    /** 페이지 번호 (1부터) */
    page: number
    /** 페이지당 행 수 (페이지 없으면 0) */
    pageSize: number
}

export type DataTableProps<T> = {
    /** 열 정의 (columns 를 넣으면 다단 헤더) */
    columns: DataTableColumn<T>[]
    /** 행 데이터 */
    data: T[]
    /** 행 키를 돌려준다 (선택 · 펼침 기준, 없으면 인덱스) */
    rowKey?: (row: T, index: number) => DataTableKey
    /** 행을 누를 때 (행) */
    onRowClick?: (row: T) => void
    /** 툴바 왼쪽 제목 (CSV 파일 이름에도 쓴다) */
    title?: ReactNode
    /** 툴바 오른쪽에 붙는 버튼 */
    actions?: ReactNode
    /** client: 정렬·필터·페이지를 표가 직접 · server: onQueryChange 로 알리고 data 는 현재 페이지만 */
    mode?: 'client' | 'server'
    /** 불러오는 중. 행이 없으면 스켈레톤, 있으면 로딩 막대 */
    loading?: boolean
    /** server 모드 전체 행 수 (페이지 계산용) */
    totalCount?: number
    /** server 모드에서 정렬 · 필터 · 검색 · 페이지가 바뀔 때 (조건) */
    onQueryChange?: (q: DataTableQuery) => void
    /** 페이지 크기 · 크기 선택지. false 면 페이지 없이 전부 */
    pagination?: { pageSize?: number; pageSizeOptions?: number[] } | false
    /** @deprecated pagination.pageSize 를 쓴다 */
    pageSize?: number
    /** 툴바 검색칸 */
    showSearch?: boolean
    /** 검색칸 안내 문구 */
    searchPlaceholder?: string
    /** 검색할 키나 함수 (없으면 모든 열 값) */
    searchKeys?: (keyof T | ((row: T) => string))[]
    /** 행이 없을 때 내용 */
    empty?: ReactNode
    /** @deprecated empty 를 쓴다 */
    emptyState?: ReactNode
    /** 행 선택 방식. single 라디오 · multiple 체크박스 */
    selection?: 'none' | 'single' | 'multiple'
    /** 제어 모드 선택 키 */
    selectedKeys?: DataTableKey[]
    /** 선택이 바뀔 때 (키 목록, 행 목록) */
    onSelectionChange?: (keys: DataTableKey[], rows: T[]) => void
    /** 선택했을 때 위에 뜨는 일괄 작업 줄 */
    bulkActions?: (selected: T[]) => ReactNode
    /** 행 아래 상세 펼치기 (render · 펼칠 수 있는 행 판정) */
    expandable?: { render: (row: T) => ReactNode; rowExpandable?: (row: T) => boolean }
    /** 행 바탕 톤 (불량률 초과 등) */
    rowTone?: (row: T) => Tone | undefined
    /** 그룹 행 + 소계 (aggregate 열) */
    groupBy?: keyof T | ((row: T) => string)
    /** editor 가 있는 열의 셀 편집 켜기 */
    editable?: boolean
    /** 셀 편집을 마칠 때 (행, 열 id, 새 값) */
    onCellEdit?: (row: T, columnId: string, value: unknown) => void
    /** 보이는 행만 그린다 (maxHeight 필요 · 80행 초과 · expandable 없을 때) */
    virtualized?: boolean
    /** 스크롤해도 머리 고정 */
    stickyHeader?: boolean
    /** 스크롤 영역 최대 높이(px) */
    maxHeight?: number
    /** 셀 여백 · 행 높이 */
    density?: Density
    /** 줄마다 번갈아 배경 */
    striped?: boolean
    /** 셀 사이 세로 구분선 */
    bordered?: boolean
    /** outlined(바깥 테두리) · underline(행 구분선만) · filled(헤더 배경) · ghost(구분선 없음) */
    variant?: BorderVariant
    /** 내보내기 버튼. 없으면 CSV 만 브라우저에서 바로 내려받는다 */
    onExport?: (format: 'csv' | 'xlsx', rows: T[]) => void
    /** 툴바에 내보내기 메뉴 */
    exportable?: boolean
    /** localStorage 키. 열 너비 · 숨김을 기억한다 */
    stateKey?: string
    /** 바깥 요소 클래스 */
    className?: string
    /** 바깥 요소 스타일 */
    style?: CSSProperties
    /** DOM 요소 ref */
    ref?: Ref<HTMLDivElement>
}

/* ───────────────────────── 유틸 ───────────────────────── */

const compare = (a: unknown, b: unknown): number => {
    if (typeof a === 'number' && typeof b === 'number') return a - b
    const sa = String(a ?? '').toLowerCase()
    const sb = String(b ?? '').toLowerCase()
    return sa.localeCompare(sb, 'ko', { numeric: true })
}

const leaves = <T,>(cols: DataTableColumn<T>[]): DataTableColumn<T>[] =>
    cols.flatMap((c) => (c.columns?.length ? leaves(c.columns) : [c]))

const depthOf = <T,>(cols: DataTableColumn<T>[]): number =>
    Math.max(1, ...cols.map((c) => (c.columns?.length ? 1 + depthOf(c.columns) : 1)))

const valueOf = <T,>(c: DataTableColumn<T>, row: T): unknown =>
    c.accessor ? c.accessor(row) : (row as Record<string, unknown>)[c.id]

const fmtNum = (n: number) => n.toLocaleString('ko-KR', { maximumFractionDigits: 2 })

const aggregate = <T,>(c: DataTableColumn<T>, rows: T[]): ReactNode => {
    if (!c.aggregate) return null
    if (typeof c.aggregate === 'function') return c.aggregate(rows)
    const nums = rows.map((r) => Number(valueOf(c, r))).filter((n) => !Number.isNaN(n))
    switch (c.aggregate) {
        case 'count':
            return fmtNum(rows.length)
        case 'sum':
            return fmtNum(nums.reduce((a, b) => a + b, 0))
        case 'avg':
            return nums.length ? fmtNum(nums.reduce((a, b) => a + b, 0) / nums.length) : '—'
        case 'min':
            return nums.length ? fmtNum(Math.min(...nums)) : '—'
        case 'max':
            return nums.length ? fmtNum(Math.max(...nums)) : '—'
    }
}

const loadState = (key?: string): { widths?: Record<string, number>; hidden?: string[] } => {
    if (!key) return {}
    try {
        return JSON.parse(localStorage.getItem(`ds-table:${key}`) ?? '{}')
    } catch {
        return {}
    }
}
const saveState = (key: string | undefined, s: { widths: Record<string, number>; hidden: string[] }) => {
    if (!key) return
    try {
        localStorage.setItem(`ds-table:${key}`, JSON.stringify(s))
    } catch {
        /* 사생활 보호 모드 등 */
    }
}

const toCsv = <T,>(cols: DataTableColumn<T>[], rows: T[]) => {
    const esc = (v: unknown) => {
        const s = String(v ?? '')
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }
    const head = cols.map((c) => esc(typeof c.header === 'string' ? c.header : c.id)).join(',')
    const body = rows.map((r) => cols.map((c) => esc(valueOf(c, r))).join(',')).join('\n')
    return `﻿${head}\n${body}`
}

/* ───────────────────────── 필터 버튼 ───────────────────────── */

const FilterButton = ({
    label,
    filter,
    value,
    onChange,
}: {
    label: string
    filter: DataTableFilter
    value: string
    onChange: (v: string) => void
}) => {
    const [open, setOpen] = useState(false)
    const btn = useRef<HTMLButtonElement | null>(null)
    const pop = useRef<HTMLDivElement | null>(null)
    useOutsideClick([btn, pop], () => setOpen(false), open)
    return (
        <>
            <button
                ref={btn}
                type="button"
                data-slot="filter"
                data-active={value ? '' : undefined}
                aria-label={`${label} 필터${value ? ` (${value})` : ''}`}
                aria-expanded={open}
                onClick={(e) => {
                    e.stopPropagation()
                    setOpen(!open)
                }}
            >
                <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden>
                    <path d="M2 3h12l-4 6v4l-4-2V9z" fill={value ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
            </button>
            <Popover open={open} triggerRef={btn} offset={4} align="end">
                <div ref={pop} data-ds-picker-panel="" style={{ flexDirection: 'column', width: 220, gap: 8 }} onClick={(e) => e.stopPropagation()}>
                    {filter.type === 'select' ? (
                        <Select
                            size="sm"
                            options={[{ value: '', label: '전체' }, ...filter.options]}
                            value={value || ''}
                            placeholder={filter.placeholder ?? '전체'}
                            onValueChange={(v: string | null) => onChange(v ?? '')}
                            aria-label={`${label} 필터`}
                            fullWidth
                        />
                    ) : (
                        <Input
                            size="sm"
                            autoFocus
                            value={value}
                            placeholder={filter.type === 'number' ? '예) >100, <=5, 10..20' : (filter.placeholder ?? '포함하는 글자')}
                            onChange={(e) => onChange(e.target.value)}
                            clearable
                            onClear={() => onChange('')}
                            aria-label={`${label} 필터`}
                            fullWidth
                        />
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                        <Button size="xs" appearance="ghost" tone="neutral" onClick={() => onChange('')}>
                            초기화
                        </Button>
                        <Button size="xs" onClick={() => setOpen(false)}>
                            적용
                        </Button>
                    </div>
                </div>
            </Popover>
        </>
    )
}

/** 숫자 필터: ">100", "<=5", "10..20", "=3" */
const numberMatch = (v: number, q: string) => {
    const t = q.replace(/\s/g, '')
    const range = /^(-?[\d.]+)\.\.(-?[\d.]+)$/.exec(t)
    if (range) return v >= +range[1]! && v <= +range[2]!
    const op = /^(>=|<=|>|<|=)?(-?[\d.]+)$/.exec(t)
    if (!op) return true
    const n = +op[2]!
    switch (op[1]) {
        case '>':
            return v > n
        case '<':
            return v < n
        case '>=':
            return v >= n
        case '<=':
            return v <= n
        default:
            return v === n
    }
}

/* ───────────────────────── DataTable ───────────────────────── */

/** 정렬 · 필터 · 검색 · 페이지 · 선택 · 그룹 · 편집을 갖춘 표 */
export const DataTable = <T,>({
    columns: columnsProp,
    data,
    rowKey = (_r, i) => i,
    onRowClick,
    title,
    actions,
    mode = 'client',
    loading,
    totalCount,
    onQueryChange,
    pagination: paginationProp,
    pageSize: legacyPageSize,
    showSearch,
    searchPlaceholder = '검색',
    searchKeys,
    empty,
    emptyState,
    selection = 'none',
    selectedKeys: selectedProp,
    onSelectionChange,
    bulkActions,
    expandable,
    rowTone,
    groupBy,
    editable,
    onCellEdit,
    virtualized,
    stickyHeader = true,
    maxHeight,
    density = 'default',
    striped,
    bordered,
    variant = 'outlined',
    onExport,
    exportable,
    stateKey,
    className,
    style,
    ref,
}: DataTableProps<T>) => {
    const saved = useMemo(() => loadState(stateKey), [stateKey])
    const [widths, setWidths] = useState<Record<string, number>>(saved.widths ?? {})
    const [hidden, setHidden] = useState<string[]>(
        saved.hidden ?? leaves(columnsProp).filter((c) => c.hidden).map((c) => c.id),
    )
    useEffect(() => saveState(stateKey, { widths, hidden }), [stateKey, widths, hidden])

    const pag = paginationProp === false ? false : { pageSize: paginationProp?.pageSize ?? legacyPageSize ?? 20, pageSizeOptions: paginationProp?.pageSizeOptions ?? [20, 50, 100] }
    const [sort, setSort] = useState<DataTableSort>(null)
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState<Record<string, string>>({})
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(pag ? pag.pageSize : Infinity)
    const [selInner, setSelInner] = useState<DataTableKey[]>([])
    const selected = new Set(selectedProp ?? selInner)
    const [expanded, setExpanded] = useState<Set<DataTableKey>>(new Set())
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())
    const [editing, setEditing] = useState<{ key: DataTableKey; col: string } | null>(null)
    const [edited, setEdited] = useState<Set<string>>(new Set())
    const [scrollTop, setScrollTop] = useState(0)

    // 서버 모드: 조건이 바뀌면 알린다
    useEffect(() => {
        if (mode === 'server') onQueryChange?.({ sort, filters, search, page, pageSize: pag ? pageSize : 0 })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, sort, filters, search, page, pageSize])

    const allLeaves = leaves(columnsProp)
    const visibleCols = allLeaves.filter((c) => !hidden.includes(c.id))
    const width = (c: DataTableColumn<T>) => widths[c.id] ?? c.width
    // 고정 열 오프셋
    const leftCols = visibleCols.filter((c) => c.pinned === 'left')
    const rightCols = visibleCols.filter((c) => c.pinned === 'right')
    const midCols = visibleCols.filter((c) => !c.pinned)
    const orderedCols = [...leftCols, ...midCols, ...rightCols]
    const selW = selection !== 'none' ? 40 : 0
    const expW = expandable ? 32 : 0
    const offsets = new Map<string, CSSProperties>()
    let acc = selW + expW
    for (const c of leftCols) {
        offsets.set(c.id, { position: 'sticky', left: acc, zIndex: 2 })
        acc += width(c) ?? 140
    }
    acc = 0
    for (const c of [...rightCols].reverse()) {
        offsets.set(c.id, { position: 'sticky', right: acc, zIndex: 2 })
        acc += width(c) ?? 120
    }

    /* 정렬 · 필터 · 검색 (client) */
    const processed = useMemo(() => {
        if (mode === 'server') return data
        let out = data
        const q = search.trim().toLowerCase()
        if (q) {
            out = out.filter((row) => {
                if (searchKeys?.length)
                    return searchKeys.some((k) => String(typeof k === 'function' ? k(row) : row[k]).toLowerCase().includes(q))
                return allLeaves.some((c) => String(valueOf(c, row) ?? '').toLowerCase().includes(q))
            })
        }
        for (const [id, fv] of Object.entries(filters)) {
            if (!fv) continue
            const c = allLeaves.find((x) => x.id === id)
            if (!c) continue
            out = out.filter((row) => {
                const v = valueOf(c, row)
                if (c.filter?.type === 'select') return String(v) === fv
                if (c.filter?.type === 'number') return numberMatch(Number(v), fv)
                return String(v ?? '').toLowerCase().includes(fv.toLowerCase())
            })
        }
        if (sort) {
            const c = allLeaves.find((x) => x.id === sort.columnId)
            if (c) {
                const dir = sort.direction === 'asc' ? 1 : -1
                out = [...out].sort((a, b) => compare(valueOf(c, a), valueOf(c, b)) * dir)
            }
        }
        return out
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, search, filters, sort, mode, columnsProp])

    const total = mode === 'server' ? (totalCount ?? data.length) : processed.length
    const pageCount = pag ? Math.max(1, Math.ceil(total / pageSize)) : 1
    const safePage = Math.min(page, pageCount)
    const pageRows = mode === 'server' || !pag ? processed : processed.slice((safePage - 1) * pageSize, safePage * pageSize)
    const keyOf = (r: T) => rowKey(r, data.indexOf(r))

    /* 그룹 */
    type Item = { kind: 'group'; name: string; rows: T[] } | { kind: 'row'; row: T; index: number }
    const items: Item[] = useMemo(() => {
        if (!groupBy) return pageRows.map((row, index) => ({ kind: 'row' as const, row, index }))
        const g = new Map<string, T[]>()
        for (const r of pageRows) {
            const k = String(typeof groupBy === 'function' ? groupBy(r) : r[groupBy])
            if (!g.has(k)) g.set(k, [])
            g.get(k)!.push(r)
        }
        const out: Item[] = []
        let i = 0
        for (const [name, rows] of g) {
            out.push({ kind: 'group', name, rows })
            if (!collapsedGroups.has(name)) for (const row of rows) out.push({ kind: 'row', row, index: i++ })
            else i += rows.length
        }
        return out
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageRows, groupBy, collapsedGroups])

    /* 선택 */
    const setSelected = (keys: DataTableKey[]) => {
        if (selectedProp === undefined) setSelInner(keys)
        onSelectionChange?.(keys, data.filter((r) => keys.includes(keyOf(r))))
    }
    const pageKeys = pageRows.map(keyOf)
    const allOn = pageKeys.length > 0 && pageKeys.every((k) => selected.has(k))
    const someOn = !allOn && pageKeys.some((k) => selected.has(k))
    const selectedRows = data.filter((r) => selected.has(keyOf(r)))

    /* 열 너비 조절 */
    const startResize = (c: DataTableColumn<T>, e: ReactPointerEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const th = (e.currentTarget as HTMLElement).parentElement!
        const startX = e.clientX
        const startW = th.getBoundingClientRect().width
        const move = (ev: PointerEvent) => {
            const w = Math.max(c.minWidth ?? 60, Math.min(c.maxWidth ?? 800, startW + ev.clientX - startX))
            setWidths((s) => ({ ...s, [c.id]: Math.round(w) }))
        }
        const up = () => {
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
    }

    const toggleSort = (c: DataTableColumn<T>) => {
        if (!c.sortable) return
        setSort((s) => (!s || s.columnId !== c.id ? { columnId: c.id, direction: 'asc' } : s.direction === 'asc' ? { columnId: c.id, direction: 'desc' } : null))
        setPage(1)
    }

    const commitEdit = (row: T, c: DataTableColumn<T>, v: unknown) => {
        setEditing(null)
        if (v === valueOf(c, row)) return
        setEdited((s) => new Set(s).add(`${keyOf(row)}:${c.id}`))
        onCellEdit?.(row, c.id, v)
    }

    const doExport = (format: 'csv' | 'xlsx') => {
        const rows = processed
        if (onExport) return onExport(format, rows)
        const blob = new Blob([toCsv(visibleCols, rows)], { type: 'text/csv;charset=utf-8' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `${typeof title === 'string' ? title : 'table'}.csv`
        a.click()
        URL.revokeObjectURL(a.href)
    }

    const hasAgg = visibleCols.some((c) => c.aggregate)
    const ROW = density === 'compact' ? 32 : density === 'comfortable' ? 48 : 40
    const virtual = virtualized && !!maxHeight && items.length > 80 && !expandable
    const vStart = virtual ? Math.max(0, Math.floor(scrollTop / ROW) - 8) : 0
    const vEnd = virtual ? Math.min(items.length, vStart + Math.ceil(maxHeight! / ROW) + 16) : items.length
    const colCount = orderedCols.length + (selW ? 1 : 0) + (expW ? 1 : 0)

    /* 다단 헤더 행 */
    const headDepth = depthOf(columnsProp)
    const headerRows: Array<Array<{ c: DataTableColumn<T>; span: number; rowSpan: number }>> = Array.from({ length: headDepth }, () => [])
    const walk = (cols: DataTableColumn<T>[], level: number) => {
        for (const c of cols) {
            if (c.columns?.length) {
                const span = leaves(c.columns).filter((l) => !hidden.includes(l.id)).length
                if (span) headerRows[level]!.push({ c, span, rowSpan: 1 })
                walk(c.columns, level + 1)
            } else if (!hidden.includes(c.id)) headerRows[level]!.push({ c, span: 1, rowSpan: headDepth - level })
        }
    }
    // 고정 열 순서를 지키기 위해 다단 헤더가 없을 때만 orderedCols 를 쓴다
    if (headDepth === 1) headerRows[0] = orderedCols.map((c) => ({ c, span: 1, rowSpan: 1 }))
    else walk(columnsProp, 0)

    const renderCell = (row: T, c: DataTableColumn<T>, rowIndex: number) => {
        const v = valueOf(c, row)
        const isEditing = editing && editing.key === keyOf(row) && editing.col === c.id
        if (isEditing && c.editor) {
            const common = { size: 'sm' as const, autoFocus: true, 'aria-label': `${typeof c.header === 'string' ? c.header : c.id} 편집` }
            if (c.editor === 'number')
                return <NumberInput {...common} stepper="none" defaultValue={Number(v)} onValueChange={() => {}} onBlur={(e) => commitEdit(row, c, Number(String(e.target.value).replace(/,/g, '')))} onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(row, c, Number(String((e.target as HTMLInputElement).value).replace(/,/g, ''))); if (e.key === 'Escape') setEditing(null) }} fullWidth />
            if (c.editor === 'select')
                return <Select {...common} options={c.editorOptions ?? []} defaultValue={String(v ?? '')} onValueChange={(nv: string | null) => commitEdit(row, c, nv)} fullWidth />
            if (c.editor === 'date')
                return <DatePicker size="sm" defaultValue={String(v ?? '')} onValueChange={(nv) => commitEdit(row, c, nv)} fullWidth />
            return <Input {...common} defaultValue={String(v ?? '')} onBlur={(e) => commitEdit(row, c, e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(row, c, (e.target as HTMLInputElement).value); if (e.key === 'Escape') setEditing(null) }} fullWidth />
        }
        if (c.cell) return c.cell(row, { value: v, rowIndex })
        if (c.type === 'bar') return <InlineBar value={Number(v)} max={c.barMax ?? 100} tone={c.barTone?.(Number(v), row)} format={(n) => (c.format ? String(c.format(n, row)) : fmtNum(n))} />
        if (c.format) return c.format(v, row)
        return typeof v === 'number' ? fmtNum(v) : (v as ReactNode)
    }

    const cellStyle = (c: DataTableColumn<T>): CSSProperties => ({
        ...offsets.get(c.id),
        ...(width(c) ? { width: width(c), minWidth: width(c), maxWidth: width(c) } : null),
    })

    const groupRow = (g: { name: string; rows: T[] }) => {
        const open = !collapsedGroups.has(g.name)
        return (
            <tr key={`g-${g.name}`} data-slot="group">
                <td colSpan={colCount}>
                    <button
                        type="button"
                        data-slot="group-toggle"
                        aria-expanded={open}
                        onClick={() => setCollapsedGroups((s) => { const n = new Set(s); if (n.has(g.name)) n.delete(g.name); else n.add(g.name); return n })}
                    >
                        <IconChevronDown size={14} style={{ transform: open ? undefined : 'rotate(-90deg)' }} />
                        <b>{g.name}</b>
                        <span data-slot="count">{g.rows.length}</span>
                    </button>
                    {hasAgg && (
                        <span data-slot="subtotal">
                            소계{' '}
                            {visibleCols
                                .filter((c) => c.aggregate)
                                .map((c) => `${typeof c.header === 'string' ? c.header : c.id} ${aggregate(c, g.rows)}`)
                                .join(' · ')}
                        </span>
                    )}
                </td>
            </tr>
        )
    }

    const bodyRow = (row: T, index: number) => {
        const k = keyOf(row)
        const tone = rowTone?.(row)
        const canExpand = expandable && (expandable.rowExpandable?.(row) ?? true)
        const isOpen = expanded.has(k)
        return (
            <Fragment key={String(k)}>
                <tr
                    data-slot="row"
                    data-tone={tone}
                    data-selected={selected.has(k) ? '' : undefined}
                    aria-selected={selection !== 'none' ? selected.has(k) : undefined}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    style={onRowClick ? { cursor: 'pointer' } : undefined}
                >
                    {selW > 0 && (
                        <td data-slot="sel" style={{ position: 'sticky', left: 0, zIndex: 2 }} onClick={(e) => e.stopPropagation()}>
                            <input
                                type={selection === 'single' ? 'radio' : 'checkbox'}
                                data-ds-checkbox={selection === 'multiple' ? '' : undefined}
                                data-ds-radio={selection === 'single' ? '' : undefined}
                                data-size="sm"
                                aria-label={`${String(k)} 선택`}
                                checked={selected.has(k)}
                                onChange={() => setSelected(selection === 'single' ? [k] : selected.has(k) ? [...selected].filter((x) => x !== k) : [...selected, k])}
                            />
                        </td>
                    )}
                    {expW > 0 && (
                        <td data-slot="exp" style={{ position: 'sticky', left: selW, zIndex: 2 }} onClick={(e) => e.stopPropagation()}>
                            {canExpand && (
                                <button
                                    type="button"
                                    data-slot="exp-btn"
                                    aria-expanded={isOpen}
                                    aria-label={isOpen ? '상세 접기' : '상세 펼치기'}
                                    onClick={() => setExpanded((s) => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n })}
                                >
                                    <IconChevronRight size={14} style={{ transform: isOpen ? 'rotate(90deg)' : undefined }} />
                                </button>
                            )}
                        </td>
                    )}
                    {orderedCols.map((c) => {
                        const canEdit = editable && !!c.editor
                        return (
                            <td
                                key={c.id}
                                data-align={c.align}
                                data-pinned={c.pinned}
                                data-edited={edited.has(`${k}:${c.id}`) ? '' : undefined}
                                data-editable={canEdit ? '' : undefined}
                                tabIndex={canEdit ? 0 : undefined}
                                style={cellStyle(c)}
                                onDoubleClick={canEdit ? () => setEditing({ key: k, col: c.id }) : undefined}
                                onKeyDown={canEdit ? (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === 'F2') { e.preventDefault(); setEditing({ key: k, col: c.id }) } } : undefined}
                            >
                                {renderCell(row, c, index)}
                            </td>
                        )
                    })}
                </tr>
                {canExpand && isOpen && (
                    <tr data-slot="detail">
                        <td colSpan={colCount}>{expandable!.render(row)}</td>
                    </tr>
                )}
            </Fragment>
        )
    }

    const hideableCols = allLeaves.filter((c) => c.hideable !== false)
    const showToolbar = title || actions || showSearch || exportable || onExport || hideableCols.length > 0

    return (
        <div ref={ref} data-ds-datatable="" className={className} style={style}>
            {showToolbar && (
                <div data-slot="toolbar">
                    <div data-slot="title">
                        {title && <h4>{title}</h4>}
                        <span data-slot="total">
                            총 <b>{fmtNum(total)}</b>건
                        </span>
                    </div>
                    <div data-slot="tools">
                        {showSearch && (
                            <Input
                                size="sm"
                                prefix={<IconSearch size={14} />}
                                placeholder={searchPlaceholder}
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    setPage(1)
                                }}
                                clearable
                                onClear={() => setSearch('')}
                                aria-label={searchPlaceholder}
                                style={{ width: 200 }}
                            />
                        )}
                        {hideableCols.length > 1 && (
                            <Menu
                                align="end"
                                trigger={
                                    <Button size="sm" appearance="ghost" tone="neutral">
                                        열 설정
                                    </Button>
                                }
                            >
                                <MenuLabel>표시할 열</MenuLabel>
                                {hideableCols.map((c) => (
                                    <MenuCheckboxItem
                                        key={c.id}
                                        checked={!hidden.includes(c.id)}
                                        onCheckedChange={(on) => setHidden((h) => (on ? h.filter((x) => x !== c.id) : [...h, c.id]))}
                                    >
                                        {c.header}
                                    </MenuCheckboxItem>
                                ))}
                            </Menu>
                        )}
                        {(exportable || onExport) && (
                            <Menu
                                align="end"
                                items={[
                                    { label: 'CSV', onSelect: () => doExport('csv') },
                                    { label: '엑셀 (xlsx)', onSelect: () => doExport('xlsx'), disabled: !onExport },
                                ]}
                                trigger={
                                    <Button size="sm" appearance="outline" tone="neutral">
                                        내보내기
                                    </Button>
                                }
                            />
                        )}
                        {actions}
                    </div>
                </div>
            )}
            {bulkActions && selected.size > 0 && (
                <div data-slot="bulk" role="region" aria-label="일괄 작업">
                    <b>{selected.size}건 선택</b>
                    <span data-slot="divider" />
                    {bulkActions(selectedRows)}
                    <span style={{ flex: 1 }} />
                    <Button size="xs" appearance="ghost" onClick={() => setSelected([])}>
                        선택 해제
                    </Button>
                </div>
            )}
            <div
                data-slot="scroll"
                data-variant={variant}
                style={maxHeight ? { maxHeight } : undefined}
                onScroll={virtual ? (e) => setScrollTop(e.currentTarget.scrollTop) : undefined}
                aria-busy={loading || undefined}
            >
                <table
                    data-ds-table=""
                    data-density={density}
                    data-striped={striped ? '' : undefined}
                    data-bordered={bordered ? '' : undefined}
                    data-sticky={stickyHeader ? '' : undefined}
                    data-hoverable=""
                >
                    <thead>
                        {headerRows.map((hr, level) => (
                            <tr key={level}>
                                {level === 0 && selW > 0 && (
                                    <th rowSpan={headDepth} data-slot="sel" style={{ position: 'sticky', left: 0, zIndex: 3, width: selW }}>
                                        {selection === 'multiple' && (
                                            <input
                                                type="checkbox"
                                                data-ds-checkbox=""
                                                data-size="sm"
                                                aria-label="이 페이지 전체 선택"
                                                checked={allOn}
                                                data-indeterminate={someOn ? '' : undefined}
                                                ref={(el) => {
                                                    if (el) el.indeterminate = someOn
                                                }}
                                                onChange={() => setSelected(allOn ? [...selected].filter((k) => !pageKeys.includes(k)) : [...new Set([...selected, ...pageKeys])])}
                                            />
                                        )}
                                    </th>
                                )}
                                {level === 0 && expW > 0 && <th rowSpan={headDepth} data-slot="exp" style={{ position: 'sticky', left: selW, zIndex: 3, width: expW }} />}
                                {hr.map(({ c, span, rowSpan }) => {
                                    const isLeaf = !c.columns?.length
                                    const sorted = sort?.columnId === c.id ? sort.direction : null
                                    const label = typeof c.header === 'string' ? c.header : c.id
                                    return (
                                        <th
                                            key={c.id}
                                            colSpan={span}
                                            rowSpan={rowSpan}
                                            data-align={isLeaf ? c.align : 'center'}
                                            data-group-header={!isLeaf ? '' : undefined}
                                            data-sortable={isLeaf && c.sortable ? '' : undefined}
                                            aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined}
                                            style={isLeaf ? { ...cellStyle(c), ...(offsets.get(c.id) ? { zIndex: 3 } : null) } : undefined}
                                        >
                                            <span data-slot="th">
                                                {isLeaf && c.sortable ? (
                                                    <button type="button" data-slot="sort-btn" onClick={() => toggleSort(c)}>
                                                        {c.header}
                                                        <span data-slot="sort" data-on={sorted ? '' : undefined} aria-hidden>
                                                            {sorted === 'desc' ? <IconArrowDown size={12} /> : <IconArrowUp size={12} />}
                                                        </span>
                                                    </button>
                                                ) : (
                                                    c.header
                                                )}
                                                {isLeaf && c.filter && (
                                                    <FilterButton
                                                        label={label}
                                                        filter={c.filter}
                                                        value={filters[c.id] ?? ''}
                                                        onChange={(v) => {
                                                            setFilters((f) => ({ ...f, [c.id]: v }))
                                                            setPage(1)
                                                        }}
                                                    />
                                                )}
                                            </span>
                                            {isLeaf && c.resizable && (
                                                <span
                                                    role="separator"
                                                    aria-orientation="vertical"
                                                    aria-label={`${label} 열 너비`}
                                                    data-slot="resize"
                                                    onPointerDown={(e) => startResize(c, e)}
                                                    onDoubleClick={() => setWidths((w) => { const n = { ...w }; delete n[c.id]; return n })}
                                                />
                                            )}
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {loading && pageRows.length === 0 ? (
                            Array.from({ length: 5 }, (_, i) => (
                                <tr key={`sk${i}`}>
                                    <td colSpan={colCount}>
                                        <span data-ds-skeleton="" style={{ height: 14, width: `${60 + ((i * 13) % 35)}%` }} />
                                    </td>
                                </tr>
                            ))
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan={colCount} data-slot="empty">
                                    {empty ?? emptyState ?? <Empty title="조건에 맞는 데이터가 없습니다" description={search || Object.values(filters).some(Boolean) ? '검색어나 필터를 바꿔 보세요' : undefined} />}
                                </td>
                            </tr>
                        ) : (
                            <>
                                {virtual && vStart > 0 && (
                                    <tr aria-hidden>
                                        <td colSpan={colCount} style={{ height: vStart * ROW, padding: 0, border: 'none' }} />
                                    </tr>
                                )}
                                {items.slice(vStart, vEnd).map((it) => (it.kind === 'group' ? groupRow(it) : bodyRow(it.row, it.index)))}
                                {virtual && vEnd < items.length && (
                                    <tr aria-hidden>
                                        <td colSpan={colCount} style={{ height: (items.length - vEnd) * ROW, padding: 0, border: 'none' }} />
                                    </tr>
                                )}
                            </>
                        )}
                    </tbody>
                    {hasAgg && items.length > 0 && (
                        <tfoot>
                            <tr>
                                {selW > 0 && <td style={{ position: 'sticky', left: 0, zIndex: 2 }} />}
                                {expW > 0 && <td style={{ position: 'sticky', left: selW, zIndex: 2 }} />}
                                {orderedCols.map((c, i) => (
                                    <td key={c.id} data-align={c.align} style={cellStyle(c)}>
                                        {c.aggregate ? aggregate(c, processed) : i === 0 ? '합계' : null}
                                    </td>
                                ))}
                            </tr>
                        </tfoot>
                    )}
                </table>
                {loading && pageRows.length > 0 && <div data-slot="loading-bar" role="status" aria-label="불러오는 중" />}
            </div>
            {pag && (
                <div data-slot="footer">
                    <span>
                        {total === 0 ? 0 : (safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, total)} / 총 <b>{fmtNum(total)}</b>건
                    </span>
                    <div data-slot="pager">
                        {pag.pageSizeOptions.length > 1 && (
                            <Select
                                size="xs"
                                width={96}
                                aria-label="페이지당 행 수"
                                value={String(pageSize)}
                                options={pag.pageSizeOptions.map((n) => ({ value: String(n), label: `${n}개씩` }))}
                                onValueChange={(v: string | null) => {
                                    setPageSize(Number(v))
                                    setPage(1)
                                }}
                            />
                        )}
                        {pageCount > 1 && <Pagination page={safePage} pageCount={pageCount} onChange={setPage} />}
                    </div>
                </div>
            )}
        </div>
    )
}
