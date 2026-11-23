import { useEffect, useRef } from 'react'
import { LuX } from 'react-icons/lu'
import {
    groupLabels,
    groupOrder,
    routes,
    type RouteId,
    type RouteMeta,
} from '../router/routes'

type Props = {
    current: RouteId
    onSelect: (id: RouteId) => void
    /** 모바일 서랍 열림 */
    open: boolean
    onClose: () => void
}

export const Sidebar = ({ current, onSelect, open, onClose }: Props) => {
    const ref = useRef<HTMLElement>(null)
    // 서랍이 열리면 지금 페이지 항목으로 포커스 · 스크롤
    useEffect(() => {
        if (!open) return
        const aside = ref.current
        if (!aside) return
        // 밀려 나오는 동안에는 포커스가 들어가지 않아서, 다 나온 뒤에 옮긴다
        const go = () => {
            const active = aside.querySelector<HTMLButtonElement>('[aria-current="page"]')
            active?.scrollIntoView({ block: 'center' })
            active?.focus({ preventScroll: true })
        }
        const onEnd = (e: TransitionEvent) => e.target === aside && e.propertyName === 'transform' && go()
        aside.addEventListener('transitionend', onEnd)
        const t = setTimeout(go, 300)
        return () => {
            aside.removeEventListener('transitionend', onEnd)
            clearTimeout(t)
        }
    }, [open])
    const grouped = groupOrder.map((g) => ({
        group: g,
        items: routes.filter((r) => r.group === g),
    }))

    return (
        <aside
            ref={ref}
            id="docs-sidebar"
            className="docs-sidebar"
            data-open={open ? '' : undefined}
            data-ds-scrollbar=""
            aria-label="문서 메뉴"
        >
            <div className="docs-sidebar-head">
                <span>메뉴</span>
                <button type="button" className="docs-menu-button" aria-label="메뉴 닫기" onClick={onClose}>
                    <LuX size={20} />
                </button>
            </div>
            {grouped.map(
                (g) =>
                    g.items.length > 0 && (
                        <NavGroup
                            key={g.group}
                            title={groupLabels[g.group as RouteMeta['group']]}
                        >
                            {g.items.map((r) => (
                                <NavItem
                                    key={r.id}
                                    active={current === r.id}
                                    onClick={() => onSelect(r.id)}
                                >
                                    {r.label}
                                </NavItem>
                            ))}
                        </NavGroup>
                    ),
            )}
        </aside>
    )
}

const NavGroup = ({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) => (
    <div style={{ marginBottom: '24px' }}>
        <div
            style={{
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--ds-color-foreground-tertiary)',
                marginBottom: '8px',
                paddingLeft: '10px',
            }}
        >
            {title}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {children}
        </div>
    </div>
)

const NavItem = ({
    active,
    onClick,
    children,
}: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
}) => (
    <button
        type="button"
        className="docs-nav-item"
        aria-current={active ? 'page' : undefined}
        onClick={onClick}
        style={{
            display: 'block',
            width: '100%',
            padding: '6px 10px',
            textAlign: 'left',
            background: active
                ? 'var(--ds-color-background-inset)'
                : 'transparent',
            color: active
                ? 'var(--ds-color-foreground-primary)'
                : 'var(--ds-color-foreground-secondary)',
            border: 'none',
            borderRadius: 'var(--ds-radius-sm)',
            fontSize: '13px',
            fontWeight: active ? 600 : 400,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 80ms ease',
        }}
    >
        {children}
    </button>
)
