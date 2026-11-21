import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { LuMinus, LuPlus, LuSearch, LuX } from 'react-icons/lu'

/* 보드 12-05 · 수량 선택 · 옵션 선택 · 검색창 */

/* ───────── QuantityInput ───────── */

export type QuantityInputProps = {
    value?: number
    defaultValue?: number
    onChange?: (n: number) => void
    min?: number
    /** 재고 */
    max?: number
    step?: number
    /** sm 32 (장바구니) · md 40 (상품 상세) */
    size?: 'sm' | 'md'
    disabled?: boolean
    'aria-label'?: string
    style?: CSSProperties
}

export const QuantityInput = ({ value, defaultValue = 1, onChange, min = 1, max, step = 1, size = 'md', disabled, style, ...rest }: QuantityInputProps) => {
    const [inner, setInner] = useState(defaultValue)
    const v = value ?? inner
    const [draft, setDraft] = useState<string | null>(null)
    const clamp = (n: number) => Math.max(min, max != null ? Math.min(max, n) : n)
    const set = (n: number) => { const c = clamp(n); setInner(c); onChange?.(c) }
    return (
        <span data-ds-qty="" data-size={size} style={style} role="group" aria-label={rest['aria-label'] ?? '수량'}>
            <button type="button" aria-label="수량 줄이기" disabled={disabled || v <= min} onClick={() => set(v - step)}><LuMinus size={size === 'sm' ? 14 : 16} /></button>
            <input
                type="number"
                inputMode="numeric"
                aria-label="수량"
                value={draft ?? v}
                min={min}
                max={max}
                disabled={disabled}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={() => { if (draft != null) set(Number(draft) || min); setDraft(null) }}
                onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
            />
            <button type="button" aria-label="수량 늘리기" disabled={disabled || (max != null && v >= max)} onClick={() => set(v + step)}><LuPlus size={size === 'sm' ? 14 : 16} /></button>
        </span>
    )
}

/* ───────── OptionPicker ───────── */

export type PickerOption = { value: string; label: string; color?: string; stock?: number }

export type OptionPickerProps = {
    /** swatch: 색상 점 · chip: 사이즈 칩 · select: 드롭다운 */
    type?: 'swatch' | 'chip' | 'select'
    label?: ReactNode
    options: PickerOption[]
    value?: string
    defaultValue?: string
    onChange?: (v: string) => void
    /** 이 수 이하면 '적음' 표시 */
    lowStock?: number
    /** 품절도 고를 수 있게 (재입고 알림용) */
    allowSoldOut?: boolean
    style?: CSSProperties
}

export const OptionPicker = ({ type = 'chip', label, options, value, defaultValue, onChange, lowStock = 3, allowSoldOut, style }: OptionPickerProps) => {
    const [inner, setInner] = useState(defaultValue)
    const v = value ?? inner
    const set = (x: string) => { setInner(x); onChange?.(x) }
    const sel = options.find((o) => o.value === v)
    const soldOut = (o: PickerOption) => o.stock === 0
    const low = (o: PickerOption) => o.stock != null && o.stock > 0 && o.stock <= lowStock
    const lowSel = sel && low(sel)
    if (type === 'select')
        return (
            <label data-ds-option="" data-type="select" style={{ ...style, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                {label}
                <select value={v ?? ''} onChange={(e) => set(e.target.value)} style={{ height: 40, borderRadius: 8, border: '1px solid var(--ds-color-border-subtle)', padding: '0 10px', font: 'inherit', background: 'var(--ds-surface-card-background)', color: 'inherit' }}>
                    <option value="" disabled>선택하세요</option>
                    {options.map((o) => (
                        <option key={o.value} value={o.value} disabled={soldOut(o) && !allowSoldOut}>
                            {o.label}{soldOut(o) ? ' (품절)' : low(o) ? ` (${o.stock}개 남음)` : ''}
                        </option>
                    ))}
                </select>
            </label>
        )
    const move = (dir: number) => {
        const usable = options.filter((o) => allowSoldOut || !soldOut(o))
        const i = usable.findIndex((o) => o.value === v)
        const n = usable[(i + dir + usable.length) % usable.length]
        if (n) set(n.value)
    }
    return (
        <fieldset data-ds-option="" data-type={type} style={style}>
            {label && <legend>{label}{sel && <b>{sel.label}</b>}</legend>}
            <div data-slot="list" role="radiogroup" onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); move(1) } if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); move(-1) } }}>
                {options.map((o, i) => {
                    const dis = soldOut(o) && !allowSoldOut
                    const checked = o.value === v
                    return (
                        <button
                            key={o.value}
                            type="button"
                            role="radio"
                            data-slot="opt"
                            aria-checked={checked}
                            aria-disabled={soldOut(o) || undefined}
                            aria-label={`${o.label}${soldOut(o) ? ', 품절' : low(o) ? `, ${o.stock}개 남음` : ''}`}
                            title={type === 'swatch' ? o.label : undefined}
                            tabIndex={checked || (!v && i === 0) ? 0 : -1}
                            onClick={() => !dis && set(o.value)}
                        >
                            {type === 'swatch' ? <i style={{ background: o.color }} /> : o.label}
                            {low(o) && <span data-slot="low" aria-hidden />}
                        </button>
                    )
                })}
            </div>
            {lowSel && <div data-slot="hint">{sel!.label} {sel!.stock}개 남음</div>}
        </fieldset>
    )
}

/* ───────── SearchBox ───────── */

export type SearchBoxProps = {
    value?: string
    defaultValue?: string
    onChange?: (q: string) => void
    onSearch?: (q: string) => void
    placeholder?: string
    /** 비었을 때 최근 검색어 */
    recent?: string[]
    onRecentRemove?: (q: string | null) => void
    /** 비었을 때 인기 검색어 */
    trending?: string[]
    /** 입력하면 연관 검색어 */
    suggest?: (q: string) => Promise<string[]> | string[]
    /** 입력어 강조 */
    highlight?: boolean
    debounce?: number
    style?: CSSProperties
}

const hl = (text: string, q: string) => {
    if (!q) return text
    const i = text.toLowerCase().indexOf(q.toLowerCase())
    if (i < 0) return text
    return <>{text.slice(0, i)}<mark>{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>
}

export const SearchBox = ({ value, defaultValue = '', onChange, onSearch, placeholder = '검색어를 입력하세요', recent, onRecentRemove, trending, suggest, highlight = true, debounce = 150, style }: SearchBoxProps) => {
    const [inner, setInner] = useState(defaultValue)
    const q = value ?? inner
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState<string[]>([])
    const [active, setActive] = useState(-1)
    const root = useRef<HTMLDivElement>(null)
    const id = useId()
    useEffect(() => {
        if (!suggest || !q.trim()) { setItems([]); return }
        let alive = true
        const t = setTimeout(async () => { const r = await suggest(q); if (alive) { setItems(r); setActive(-1) } }, debounce)
        return () => { alive = false; clearTimeout(t) }
    }, [q, suggest, debounce])
    useEffect(() => {
        const on = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false) }
        document.addEventListener('mousedown', on)
        return () => document.removeEventListener('mousedown', on)
    }, [])
    const set = (s: string) => { setInner(s); onChange?.(s) }
    const submit = (s: string) => { set(s); setOpen(false); onSearch?.(s) }
    const empty = !q.trim()
    const list = empty ? trending ?? [] : items
    const showPanel = open && (empty ? (recent?.length || trending?.length) : items.length > 0)
    return (
        <div data-ds-search="" ref={root} style={style}>
            <form data-slot="box" role="search" onSubmit={(e) => { e.preventDefault(); submit(active >= 0 && list[active] ? list[active]! : q) }}>
                <LuSearch size={18} aria-hidden style={{ flex: 'none', opacity: .6 }} />
                <input
                    type="search"
                    value={q}
                    placeholder={placeholder}
                    role="combobox"
                    aria-expanded={!!showPanel}
                    aria-controls={`${id}-list`}
                    aria-activedescendant={active >= 0 ? `${id}-${active}` : undefined}
                    aria-autocomplete="list"
                    onFocus={() => setOpen(true)}
                    onChange={(e) => { set(e.target.value); setOpen(true) }}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(list.length - 1, a + 1)) }
                        if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(-1, a - 1)) }
                        if (e.key === 'Escape') setOpen(false)
                    }}
                />
                {q && <button type="button" aria-label="지우기" onClick={() => set('')}><LuX size={16} /></button>}
            </form>
            {showPanel ? (
                <div data-slot="panel">
                    {empty && recent && recent.length > 0 && (
                        <>
                            <h6>최근 검색어{onRecentRemove && <button type="button" onClick={() => onRecentRemove(null)}>전체 삭제</button>}</h6>
                            <div data-slot="chips">
                                {recent.map((r) => (
                                    <span key={r}>
                                        <button type="button" onClick={() => submit(r)}>{r}</button>
                                        {onRecentRemove && <button type="button" aria-label={`${r} 삭제`} onClick={() => onRecentRemove(r)}><LuX size={12} /></button>}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                    {empty && trending && trending.length > 0 && <h6>인기 검색어</h6>}
                    <div role="listbox" id={`${id}-list`}>
                        {list.map((s, i) => (
                            <div key={s} id={`${id}-${i}`} role="option" aria-selected={i === active} onMouseDown={(e) => e.preventDefault()} onClick={() => submit(s)} onMouseEnter={() => setActive(i)}>
                                {empty ? <span data-slot="rank">{i + 1}</span> : <LuSearch size={14} aria-hidden style={{ opacity: .5 }} />}
                                <span>{highlight && !empty ? hl(s, q) : s}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    )
}
