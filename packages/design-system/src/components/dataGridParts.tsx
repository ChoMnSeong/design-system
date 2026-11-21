import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Avatar } from './Avatar.js'
import { Badge } from './Badge.js'
import { Button } from './Button.js'
import { Sparkline } from './Sparkline.js'
import type { Tone } from './types.js'
import { TONES, formatValue, type AdvancedFilter, type CellParams, type FilterModelItem, type GridColumn, type GridRow } from './dataGridModel.js'

/* ───────────────────────── 셀 렌더러 프리셋 (10-06) ───────────────────────── */

export const renderCell = <T extends GridRow>(c: GridColumn<T>, p: CellParams<T>): ReactNode => {
    const r = c.cellRenderer
    if (typeof r === 'function') return r(p)
    const prm = c.cellRendererParams ?? {}
    const text = formatValue(c, p.value, p.row)
    switch (r) {
        case 'bar': {
            const max = prm.max ?? 100
            const pct = Math.max(0, Math.min(100, (Number(p.value) / max) * 100))
            const tone: Tone | undefined = typeof prm.tone === 'function' ? prm.tone(p.value) : prm.tone
            return (
                <span data-slot="bar" style={tone ? ({ '--_tone': `var(--ds-tone-${tone}-text)` } as any) : undefined}>
                    <i><i style={{ width: `${pct}%` }} /></i>
                    <span>{text}</span>
                </span>
            )
        }
        case 'sparkline':
            return Array.isArray(p.value) ? <Sparkline data={p.value} height={prm.height ?? 20} tone={prm.tone ?? 'accent'} aria-label={`${c.field} 추이`} /> : null
        case 'badge': {
            const tone = prm.toneMap?.[String(p.value)] ?? 'neutral'
            return <Badge tone={tone} size="sm">{text}</Badge>
        }
        case 'avatar':
            return (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Avatar size="xs" name={String(p.value ?? '')} src={prm.srcField ? p.row[prm.srcField] : undefined} />
                    {text}
                </span>
            )
        case 'delta': {
            const n = Number(p.value)
            const good = prm.goodWhen === 'down' ? n < 0 : n > 0
            const sign = n > 0 ? '▲' : n < 0 ? '▼' : '–'
            return (
                <span data-slot="delta" data-good={n !== 0 && good ? '' : undefined} data-bad={n !== 0 && !good ? '' : undefined}>
                    {sign} {formatValue({ ...c, valueFormatter: c.valueFormatter }, Math.abs(n), p.row)}
                </span>
            )
        }
        default:
            return text
    }
}

/** cellClassRules → 톤 이름이면 data-tone, 나머지는 className */
export const cellClasses = <T extends GridRow>(c: GridColumn<T>, p: CellParams<T>) => {
    let tone: string | undefined
    const cls: string[] = []
    for (const [k, fn] of Object.entries(c.cellClassRules ?? {}))
        if (fn(p)) (TONES as string[]).includes(k) ? (tone = k) : cls.push(k)
    return { tone, className: cls.join(' ') || undefined }
}

/* ───────────────────────── 편집기 (10-03) ───────────────────────── */

export const CellEditor = <T extends GridRow>({ col, value, row, onCommit, onCancel }: { col: GridColumn<T>; value: any; row: T; onCommit: (v: any) => void; onCancel: () => void }) => {
    const [v, setV] = useState(value ?? '')
    const ref = useRef<any>(null)
    useEffect(() => { ref.current?.focus(); ref.current?.select?.() }, [])
    const ed = col.cellEditor ?? (typeof value === 'number' ? 'number' : 'text')
    if (typeof ed === 'function') return <>{ed({ value, row, onCommit, onCancel })}</>
    const commit = () => onCommit(ed === 'number' ? (v === '' ? null : Number(v)) : v)
    const keys = (e: React.KeyboardEvent) => {
        e.stopPropagation()
        if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); commit() }
        if (e.key === 'Escape') onCancel()
    }
    if (ed === 'select')
        return (
            <select ref={ref} value={v} onChange={(e) => onCommit(e.target.value)} onBlur={onCancel} onKeyDown={keys} aria-label={`${col.field} 편집`}>
                {col.cellEditorOptions?.map((o) => <option key={o.value} value={o.value}>{typeof o.label === 'string' ? o.label : o.value}</option>)}
            </select>
        )
    return <input ref={ref} type={ed === 'number' ? 'number' : ed === 'date' ? 'date' : 'text'} value={v} onChange={(e) => setV(e.target.value)} onBlur={commit} onKeyDown={keys} aria-label={`${col.field} 편집`} />
}

/* ───────────────────────── 필터 (10-02) ───────────────────────── */

/** 플로팅 필터 문자열 → 모델. 숫자: ">100" "10..20" "=5", 날짜: "2026-01-01..2026-02-01" */
export const parseFloating = (col: GridColumn, text: string): FilterModelItem | null => {
    const t = text.trim()
    if (!t) return null
    if (col.filter === 'number') {
        const range = t.match(/^(-?[\d.]+)\s*\.\.\s*(-?[\d.]+)$/)
        if (range) return { type: 'number', op: 'between', value: Number(range[1]), value2: Number(range[2]) }
        const m = t.match(/^(>=|<=|>|<|=)?\s*(-?[\d.]+)$/)
        if (m) return { type: 'number', op: (m[1] as any) ?? '=', value: Number(m[2]) }
        return null
    }
    if (col.filter === 'date') {
        const [from, to] = t.split('..').map((s) => s.trim())
        return { type: 'date', from: from || undefined, to: to ?? from }
    }
    if (col.filter === 'set') return { type: 'set', values: t.split(',').map((s) => s.trim()).filter(Boolean) }
    return { type: 'text', value: t }
}

export const floatingText = (m?: FilterModelItem) => {
    if (!m) return ''
    if (m.type === 'text') return m.value
    if (m.type === 'number') return m.op === 'between' ? `${m.value}..${m.value2}` : `${m.op === '=' ? '' : m.op}${m.value}`
    if (m.type === 'date') return m.from === m.to ? (m.from ?? '') : `${m.from ?? ''}..${m.to ?? ''}`
    return m.values.join(', ')
}

/** set 필터 체크 목록 (값이 함수면 비동기로 받아온다) */
export const SetFilterList = ({ values, selected, onChange }: { values: string[] | (() => Promise<string[]>); selected: string[] | undefined; onChange: (v: string[] | null) => void }) => {
    const [list, setList] = useState<string[] | null>(Array.isArray(values) ? values : null)
    const [q, setQ] = useState('')
    useEffect(() => { if (typeof values === 'function') values().then(setList) }, [values])
    if (!list) return <div style={{ padding: 8, fontSize: 12 }}>불러오는 중…</div>
    const sel = new Set(selected ?? list)
    const shown = list.filter((v) => v.toLowerCase().includes(q.toLowerCase()))
    const toggle = (v: string) => {
        const n = new Set(sel)
        n.has(v) ? n.delete(v) : n.add(v)
        onChange(n.size === list.length ? null : [...n])
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 180, fontSize: 12 }}>
            <input placeholder="값 검색" value={q} onChange={(e) => setQ(e.target.value)} style={{ height: 26, padding: '0 6px', border: '1px solid var(--ds-color-border-subtle)', borderRadius: 4, font: 'inherit', background: 'transparent', color: 'inherit' }} />
            <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="checkbox" checked={sel.size === list.length} onChange={() => onChange(sel.size === list.length ? [] : null)} /> (전체 선택)
            </label>
            <div style={{ maxHeight: 200, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {shown.map((v) => (
                    <label key={v} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <input type="checkbox" checked={sel.has(v)} onChange={() => toggle(v)} /> {v}
                    </label>
                ))}
            </div>
        </div>
    )
}

const OPS = ['contains', '=', '!=', '>', '<', '>=', '<='] as const

/** 고급 필터 편집기 (AND/OR 조건 묶음) */
export const AdvancedFilterEditor = ({ value, columns, onChange }: { value: AdvancedFilter; columns: GridColumn[]; onChange: (v: AdvancedFilter) => void }) => {
    const set = (i: number, patch: Partial<AdvancedFilter['conditions'][number]>) => onChange({ ...value, conditions: value.conditions.map((c, j) => (j === i ? { ...c, ...patch } : c)) })
    return (
        <div data-slot="adv" role="group" aria-label="고급 필터">
            {value.conditions.map((c, i) => (
                <div key={i}>
                    {i === 0 ? (
                        <span style={{ width: 52, fontSize: 12, color: 'var(--ds-color-foreground-tertiary)' }}>조건</span>
                    ) : (
                        <select aria-label="결합" value={value.join} onChange={(e) => onChange({ ...value, join: e.target.value as any })} style={{ width: 52 }}>
                            <option>AND</option>
                            <option>OR</option>
                        </select>
                    )}
                    <select aria-label="열" value={c.field} onChange={(e) => set(i, { field: e.target.value })}>
                        {columns.map((col) => <option key={col.field} value={col.field}>{typeof col.headerName === 'string' ? col.headerName : col.field}</option>)}
                    </select>
                    <select aria-label="연산" value={c.op} onChange={(e) => set(i, { op: e.target.value as any })}>
                        {OPS.map((o) => <option key={o} value={o}>{o === 'contains' ? '포함' : o}</option>)}
                    </select>
                    <input aria-label="값" value={c.value} onChange={(e) => set(i, { value: e.target.value })} />
                    <Button appearance="ghost" size="xs" onClick={() => onChange({ ...value, conditions: value.conditions.filter((_, j) => j !== i) })} aria-label="조건 삭제">✕</Button>
                </div>
            ))}
            <div>
                <Button appearance="ghost" size="xs" onClick={() => onChange({ ...value, conditions: [...value.conditions, { field: columns[0]?.field ?? '', op: 'contains', value: '' }] })}>+ 조건 추가</Button>
            </div>
        </div>
    )
}

/* ───────────────────────── 사이드바 (10-04) ───────────────────────── */

export const GridSideBar = ({ panels, columns, hidden, onToggleColumn, groupBy, onGroupBy, filterSlot }: {
    panels: Array<'columns' | 'filters'>
    columns: GridColumn[]
    hidden: Set<string>
    onToggleColumn: (field: string) => void
    groupBy: string[]
    onGroupBy: (g: string[]) => void
    filterSlot: ReactNode
}) => {
    const [tab, setTab] = useState(panels[0])
    const label = (c: GridColumn) => (typeof c.headerName === 'string' ? c.headerName : c.field)
    return (
        <aside data-slot="side" aria-label="도구 패널">
            <div data-slot="side-tabs" role="tablist">
                {panels.map((p) => (
                    <button key={p} type="button" role="tab" aria-selected={tab === p} onClick={() => setTab(p)}>{p === 'columns' ? '열' : '필터'}</button>
                ))}
            </div>
            <div data-slot="side-body">
                {tab === 'columns' ? (
                    <>
                        <h5>표시 열</h5>
                        {columns.map((c) => (
                            <label key={c.field}>
                                <input type="checkbox" checked={!hidden.has(c.field)} onChange={() => onToggleColumn(c.field)} /> {label(c)}
                            </label>
                        ))}
                        <h5>행 그룹</h5>
                        {columns.map((c) => (
                            <label key={c.field}>
                                <input type="checkbox" checked={groupBy.includes(c.field)} onChange={() => onGroupBy(groupBy.includes(c.field) ? groupBy.filter((g) => g !== c.field) : [...groupBy, c.field])} /> {label(c)}
                            </label>
                        ))}
                    </>
                ) : (
                    filterSlot
                )}
            </div>
        </aside>
    )
}
