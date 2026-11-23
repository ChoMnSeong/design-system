import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type KeyboardEvent,
    type ReactNode,
} from 'react'
import { IconChevronRight, IconSearch } from '../icons.js'
import type { Density } from '../types.js'

export type TreeNode = {
    /** 노드 고유 id */
    id: string
    /** 표시 이름 */
    label: ReactNode
    /** 이름 앞 아이콘 */
    icon?: ReactNode
    /** 오른쪽 끝 배지 (개수 · 수량 등) */
    badge?: ReactNode
    /** 행에 마우스를 올리거나 선택했을 때 보이는 동작 (··· 메뉴 등) */
    actions?: ReactNode
    /** 선택 · 체크 · 드래그 불가 */
    disabled?: boolean
    /** 자식 노드 */
    children?: TreeNode[]
    /** loadChildren 을 쓸 때: 아직 안 불러왔지만 자식이 있는 노드 */
    hasChildren?: boolean
}

export type TreeProps = {
    /** 최상위 노드 목록 */
    data: TreeNode[]
    /** 비제어 초기 펼침 id 목록 */
    defaultExpanded?: string[]
    /** 제어 모드 펼침 id 목록 */
    expanded?: string[]
    /** 펼침이 바뀔 때 (새 id 목록) */
    onExpandedChange?: (ids: string[]) => void
    /** none: 선택 안 함 · single: 하나 · multiple: Ctrl/⌘ 클릭으로 추가 */
    selectable?: 'none' | 'single' | 'multiple'
    /** 제어 모드 선택 id 목록 */
    selected?: string[]
    /** 비제어 초기 선택 id 목록 */
    defaultSelected?: string[]
    /** 선택이 바뀔 때 (새 id 목록) */
    onSelectedChange?: (ids: string[]) => void
    /** @deprecated selected 를 쓴다 */
    selectedId?: string
    /** @deprecated onSelectedChange 를 쓴다 */
    onSelect?: (id: string) => void
    /** 체크박스. 부모를 체크하면 자식 전체, 자식 일부면 부모는 부분 체크 */
    checkable?: boolean
    /** 제어 모드 체크 id 목록 */
    checked?: string[]
    /** 비제어 초기 체크 id 목록 */
    defaultChecked?: string[]
    /** 체크가 바뀔 때 (체크된 잎 + 자식 전부 체크된 부모 id) */
    onCheckedChange?: (ids: string[]) => void
    /** 펼칠 때 자식을 불러온다 */
    loadChildren?: (node: TreeNode) => Promise<TreeNode[]>
    /** 위에 검색창. 일치하는 노드와 조상만 남기고 펼친다 */
    searchable?: boolean
    /** 검색창 안내 문구 */
    searchPlaceholder?: string
    /** 검색 일치 판정 (노드, 검색어). 없으면 라벨 포함 여부 */
    filter?: (node: TreeNode, query: string) => boolean
    /** 끌어서 옮기기 */
    draggable?: boolean
    /** 노드를 놓을 때 (끌린 id, 대상 id, 대상 앞·안·뒤) */
    onMove?: (dragId: string, targetId: string, position: 'before' | 'inside' | 'after') => void
    /** 보이는 행만 그린다 (행 높이 고정) */
    virtualized?: boolean
    /** virtualized 목록의 최대 높이 (px) */
    height?: number
    /** 행 높이 compact 26 · default 30 · comfortable 36 (px) */
    density?: Density
    /** 바깥 요소 style */
    style?: CSSProperties
    /** 트리 접근성 이름 */
    'aria-label'?: string
}

type Row = { node: TreeNode; depth: number; parent: string | null; hasKids: boolean }

const textOf = (n: TreeNode) => (typeof n.label === 'string' || typeof n.label === 'number' ? String(n.label) : n.id)

const leafIds = (n: TreeNode): string[] =>
    n.children && n.children.length ? n.children.flatMap(leafIds) : [n.id]

/** 펼침 · 선택 · 체크 · 끌어 옮기기를 지원하는 트리 */
export const Tree = ({
    data,
    defaultExpanded = [],
    expanded: expandedProp,
    onExpandedChange,
    selectable = 'single',
    selected: selectedProp,
    defaultSelected = [],
    onSelectedChange,
    selectedId,
    onSelect,
    checkable,
    checked: checkedProp,
    defaultChecked = [],
    onCheckedChange,
    loadChildren,
    searchable,
    searchPlaceholder = '검색',
    filter = (n, q) => textOf(n).toLowerCase().includes(q.toLowerCase()),
    draggable,
    onMove,
    virtualized,
    height = 320,
    density = 'default',
    style,
    'aria-label': ariaLabel = '트리',
}: TreeProps) => {
    const [expInner, setExpInner] = useState(defaultExpanded)
    const expanded = new Set(expandedProp ?? expInner)
    const setExpanded = (s: Set<string>) => {
        const arr = [...s]
        if (expandedProp === undefined) setExpInner(arr)
        onExpandedChange?.(arr)
    }
    const [selInner, setSelInner] = useState(defaultSelected)
    const selected = new Set(selectedProp ?? (selectedId !== undefined ? [selectedId] : selInner))
    const [chkInner, setChkInner] = useState(defaultChecked)
    const checked = new Set(checkedProp ?? chkInner)
    const [loaded, setLoaded] = useState<Record<string, TreeNode[]>>({})
    const [loading, setLoading] = useState<Set<string>>(new Set())
    const [query, setQuery] = useState('')
    const [focusId, setFocusId] = useState<string | null>(null)
    const [drop, setDrop] = useState<{ id: string; pos: 'before' | 'inside' | 'after' } | null>(null)
    const dragId = useRef<string | null>(null)
    const listRef = useRef<HTMLDivElement | null>(null)
    const [scrollTop, setScrollTop] = useState(0)

    const kidsOf = (n: TreeNode) => n.children ?? loaded[n.id]

    // 검색: 일치 노드와 그 조상
    const visibleIds = useMemo(() => {
        if (!query) return null
        const keep = new Set<string>()
        const walk = (n: TreeNode, chain: string[]): boolean => {
            const kids = kidsOf(n) ?? []
            let hit = filter(n, query)
            for (const k of kids) if (walk(k, [...chain, n.id])) hit = true
            if (hit) {
                keep.add(n.id)
                chain.forEach((c) => keep.add(c))
            }
            return hit
        }
        data.forEach((n) => walk(n, []))
        return keep
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, data, loaded])

    const rows: Row[] = []
    const build = (nodes: TreeNode[], depth: number, parent: string | null) => {
        for (const n of nodes) {
            if (visibleIds && !visibleIds.has(n.id)) continue
            const kids = kidsOf(n)
            const hasKids = !!(kids?.length || n.hasChildren)
            rows.push({ node: n, depth, parent, hasKids })
            if (hasKids && kids && (expanded.has(n.id) || !!visibleIds)) build(kids, depth + 1, n.id)
        }
    }
    build(data, 0, null)

    // 체크 상태: 잎 기준으로 부모를 계산
    const allNodes = useMemo(() => {
        const m = new Map<string, TreeNode>()
        const walk = (n: TreeNode) => {
            m.set(n.id, n)
            ;(n.children ?? loaded[n.id] ?? []).forEach(walk)
        }
        data.forEach(walk)
        return m
    }, [data, loaded])
    const checkState = (n: TreeNode): 'on' | 'off' | 'mixed' => {
        const leaves = leafIds({ ...n, children: kidsOf(n) })
        const on = leaves.filter((l) => checked.has(l)).length
        return on === 0 ? 'off' : on === leaves.length ? 'on' : 'mixed'
    }
    const toggleCheck = (n: TreeNode) => {
        const leaves = leafIds({ ...n, children: kidsOf(n) })
        const st = checkState(n)
        const next = new Set(checked)
        leaves.forEach((l) => (st === 'on' ? next.delete(l) : next.add(l)))
        // 잎을 기준으로 다시 계산하고, 자식이 모두 체크된 부모 id 도 포함해 돌려준다
        const leafSet = new Set([...next].filter((id) => {
            const node = allNodes.get(id)
            return node && !(node.children ?? loaded[id])?.length
        }))
        const uniq: string[] = [...leafSet]
        for (const [id, node] of allNodes) {
            const kids = node.children ?? loaded[id]
            if (kids?.length && leafIds({ ...node, children: kids }).every((l) => leafSet.has(l))) uniq.push(id)
        }
        if (checkedProp === undefined) setChkInner(uniq)
        onCheckedChange?.(uniq)
    }

    const toggleExpand = async (n: TreeNode) => {
        const next = new Set(expanded)
        if (next.has(n.id)) next.delete(n.id)
        else {
            next.add(n.id)
            if (loadChildren && !n.children && !loaded[n.id]) {
                setLoading((s) => new Set(s).add(n.id))
                try {
                    const kids = await loadChildren(n)
                    setLoaded((l) => ({ ...l, [n.id]: kids }))
                } finally {
                    setLoading((s) => {
                        const c = new Set(s)
                        c.delete(n.id)
                        return c
                    })
                }
            }
        }
        setExpanded(next)
    }

    const select = (n: TreeNode, additive: boolean) => {
        if (selectable === 'none' || n.disabled) return
        let next: string[]
        if (selectable === 'multiple' && additive) next = selected.has(n.id) ? [...selected].filter((x) => x !== n.id) : [...selected, n.id]
        else next = [n.id]
        if (selectedProp === undefined && selectedId === undefined) setSelInner(next)
        onSelectedChange?.(next)
        onSelect?.(n.id)
    }

    // 키보드: ↑↓ 이동, → 펼치기/첫 자식, ← 접기/부모, Enter·Space 선택(체크)
    const onKey = (e: KeyboardEvent) => {
        const i = rows.findIndex((r) => r.node.id === focusId)
        const r = rows[i]
        const go = (k: number) => {
            const t = rows[Math.max(0, Math.min(rows.length - 1, k))]
            if (t) setFocusId(t.node.id)
        }
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                go(i + 1)
                break
            case 'ArrowUp':
                e.preventDefault()
                go(i - 1)
                break
            case 'Home':
                e.preventDefault()
                go(0)
                break
            case 'End':
                e.preventDefault()
                go(rows.length - 1)
                break
            case 'ArrowRight':
                if (!r) break
                e.preventDefault()
                if (r.hasKids && !expanded.has(r.node.id)) void toggleExpand(r.node)
                else if (r.hasKids) go(i + 1)
                break
            case 'ArrowLeft':
                if (!r) break
                e.preventDefault()
                if (r.hasKids && expanded.has(r.node.id)) void toggleExpand(r.node)
                else if (r.parent) setFocusId(r.parent)
                break
            case 'Enter':
            case ' ':
                if (!r) break
                e.preventDefault()
                if (checkable && e.key === ' ') toggleCheck(r.node)
                else select(r.node, e.ctrlKey || e.metaKey)
                break
        }
    }
    useEffect(() => {
        if (!focusId) return
        listRef.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(focusId)}"]`)?.focus()
    }, [focusId])

    const ROW = density === 'compact' ? 26 : density === 'comfortable' ? 36 : 30
    const virtual = virtualized && rows.length > 60
    const start = virtual ? Math.max(0, Math.floor(scrollTop / ROW) - 6) : 0
    const end = virtual ? Math.min(rows.length, start + Math.ceil(height / ROW) + 12) : rows.length
    const tabId = focusId ?? [...selected][0] ?? rows[0]?.node.id

    return (
        <div data-ds-tree="" data-density={density} style={style}>
            {searchable && (
                <label data-slot="search">
                    <IconSearch size={14} aria-hidden />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={searchPlaceholder} aria-label={searchPlaceholder} />
                </label>
            )}
            <div
                ref={listRef}
                role="tree"
                aria-label={ariaLabel}
                aria-multiselectable={selectable === 'multiple' || undefined}
                onKeyDown={onKey}
                onScroll={virtual ? (e) => setScrollTop(e.currentTarget.scrollTop) : undefined}
                style={virtual ? { maxHeight: height, overflow: 'auto' } : undefined}
            >
                {virtual && <div style={{ height: start * ROW }} />}
                {rows.slice(start, end).map(({ node: n, depth, hasKids }) => {
                    const isOpen = hasKids && (expanded.has(n.id) || !!visibleIds)
                    const cs = checkable ? checkState(n) : null
                    return (
                        <div
                            key={n.id}
                            role="treeitem"
                            data-id={n.id}
                            aria-level={depth + 1}
                            aria-expanded={hasKids ? isOpen : undefined}
                            aria-selected={selectable !== 'none' ? selected.has(n.id) : undefined}
                            aria-checked={cs ? (cs === 'mixed' ? 'mixed' : cs === 'on') : undefined}
                            aria-disabled={n.disabled || undefined}
                            aria-busy={loading.has(n.id) || undefined}
                            tabIndex={n.id === tabId ? 0 : -1}
                            data-slot="row"
                            data-selected={selected.has(n.id) ? '' : undefined}
                            data-drop={drop?.id === n.id ? drop.pos : undefined}
                            draggable={draggable && !n.disabled}
                            style={{ paddingLeft: depth * 22, height: ROW }}
                            onFocus={() => setFocusId(n.id)}
                            onClick={(e) => select(n, e.ctrlKey || e.metaKey)}
                            onDragStart={(e) => {
                                dragId.current = n.id
                                e.dataTransfer.effectAllowed = 'move'
                            }}
                            onDragOver={(e) => {
                                if (!draggable || !dragId.current || dragId.current === n.id) return
                                e.preventDefault()
                                const r = e.currentTarget.getBoundingClientRect()
                                const y = (e.clientY - r.top) / r.height
                                setDrop({ id: n.id, pos: y < 0.25 ? 'before' : y > 0.75 ? 'after' : 'inside' })
                            }}
                            onDragLeave={() => setDrop(null)}
                            onDrop={(e) => {
                                e.preventDefault()
                                if (dragId.current && drop) onMove?.(dragId.current, drop.id, drop.pos)
                                dragId.current = null
                                setDrop(null)
                            }}
                        >
                            <span
                                data-slot="twisty"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (hasKids) void toggleExpand(n)
                                }}
                            >
                                {loading.has(n.id) ? (
                                    <span data-ds-field-spinner="" data-ds-spinner="" style={{ width: 10, height: 10 }} />
                                ) : hasKids ? (
                                    <IconChevronRight size={14} style={{ transform: isOpen ? 'rotate(90deg)' : undefined }} />
                                ) : null}
                            </span>
                            {cs && (
                                <input
                                    type="checkbox"
                                    data-ds-checkbox=""
                                    data-size="sm"
                                    tabIndex={-1}
                                    aria-hidden
                                    checked={cs === 'on'}
                                    data-indeterminate={cs === 'mixed' ? '' : undefined}
                                    ref={(el) => {
                                        if (el) el.indeterminate = cs === 'mixed'
                                    }}
                                    disabled={n.disabled}
                                    onChange={() => toggleCheck(n)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            )}
                            {n.icon && <span data-slot="icon" aria-hidden>{n.icon}</span>}
                            <span data-slot="label">{n.label}</span>
                            {n.badge !== undefined && <span data-slot="badge">{n.badge}</span>}
                            {n.actions && (
                                <span data-slot="actions" onClick={(e) => e.stopPropagation()}>
                                    {n.actions}
                                </span>
                            )}
                        </div>
                    )
                })}
                {virtual && <div style={{ height: (rows.length - end) * ROW }} />}
                {rows.length === 0 && <div data-slot="empty">{query ? '일치하는 항목이 없습니다' : '항목이 없습니다'}</div>}
            </div>
        </div>
    )
}
