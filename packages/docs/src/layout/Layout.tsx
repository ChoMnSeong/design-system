import { useEffect, useRef, useState, type ReactNode } from 'react'
import { TopNav } from './TopNav'
import { Sidebar } from './Sidebar'
import { ThemeDrawer } from './ThemeDrawer'
import type { RouteId } from '../router/routes'
import './layout.css'

type Props = {
    route: RouteId
    onNavigate: (id: RouteId) => void
    children: ReactNode
}

export const Layout = ({ route, onNavigate, children }: Props) => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const menuButton = useRef<HTMLButtonElement>(null)

    const restoreFocus = useRef(false)
    const closeMenu = (restore = true) => {
        restoreFocus.current = restore
        setMenuOpen(false)
    }
    // 뒤 화면의 inert 가 풀린 다음에 메뉴 버튼으로 포커스를 돌려준다
    useEffect(() => {
        if (!menuOpen && restoreFocus.current) {
            restoreFocus.current = false
            menuButton.current?.focus()
        }
    }, [menuOpen])

    // 모바일 서랍이 열려 있는 동안: Esc 로 닫기, 뒤 화면 스크롤 막기, 넓은 화면이 되면 닫기
    useEffect(() => {
        if (!menuOpen) return
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeMenu()
        const wide = window.matchMedia('(min-width: 900px)')
        const onWide = () => wide.matches && setMenuOpen(false)
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKey)
        wide.addEventListener('change', onWide)
        return () => {
            document.body.style.overflow = prev
            window.removeEventListener('keydown', onKey)
            wide.removeEventListener('change', onWide)
        }
    }, [menuOpen])

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'var(--ds-color-background-page)',
                color: 'var(--ds-color-foreground-primary)',
            }}
        >
            <TopNav
                inert={menuOpen}
                menuButtonRef={menuButton}
                menuOpen={menuOpen}
                onOpenMenu={() => setMenuOpen(true)}
                onOpenSettings={() => setDrawerOpen(true)}
            />
            <div className="docs-shell">
                <Sidebar
                    current={route}
                    open={menuOpen}
                    onClose={() => closeMenu()}
                    onSelect={(id) => {
                        onNavigate(id)
                        if (menuOpen) closeMenu(false)
                        window.scrollTo({ top: 0 })
                    }}
                />
                <main className="docs-main" inert={menuOpen || undefined}>{children}</main>
            </div>
            <button
                type="button"
                className="docs-backdrop"
                data-open={menuOpen ? '' : undefined}
                aria-hidden
                tabIndex={-1}
                onClick={() => closeMenu()}
            />
            <ThemeDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </div>
    )
}
