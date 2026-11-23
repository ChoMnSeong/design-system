import type { RefObject } from 'react'
import { LuMenu, LuSlidersHorizontal } from 'react-icons/lu'
import { IconMoon, IconSun, useDesignSystem } from '@ensnif/design-system'

type Props = {
    onOpenSettings: () => void
    onOpenMenu: () => void
    menuOpen: boolean
    menuButtonRef: RefObject<HTMLButtonElement | null>
    /** 모바일 서랍이 열린 동안 뒤 머리말을 막는다 */
    inert?: boolean
}

export const TopNav = ({ onOpenSettings, onOpenMenu, menuOpen, menuButtonRef, inert }: Props) => {
    const { theme, toggleMode } = useDesignSystem()
    return (
        <header
            className="docs-header"
            inert={inert || undefined}
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 24px',
                background: 'var(--ds-color-background-page)',
                borderBottom: '1px solid var(--ds-color-border-subtle)',
                backdropFilter: 'blur(8px)',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    minWidth: 0,
                }}
            >
                <button
                    ref={menuButtonRef}
                    type="button"
                    className="docs-menu-button"
                    aria-label="메뉴 열기"
                    aria-expanded={menuOpen}
                    aria-controls="docs-sidebar"
                    onClick={onOpenMenu}
                >
                    <LuMenu size={20} />
                </button>
                <div
                    style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        flex: 'none',
                        background: 'var(--ds-color-accent-background)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--ds-color-accent-color)',
                        fontWeight: 800,
                        fontSize: '12px',
                    }}
                >
                    L
                </div>
                <span
                    className="docs-brand-name"
                    style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--ds-color-foreground-primary)',
                    }}
                >
                    @ensnif/design-system
                </span>
            </div>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flex: 'none',
                }}
            >
                <button
                    onClick={toggleMode}
                    aria-label="Toggle mode"
                    style={iconButtonStyle}
                    title={`현재: ${theme.mode}`}
                >
                    {theme.mode === 'light' ? (
                        <IconSun size={16} />
                    ) : (
                        <IconMoon size={16} />
                    )}
                </button>
                <button
                    onClick={onOpenSettings}
                    aria-label="테마 설정"
                    style={{
                        ...primaryButtonStyle,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        minHeight: '34px',
                    }}
                >
                    <LuSlidersHorizontal size={14} className="docs-customize-icon" aria-hidden />
                    <span className="docs-customize-label">Customize</span>
                </button>
            </div>
        </header>
    )
}

const iconButtonStyle: React.CSSProperties = {
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    color: 'var(--ds-color-foreground-secondary)',
    border: '1px solid var(--ds-color-border-subtle)',
    borderRadius: 'var(--ds-radius-md)',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
}

const primaryButtonStyle: React.CSSProperties = {
    padding: '8px 14px',
    background: 'var(--ds-color-accent-background)',
    color: 'var(--ds-color-accent-color)',
    border: 'var(--ds-color-accent-border)',
    boxShadow: 'var(--ds-color-accent-shadow)',
    borderRadius: 'var(--ds-radius-md)',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
}
