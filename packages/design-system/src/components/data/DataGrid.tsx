import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { LuChevronRight, LuEllipsisVertical, LuX } from 'react-icons/lu'
import { Button } from '../actions/Button.js'
import { Menu } from '../overlay/Menu.js'
import { Popover } from '../overlay/Popover.js'
import { Spinner } from '../feedback/Spinner.js'
import {
    aggregate, buildGroups, buildTree, compareValues, download, formatValue, getValue, headerDepth, leafColumns, matchAdvanced, matchFilter, pivotRows, toCsv, toExcelHtml,
    type AdvancedFilter, type AggFunc, type DisplayRow, type FilterModel, type GridColumn, type GridRow, type SortItem,
} from './dataGridModel.js'
import { AdvancedFilterEditor, CellEditor, GridSideBar, SetFilterList, cellClasses, floatingText, parseFloating, renderCell } from './dataGridParts.js'

export * from './dataGridModel.js'

export type CellChange<T extends GridRow = GridRow> = { rowId: string; field: string; oldValue: any; newValue: any; row: T }
export type SavedView = { name: string; filterModel?: FilterModel; sortModel?: SortItem[]; groupBy?: string[]; hidden?: string[] }
export type StatusBarItem = 'count' | 'selected' | 'sum' | 'avg' | 'min' | 'max' | 'changes'

export type DataGridProps<T extends GridRow = GridRow> = {
    rows: T[]
    columns: GridColumn<T>[]
    getRowId?: (row: T) => string
    /* 헤더 · 열 */
    sortModel?: SortItem[]
    defaultSortModel?: SortItem[]
    onSortModelChange?: (m: SortItem[]) => void
    quickFilter?: string
    /** 빠른 검색 입력칸을 위 막대에 둔다 */
    showQuickFilter?: boolean
    /* 필터 */
    filterModel?: FilterModel
    defaultFilterModel?: FilterModel
    onFilterModelChange?: (m: FilterModel) => void
    advancedFilter?: AdvancedFilter | boolean
    onAdvancedFilterChange?: (f: AdvancedFilter) => void
    savedViews?: SavedView[]
    /* 편집 · 선택 · 상태 막대 */
    onCellValueChanged?: (c: CellChange<T>) => void
    /** true 면 바뀐 값을 모아 두었다가 onSaveChanges 로 한꺼번에 넘긴다 */
    pendingChanges?: boolean
    onSaveChanges?: (changes: CellChange<T>[]) => void
    /** 범위 선택 + 채우기 핸들 */
    cellSelection?: boolean
    /** Ctrl+C / Ctrl+V (탭 구분) */
    clipboard?: boolean
    /** 되돌리기 깊이. true = 20 */
    undoRedo?: boolean | number
    statusBar?: StatusBarItem[] | boolean
    /* 행 그룹 · 피벗 · 도구 패널 */
    groupBy?: string[]
    defaultGroupBy?: string[]
    onGroupByChange?: (g: string[]) => void
    groupPanel?: boolean
    groupDefaultExpanded?: number
    sideBar?: boolean | Array<'columns' | 'filters'>
    pivot?: { columns: string[]; values: string[] }
    /** 'total' 이면 aggFunc 로 합계 행을 만든다 */
    pinnedBottomRow?: 'total' | T
    /* 트리 · 마스터-디테일 */
    getDataPath?: (row: T) => string[]
    /** 트리에서 자식 값을 부모에 집계 */
    treeAggregate?: boolean
    treeColumnName?: ReactNode
    renderDetail?: (row: T) => ReactNode
    /* 상태 · 대용량 */
    loading?: boolean
    error?: ReactNode
    onRetry?: () => void
    emptyText?: ReactNode
    height?: number | string
    rowHeight?: number
    density?: 'compact' | 'default' | 'comfortable'
    /** 이 행 수를 넘으면 화면에 보이는 행만 그린다 (기본 100, false 끔) */
    virtualize?: boolean | number
    pageSize?: number
    /** 끝 근처로 스크롤하면 호출 (무한 스크롤) */
    onLoadMore?: () => void
    hasMore?: boolean
    exportFileName?: string
    toolbar?: ReactNode
    'aria-label'?: string
    className?: string
    style?: CSSProperties
}

const RH = { compact: 30, default: 36, comfortable: 44 }
const labelOf = (c: GridColumn<any>) => (typeof c.headerName === 'string' ? c.headerName : c.field)
const useControlled = <V,>(value: V | undefined, def: V, cb?: (v: V) => void) => {
    const [inner, setInner] = useState(def)
    const v = value ?? inner
    const set = useCallback((n: V) => { setInner(n); cb?.(n) }, [cb])
    return [v, set] as const
}

export const DataGrid = <T extends GridRow>(props: DataGridProps<T>) => {
    const {
        rows: rowsProp, columns: colsProp, getRowId, quickFilter: qfProp, showQuickFilter, savedViews, onCellValueChanged, pendingChanges, onSaveChanges,
        cellSelection, clipboard, undoRedo, statusBar, groupPanel, groupDefaultExpanded = 1, sideBar, pivot, pinnedBottomRow, getDataPath, treeAggregate = true,
        treeColumnName = '이름', renderDetail, loading, error, onRetry, emptyText = '표시할 데이터가 없습니다', height, rowHeight, density = 'default', virtualize = 100,
        pageSize, onLoadMore, hasMore, exportFileName, toolbar, className, style,
    } = props
    const autoIds = useRef(new WeakMap<object, string>())
    const idOf = useCallback((r: T) => {
        if (getRowId) return getRowId(r)
        if (r.id != null) return String(r.id)
        let k = autoIds.current.get(r)
        if (!k) autoIds.current.set(r, (k = `r${Math.random().toString(36).slice(2, 9)}`))
        return k
    }, [getRowId])
    const [sortModel, setSort] = useControlled(props.sortModel, props.defaultSortModel ?? [], props.onSortModelChange)
    const [filterModel, setFilter] = useControlled(props.filterModel, props.defaultFilterModel ?? {}, props.onFilterModelChange)
    const [groupBy, setGroupBy] = useControlled(props.groupBy, props.defaultGroupBy ?? [], props.onGroupByChange)
    const [adv, setAdv] = useControlled<AdvancedFilter>(typeof props.advancedFilter === 'object' ? props.advancedFilter : undefined, { join: 'AND', conditions: [] }, props.onAdvancedFilterChange)
    const [advOpen, setAdvOpen] = useState(false)
    const [qfInner, setQf] = useState('')
    const qf = qfProp ?? qfInner
    const [hidden, setHidden] = useState<Set<string>>(() => new Set(leafColumns(colsProp).filter((c) => c.hide).map((c) => c.field)))
    const [pins, setPins] = useState<Record<string, 'left' | 'right' | false>>({})
    const [widths, setWidths] = useState<Record<string, number>>({})
    const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
    const [expanded, setExpanded] = useState<Set<string>>(new Set())
    const [view, setView] = useState<string>('')
    const [page, setPage] = useState(0)
    const [dragOver, setDragOver] = useState(false)

    /* 편집 상태 */
    const [edits, setEdits] = useState<Map<string, Record<string, any>>>(new Map())
    const [changes, setChanges] = useState<CellChange<T>[]>([])
    const [errors, setErrors] = useState<Map<string, string>>(new Map())
    const undoStack = useRef<CellChange<T>[][]>([])
    const redoStack = useRef<CellChange<T>[][]>([])
    const undoDepth = undoRedo === true ? 20 : typeof undoRedo === 'number' ? undoRedo : 0

    const rowsWithEdits = useMemo(() => (edits.size ? rowsProp.map((r) => { const id = idOf(r); const e = edits.get(id); if (!e) return r; const m = { ...r, ...e } as T; autoIds.current.set(m, id); return m }) : rowsProp), [rowsProp, edits, idOf])

    /* 피벗이면 열/행을 바꿔 그린다 */
    const pv = useMemo(() => (pivot ? pivotRows(rowsWithEdits, groupBy.length ? groupBy : [leafColumns(colsProp)[0]!.field], pivot, colsProp) : null), [pivot, rowsWithEdits, groupBy, colsProp])
    const columns: GridColumn<T>[] = useMemo(() => {
        const base = pv ? pv.cols : colsProp
        const apply = (cs: GridColumn<T>[]): GridColumn<T>[] =>
            cs.flatMap((c): GridColumn<T>[] => {
                if (c.children?.length) { const ch = apply(c.children); return ch.length ? [{ ...c, children: ch }] : [] }
                if (hidden.has(c.field)) return []
                return [{ ...c, pinned: c.field in pins ? pins[c.field] : c.pinned, width: widths[c.field] ?? c.width }]
            })
        const out = apply(base)
        return getDataPath ? [{ field: '__treeName', headerName: treeColumnName, width: 220, pinned: 'left' } as GridColumn<T>, ...out] : out
    }, [pv, colsProp, hidden, pins, widths, getDataPath, treeColumnName])
    const allLeaves = useMemo(() => leafColumns(colsProp), [colsProp])
    const leaves = useMemo(() => {
        const ls = leafColumns(columns)
        return [...ls.filter((c) => c.pinned === 'left'), ...ls.filter((c) => !c.pinned), ...ls.filter((c) => c.pinned === 'right')]
    }, [columns])

    /* 필터 · 정렬 */
    const filtered = useMemo(() => {
        let rs = pv ? (pv.rows as T[]) : rowsWithEdits
        const q = qf.trim().toLowerCase()
        if (q) rs = rs.filter((r) => allLeaves.some((c) => formatValue(c, getValue(c, r), r).toLowerCase().includes(q)))
        for (const [field, m] of Object.entries(filterModel)) {
            const c = allLeaves.find((x) => x.field === field)
            if (!c) continue
            rs = typeof c.filter === 'function' ? rs.filter((r) => (c.filter as any)(getValue(c, r), r, m)) : rs.filter((r) => matchFilter(getValue(c, r), m))
        }
        if (adv.conditions.length) rs = rs.filter((r) => matchAdvanced(r, adv, allLeaves as GridColumn[]))
        if (sortModel.length)
            rs = [...rs].sort((a, b) => {
                for (const s of sortModel) {
                    const c = leaves.find((x) => x.field === s.key) ?? ({ field: s.key } as GridColumn<T>)
                    const d = compareValues(getValue(c, a), getValue(c, b))
                    if (d) return s.dir === 'asc' ? d : -d
                }
                return 0
            })
        return rs
    }, [pv, rowsWithEdits, qf, filterModel, adv, sortModel, allLeaves, leaves])

    const display: DisplayRow<T>[] = useMemo(() => {
        if (getDataPath) return buildTree(filtered, getDataPath, allLeaves, (k) => expanded.has(k) !== (k.split('/').length <= groupDefaultExpanded), idOf, treeAggregate)
        if (groupBy.length && !pivot) return buildGroups(filtered, groupBy, allLeaves, (k, d) => collapsed.has(k) !== d >= groupDefaultExpanded, idOf)
        const out: DisplayRow<T>[] = []
        const list = pageSize ? filtered.slice(page * pageSize, (page + 1) * pageSize) : filtered
        for (const row of list) {
            const id = idOf(row)
            out.push({ kind: 'data', row, id, depth: 0, hasChildren: !!renderDetail })
            if (renderDetail && expanded.has(id)) out.push({ kind: 'detail', row, id })
        }
        return out
    }, [getDataPath, filtered, allLeaves, expanded, collapsed, groupDefaultExpanded, idOf, treeAggregate, groupBy, pivot, pageSize, page, renderDetail])

    const dataRows = display.filter((d) => d.kind === 'data') as Extract<DisplayRow<T>, { kind: 'data' }>[]

    /* 셀 선택 */
    const [anchor, setAnchor] = useState<[number, number] | null>(null)
    const [focus, setFocus] = useState<[number, number] | null>(null)
    const [editing, setEditing] = useState<[number, number] | null>(null)
    const [fillTo, setFillTo] = useState<number | null>(null)
    const dragging = useRef<'select' | 'fill' | null>(null)
    const range = anchor && focus ? { r0: Math.min(anchor[0], focus[0]), r1: Math.max(anchor[0], focus[0], fillTo ?? -1), c0: Math.min(anchor[1], focus[1]), c1: Math.max(anchor[1], focus[1]) } : null
    const inRange = (r: number, c: number) => !!range && r >= range.r0 && r <= range.r1 && c >= range.c0 && c <= range.c1

    const editableAt = (c: GridColumn<T>, row: T) => (typeof c.editable === 'function' ? c.editable(row) : !!c.editable)

    const applyChanges = (list: CellChange<T>[], record = true) => {
        if (!list.length) return
        setEdits((prev) => {
            const n = new Map(prev)
            for (const ch of list) n.set(ch.rowId, { ...(n.get(ch.rowId) ?? {}), [ch.field]: ch.newValue })
            return n
        })
        if (pendingChanges) setChanges((prev) => [...prev, ...list])
        list.forEach((ch) => onCellValueChanged?.(ch))
        if (record && undoDepth) {
            undoStack.current = [...undoStack.current.slice(-(undoDepth - 1)), list]
            redoStack.current = []
        }
    }
    const setCell = (ri: number, c: GridColumn<T>, value: any, record = true) => {
        const d = dataRows[ri]
        if (!d || !editableAt(c, d.row)) return null
        const err = c.validate?.(value, d.row) ?? null
        const ek = `${d.id}:${c.field}`
        setErrors((prev) => { const n = new Map(prev); err ? n.set(ek, err) : n.delete(ek); return n })
        if (err) return null
        const oldValue = getValue(c, d.row)
        if (oldValue === value) return null
        const ch: CellChange<T> = { rowId: d.id, field: c.field, oldValue, newValue: value, row: d.row }
        if (record) applyChanges([ch])
        return ch
    }
    const undo = () => {
        const last = undoStack.current.pop()
        if (!last) return
        redoStack.current.push(last)
        applyChanges(last.map((c) => ({ ...c, oldValue: c.newValue, newValue: c.oldValue })), false)
    }
    const redo = () => {
        const next = redoStack.current.pop()
        if (!next) return
        undoStack.current.push(next)
        applyChanges(next, false)
    }

    const copy = () => {
        if (!range) return
        const lines: string[] = []
        for (let r = range.r0; r <= range.r1; r++) {
            const d = dataRows[r]
            if (d) lines.push(leaves.slice(range.c0, range.c1 + 1).map((c) => String(getValue(c, d.row) ?? '')).join('\t'))
        }
        navigator.clipboard?.writeText(lines.join('\n'))
    }
    const paste = async () => {
        if (!focus || !navigator.clipboard) return
        const text = await navigator.clipboard.readText()
        const out: CellChange<T>[] = []
        text.replace(/\r/g, '').split('\n').filter(Boolean).forEach((line, i) =>
            line.split('\t').forEach((cell, j) => {
                const c = leaves[focus[1] + j]
                if (!c) return
                const cur = dataRows[focus[0] + i] && getValue(c, dataRows[focus[0] + i]!.row)
                const ch = setCell(focus[0] + i, c, typeof cur === 'number' ? Number(cell) : cell, false)
                if (ch) out.push(ch)
            }),
        )
        applyChanges(out)
    }
    const finishFill = () => {
        if (!anchor || !focus || fillTo == null || !range) return
        const out: CellChange<T>[] = []
        const srcRows = Math.abs(focus[0] - anchor[0]) + 1
        const top = Math.min(anchor[0], focus[0])
        for (let r = top + srcRows; r <= fillTo; r++)
            for (let ci = range.c0; ci <= range.c1; ci++) {
                const c = leaves[ci]!
                const src = dataRows[top + ((r - top) % srcRows)]
                if (src) { const ch = setCell(r, c, getValue(c, src.row), false); if (ch) out.push(ch) }
            }
        applyChanges(out)
        setFocus([fillTo, focus[1]])
        setFillTo(null)
    }
    useEffect(() => {
        const up = () => { if (dragging.current === 'fill') finishFill(); dragging.current = null }
        window.addEventListener('mouseup', up)
        return () => window.removeEventListener('mouseup', up)
    })

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (editing) return
        const mod = e.metaKey || e.ctrlKey
        if (mod && undoDepth && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); return }
        if (mod && undoDepth && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); return }
        if (clipboard && mod && e.key.toLowerCase() === 'c') { copy(); return }
        if (clipboard && mod && e.key.toLowerCase() === 'v') { paste(); return }
        if (!focus) return
        const mv: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }
        if (mv[e.key]) {
            e.preventDefault()
            const n: [number, number] = [Math.max(0, Math.min(dataRows.length - 1, focus[0] + mv[e.key]![0])), Math.max(0, Math.min(leaves.length - 1, focus[1] + mv[e.key]![1]))]
            setFocus(n)
            if (!e.shiftKey || !cellSelection) setAnchor(n)
        } else if (e.key === 'Enter' || e.key === 'F2') {
            e.preventDefault()
            const d = dataRows[focus[0]]
            if (d && editableAt(leaves[focus[1]]!, d.row)) setEditing(focus)
        } else if ((e.key === 'Delete' || e.key === 'Backspace') && range) {
            const out: CellChange<T>[] = []
            for (let r = range.r0; r <= range.r1; r++) for (let c = range.c0; c <= range.c1; c++) { const ch = setCell(r, leaves[c]!, null, false); if (ch) out.push(ch) }
            applyChanges(out)
        }
    }

    /* 헤더 */
    const onSortClick = (c: GridColumn<T>, e: React.MouseEvent) => {
        if (c.sortable === false || c.children) return
        const cur = sortModel.find((s) => s.key === c.field)
        const next: SortItem | null = !cur ? { key: c.field, dir: 'asc' } : cur.dir === 'asc' ? { key: c.field, dir: 'desc' } : null
        const rest = e.shiftKey ? sortModel.filter((s) => s.key !== c.field) : []
        setSort(next ? (e.shiftKey && cur ? sortModel.map((s) => (s.key === c.field ? next : s)) : [...rest, next]) : rest)
    }
    const startResize = (c: GridColumn<T>, e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation()
        const th = (e.target as HTMLElement).parentElement!
        const x0 = e.clientX, w0 = th.getBoundingClientRect().width, min = c.minWidth ?? 60
        const move = (ev: MouseEvent) => setWidths((w) => ({ ...w, [c.field]: Math.max(min, Math.round(w0 + ev.clientX - x0)) }))
        const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
        window.addEventListener('mousemove', move); window.addEventListener('mouseup', up)
    }
    const widthOf = (c: GridColumn<T>) => c.width ?? (c.flex ? Math.max(c.minWidth ?? 120, 120 * c.flex) : 140)
    const offsets = useMemo(() => {
        const o: Record<string, { side: 'left' | 'right'; px: number; edge?: boolean }> = {}
        let x = 0
        const L = leaves.filter((c) => c.pinned === 'left')
        L.forEach((c, i) => { o[c.field] = { side: 'left', px: x, edge: i === L.length - 1 }; x += widthOf(c) })
        x = 0
        const R = leaves.filter((c) => c.pinned === 'right').reverse()
        R.forEach((c, i) => { o[c.field] = { side: 'right', px: x, edge: i === R.length - 1 }; x += widthOf(c) })
        return o
    }, [leaves])
    const pinStyle = (field: string, top?: number): CSSProperties => {
        const p = offsets[field]
        return { ...(p ? { [p.side]: p.px } : {}), ...(top != null ? { top } : {}) }
    }
    const pinAttrs = (field: string) => { const p = offsets[field]; return p ? { 'data-pin': p.side, 'data-pin-edge': p.edge ? p.side : undefined } : {} }

    const rh = rowHeight ?? RH[density]
    const depth = headerDepth(columns)
    const hasFloating = leaves.some((c) => c.floatingFilter)
    const headerRows: Array<Array<{ col: GridColumn<T>; colSpan: number; rowSpan: number }>> = Array.from({ length: depth }, () => [])
    const walkHeader = (cs: GridColumn<T>[], level: number) => {
        const order = (x: GridColumn<T>) => { const ls = leafColumns([x]); return ls.every((l) => l.pinned === 'left') ? 0 : ls.every((l) => l.pinned === 'right') ? 2 : 1 }
        for (const c of [...cs].sort((a, b) => order(a) - order(b))) {
            const span = leafColumns([c]).length
            headerRows[level]!.push({ col: c, colSpan: span, rowSpan: c.children?.length ? 1 : depth - level })
            if (c.children?.length) walkHeader(c.children, level + 1)
        }
    }
    walkHeader(columns, 0)

    const colMenu = (c: GridColumn<T>) => {
        const allowed = c.menu ?? ['sort', 'pin', 'autosize', 'hide', 'group']
        const items: any[] = []
        if (allowed.includes('sort')) items.push({ label: '오름차순', onSelect: () => setSort([{ key: c.field, dir: 'asc' }]) }, { label: '내림차순', onSelect: () => setSort([{ key: c.field, dir: 'desc' }]) }, { label: '정렬 해제', onSelect: () => setSort(sortModel.filter((s) => s.key !== c.field)) }, { type: 'separator' })
        if (allowed.includes('pin')) items.push({ label: '왼쪽 고정', onSelect: () => setPins((p) => ({ ...p, [c.field]: 'left' })) }, { label: '오른쪽 고정', onSelect: () => setPins((p) => ({ ...p, [c.field]: 'right' })) }, { label: '고정 해제', onSelect: () => setPins((p) => ({ ...p, [c.field]: false })) }, { type: 'separator' })
        if (allowed.includes('autosize')) items.push({ label: '너비 맞춤', onSelect: () => setWidths((w) => ({ ...w, [c.field]: Math.max(c.minWidth ?? 60, Math.min(400, 24 + 8 * Math.max(labelOf(c).length * 1.6, ...filtered.slice(0, 200).map((r) => formatValue(c, getValue(c, r), r).length)))) })) })
        if (allowed.includes('group') && !getDataPath) items.push({ label: groupBy.includes(c.field) ? '그룹 해제' : '이 열로 그룹', onSelect: () => setGroupBy(groupBy.includes(c.field) ? groupBy.filter((g) => g !== c.field) : [...groupBy, c.field]) })
        if (allowed.includes('hide')) items.push({ label: '열 숨기기', onSelect: () => setHidden((h) => new Set([...h, c.field])) })
        return items
    }

    const headerCell = (h: { col: GridColumn<T>; colSpan: number; rowSpan: number }, level: number) => {
        const c = h.col
        const isLeaf = !c.children?.length
        const s = sortModel.findIndex((x) => x.key === c.field)
        const sortable = isLeaf && c.sortable !== false && c.field !== '__treeName'
        const f = filterModel[c.field]
        return (
            <th
                key={c.field}
                colSpan={h.colSpan}
                rowSpan={h.rowSpan}
                data-group={isLeaf ? undefined : ''}
                data-sortable={sortable ? '' : undefined}
                data-align={c.align}
                aria-sort={s >= 0 ? (sortModel[s]!.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                {...(isLeaf ? pinAttrs(c.field) : {})}
                style={{ ...(isLeaf ? pinStyle(c.field, level * rh) : { top: level * rh }) }}
                onClick={(e) => sortable && onSortClick(c, e)}
                draggable={groupPanel && isLeaf}
                onDragStart={(e) => e.dataTransfer.setData('text/ds-grid-col', c.field)}
            >
                <span data-slot="th">
                    <span>{c.headerName ?? c.field}</span>
                    {s >= 0 && (
                        <span data-slot="sort">{sortModel[s]!.dir === 'asc' ? '▲' : '▼'}{sortModel.length > 1 && <sub>{s + 1}</sub>}</span>
                    )}
                    {f && <span data-slot="filtered" title="필터 적용됨" />}
                    {isLeaf && c.filter === 'set' && c.filterValues && (
                        <span onClick={(e) => e.stopPropagation()}>
                            <Popover trigger={<button type="button" data-slot="col-menu" aria-label={`${labelOf(c)} 값 필터`}>▾</button>} side="bottom" align="start">
                                <SetFilterList values={c.filterValues} selected={f?.type === 'set' ? f.values : undefined} onChange={(v) => { const n = { ...filterModel }; v ? (n[c.field] = { type: 'set', values: v }) : delete n[c.field]; setFilter(n) }} />
                            </Popover>
                        </span>
                    )}
                    {isLeaf && c.field !== '__treeName' && c.menu?.length !== 0 && (
                        <span onClick={(e) => e.stopPropagation()} style={{ marginLeft: c.align === 'right' ? 0 : 'auto' }}>
                            <Menu trigger={<button type="button" data-slot="col-menu" aria-label={`${labelOf(c)} 열 메뉴`}><LuEllipsisVertical size={13} /></button>} items={colMenu(c)} minWidth={160} />
                        </span>
                    )}
                </span>
                {isLeaf && c.resizable !== false && <span data-slot="resize" onMouseDown={(e) => startResize(c, e)} onClick={(e) => e.stopPropagation()} />}
            </th>
        )
    }

    /* 가상화 */
    const scrollRef = useRef<HTMLDivElement>(null)
    const [scrollTop, setScrollTop] = useState(0)
    const [viewH, setViewH] = useState(600)
    useEffect(() => { if (scrollRef.current) setViewH(scrollRef.current.clientHeight || 600) }, [height])
    const vThreshold = virtualize === false ? Infinity : virtualize === true ? 0 : virtualize
    const virtual = display.length > vThreshold && !renderDetail
    const start = virtual ? Math.max(0, Math.floor(scrollTop / rh) - 8) : 0
    const end = virtual ? Math.min(display.length, start + Math.ceil(viewH / rh) + 16) : display.length
    const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget
        setScrollTop(el.scrollTop)
        if (onLoadMore && hasMore && !loading && el.scrollTop + el.clientHeight > el.scrollHeight - rh * 4) onLoadMore()
    }

    const bottomRow: T | null = pinnedBottomRow === 'total'
        ? (Object.fromEntries(allLeaves.filter((c) => c.aggFunc).map((c) => [c.field, aggregate(c.aggFunc as AggFunc, filtered.map((r) => getValue(c, r)))])) as T)
        : pinnedBottomRow ?? null

    const dataIndex = useMemo(() => { const m = new Map<string, number>(); dataRows.forEach((d, i) => m.set(d.id, i)); return m }, [dataRows])

    const renderRow = (d: DisplayRow<T>, i: number) => {
        if (d.kind === 'group') {
            const open = !(collapsed.has(d.key) !== d.depth >= groupDefaultExpanded)
            const gc = allLeaves.find((c) => c.field === d.field)
            return (
                <tr key={d.key} data-kind="group">
                    {leaves.map((c, ci) =>
                        ci === 0 ? (
                            <td key={c.field} {...pinAttrs(c.field)} style={{ ...pinStyle(c.field), paddingLeft: 10 + d.depth * 18 }} colSpan={1}>
                                <button type="button" data-slot="toggle" aria-expanded={open} aria-label={`${d.value} 펼치기`} onClick={() => setCollapsed((s) => { const n = new Set(s); n.has(d.key) ? n.delete(d.key) : n.add(d.key); return n })}><LuChevronRight size={13} /></button>
                                {gc ? labelOf(gc) : d.field}: {d.value}<span data-slot="count">({d.count})</span>
                            </td>
                        ) : (
                            <td key={c.field} data-align={c.align} {...pinAttrs(c.field)} style={pinStyle(c.field)}>{c.field in d.agg ? formatValue(c, d.agg[c.field], {} as T) : ''}</td>
                        ),
                    )}
                </tr>
            )
        }
        if (d.kind === 'detail')
            return (
                <tr key={`${d.id}:detail`} data-kind="detail"><td colSpan={leaves.length}>{renderDetail?.(d.row)}</td></tr>
            )
        const ri = dataIndex.get(d.id) ?? i
        return (
            <tr key={d.id} aria-rowindex={ri + 2}>
                {leaves.map((c, ci) => {
                    const value = getValue(c, d.row)
                    const p = { value, row: d.row, field: c.field, rowIndex: ri }
                    const { tone, className } = cellClasses(c, p)
                    const ek = `${d.id}:${c.field}`
                    const isEditing = editing?.[0] === ri && editing[1] === ci
                    const isFocus = focus?.[0] === ri && focus[1] === ci
                    const editable = editableAt(c, d.row)
                    const first = ci === 0 && (getDataPath || renderDetail)
                    return (
                        <td
                            key={c.field}
                            className={className}
                            data-align={c.align}
                            data-tone={tone}
                            data-selected={cellSelection && inRange(ri, ci) && range && (range.r0 !== range.r1 || range.c0 !== range.c1) ? '' : undefined}
                            data-focus={isFocus && !isEditing ? '' : undefined}
                            data-editable={editable ? '' : undefined}
                            data-editing={isEditing ? '' : undefined}
                            data-dirty={edits.get(d.id)?.[c.field] !== undefined ? '' : undefined}
                            data-invalid={errors.has(ek) ? '' : undefined}
                            title={errors.get(ek)}
                            {...pinAttrs(c.field)}
                            style={{ ...pinStyle(c.field), ...(first ? { paddingLeft: 10 + d.depth * 18 } : {}) }}
                            onMouseDown={(e) => {
                                if (isEditing || (e.target as HTMLElement).closest('button')) return
                                if (e.shiftKey && cellSelection && anchor) setFocus([ri, ci])
                                else { setAnchor([ri, ci]); setFocus([ri, ci]); if (cellSelection) dragging.current = 'select' }
                            }}
                            onMouseEnter={() => {
                                if (dragging.current === 'select') setFocus([ri, ci])
                                if (dragging.current === 'fill' && focus) setFillTo(Math.max(ri, focus[0]))
                            }}
                            onDoubleClick={() => editable && setEditing([ri, ci])}
                        >
                            {first && (d.hasChildren ? (
                                <button type="button" data-slot="toggle" aria-expanded={getDataPath ? expanded.has(d.pathKey!) !== (d.pathKey!.split('/').length <= groupDefaultExpanded) : expanded.has(d.id)} aria-label="펼치기" onClick={() => setExpanded((s) => { const k = getDataPath ? d.pathKey! : d.id; const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n })}><LuChevronRight size={13} /></button>
                            ) : getDataPath ? <span style={{ display: 'inline-block', width: 22 }} /> : null)}
                            {isEditing ? (
                                <CellEditor col={c} value={value} row={d.row} onCommit={(v) => { setCell(ri, c, v); setEditing(null) }} onCancel={() => setEditing(null)} />
                            ) : (
                                renderCell(c, p)
                            )}
                            {cellSelection && range && !isEditing && ri === range.r1 && ci === range.c1 && editable && (
                                <span data-slot="fill" onMouseDown={(e) => { e.stopPropagation(); dragging.current = 'fill' }} aria-hidden />
                            )}
                        </td>
                    )
                })}
            </tr>
        )
    }

    /* 상태 막대 */
    const statusItems: StatusBarItem[] = statusBar === true ? ['count', 'sum', 'avg', 'changes'] : statusBar || []
    const rangeNums: number[] = []
    if (range) for (let r = range.r0; r <= range.r1; r++) for (let c = range.c0; c <= range.c1; c++) { const d = dataRows[r]; const v = d && getValue(leaves[c]!, d.row); if (typeof v === 'number') rangeNums.push(v) }
    const fmt = (n: number | null) => (n == null ? '–' : n.toLocaleString(undefined, { maximumFractionDigits: 2 }))

    const views = savedViews && (
        <select aria-label="저장된 보기" value={view} onChange={(e) => {
            const v = savedViews.find((x) => x.name === e.target.value)
            setView(e.target.value)
            setFilter(v?.filterModel ?? {}); setSort(v?.sortModel ?? []); setGroupBy(v?.groupBy ?? [])
            if (v?.hidden) setHidden(new Set(v.hidden))
        }} style={{ height: 32, borderRadius: 6, border: '1px solid var(--ds-color-border-subtle)', padding: '0 8px', font: 'inherit', background: 'var(--ds-surface-card-background)', color: 'inherit' }}>
            <option value="">기본 보기</option>
            {savedViews.map((v) => <option key={v.name}>{v.name}</option>)}
        </select>
    )
    const activeFilters = Object.keys(filterModel).length + adv.conditions.length
    const panels = sideBar === true ? (['columns', 'filters'] as const) : sideBar || []
    const totalPages = pageSize ? Math.max(1, Math.ceil(filtered.length / pageSize)) : 1

    return (
        <div data-ds-grid="" className={className} style={{ ...style, '--_rh': `${rh}px` } as CSSProperties} aria-label={props['aria-label']}>
            {(showQuickFilter || savedViews || props.advancedFilter || toolbar || exportFileName || pendingChanges) && (
                <div data-slot="top">
                    {showQuickFilter && <input aria-label="빠른 검색" placeholder="전체 열 검색…" value={qf} onChange={(e) => setQf(e.target.value)} style={{ height: 32, width: 220, borderRadius: 6, border: '1px solid var(--ds-color-border-subtle)', padding: '0 10px', font: 'inherit', background: 'var(--ds-surface-card-background)', color: 'inherit' }} />}
                    {views}
                    {props.advancedFilter && <Button size="sm" appearance={advOpen ? 'soft' : 'outline'} tone="neutral" onClick={() => setAdvOpen((o) => !o)}>고급 필터{adv.conditions.length ? ` · ${adv.conditions.length}` : ''}</Button>}
                    {activeFilters > 0 && <Button size="sm" appearance="ghost" tone="neutral" onClick={() => { setFilter({}); setAdv({ ...adv, conditions: [] }) }}>필터 초기화</Button>}
                    {toolbar}
                    <span data-slot="spacer" />
                    {pendingChanges && changes.length > 0 && (
                        <>
                            <Button size="sm" appearance="ghost" tone="neutral" onClick={() => { setEdits(new Map()); setChanges([]); setErrors(new Map()) }}>취소</Button>
                            <Button size="sm" onClick={() => { onSaveChanges?.(changes); setChanges([]) }}>변경 {changes.length}건 저장</Button>
                        </>
                    )}
                    {exportFileName && (
                        <Menu trigger={<Button size="sm" appearance="outline" tone="neutral">내보내기</Button>} align="end" items={[
                            { label: 'CSV', onSelect: () => download(`${exportFileName}.csv`, toCsv(leaves as GridColumn[], filtered), 'text/csv;charset=utf-8') },
                            { label: 'Excel', onSelect: () => download(`${exportFileName}.xls`, toExcelHtml(leaves as GridColumn[], filtered), 'application/vnd.ms-excel') },
                        ]} />
                    )}
                </div>
            )}
            {advOpen && <AdvancedFilterEditor value={adv} columns={allLeaves as GridColumn[]} onChange={setAdv} />}
            {groupPanel && (
                <div data-slot="group-panel" data-over={dragOver ? '' : undefined} onDragOver={(e) => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={(e) => { setDragOver(false); const f = e.dataTransfer.getData('text/ds-grid-col'); if (f && !groupBy.includes(f)) setGroupBy([...groupBy, f]) }}>
                    {groupBy.length ? groupBy.map((g, i) => (
                        <Fragment key={g}>
                            {i > 0 && <LuChevronRight size={12} />}
                            <span data-slot="chip">{labelOf(allLeaves.find((c) => c.field === g) ?? { field: g })}<button type="button" aria-label={`${g} 그룹 해제`} onClick={() => setGroupBy(groupBy.filter((x) => x !== g))}><LuX size={11} /></button></span>
                        </Fragment>
                    )) : '열 머리글을 여기로 끌어 행 그룹을 만드세요'}
                </div>
            )}
            <div data-slot="body" style={{ height }}>
                <div data-slot="scroll" ref={scrollRef} tabIndex={0} onKeyDown={onKeyDown} onScroll={onScroll} role="grid" aria-rowcount={dataRows.length + 1} aria-busy={loading || undefined}>
                    <table>
                        <colgroup>{leaves.map((c) => <col key={c.field} style={{ width: widthOf(c) }} />)}</colgroup>
                        <thead>
                            {headerRows.map((r, level) => <tr key={level}>{r.map((h) => headerCell(h, level))}</tr>)}
                            {hasFloating && (
                                <tr data-floating="">
                                    {leaves.map((c) => (
                                        <th key={c.field} {...pinAttrs(c.field)} style={pinStyle(c.field, depth * rh)}>
                                            {c.floatingFilter && (
                                                <input
                                                    aria-label={`${labelOf(c)} 필터`}
                                                    placeholder={c.filter === 'number' ? '>100' : c.filter === 'date' ? '날짜..' : '필터'}
                                                    defaultValue={floatingText(filterModel[c.field])}
                                                    key={floatingText(filterModel[c.field])}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
                                                    onBlur={(e) => { const m = parseFloating(c as GridColumn, e.target.value); const n = { ...filterModel }; m ? (n[c.field] = m) : delete n[c.field]; setFilter(n) }}
                                                />
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {error ? (
                                <tr><td colSpan={leaves.length}><div data-slot="state" data-tone="danger" role="alert">{error}{onRetry && <div style={{ marginTop: 10 }}><Button size="sm" appearance="outline" tone="neutral" onClick={onRetry}>다시 시도</Button></div>}</div></td></tr>
                            ) : !display.length && !loading ? (
                                <tr><td colSpan={leaves.length}><div data-slot="state">{emptyText}</div></td></tr>
                            ) : (
                                <>
                                    {virtual && start > 0 && <tr style={{ height: start * rh }} aria-hidden />}
                                    {display.slice(start, end).map((d, i) => renderRow(d, start + i))}
                                    {virtual && end < display.length && <tr style={{ height: (display.length - end) * rh }} aria-hidden />}
                                    {loading && display.length > 0 && hasMore !== undefined && <tr><td colSpan={leaves.length} style={{ textAlign: 'center' }}><Spinner size="sm" /></td></tr>}
                                </>
                            )}
                        </tbody>
                        {bottomRow && !error && (
                            <tfoot>
                                <tr>
                                    {leaves.map((c, ci) => (
                                        <td key={c.field} data-align={c.align} {...pinAttrs(c.field)} style={pinStyle(c.field)}>
                                            {ci === 0 && !(c.field in bottomRow) ? '합계' : c.field in bottomRow ? formatValue(c, (bottomRow as any)[c.field], bottomRow) : ''}
                                        </td>
                                    ))}
                                </tr>
                            </tfoot>
                        )}
                    </table>
                    {loading && (hasMore === undefined || !display.length) && <div data-slot="overlay"><Spinner /></div>}
                </div>
                {panels.length > 0 && (
                    <GridSideBar
                        panels={[...panels]}
                        columns={allLeaves as GridColumn[]}
                        hidden={hidden}
                        onToggleColumn={(f) => setHidden((h) => { const n = new Set(h); n.has(f) ? n.delete(f) : n.add(f); return n })}
                        groupBy={groupBy}
                        onGroupBy={setGroupBy}
                        filterSlot={
                            <>
                                {allLeaves.filter((c) => c.filter).map((c) => (
                                    <div key={c.field} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <h5>{labelOf(c)}</h5>
                                        {c.filter === 'set' && c.filterValues ? (
                                            <SetFilterList values={c.filterValues} selected={filterModel[c.field]?.type === 'set' ? (filterModel[c.field] as any).values : undefined} onChange={(v) => { const n = { ...filterModel }; v ? (n[c.field] = { type: 'set', values: v }) : delete n[c.field]; setFilter(n) }} />
                                        ) : (
                                            <input aria-label={`${labelOf(c)} 조건`} defaultValue={floatingText(filterModel[c.field])} key={floatingText(filterModel[c.field])} onBlur={(e) => { const m = parseFloating(c as GridColumn, e.target.value); const n = { ...filterModel }; m ? (n[c.field] = m) : delete n[c.field]; setFilter(n) }} style={{ height: 26, border: '1px solid var(--ds-color-border-subtle)', borderRadius: 4, padding: '0 6px', font: 'inherit', fontSize: 12, background: 'transparent', color: 'inherit' }} />
                                        )}
                                    </div>
                                ))}
                            </>
                        }
                    />
                )}
            </div>
            {(statusItems.length > 0 || pageSize) && (
                <div data-slot="status" role="status">
                    {statusItems.includes('count') && <span>행<b>{filtered.length.toLocaleString()}</b>{filtered.length !== rowsProp.length && <> / {rowsProp.length.toLocaleString()}</>}</span>}
                    {statusItems.includes('selected') && range && <span>선택<b>{(range.r1 - range.r0 + 1) * (range.c1 - range.c0 + 1)}</b></span>}
                    {rangeNums.length > 1 && statusItems.includes('sum') && <span>합계<b>{fmt(aggregate('sum', rangeNums))}</b></span>}
                    {rangeNums.length > 1 && statusItems.includes('avg') && <span>평균<b>{fmt(aggregate('avg', rangeNums))}</b></span>}
                    {rangeNums.length > 1 && statusItems.includes('min') && <span>최소<b>{fmt(aggregate('min', rangeNums))}</b></span>}
                    {rangeNums.length > 1 && statusItems.includes('max') && <span>최대<b>{fmt(aggregate('max', rangeNums))}</b></span>}
                    {statusItems.includes('changes') && (pendingChanges ? changes.length : edits.size) > 0 && <span>변경<b>{pendingChanges ? changes.length : [...edits.values()].reduce((a, e) => a + Object.keys(e).length, 0)}</b></span>}
                    <span data-slot="spacer" />
                    {pageSize && (
                        <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                            <Button size="xs" appearance="ghost" tone="neutral" disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="이전 페이지">‹</Button>
                            {page + 1} / {totalPages}
                            <Button size="xs" appearance="ghost" tone="neutral" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} aria-label="다음 페이지">›</Button>
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}
