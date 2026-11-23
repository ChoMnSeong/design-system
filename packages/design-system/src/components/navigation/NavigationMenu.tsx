import { useEffect, useMemo, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { IconChevronDown, IconMoreHorizontal, IconSearch } from '../icons.js'
import { Menu, MenuItem, MenuLabel } from '../overlay/Menu.js'
import type { Density } from '../types.js'

export type NavItem = {
    /** 항목 고유 id (activeId · expanded 기준) */
    id: string
    /** 표시 이름 */
    label: ReactNode
    /** 이름 앞 아이콘 (접힌 메뉴에선 이것만 보임) */
    icon?: ReactNode
    /** 오른쪽 배지 (접힌 메뉴에선 점) */
    badge?: ReactNode
    /** 링크 주소 (있으면 <a>, 없으면 <button>) */
    href?: string
    /** 항목을 누를 때 */
    onClick?: () => void
    /** 하위 항목 */
    children?: NavItem[]
    /** 같은 group 이 이어지면 위에 그룹 라벨을 한 번 단다 */
    group?: string
    /** 비활성 */
    disabled?: boolean
    /** 권한 없음 등으로 아예 숨김 */
    hidden?: boolean
}

export type NavigationMenuProps = {
    /** 메뉴 항목 */
    items: NavItem[]
    /** 현재 페이지 항목 id (강조 + aria-current) */
    activeId?: string
    /** 비제어 초기 펼침 id 목록 (없으면 활성 항목의 부모) */
    defaultExpanded?: string[]
    /** 제어 모드 펼침 id 목록 */
    expanded?: string[]
    /** 펼침이 바뀔 때 (새 id 목록) */
    onExpandedChange?: (ids: string[]) => void
    /** 아이콘만 보이고 하위 메뉴는 팝오버로 */
    collapsed?: boolean
    /** 접힘 변경 콜백 (컴포넌트 안에서는 호출하지 않음) */
    onCollapsedChange?: (collapsed: boolean) => void
    /** vertical: 세로 펼침 목록 · horizontal: 가로, 넘치면 ··· 메뉴 */
    orientation?: 'vertical' | 'horizontal'
    /** 위에 메뉴 검색창 (세로 메뉴) */
    searchable?: boolean
    /** 검색창 안내 문구 */
    searchPlaceholder?: string
    /** 세로 메뉴 항목 높이 compact 26 · default 34 · comfortable 40 (px) */
    density?: Density
    /** 라우터 연결. 기본은 <a href> 또는 <button> */
    renderLink?: (item: NavItem, children: ReactNode, props: Record<string, unknown>) => ReactNode
    /** nav 접근성 이름 */
    'aria-label'?: string
    /** nav 요소 class */
    className?: string
    /** nav 요소 style */
    style?: CSSProperties
    /** DOM 요소 ref */
    ref?: Ref<HTMLElement>
} & Omit<HTMLAttributes<HTMLElement>, 'children'>

const textOf = (n: NavItem) => (typeof n.label === 'string' ? n.label : n.id)
const containsActive = (n: NavItem, id?: string): boolean => !!id && (n.id === id || !!n.children?.some((c) => containsActive(c, id)))

/** 세로·가로·접힘 배치를 지원하는 사이트 메뉴 */
export const NavigationMenu = ({
    items: itemsProp,
    activeId,
    defaultExpanded,
    expanded: expandedProp,
    onExpandedChange,
    collapsed,
    // 접힘은 AppShell 등 바깥에서 바꾼다. DOM 으로 새지 않게 꺼내 둔다
    onCollapsedChange: _onCollapsedChange,
    orientation = 'vertical',
    searchable,
    searchPlaceholder = '메뉴 검색',
    density = 'default',
    renderLink,
    'aria-label': ariaLabel = '주 메뉴',
    className,
    style,
    ref,
    ...rest
}: NavigationMenuProps) => {
    const items = useMemo(() => {
        const strip = (list: NavItem[]): NavItem[] => list.filter((n) => !n.hidden).map((n) => ({ ...n, children: n.children ? strip(n.children) : undefined }))
        return strip(itemsProp)
    }, [itemsProp])
    // 기본: 활성 항목의 부모를 펼친다
    const [inner, setInner] = useState<string[]>(() => defaultExpanded ?? items.filter((n) => n.children && containsActive(n, activeId)).map((n) => n.id))
    const expanded = new Set(expandedProp ?? inner)
    const toggle = (id: string) => {
        const n = new Set(expanded)
        if (n.has(id)) n.delete(id)
        else n.add(id)
        if (expandedProp === undefined) setInner([...n])
        onExpandedChange?.([...n])
    }
    const [query, setQuery] = useState('')

    const filtered = useMemo(() => {
        if (!query.trim()) return items
        const q = query.trim().toLowerCase()
        const walk = (list: NavItem[]): NavItem[] =>
            list.flatMap((n) => {
                const kids = n.children ? walk(n.children) : undefined
                return textOf(n).toLowerCase().includes(q) || kids?.length ? [{ ...n, children: kids?.length ? kids : n.children && textOf(n).toLowerCase().includes(q) ? n.children : undefined }] : []
            })
        return walk(items)
    }, [items, query])

    const link = (n: NavItem, content: ReactNode, extra: Record<string, unknown> = {}) => {
        const props = {
            'data-slot': 'item',
            'data-active': n.id === activeId ? '' : undefined,
            'aria-current': n.id === activeId ? 'page' : undefined,
            'aria-disabled': n.disabled || undefined,
            onClick: n.disabled ? (e: Event) => e.preventDefault() : n.onClick,
            ...extra,
        }
        if (renderLink && !n.disabled) return renderLink(n, content, props)
        return n.href && !n.disabled ? (
            <a href={n.href} {...(props as object)}>
                {content}
            </a>
        ) : (
            <button type="button" disabled={n.disabled} {...(props as object)}>
                {content}
            </button>
        )
    }

    const inner3 = (n: NavItem, showChevron?: boolean, open?: boolean) => (
        <>
            {n.icon && <span data-slot="icon" aria-hidden>{n.icon}</span>}
            <span data-slot="label">{n.label}</span>
            {n.badge !== undefined && <span data-slot="badge">{n.badge}</span>}
            {showChevron && <IconChevronDown size={14} data-slot="chevron" style={{ transform: open ? 'rotate(180deg)' : undefined }} aria-hidden />}
        </>
    )

    /* ── 접힌 세로 메뉴: 아이콘 + 하위는 팝오버 메뉴 ── */
    if (collapsed && orientation === 'vertical') {
        return (
            <nav ref={ref} aria-label={ariaLabel} data-ds-nav="" data-collapsed="" data-density={density} className={className} style={style} {...rest}>
                <ul data-slot="list">
                    {items.map((n) => {
                        const active = containsActive(n, activeId)
                        const iconBtn = (extra: Record<string, unknown>) => (
                            <button
                                type="button"
                                data-slot="item"
                                data-active={active ? '' : undefined}
                                aria-label={textOf(n)}
                                title={textOf(n)}
                                disabled={n.disabled}
                                {...extra}
                            >
                                <span data-slot="icon" aria-hidden>{n.icon ?? textOf(n).slice(0, 1)}</span>
                                {n.badge !== undefined && <span data-slot="dot" aria-hidden />}
                            </button>
                        )
                        return (
                            <li key={n.id}>
                                {n.children?.length ? (
                                    <Menu placement="right" align="start" trigger={iconBtn({})} minWidth={180}>
                                        <MenuLabel>{n.label}</MenuLabel>
                                        {n.children.map((c) => (
                                            <MenuItem key={c.id} disabled={c.disabled} onClick={c.onClick} aria-current={c.id === activeId ? 'page' : undefined} data-active={c.id === activeId ? '' : undefined}>
                                                {c.label}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                ) : (
                                    iconBtn({ onClick: n.onClick, 'aria-current': n.id === activeId ? 'page' : undefined })
                                )}
                            </li>
                        )
                    })}
                </ul>
            </nav>
        )
    }

    /* ── 가로 메뉴: 넘치면 ··· ── */
    if (orientation === 'horizontal') return <HorizontalNav items={items} activeId={activeId} ariaLabel={ariaLabel} link={link} inner={inner3} className={className} style={style} navRef={ref} rest={rest} />

    /* ── 세로 메뉴 ── */
    let lastGroup: string | undefined
    const renderList = (list: NavItem[], depth: number): ReactNode => (
        <ul data-slot="list" data-depth={depth}>
            {list.map((n) => {
                const header = depth === 0 && n.group && n.group !== lastGroup ? n.group : null
                if (depth === 0) lastGroup = n.group
                const hasKids = !!n.children?.length
                const open = hasKids && (expanded.has(n.id) || !!query)
                return (
                    <li key={n.id}>
                        {header && <div data-slot="group" role="presentation">{header}</div>}
                        {hasKids ? (
                            <>
                                <button
                                    type="button"
                                    data-slot="item"
                                    data-parent=""
                                    data-active-within={containsActive(n, activeId) && !open ? '' : undefined}
                                    aria-expanded={open}
                                    disabled={n.disabled}
                                    style={{ ['--_d' as string]: depth } as CSSProperties}
                                    onClick={() => toggle(n.id)}
                                >
                                    {inner3(n, true, open)}
                                </button>
                                {open && renderList(n.children!, depth + 1)}
                            </>
                        ) : (
                            link(n, inner3(n), { style: { ['--_d' as string]: depth } })
                        )}
                    </li>
                )
            })}
        </ul>
    )

    return (
        <nav ref={ref} aria-label={ariaLabel} data-ds-nav="" data-density={density} className={className} style={style} {...rest}>
            {searchable && (
                <label data-slot="search">
                    <IconSearch size={14} aria-hidden />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={searchPlaceholder} aria-label={searchPlaceholder} />
                </label>
            )}
            {filtered.length ? renderList(filtered, 0) : <div data-slot="empty">일치하는 메뉴가 없습니다</div>}
        </nav>
    )
}

const HorizontalNav = ({
    items,
    activeId,
    ariaLabel,
    link,
    inner,
    className,
    style,
    navRef,
    rest,
}: {
    items: NavItem[]
    activeId?: string
    ariaLabel: string
    link: (n: NavItem, c: ReactNode, extra?: Record<string, unknown>) => ReactNode
    inner: (n: NavItem, chev?: boolean, open?: boolean) => ReactNode
    className?: string
    style?: CSSProperties
    navRef?: Ref<HTMLElement>
    rest: Record<string, unknown>
}) => {
    const ul = useRef<HTMLUListElement | null>(null)
    const [hidden, setHidden] = useState<string[]>([])
    useEffect(() => {
        const el = ul.current
        if (!el) return
        const measure = () => {
            const lis = Array.from(el.children).filter((c) => (c as HTMLElement).dataset.id) as HTMLElement[]
            lis.forEach((li) => (li.style.display = ''))
            const limit = el.getBoundingClientRect().right - 40
            const out = lis.filter((li) => li.getBoundingClientRect().right > limit).map((li) => li.dataset.id!)
            lis.forEach((li) => {
                if (out.includes(li.dataset.id!)) li.style.display = 'none'
            })
            setHidden(out)
        }
        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(el)
        return () => ro.disconnect()
    }, [items])
    return (
        <nav ref={navRef} aria-label={ariaLabel} data-ds-nav="" data-orientation="horizontal" className={className} style={style} {...rest}>
            <ul ref={ul} data-slot="list">
                {items.map((n) => (
                    <li key={n.id} data-id={n.id}>
                        {n.children?.length ? (
                            <Menu
                                trigger={
                                    <button type="button" data-slot="item" data-active={containsActive(n, activeId) ? '' : undefined} disabled={n.disabled}>
                                        {inner(n, true, false)}
                                    </button>
                                }
                            >
                                {n.children.map((c) => (
                                    <MenuItem key={c.id} disabled={c.disabled} onClick={c.onClick} aria-current={c.id === activeId ? 'page' : undefined}>
                                        {c.label}
                                    </MenuItem>
                                ))}
                            </Menu>
                        ) : (
                            link(n, inner(n))
                        )}
                    </li>
                ))}
                {hidden.length > 0 && (
                    <li data-slot="more-li">
                        <Menu
                            align="end"
                            trigger={
                                <button type="button" data-slot="item" aria-label={`메뉴 ${hidden.length}개 더보기`}>
                                    <IconMoreHorizontal size={16} />
                                </button>
                            }
                        >
                            {items
                                .filter((n) => hidden.includes(n.id))
                                .map((n) => (
                                    <MenuItem key={n.id} disabled={n.disabled} onClick={n.onClick}>
                                        {n.label}
                                    </MenuItem>
                                ))}
                        </Menu>
                    </li>
                )}
            </ul>
        </nav>
    )
}
