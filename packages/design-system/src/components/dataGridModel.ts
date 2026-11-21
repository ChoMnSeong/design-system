import type { ReactNode } from 'react'
import type { Tone } from './types.js'

/* ───────────────────────── 타입 ───────────────────────── */

export type GridRow = Record<string, any>
export type AggFunc = 'sum' | 'avg' | 'min' | 'max' | 'count' | ((values: any[]) => any)
export type CellRendererPreset = 'bar' | 'sparkline' | 'badge' | 'avatar' | 'delta'
export type ValueFormatterPreset = 'number' | 'percent' | 'date'

export type CellParams<T extends GridRow = GridRow> = { value: any; row: T; field: string; rowIndex: number }

export type GridColumn<T extends GridRow = GridRow> = {
    field: string
    headerName?: ReactNode
    /** 열 그룹 (다단 헤더) */
    children?: GridColumn<T>[]
    width?: number
    minWidth?: number
    /** 남는 폭을 나눠 가지는 비율 */
    flex?: number
    pinned?: 'left' | 'right' | false
    sortable?: boolean
    resizable?: boolean
    filter?: 'text' | 'number' | 'date' | 'set' | false | ((value: any, row: T, model: any) => boolean)
    /** 헤더 아래 필터 줄 */
    floatingFilter?: boolean
    /** set 필터 후보값 (서버 값이면 함수) */
    filterValues?: string[] | (() => Promise<string[]>)
    menu?: Array<'sort' | 'pin' | 'autosize' | 'hide' | 'group'>
    hide?: boolean
    align?: 'left' | 'right' | 'center'
    valueGetter?: (row: T) => any
    valueFormatter?: ValueFormatterPreset | ((value: any, row: T) => string)
    editable?: boolean | ((row: T) => boolean)
    cellEditor?: 'text' | 'number' | 'select' | 'date' | ((p: { value: any; row: T; onCommit: (v: any) => void; onCancel: () => void }) => ReactNode)
    cellEditorOptions?: Array<{ value: string; label: ReactNode }>
    /** 오류 문구를 돌려주면 저장하지 않는다 */
    validate?: (value: any, row: T) => string | null
    aggFunc?: AggFunc
    cellRenderer?: CellRendererPreset | ((p: CellParams<T>) => ReactNode)
    /** 프리셋 렌더러 옵션: bar { max, tone } · badge { toneMap } · delta { goodWhen } */
    cellRendererParams?: Record<string, any>
    /** { danger: (p) => p.value > 1.5 } — 톤 이름이면 셀 바탕, 그 밖은 className */
    cellClassRules?: Record<string, (p: CellParams<T>) => boolean>
}

export type SortItem = { key: string; dir: 'asc' | 'desc' }
export type FilterModelItem =
    | { type: 'text'; value: string }
    | { type: 'number'; op: '=' | '>' | '<' | '>=' | '<=' | 'between'; value: number; value2?: number }
    | { type: 'date'; from?: string; to?: string }
    | { type: 'set'; values: string[] }
export type FilterModel = Record<string, FilterModelItem>
export type AdvancedCondition = { field: string; op: 'contains' | '=' | '!=' | '>' | '<' | '>=' | '<='; value: string }
export type AdvancedFilter = { join: 'AND' | 'OR'; conditions: AdvancedCondition[] }

/* ───────────────────────── 열 ───────────────────────── */

export const leafColumns = <T extends GridRow>(cols: GridColumn<T>[]): GridColumn<T>[] => cols.flatMap((c) => (c.children?.length ? leafColumns(c.children) : [c]))
export const headerDepth = <T extends GridRow>(cols: GridColumn<T>[]): number => Math.max(1, ...cols.map((c) => (c.children?.length ? 1 + headerDepth(c.children) : 1)))

export const getValue = <T extends GridRow>(c: GridColumn<T>, row: T) => (c.valueGetter ? c.valueGetter(row) : row[c.field])

export const formatValue = <T extends GridRow>(c: GridColumn<T>, v: any, row: T): string => {
    if (v == null || v === '') return ''
    const f = c.valueFormatter
    if (typeof f === 'function') return f(v, row)
    if (f === 'number') return Number(v).toLocaleString('ko-KR', { maximumFractionDigits: 2 })
    if (f === 'percent') return `${(Number(v) * (Math.abs(Number(v)) <= 1 ? 100 : 1)).toFixed(1)}%`
    if (f === 'date') return String(v).slice(0, 10)
    return typeof v === 'number' ? v.toLocaleString('ko-KR', { maximumFractionDigits: 2 }) : String(v)
}

/* ───────────────────────── 필터 · 정렬 ───────────────────────── */

export const matchFilter = (v: any, m: FilterModelItem): boolean => {
    switch (m.type) {
        case 'text':
            return !m.value || String(v ?? '').toLowerCase().includes(m.value.toLowerCase())
        case 'number': {
            const n = Number(v)
            if (m.value === undefined || Number.isNaN(m.value)) return true
            switch (m.op) {
                case '=': return n === m.value
                case '>': return n > m.value
                case '<': return n < m.value
                case '>=': return n >= m.value
                case '<=': return n <= m.value
                case 'between': return n >= m.value && n <= (m.value2 ?? m.value)
            }
            return true
        }
        case 'date': {
            const s = String(v ?? '').slice(0, 10)
            return (!m.from || s >= m.from) && (!m.to || s <= m.to)
        }
        case 'set':
            return !m.values.length || m.values.includes(String(v))
    }
}

export const matchAdvanced = (row: GridRow, adv: AdvancedFilter, cols: GridColumn[]) => {
    if (!adv.conditions.length) return true
    const test = (c: AdvancedCondition) => {
        const col = cols.find((x) => x.field === c.field)
        const v = col ? getValue(col, row) : row[c.field]
        const n = Number(v)
        const t = Number(c.value)
        switch (c.op) {
            case 'contains': return String(v ?? '').toLowerCase().includes(c.value.toLowerCase())
            case '=': return String(v) === c.value
            case '!=': return String(v) !== c.value
            case '>': return n > t
            case '<': return n < t
            case '>=': return n >= t
            case '<=': return n <= t
        }
    }
    return adv.join === 'AND' ? adv.conditions.every(test) : adv.conditions.some(test)
}

export const compareValues = (a: any, b: any) => {
    if (typeof a === 'number' && typeof b === 'number') return a - b
    return String(a ?? '').localeCompare(String(b ?? ''), 'ko', { numeric: true })
}

export const aggregate = (fn: AggFunc, values: any[]) => {
    if (typeof fn === 'function') return fn(values)
    const nums = values.map(Number).filter((n) => !Number.isNaN(n))
    switch (fn) {
        case 'count': return values.length
        case 'sum': return nums.reduce((a, b) => a + b, 0)
        case 'avg': return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null
        case 'min': return nums.length ? Math.min(...nums) : null
        case 'max': return nums.length ? Math.max(...nums) : null
    }
}

/* ───────────────────────── 표시 행 ───────────────────────── */

export type DisplayRow<T extends GridRow = GridRow> =
    | { kind: 'data'; row: T; id: string; depth: number; hasChildren?: boolean; pathKey?: string }
    | { kind: 'group'; key: string; field: string; value: any; depth: number; count: number; agg: Record<string, any> }
    | { kind: 'detail'; row: T; id: string }

/** 다단 그룹 */
export const buildGroups = <T extends GridRow>(rows: T[], groupBy: string[], cols: GridColumn<T>[], collapsed: (key: string, depth: number) => boolean, idOf: (r: T) => string, depth = 0, prefix = ''): DisplayRow<T>[] => {
    if (!groupBy.length) return rows.map((row) => ({ kind: 'data', row, id: idOf(row), depth }))
    const [field, ...rest] = groupBy
    const col = cols.find((c) => c.field === field)
    const map = new Map<string, T[]>()
    for (const r of rows) {
        const k = String(col ? getValue(col, r) : r[field!])
        if (!map.has(k)) map.set(k, [])
        map.get(k)!.push(r)
    }
    const out: DisplayRow<T>[] = []
    for (const [value, list] of map) {
        const key = `${prefix}${field}=${value}`
        const agg: Record<string, any> = {}
        for (const c of cols) if (c.aggFunc) agg[c.field] = aggregate(c.aggFunc, list.map((r) => getValue(c, r)))
        out.push({ kind: 'group', key, field: field!, value, depth, count: list.length, agg })
        if (!collapsed(key, depth)) out.push(...buildGroups(list, rest, cols, collapsed, idOf, depth + 1, `${key}|`))
    }
    return out
}

/** 트리 데이터 (getDataPath) */
export const buildTree = <T extends GridRow>(rows: T[], getPath: (r: T) => string[], cols: GridColumn<T>[], expanded: (key: string) => boolean, idOf: (r: T) => string, aggregateChildren: boolean): DisplayRow<T>[] => {
    type Node = { key: string; name: string; row?: T; children: Map<string, Node> }
    const root: Node = { key: '', name: '', children: new Map() }
    for (const r of rows) {
        let n = root
        const path = getPath(r)
        path.forEach((p, i) => {
            const key = path.slice(0, i + 1).join('/')
            if (!n.children.has(p)) n.children.set(p, { key, name: p, children: new Map() })
            n = n.children.get(p)!
            if (i === path.length - 1) n.row = r
        })
    }
    const leaves = (n: Node): T[] => (n.children.size ? [...n.children.values()].flatMap(leaves) : n.row ? [n.row] : [])
    const out: DisplayRow<T>[] = []
    const walk = (n: Node, depth: number) => {
        for (const c of n.children.values()) {
            let row = c.row
            if (!row || (aggregateChildren && c.children.size)) {
                const base: GridRow = { ...(row ?? {}), __treeName: c.name }
                if (aggregateChildren && c.children.size) {
                    const ls = leaves(c)
                    for (const col of cols) if (col.aggFunc) base[col.field] = aggregate(col.aggFunc, ls.map((x) => getValue(col, x)))
                }
                row = base as T
            }
            out.push({ kind: 'data', row: { ...row, __treeName: c.name } as T, id: c.row ? idOf(c.row) : `tree:${c.key}`, depth, hasChildren: c.children.size > 0, pathKey: c.key })
            if (c.children.size && expanded(c.key)) walk(c, depth + 1)
        }
    }
    walk(root, 0)
    return out
}

/** 피벗: groupBy 행 × pivot.columns 값 → values 를 집계한 열 */
export const pivotRows = <T extends GridRow>(rows: T[], rowKeys: string[], pivot: { columns: string[]; values: string[] }, cols: GridColumn<T>[]) => {
    const pk = (r: T) => pivot.columns.map((k) => String(r[k])).join(' · ')
    const pvals = [...new Set(rows.map(pk))].sort()
    const map = new Map<string, T[]>()
    for (const r of rows) {
        const k = rowKeys.map((x) => String(r[x])).join('|')
        if (!map.has(k)) map.set(k, [])
        map.get(k)!.push(r)
    }
    const out: GridRow[] = []
    for (const [, list] of map) {
        const o: GridRow = Object.fromEntries(rowKeys.map((k) => [k, list[0]![k]]))
        for (const pv of pvals)
            for (const vk of pivot.values) {
                const col = leafColumns(cols).find((c) => c.field === vk)
                o[`${pv}::${vk}`] = aggregate(col?.aggFunc ?? 'sum', list.filter((r) => pk(r) === pv).map((r) => r[vk]))
            }
        out.push(o)
    }
    const pivotCols = [
        ...rowKeys.map((k) => leafColumns(cols).find((c) => c.field === k) ?? { field: k }),
        ...pvals.map((pv) => ({
            field: `pv:${pv}`,
            headerName: pv,
            children: pivot.values.map((vk) => ({ field: `${pv}::${vk}`, headerName: leafColumns(cols).find((c) => c.field === vk)?.headerName ?? vk, align: 'right' as const, valueFormatter: 'number' as const, aggFunc: 'sum' as const })),
        })),
    ]
    return { rows: out as T[], cols: pivotCols as unknown as GridColumn<T>[] }
}

/* ───────────────────────── 내보내기 ───────────────────────── */

const cellText = (c: GridColumn, r: GridRow) => formatValue(c, getValue(c, r), r)

export const toCsv = (cols: GridColumn[], rows: GridRow[]) => {
    const esc = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s)
    return '﻿' + [cols.map((c) => esc(typeof c.headerName === 'string' ? c.headerName : c.field)).join(','), ...rows.map((r) => cols.map((c) => esc(cellText(c, r))).join(','))].join('\n')
}

/** 엑셀이 여는 HTML 표 (.xls). 숫자는 숫자로, 머리행은 굵게 */
export const toExcelHtml = (cols: GridColumn[], rows: GridRow[], sheetName = 'Sheet1') => {
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    const head = cols.map((c) => `<th style="background:#f1eef3;font-weight:bold">${esc(typeof c.headerName === 'string' ? c.headerName : c.field)}</th>`).join('')
    const body = rows.map((r) => `<tr>${cols.map((c) => { const v = getValue(c, r); return typeof v === 'number' ? `<td x:num>${v}</td>` : `<td>${esc(cellText(c, r))}</td>` }).join('')}</tr>`).join('')
    return `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${esc(sheetName)}</x:Name></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></body></html>`
}

export const download = (name: string, content: string, type: string) => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([content], { type }))
    a.download = name
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

export const TONES: Tone[] = ['accent', 'neutral', 'success', 'warning', 'danger', 'info']
