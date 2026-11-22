import { Children, createContext, Fragment, isValidElement, useContext, useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { Button } from './Button.js'
import { Tag } from './Tag.js'
import { NavigationMenu, type NavItem } from './NavigationMenu.js'
import { LuPanelLeftClose, LuPanelLeftOpen } from 'react-icons/lu'
import { IconArrowLeft, IconChevronDown, IconChevronLeft, IconChevronRight } from './icons.js'

/* ───────────────────────── AppShell ───────────────────────── */

export const AppShellContext = createContext<{ collapsed: boolean; toggle: () => void }>({ collapsed: false, toggle: () => {} })
/** 사이드바 안에서 접힘 상태를 읽는다 */
export const useAppShell = () => useContext(AppShellContext)

export type AppShellProps = {
    /** 머리말 전체를 직접 그린다. 없으면 brand · headerSearch · headerActions 로 짠다 */
    header?: ReactNode
    /** 로고 + 이름. 사이드바 폭에 맞춰 왼쪽에 놓인다 */
    brand?: ReactNode
    /** 머리말 가운데 (⌘K 검색 버튼 등) */
    headerSearch?: ReactNode
    /** 머리말 오른쪽 (알림 · 사용자 메뉴) */
    headerActions?: ReactNode
    /** 메뉴 항목. 주면 아이콘 · 선택 표시 · 접힘이 맞춰진 NavigationMenu 를 그린다 */
    navigation?: NavItem[]
    activeNavId?: string
    onNavigate?: (item: NavItem) => void
    /** 사이드바 아래 */
    sidebarFooter?: ReactNode
    /** 접기 버튼 위치. 기본: 머리말을 슬롯으로 짜면 'header', header 를 직접 그리면 'sidebar' */
    collapseButton?: 'header' | 'sidebar' | 'none'
    /** ⌘B / Ctrl+B 로 접기 (기본 true) */
    collapseShortcut?: boolean
    sidebar?: ReactNode
    /** 맨 아래 상태 줄 (PLC 연결 · 마지막 갱신 · 버전) */
    footer?: ReactNode
    sidebarWidth?: number
    sidebarCollapsed?: boolean
    defaultSidebarCollapsed?: boolean
    onSidebarCollapsedChange?: (collapsed: boolean) => void
    /** 접힌 사이드바 폭 */
    collapsedWidth?: number
    /** 현장 모니터: 헤더 · 사이드바를 숨기고 글자를 키운다 */
    kiosk?: boolean
    children: ReactNode
} & HTMLAttributes<HTMLDivElement>

export const AppShell = ({
    header,
    brand,
    headerSearch,
    headerActions,
    navigation,
    activeNavId,
    onNavigate,
    sidebarFooter,
    collapseButton,
    collapseShortcut = true,
    sidebar: sidebarProp,
    footer,
    sidebarWidth = 220,
    sidebarCollapsed,
    defaultSidebarCollapsed = false,
    onSidebarCollapsedChange,
    collapsedWidth = 56,
    kiosk,
    children,
    style,
    ...rest
}: AppShellProps) => {
    const [inner, setInner] = useState(defaultSidebarCollapsed)
    const collapsed = sidebarCollapsed ?? inner
    const toggle = () => {
        if (sidebarCollapsed === undefined) setInner(!collapsed)
        onSidebarCollapsedChange?.(!collapsed)
    }
    const withNav = (items: NavItem[]): NavItem[] => items.map((n) => ({ ...n, onClick: n.onClick ?? (onNavigate && !n.children?.length ? () => onNavigate(n) : undefined), children: n.children && withNav(n.children) }))
    const sidebar = sidebarProp ?? (navigation ? <NavigationMenu items={onNavigate ? withNav(navigation) : navigation} activeId={activeNavId} collapsed={collapsed} aria-label="주 메뉴" /> : null)
    const hasSide = !!(sidebarProp || navigation) && !kiosk
    const btnAt = collapseButton ?? (header ? 'sidebar' : 'header')
    const shortcutLabel = typeof navigator !== 'undefined' && /Mac|iP/.test(navigator.platform) ? '⌘B' : 'Ctrl+B'
    const headerToggle = hasSide && btnAt === 'header' && (
        <button type="button" data-slot="header-toggle" aria-label={collapsed ? '메뉴 펼치기' : '메뉴 접기'} aria-expanded={!collapsed} title={`${collapsed ? '메뉴 펼치기' : '메뉴 접기'} (${shortcutLabel})`} onClick={toggle}>
            {collapsed ? <LuPanelLeftOpen size={18} /> : <LuPanelLeftClose size={18} />}
        </button>
    )
    useEffect(() => {
        if (!hasSide || !collapseShortcut) return
        const on = (e: KeyboardEvent) => {
            if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'b' || e.shiftKey || e.altKey) return
            const t = e.target as HTMLElement | null
            if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
            e.preventDefault()
            toggle()
        }
        window.addEventListener('keydown', on)
        return () => window.removeEventListener('keydown', on)
    })
    const headerNode = header ?? (brand || headerSearch || headerActions ? (
        <>
            {brand && <div data-slot="brand">{brand}{!collapsed && headerToggle}</div>}
            {(collapsed || !brand) && headerToggle}
            <div data-slot="header-search">{headerSearch}</div>
            {headerActions && <div data-slot="header-actions">{headerActions}</div>}
        </>
    ) : null)
    const showSide = !!sidebar && !kiosk
    return (
        <div
            data-ds-app-shell=""
            data-kiosk={kiosk ? '' : undefined}
            data-collapsed={collapsed ? '' : undefined}
            style={{ ['--_sw' as string]: `${showSide ? (collapsed ? collapsedWidth : sidebarWidth) : 0}px`, ...style } as CSSProperties}
            {...rest}
        >
            {headerNode && !kiosk && <header data-slot="header" data-composed={header ? undefined : ''}>{headerNode}</header>}
            {showSide && (
                <AppShellContext.Provider value={{ collapsed, toggle }}>
                <div data-slot="sidebar" role={sidebarProp ? 'navigation' : undefined} aria-label={sidebarProp ? '주 메뉴' : undefined}>
                    <div data-slot="sidebar-body">{sidebar}</div>
                    {sidebarFooter && <div data-slot="sidebar-footer">{sidebarFooter}</div>}
{btnAt === 'sidebar' && (
                    <button type="button" data-slot="collapse" aria-label={collapsed ? '메뉴 펼치기' : '메뉴 접기'} aria-expanded={!collapsed} onClick={toggle}>
                        {collapsed ? <IconChevronRight size={16} /> : <><IconChevronLeft size={16} /><span>접기</span></>}
                    </button>
                    )}
                </div>
                </AppShellContext.Provider>
            )}
            <main data-slot="main">{children}</main>
            {footer && <footer data-slot="footer">{footer}</footer>}
        </div>
    )
}

/* ───────────────────────── PageHeader ───────────────────────── */

export type PageHeaderProps = {
    title: ReactNode
    description?: ReactNode
    breadcrumb?: ReactNode
    /** 오른쪽 버튼 */
    actions?: ReactNode
    /** 아래에 붙는 탭 */
    tabs?: ReactNode
    /** 제목 아래 보조 정보 (규격 · 단위 · 수정일) */
    meta?: ReactNode
    /** 제목 옆 (상태 배지) */
    extra?: ReactNode
    onBack?: () => void
} & Omit<HTMLAttributes<HTMLDivElement>, 'title'>

export const PageHeader = ({ title, description, breadcrumb, actions, tabs, meta, extra, onBack, ...rest }: PageHeaderProps) => (
    <div data-ds-page-header="" {...rest}>
        {breadcrumb && <div data-slot="breadcrumb">{breadcrumb}</div>}
        <div data-slot="row">
            <div data-slot="title-wrap">
                {onBack && <Button appearance="ghost" tone="neutral" size="sm" shape="square" aria-label="뒤로" iconLeft={<IconArrowLeft size={18} />} onClick={onBack} />}
                <h1>{title}</h1>
                {extra}
            </div>
            {actions && <div data-slot="actions">{actions}</div>}
        </div>
        {description && <p data-slot="description">{description}</p>}
        {meta && <div data-slot="meta">{meta}</div>}
        {tabs && <div data-slot="tabs">{tabs}</div>}
    </div>
)

/* ───────────────────────── FilterBar ───────────────────────── */

export type FilterBarProps = {
    /** 조건 입력들 (FormField 를 넣으면 라벨이 위에 붙는다) */
    fields: ReactNode
    /** 한 줄 열 수 */
    columns?: number
    /** 접었을 때 보일 줄 수. 넘치는 조건은 "조건 N개 더보기" */
    collapsedRows?: number
    defaultExpanded?: boolean
    onSearch?: () => void
    onReset?: () => void
    searchLabel?: ReactNode
    /** 적용된 조건 칩 */
    appliedChips?: Array<{ label: ReactNode; onRemove?: () => void }>
    /** 버튼 옆 추가 동작 */
    extra?: ReactNode
} & Omit<HTMLAttributes<HTMLFormElement>, 'onReset'>

export const FilterBar = ({
    fields,
    columns = 4,
    collapsedRows,
    defaultExpanded = false,
    onSearch,
    onReset,
    searchLabel = '조회',
    appliedChips,
    extra,
    ...rest
}: FilterBarProps) => {
    const [expanded, setExpanded] = useState(defaultExpanded)
    // <>…</> 로 감싸 넘겨도 조건 하나하나를 센다
    const flatten = (n: ReactNode): ReactNode[] =>
        Children.toArray(n).flatMap((c) => (isValidElement(c) && c.type === Fragment ? flatten((c.props as { children?: ReactNode }).children) : [c]))
    const items = flatten(fields)
    const limit = collapsedRows ? collapsedRows * columns : Infinity
    const hiddenCount = Math.max(0, items.length - limit)
    const visible = expanded ? items : items.slice(0, limit)
    return (
        <form
            role="search"
            data-ds-filter-bar=""
            onSubmit={(e) => {
                e.preventDefault()
                onSearch?.()
            }}
            onReset={(e) => {
                e.preventDefault()
                onReset?.()
            }}
            {...rest}
        >
            <div data-slot="fields" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
                {visible}
            </div>
            <div data-slot="bar">
                <div data-slot="chips">
                    {appliedChips && appliedChips.length > 0 && (
                        <>
                            <span data-slot="applied">적용된 조건</span>
                            {appliedChips.map((c, i) => (
                                <Tag key={i} size="sm" closable={!!c.onRemove} onClose={c.onRemove}>
                                    {c.label}
                                </Tag>
                            ))}
                        </>
                    )}
                    {hiddenCount > 0 && (
                        <Button
                            appearance="link"
                            size="xs"
                            aria-expanded={expanded}
                            iconRight={<IconChevronDown size={12} style={{ transform: expanded ? 'rotate(180deg)' : undefined }} />}
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? '조건 접기' : `조건 ${hiddenCount}개 더보기`}
                        </Button>
                    )}
                </div>
                <div data-slot="buttons">
                    {extra}
                    {onReset && (
                        <Button type="reset" size="sm" appearance="ghost" tone="neutral">
                            초기화
                        </Button>
                    )}
                    <Button type="submit" size="sm">
                        {searchLabel}
                    </Button>
                </div>
            </div>
        </form>
    )
}

/* ───────────────────────── Splitter ───────────────────────── */

export type SplitterProps = {
    direction?: 'horizontal' | 'vertical'
    /** 첫 패널 크기. 숫자는 px, '40%' 처럼 퍼센트도 된다 */
    defaultSize?: number | string
    minSize?: number
    maxSize?: number
    /** 손잡이를 두 번 누르면 첫 패널을 접는다 */
    collapsible?: boolean
    onResize?: (px: number) => void
    /** localStorage 키. 크기를 기억한다 */
    stateKey?: string
    /** 패널 두 개 */
    children: [ReactNode, ReactNode]
} & HTMLAttributes<HTMLDivElement>

export const Splitter = ({
    direction = 'horizontal',
    defaultSize = '50%',
    minSize = 120,
    maxSize,
    collapsible,
    onResize,
    stateKey,
    children,
    style,
    ...rest
}: SplitterProps) => {
    const root = useRef<HTMLDivElement | null>(null)
    const [size, setSize] = useState<number | string>(() => {
        if (stateKey) {
            try {
                const v = localStorage.getItem(`ds-split:${stateKey}`)
                if (v) return Number(v)
            } catch {
                /* 저장소 없음 */
            }
        }
        return defaultSize
    })
    const [collapsed, setCollapsed] = useState(false)
    const horizontal = direction === 'horizontal'

    useEffect(() => {
        if (!stateKey || typeof size !== 'number') return
        try {
            localStorage.setItem(`ds-split:${stateKey}`, String(size))
        } catch {
            /* 저장소 없음 */
        }
    }, [size, stateKey])

    const clamp = (px: number) => {
        const total = horizontal ? root.current!.clientWidth : root.current!.clientHeight
        return Math.max(minSize, Math.min(maxSize ?? total - minSize, px))
    }
    const startDrag = (e: ReactPointerEvent) => {
        e.preventDefault()
        const rect = root.current!.getBoundingClientRect()
        const move = (ev: PointerEvent) => {
            const px = clamp(horizontal ? ev.clientX - rect.left : ev.clientY - rect.top)
            setCollapsed(false)
            setSize(px)
            onResize?.(px)
        }
        const up = () => {
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
    }
    const onKey = (e: ReactKeyboardEvent) => {
        const dec = horizontal ? 'ArrowLeft' : 'ArrowUp'
        const inc = horizontal ? 'ArrowRight' : 'ArrowDown'
        if (e.key !== dec && e.key !== inc && e.key !== 'Enter') return
        e.preventDefault()
        if (e.key === 'Enter' && collapsible) return setCollapsed(!collapsed)
        const first = root.current!.firstElementChild as HTMLElement
        const cur = horizontal ? first.getBoundingClientRect().width : first.getBoundingClientRect().height
        const px = clamp(cur + (e.key === inc ? 24 : -24))
        setSize(px)
        onResize?.(px)
    }
    const basis = collapsed ? '0px' : typeof size === 'number' ? `${size}px` : size
    const total = root.current ? (horizontal ? root.current.clientWidth : root.current.clientHeight) : undefined
    return (
        <div ref={root} data-ds-splitter="" data-direction={direction} style={style} {...rest}>
            <div data-slot="pane" style={{ flexBasis: basis }}>
                {children[0]}
            </div>
            <div
                role="separator"
                aria-orientation={horizontal ? 'vertical' : 'horizontal'}
                aria-valuenow={typeof size === 'number' ? Math.round(size) : undefined}
                aria-valuemin={minSize}
                aria-valuemax={maxSize ?? total}
                aria-label="패널 크기 조절"
                tabIndex={0}
                data-slot="handle"
                onPointerDown={startDrag}
                onKeyDown={onKey}
                onDoubleClick={() => collapsible && setCollapsed(!collapsed)}
            >
                <span aria-hidden />
            </div>
            <div data-slot="pane" data-fill="">
                {children[1]}
            </div>
        </div>
    )
}
