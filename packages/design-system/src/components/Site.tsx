import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { LuChevronRight, LuMenu, LuX } from 'react-icons/lu'
import { Container } from './Container.js'

/* 보드 12-02 · 사이트 머리말 · 큰 메뉴 · 꼬리말 · 공지 띠 */

const badgeText = (n: number | string) => (typeof n === 'number' && n > 99 ? '99+' : String(n))

/* ───────── 공지 띠 ───────── */

export type AnnouncementBarProps = {
    children: ReactNode
    dismissible?: boolean
    /** 닫은 뒤 숨기는 기간(일) */
    dismissDays?: number
    /** 닫힘 기억 키 (localStorage) */
    storageKey?: string
    onDismiss?: () => void
    style?: CSSProperties
}

export const AnnouncementBar = ({ children, dismissible = true, dismissDays = 7, storageKey = 'ds-announce', onDismiss, style }: AnnouncementBarProps) => {
    const [hidden, setHidden] = useState(() => {
        try {
            const until = Number(localStorage.getItem(storageKey))
            return until > Date.now()
        } catch {
            return false
        }
    })
    if (hidden) return null
    return (
        <div data-ds-announce="" role="region" aria-label="공지" style={style}>
            <span>{children}</span>
            {dismissible && (
                <button
                    type="button"
                    aria-label="공지 닫기"
                    onClick={() => {
                        try { localStorage.setItem(storageKey, String(Date.now() + dismissDays * 864e5)) } catch { /* 저장 불가 */ }
                        setHidden(true)
                        onDismiss?.()
                    }}
                >
                    <LuX size={14} />
                </button>
            )}
        </div>
    )
}

/* ───────── 큰 메뉴 ───────── */

export type MegaMenuColumn = { title: ReactNode; links: Array<{ label: ReactNode; href?: string; badge?: ReactNode }> }
export type MegaMenuCategory = { key: string; label: ReactNode; columns: MegaMenuColumn[]; promo?: ReactNode }

export type MegaMenuProps = {
    categories: MegaMenuCategory[]
    defaultCategory?: string
    /** 모든 카테고리 공통 프로모 */
    promo?: ReactNode
    renderLink?: (link: { label: ReactNode; href?: string }) => ReactNode
    onClose?: () => void
}

export const MegaMenu = ({ categories, defaultCategory, promo, renderLink, onClose }: MegaMenuProps) => {
    const [active, setActive] = useState(defaultCategory ?? categories[0]?.key)
    const cat = categories.find((c) => c.key === active) ?? categories[0]
    return (
        <div data-ds-mega="" onKeyDown={(e) => e.key === 'Escape' && onClose?.()}>
            <Container>
                <div data-slot="cats" role="tablist" aria-orientation="vertical">
                    {categories.map((c) => (
                        <button key={c.key} type="button" role="tab" aria-selected={c.key === cat?.key} onMouseEnter={() => setActive(c.key)} onFocus={() => setActive(c.key)}>
                            {c.label}
                        </button>
                    ))}
                </div>
                <div data-slot="cols" role="tabpanel">
                    {cat?.columns.map((col, i) => (
                        <div key={i}>
                            <h6>{col.title}</h6>
                            <ul>
                                {col.links.map((l, j) => (
                                    <li key={j}>{renderLink ? renderLink(l) : <a href={l.href ?? '#'}>{l.label}{l.badge}</a>}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                {(cat?.promo ?? promo) && <div data-slot="promo">{cat?.promo ?? promo}</div>}
            </Container>
        </div>
    )
}

/* ───────── 머리말 ───────── */

export type SiteHeaderAction = { icon: ReactNode; label: string; badge?: number | string; onClick?: () => void; href?: string }
export type SiteHeaderNavItem = { key: string; label: ReactNode; href?: string; highlight?: boolean; mega?: MegaMenuCategory[] }

export type SiteHeaderProps = {
    logo: ReactNode
    /** 'double' = 1단 + 카테고리 2단 */
    layout?: 'single' | 'double'
    search?: ReactNode
    actions?: SiteHeaderAction[]
    nav?: SiteHeaderNavItem[]
    activeNav?: string
    onNavSelect?: (key: string) => void
    sticky?: boolean
    /** 아래로 스크롤하면 2단만 숨긴다 */
    hideRowOnScroll?: boolean
    /** 배너 위에서 투명 + 흰 글자, 스크롤하면 채워진다 */
    transparentOnTop?: boolean
    /** 모바일 메뉴 버튼 */
    onMenuClick?: () => void
    /** 스크롤을 감지할 요소 (기본 window) */
    scrollContainer?: () => HTMLElement | null
    announcement?: ReactNode
    style?: CSSProperties
}

export const SiteHeader = ({
    logo, layout = 'double', search, actions = [], nav = [], activeNav, onNavSelect, sticky = true, hideRowOnScroll = true, transparentOnTop, onMenuClick, scrollContainer, announcement, style,
}: SiteHeaderProps) => {
    const [atTop, setAtTop] = useState(true)
    const [rowHidden, setRowHidden] = useState(false)
    const [mega, setMega] = useState<string | null>(null)
    const last = useRef(0)
    const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
    useEffect(() => {
        const el = scrollContainer?.() ?? null
        const read = () => (el ? el.scrollTop : window.scrollY)
        const on = () => {
            const y = read()
            setAtTop(y < 8)
            if (hideRowOnScroll) setRowHidden(y > 80 && y > last.current)
            last.current = y
        }
        const target: any = el ?? window
        target.addEventListener('scroll', on, { passive: true })
        return () => target.removeEventListener('scroll', on)
    }, [hideRowOnScroll, scrollContainer])
    const transparent = transparentOnTop && atTop && !mega
    const megaItem = nav.find((n) => n.key === mega)
    return (
        <header
            data-ds-site-header=""
            data-sticky={sticky ? '' : undefined}
            data-transparent={transparent ? '' : undefined}
            data-overlay={transparentOnTop ? '' : undefined}
            data-row-hidden={rowHidden ? '' : undefined}
            style={style}
            onMouseLeave={() => { closeTimer.current = setTimeout(() => setMega(null), 120) }}
            onMouseEnter={() => clearTimeout(closeTimer.current)}
        >
            {announcement}
            <Container>
                <div data-slot="row1">
                    <button type="button" data-slot="mobile" aria-label="메뉴" onClick={onMenuClick}>
                        <LuMenu size={22} />
                    </button>
                    <div data-slot="logo">{logo}</div>
                    {search && <div data-slot="search">{search}</div>}
                    <div data-slot="actions">
                        {actions.map((a) => {
                            const inner = (
                                <>
                                    {a.icon}
                                    <span>{a.label}</span>
                                    {a.badge != null && a.badge !== 0 && <span data-slot="badge" aria-label={`${a.badge}개`}>{badgeText(a.badge)}</span>}
                                </>
                            )
                            return a.href ? (
                                <a key={a.label} data-slot="action" href={a.href} aria-label={a.label}>{inner}</a>
                            ) : (
                                <button key={a.label} type="button" data-slot="action" aria-label={a.label} onClick={a.onClick}>{inner}</button>
                            )
                        })}
                    </div>
                </div>
            </Container>
            {layout === 'double' && nav.length > 0 && (
                <div data-slot="row2">
                    <Container>
                        <nav data-slot="nav" aria-label="카테고리">
                            {nav.map((n) => (
                                <a
                                    key={n.key}
                                    href={n.href ?? '#'}
                                    aria-current={activeNav === n.key ? 'page' : undefined}
                                    aria-expanded={n.mega ? mega === n.key : undefined}
                                    data-highlight={n.highlight ? '' : undefined}
                                    onMouseEnter={() => setMega(n.mega ? n.key : null)}
                                    onFocus={() => setMega(n.mega ? n.key : null)}
                                    onClick={(e) => { if (onNavSelect) { e.preventDefault(); onNavSelect(n.key) } }}
                                >
                                    {n.label}
                                </a>
                            ))}
                        </nav>
                    </Container>
                </div>
            )}
            {megaItem?.mega && <MegaMenu categories={megaItem.mega} onClose={() => setMega(null)} />}
        </header>
    )
}

/* ───────── 꼬리말 ───────── */

export type SiteFooterProps = {
    benefits?: Array<{ icon: ReactNode; title: ReactNode; description?: ReactNode }>
    support?: { title?: ReactNode; phone: ReactNode; hours?: ReactNode; actions?: ReactNode }
    columns?: Array<{ title: ReactNode; links: Array<{ label: ReactNode; href?: string }> }>
    /** 사업자 정보 (전자상거래법 표시) — 접어서 보여 준다 */
    legal?: { summary?: ReactNode; items: Array<[ReactNode, ReactNode]>; copyright?: ReactNode; defaultOpen?: boolean }
    bottom?: ReactNode
    style?: CSSProperties
}

export const SiteFooter = ({ benefits, support, columns = [], legal, bottom, style }: SiteFooterProps) => (
    <footer data-ds-site-footer="" style={style}>
        <Container>
            {benefits && (
                <div data-slot="benefits">
                    {benefits.map((b, i) => (
                        <div key={i} data-slot="benefit">
                            <span>{b.icon}</span>
                            <span><b>{b.title}</b>{b.description}</span>
                        </div>
                    ))}
                </div>
            )}
            <div data-slot="main">
                {support && (
                    <div data-slot="support">
                        <h6>{support.title ?? '고객센터'}</h6>
                        <strong>{support.phone}</strong>
                        <div>{support.hours}</div>
                        {support.actions && <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>{support.actions}</div>}
                    </div>
                )}
                {columns.map((c, i) => (
                    <nav key={i} aria-label={typeof c.title === 'string' ? c.title : undefined}>
                        <h6>{c.title}</h6>
                        <ul>{c.links.map((l, j) => <li key={j}><a href={l.href ?? '#'}>{l.label}</a></li>)}</ul>
                    </nav>
                ))}
            </div>
            {legal && (
                <div data-slot="legal">
                    <details open={legal.defaultOpen}>
                        <summary>{legal.summary ?? '사업자 정보'} <LuChevronRight size={11} style={{ verticalAlign: 'middle' }} /></summary>
                        <dl>{legal.items.map(([k, v], i) => <Fragment key={i}><dt>{k}</dt><dd>{v}</dd></Fragment>)}</dl>
                    </details>
                    {legal.copyright && <div style={{ marginTop: 12 }}>{legal.copyright}</div>}
                </div>
            )}
            {bottom}
        </Container>
    </footer>
)
