import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconSearch } from '../icons.js'
import { Kbd } from '../display/Kbd.js'
import { useModalBehavior, useOverlayState } from './Dialog.js'

export type CommandItem = {
    /** 항목 키 (최근 기록에도 쓰인다) */
    id: string
    /** 항목 이름. 검색 대상 */
    label: string
    /** 이름 아래 보조 설명 */
    description?: string
    /** 앞 아이콘 */
    icon?: ReactNode
    /** 묶어 보일 그룹 이름 */
    group?: string
    /** 검색에만 쓰는 추가 단어 */
    keywords?: string[]
    /** 오른쪽 단축키 표시. 공백으로 키를 나눈다 */
    shortcut?: string
    /** 실행 불가 */
    disabled?: boolean
    /** 항목을 실행할 때 (실행 뒤 창이 닫힌다) */
    onSelect: () => void
}

export type CommandPaletteProps = {
    /** 제어 모드 열림 */
    open?: boolean
    /** 비제어 초기 열림 */
    defaultOpen?: boolean
    /** 열림이 바뀔 때 (새 상태) */
    onOpenChange?: (open: boolean) => void
    /** @deprecated onOpenChange(false) */
    onClose?: () => void
    /** 고정 명령 목록 */
    items?: CommandItem[]
    /** 서버 검색. 입력이 바뀔 때(200ms 뒤) 불린다. 결과는 items 뒤에 붙는다 */
    loadItems?: (query: string) => Promise<CommandItem[]>
    /** 검색 입력 안내 글자 */
    placeholder?: string
    /** 결과가 없을 때 보일 내용 */
    emptyMessage?: ReactNode
    /** 전역 단축키. 'mod' 는 macOS 에서 ⌘, 그 밖에서 Ctrl. false 면 끈다 */
    hotkey?: string | false
    /** 최근 실행한 항목을 맨 위 '최근' 그룹에 보인다. 문자열이면 localStorage 키 */
    recent?: boolean | string
    /** 아래 안내 줄. 없으면 ↑↓ 이동 · Enter 실행 */
    footer?: ReactNode
    /** 점수(0 이면 제외). 기본은 라벨 앞부분 일치 > 포함 > 키워드 */
    filter?: (item: CommandItem, query: string) => number
    /** 최대 폭. md 560 · lg 720 */
    size?: 'md' | 'lg'
}

const defaultScore = (it: CommandItem, q: string) => {
    const l = it.label.toLowerCase()
    if (l.startsWith(q)) return 3
    if (l.includes(q)) return 2
    const hay = [it.description ?? '', it.group ?? '', ...(it.keywords ?? [])].join(' ').toLowerCase()
    return hay.includes(q) ? 1 : 0
}

const isMac = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

const matchesHotkey = (e: globalThis.KeyboardEvent, hk: string) => {
    const parts = hk.toLowerCase().split('+')
    const key = parts.pop()
    const mod = parts.includes('mod')
    const need = {
        meta: parts.includes('meta') || (mod && isMac()),
        ctrl: parts.includes('ctrl') || (mod && !isMac()),
        shift: parts.includes('shift'),
        alt: parts.includes('alt'),
    }
    return e.key.toLowerCase() === key && e.metaKey === need.meta && e.ctrlKey === need.ctrl && e.shiftKey === need.shift && e.altKey === need.alt
}

/** 단축키로 여는 명령 검색 · 실행 창 */
export const CommandPalette = ({
    open: openProp,
    defaultOpen,
    onOpenChange,
    onClose,
    items = [],
    loadItems,
    placeholder = '명령어 또는 검색어 입력…',
    emptyMessage = '결과 없음',
    hotkey = 'mod+k',
    recent,
    footer,
    filter = defaultScore,
    size = 'md',
}: CommandPaletteProps) => {
    const { open, setOpen } = useOverlayState({ open: openProp, defaultOpen, onOpenChange, onClose })
    const [query, setQuery] = useState('')
    const [active, setActive] = useState(0)
    const [remote, setRemote] = useState<CommandItem[]>([])
    const [loading, setLoading] = useState(false)
    const panelRef = useRef<HTMLDivElement | null>(null)
    const listId = useId()
    const storeKey = typeof recent === 'string' ? recent : 'ds-command-recent'
    const [recentIds, setRecentIds] = useState<string[]>(() => {
        if (!recent) return []
        try {
            return JSON.parse(localStorage.getItem(storeKey) ?? '[]')
        } catch {
            return []
        }
    })

    useModalBehavior(open, panelRef, () => setOpen(false))

    // 전역 단축키
    useEffect(() => {
        if (!hotkey) return
        const onKey = (e: globalThis.KeyboardEvent) => {
            if (matchesHotkey(e, hotkey)) {
                e.preventDefault()
                setOpen(!open)
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hotkey, open])

    useEffect(() => {
        if (!open) {
            setQuery('')
            setActive(0)
            setRemote([])
        }
    }, [open])

    useEffect(() => {
        if (!loadItems || !open) return
        let alive = true
        setLoading(true)
        const t = setTimeout(() => {
            loadItems(query)
                .then((r) => alive && setRemote(r))
                .finally(() => alive && setLoading(false))
        }, 200)
        return () => {
            alive = false
            clearTimeout(t)
        }
    }, [loadItems, query, open])

    const all = useMemo(() => [...items, ...remote.filter((r) => !items.some((i) => i.id === r.id))], [items, remote])
    const visible = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) {
            const rec = recent ? recentIds.map((id) => all.find((i) => i.id === id)).filter(Boolean).map((i) => ({ ...i!, group: '최근' })) : []
            return [...rec, ...all.filter((i) => !rec.some((r) => r.id === i.id))]
        }
        return all
            .map((it) => ({ it, s: filter(it, q) }))
            .filter((x) => x.s > 0)
            .sort((a, b) => b.s - a.s)
            .map((x) => x.it)
    }, [all, query, recent, recentIds, filter])

    const groups = useMemo(() => {
        const m = new Map<string, CommandItem[]>()
        for (const it of visible) {
            const g = it.group ?? ''
            if (!m.has(g)) m.set(g, [])
            m.get(g)!.push(it)
        }
        return [...m.entries()]
    }, [visible])
    const flat = groups.flatMap(([, list]) => list)

    const run = (it: CommandItem) => {
        if (it.disabled) return
        if (recent) {
            const next = [it.id, ...recentIds.filter((x) => x !== it.id)].slice(0, 5)
            setRecentIds(next)
            try {
                localStorage.setItem(storeKey, JSON.stringify(next))
            } catch {
                /* 저장 불가 */
            }
        }
        setOpen(false)
        it.onSelect()
    }

    const onKey = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActive((a) => Math.min(a + 1, flat.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActive((a) => Math.max(a - 1, 0))
        } else if (e.key === 'Enter') {
            e.preventDefault()
            const it = flat[active]
            if (it) run(it)
        }
    }

    useEffect(() => {
        panelRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
    }, [active])

    if (!open || typeof document === 'undefined') return null
    let idx = -1
    return createPortal(
        <div data-ds-modal-root="" data-command="" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
            <div ref={panelRef} role="dialog" aria-modal="true" aria-label="명령 팔레트" data-ds-command="" data-size={size} tabIndex={-1}>
                <label data-slot="search">
                    <IconSearch size={18} aria-hidden />
                    <input
                        data-autofocus=""
                        role="combobox"
                        aria-expanded="true"
                        aria-controls={listId}
                        aria-activedescendant={flat[active] ? `${listId}-${active}` : undefined}
                        aria-label={placeholder}
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            setActive(0)
                        }}
                        onKeyDown={onKey}
                    />
                    {loading && <span data-ds-spinner-ring="" style={{ width: 14, height: 14, borderWidth: 2 }} aria-hidden />}
                    <Kbd size="xs">Esc</Kbd>
                </label>
                <div id={listId} role="listbox" data-slot="list">
                    {flat.length === 0 ? (
                        <div data-slot="empty">{loading ? '검색 중…' : emptyMessage}</div>
                    ) : (
                        groups.map(([g, list]) => (
                            <div key={g || '_'} role="group" aria-label={g || undefined}>
                                {g && <div data-slot="group">{g}</div>}
                                {list.map((it) => {
                                    idx += 1
                                    const i = idx
                                    return (
                                        <div
                                            key={`${g}-${it.id}`}
                                            id={`${listId}-${i}`}
                                            role="option"
                                            aria-selected={i === active}
                                            aria-disabled={it.disabled || undefined}
                                            data-index={i}
                                            data-slot="item"
                                            data-active={i === active ? '' : undefined}
                                            onMouseMove={() => setActive(i)}
                                            onClick={() => run(it)}
                                        >
                                            {it.icon && <span data-slot="icon" aria-hidden>{it.icon}</span>}
                                            <span data-slot="label">
                                                {it.label}
                                                {it.description && <small>{it.description}</small>}
                                            </span>
                                            {it.shortcut && <Kbd keys={it.shortcut.split(/\s+/)} size="xs" />}
                                        </div>
                                    )
                                })}
                            </div>
                        ))
                    )}
                </div>
                <div data-slot="footer">
                    {footer ?? (
                        <>
                            <span><Kbd size="xs">↑</Kbd><Kbd size="xs">↓</Kbd> 이동</span>
                            <span><Kbd size="xs">Enter</Kbd> 실행</span>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body,
    )
}
