import {
    cloneElement,
    createContext,
    isValidElement,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type HTMLAttributes,
    type KeyboardEvent as ReactKeyboardEvent,
    type MouseEvent as ReactMouseEvent,
    type ReactElement,
    type ReactNode,
} from 'react'
import { Popover } from './Popover.js'
import { useOutsideClick } from './useOutsideClick.js'
import { IconCheck, IconChevronRight } from './icons.js'
import type { Tone } from './types.js'

/* ───────────────────────── 공통 ───────────────────────── */

type MenuCtx = {
    /** 메뉴 전체(하위 메뉴 포함)를 닫는다. */
    close: () => void
}
const MenuContext = createContext<MenuCtx | null>(null)

const ITEM_SELECTOR =
    '[data-ds-menu-item]:not(:disabled):not([aria-disabled="true"])'

/** 메뉴 안에서 ↑↓ Home End 로 항목 사이를 옮긴다. 하위 메뉴(다른 [data-ds-menu])의 항목은 건너뛴다. */
const onMenuKeyDown = (
    e: ReactKeyboardEvent<HTMLDivElement>,
    onEscape: () => void,
    onLeft?: () => void,
) => {
    const menu = e.currentTarget
    const items = Array.from(
        menu.querySelectorAll<HTMLElement>(ITEM_SELECTOR),
    ).filter((el) => el.closest('[data-ds-menu]') === menu)
    const idx = items.indexOf(document.activeElement as HTMLElement)
    const focus = (i: number) => items[(i + items.length) % items.length]?.focus()
    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault()
            focus(idx + 1)
            break
        case 'ArrowUp':
            e.preventDefault()
            focus(idx <= 0 ? items.length - 1 : idx - 1)
            break
        case 'Home':
            e.preventDefault()
            focus(0)
            break
        case 'End':
            e.preventDefault()
            focus(items.length - 1)
            break
        case 'Escape':
            e.preventDefault()
            e.stopPropagation()
            onEscape()
            break
        case 'ArrowLeft':
            if (onLeft) {
                e.preventDefault()
                e.stopPropagation()
                onLeft()
            }
            break
        case 'Tab':
            onEscape()
            break
    }
}

const focusFirst = (menu: HTMLElement | null) => {
    if (!menu) return
    const first = Array.from(
        menu.querySelectorAll<HTMLElement>(ITEM_SELECTOR),
    ).find((el) => el.closest('[data-ds-menu]') === menu)
    ;(first ?? menu).focus()
}

const assignRef = <T,>(ref: unknown, node: T) => {
    if (typeof ref === 'function') ref(node)
    else if (ref && typeof ref === 'object' && 'current' in ref) {
        ;(ref as { current: T }).current = node
    }
}

/* ───────────────────────── 항목 정의 ───────────────────────── */

/** items prop 으로 메뉴를 그릴 때 쓰는 항목 정의 (SplitButton · ContextMenu · Toolbar overflow 공용). */
export type MenuItemDef =
    | {
          type?: 'item'
          label: ReactNode
          icon?: ReactNode
          shortcut?: ReactNode
          tone?: Tone
          disabled?: boolean
          onSelect?: () => void
      }
    | { type: 'separator' }
    | { type: 'label'; label: ReactNode }

export const renderMenuItems = (items: MenuItemDef[]) =>
    items.map((it, i) => {
        if (it.type === 'separator') return <MenuSeparator key={i} />
        if (it.type === 'label') return <MenuLabel key={i}>{it.label}</MenuLabel>
        return (
            <MenuItem
                key={i}
                icon={it.icon}
                shortcut={it.shortcut}
                tone={it.tone}
                disabled={it.disabled}
                onClick={() => it.onSelect?.()}
            >
                {it.label}
            </MenuItem>
        )
    })

/* ───────────────────────── Menu ───────────────────────── */

export type MenuPlacement = 'auto' | 'top' | 'bottom' | 'left' | 'right'

export type MenuProps = {
    trigger: ReactElement<any>
    /** children 대신 항목 정의로 그릴 수 있다. */
    items?: MenuItemDef[]
    children?: ReactNode
    align?: 'start' | 'center' | 'end'
    placement?: MenuPlacement
    minWidth?: number
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    /** 메뉴의 접근성 이름. 없으면 트리거를 가리킨다. */
    'aria-label'?: string
}

let menuSeq = 0
const useMenuId = () => {
    const ref = useRef<string | null>(null)
    if (ref.current === null) ref.current = `ds-menu-${++menuSeq}`
    return ref.current
}

export const Menu = ({
    trigger,
    items,
    children,
    align = 'start',
    placement = 'auto',
    minWidth = 200,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    'aria-label': ariaLabel,
}: MenuProps) => {
    const [inner, setInner] = useState(defaultOpen)
    const open = openProp ?? inner
    const setOpen = useCallback(
        (next: boolean) => {
            if (openProp === undefined) setInner(next)
            onOpenChange?.(next)
        },
        [openProp, onOpenChange],
    )
    const id = useMenuId()
    const triggerRef = useRef<HTMLElement | null>(null)
    const menuRef = useRef<HTMLDivElement | null>(null)
    /** 키보드로 열었으면 첫 항목에, 마우스로 열었으면 메뉴 자체에 포커스한다. */
    const openedByKey = useRef(false)

    useOutsideClick([menuRef, triggerRef], () => setOpen(false), open)

    useEffect(() => {
        if (!open) return
        const t = setTimeout(() => {
            if (openedByKey.current) focusFirst(menuRef.current)
            else menuRef.current?.focus()
        }, 0)
        return () => clearTimeout(t)
    }, [open])

    const close = useCallback(() => {
        setOpen(false)
        triggerRef.current?.focus()
    }, [setOpen])

    const child = isValidElement(trigger) ? trigger : null
    if (!child) return <>{trigger}</>
    const childProps = (child.props ?? {}) as Record<string, unknown>

    const enhanced = cloneElement(child, {
        ref: (node: HTMLElement | null) => {
            triggerRef.current = node
            assignRef((child as { ref?: unknown }).ref, node)
        },
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': open ? id : undefined,
        onClick: (e: ReactMouseEvent) => {
            ;(childProps.onClick as ((e: unknown) => void) | undefined)?.(e)
            openedByKey.current = e.detail === 0
            setOpen(!open)
        },
        onKeyDown: (e: ReactKeyboardEvent) => {
            ;(childProps.onKeyDown as ((e: unknown) => void) | undefined)?.(e)
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault()
                openedByKey.current = true
                setOpen(true)
            }
        },
    } as never)

    return (
        <MenuContext.Provider value={{ close }}>
            {enhanced}
            <Popover
                open={open}
                triggerRef={triggerRef}
                offset={6}
                align={align}
                placement={placement}
                minWidth={minWidth}
            >
                <div
                    ref={menuRef}
                    id={id}
                    role="menu"
                    tabIndex={-1}
                    aria-label={ariaLabel}
                    data-ds-menu=""
                    style={{ minWidth: `${minWidth}px` }}
                    onKeyDown={(e) => onMenuKeyDown(e, close)}
                >
                    {items ? renderMenuItems(items) : children}
                </div>
            </Popover>
        </MenuContext.Provider>
    )
}

/* ───────────────────────── 항목 ───────────────────────── */

type ItemBase = {
    icon?: ReactNode
    shortcut?: ReactNode
    tone?: Tone
    /** @deprecated tone="danger" 를 쓴다. */
    danger?: boolean
    disabled?: boolean
}

export type MenuItemProps = ItemBase & HTMLAttributes<HTMLButtonElement>

export const MenuItem = ({
    icon,
    shortcut,
    tone,
    danger,
    disabled,
    children,
    onClick,
    ...rest
}: MenuItemProps) => {
    const ctx = useContext(MenuContext)
    return (
        <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            disabled={disabled}
            data-ds-menu-item=""
            data-tone={tone ?? (danger ? 'danger' : undefined)}
            onClick={(e) => {
                onClick?.(e)
                if (!e.defaultPrevented) ctx?.close()
            }}
            {...rest}
        >
            {icon && (
                <span data-slot="icon" aria-hidden>
                    {icon}
                </span>
            )}
            <span data-slot="label">{children}</span>
            {shortcut && <span data-slot="shortcut">{shortcut}</span>}
        </button>
    )
}

export type MenuCheckboxItemProps = Omit<ItemBase, 'icon' | 'danger'> & {
    checked?: boolean
    defaultChecked?: boolean
    onCheckedChange?: (checked: boolean) => void
    /** 선택 후 메뉴를 닫을지. 표시 열처럼 여러 개를 연달아 고르는 경우가 많아 기본은 열어 둔다. */
    closeOnSelect?: boolean
} & Omit<HTMLAttributes<HTMLButtonElement>, 'onChange'>

export const MenuCheckboxItem = ({
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    closeOnSelect = false,
    shortcut,
    tone,
    disabled,
    children,
    onClick,
    ...rest
}: MenuCheckboxItemProps) => {
    const ctx = useContext(MenuContext)
    const [inner, setInner] = useState(defaultChecked)
    const checked = checkedProp ?? inner
    return (
        <button
            type="button"
            role="menuitemcheckbox"
            aria-checked={checked}
            tabIndex={-1}
            disabled={disabled}
            data-ds-menu-item=""
            data-tone={tone}
            onClick={(e) => {
                onClick?.(e)
                if (e.defaultPrevented) return
                if (checkedProp === undefined) setInner(!checked)
                onCheckedChange?.(!checked)
                if (closeOnSelect) ctx?.close()
            }}
            {...rest}
        >
            <span data-slot="check" aria-hidden>
                {checked && <IconCheck size={11} />}
            </span>
            <span data-slot="label">{children}</span>
            {shortcut && <span data-slot="shortcut">{shortcut}</span>}
        </button>
    )
}

type RadioCtx = { value: string | undefined; select: (v: string) => void }
const RadioContext = createContext<RadioCtx | null>(null)

export type MenuRadioGroupProps = {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    closeOnSelect?: boolean
    children: ReactNode
} & Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>

export const MenuRadioGroup = ({
    value: valueProp,
    defaultValue,
    onValueChange,
    closeOnSelect = false,
    children,
    ...rest
}: MenuRadioGroupProps) => {
    const ctx = useContext(MenuContext)
    const [inner, setInner] = useState(defaultValue)
    const value = valueProp ?? inner
    return (
        <RadioContext.Provider
            value={{
                value,
                select: (v) => {
                    if (valueProp === undefined) setInner(v)
                    onValueChange?.(v)
                    if (closeOnSelect) ctx?.close()
                },
            }}
        >
            <div role="group" style={{ display: 'contents' }} {...rest}>
                {children}
            </div>
        </RadioContext.Provider>
    )
}

export type MenuRadioItemProps = Omit<ItemBase, 'icon' | 'danger'> & {
    value: string
} & HTMLAttributes<HTMLButtonElement>

export const MenuRadioItem = ({
    value,
    shortcut,
    tone,
    disabled,
    children,
    onClick,
    ...rest
}: MenuRadioItemProps) => {
    const group = useContext(RadioContext)
    const checked = group?.value === value
    return (
        <button
            type="button"
            role="menuitemradio"
            aria-checked={checked}
            tabIndex={-1}
            disabled={disabled}
            data-ds-menu-item=""
            data-tone={tone}
            onClick={(e) => {
                onClick?.(e)
                if (!e.defaultPrevented) group?.select(value)
            }}
            {...rest}
        >
            <span data-slot="check" aria-hidden />
            <span data-slot="label">{children}</span>
            {shortcut && <span data-slot="shortcut">{shortcut}</span>}
        </button>
    )
}

/* ───────────────────────── 하위 메뉴 ───────────────────────── */

export type MenuSubProps = {
    label: ReactNode
    icon?: ReactNode
    disabled?: boolean
    items?: MenuItemDef[]
    children?: ReactNode
    minWidth?: number
}

export const MenuSub = ({
    label,
    icon,
    disabled,
    items,
    children,
    minWidth = 180,
}: MenuSubProps) => {
    const parent = useContext(MenuContext)
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const menuRef = useRef<HTMLDivElement | null>(null)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const byKey = useRef(false)

    const openSoon = (v: boolean) => {
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => setOpen(v), v ? 80 : 160)
    }
    useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current)
    }, [])
    useEffect(() => {
        if (open && byKey.current) {
            const t = setTimeout(() => focusFirst(menuRef.current), 0)
            return () => clearTimeout(t)
        }
    }, [open])

    const closeSub = () => {
        setOpen(false)
        triggerRef.current?.focus()
    }

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                role="menuitem"
                aria-haspopup="menu"
                aria-expanded={open}
                tabIndex={-1}
                disabled={disabled}
                data-ds-menu-item=""
                data-open={open ? '' : undefined}
                onMouseEnter={() => {
                    byKey.current = false
                    openSoon(true)
                }}
                onMouseLeave={() => openSoon(false)}
                onClick={() => {
                    byKey.current = false
                    setOpen(true)
                }}
                onKeyDown={(e) => {
                    if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        byKey.current = true
                        setOpen(true)
                    }
                }}
            >
                {icon && (
                    <span data-slot="icon" aria-hidden>
                        {icon}
                    </span>
                )}
                <span data-slot="label">{label}</span>
                <span data-slot="shortcut" aria-hidden>
                    <IconChevronRight size={14} />
                </span>
            </button>
            <MenuContext.Provider
                value={{
                    close: () => {
                        setOpen(false)
                        parent?.close()
                    },
                }}
            >
                <Popover
                    open={open}
                    triggerRef={triggerRef}
                    offset={4}
                    placement="right"
                    align="start"
                    minWidth={minWidth}
                >
                    <div
                        ref={menuRef}
                        role="menu"
                        tabIndex={-1}
                        data-ds-menu=""
                        style={{ minWidth: `${minWidth}px`, marginTop: '-6px' }}
                        onMouseEnter={() => openSoon(true)}
                        onMouseLeave={() => openSoon(false)}
                        onMouseDown={(e) => e.stopPropagation()}
                        onKeyDown={(e) => onMenuKeyDown(e, closeSub, closeSub)}
                    >
                        {items ? renderMenuItems(items) : children}
                    </div>
                </Popover>
            </MenuContext.Provider>
        </>
    )
}

/* ───────────────────────── 구분선 · 라벨 ───────────────────────── */

export const MenuSeparator = (props: HTMLAttributes<HTMLDivElement>) => (
    <div role="separator" data-ds-menu-separator="" {...props} />
)

export const MenuLabel = (props: HTMLAttributes<HTMLDivElement>) => (
    <div role="presentation" data-ds-menu-label="" {...props} />
)

/* ───────────────────────── ContextMenu ───────────────────────── */

export type ContextMenuProps = {
    /** 우클릭 대상. */
    children: ReactElement<any>
    items?: MenuItemDef[]
    /** items 대신 메뉴 내용을 직접 그린다. */
    content?: ReactNode
    minWidth?: number
    disabled?: boolean
    onOpenChange?: (open: boolean) => void
}

export const ContextMenu = ({
    children,
    items,
    content,
    minWidth = 200,
    disabled,
    onOpenChange,
}: ContextMenuProps) => {
    const [point, setPoint] = useState<{ x: number; y: number } | null>(null)
    const anchorRef = useRef<HTMLSpanElement | null>(null)
    const menuRef = useRef<HTMLDivElement | null>(null)
    const targetRef = useRef<HTMLElement | null>(null)
    const open = point !== null

    const setOpen = (p: { x: number; y: number } | null) => {
        setPoint(p)
        onOpenChange?.(p !== null)
    }
    const close = () => {
        setOpen(null)
        targetRef.current?.focus?.()
    }

    useOutsideClick([menuRef], () => setOpen(null), open)
    useEffect(() => {
        if (!open) return
        const t = setTimeout(() => menuRef.current?.focus(), 0)
        const onScroll = () => setOpen(null)
        window.addEventListener('scroll', onScroll, { capture: true, passive: true })
        return () => {
            clearTimeout(t)
            window.removeEventListener('scroll', onScroll, { capture: true })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    if (!isValidElement(children)) return <>{children}</>
    const childProps = (children.props ?? {}) as Record<string, unknown>
    const enhanced = cloneElement(children, {
        ref: (node: HTMLElement | null) => {
            targetRef.current = node
            assignRef((children as { ref?: unknown }).ref, node)
        },
        onContextMenu: (e: ReactMouseEvent) => {
            ;(childProps.onContextMenu as ((e: unknown) => void) | undefined)?.(e)
            if (disabled || e.defaultPrevented) return
            e.preventDefault()
            setOpen({ x: e.clientX, y: e.clientY })
        },
        onKeyDown: (e: ReactKeyboardEvent) => {
            ;(childProps.onKeyDown as ((e: unknown) => void) | undefined)?.(e)
            // 키보드 사용자: Shift+F10 / 메뉴 키로 연다
            if (disabled) return
            if ((e.shiftKey && e.key === 'F10') || e.key === 'ContextMenu') {
                e.preventDefault()
                const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
                setOpen({ x: r.left + 12, y: r.bottom })
            }
        },
    } as never)

    return (
        <MenuContext.Provider value={{ close }}>
            {enhanced}
            {open && (
                <span
                    ref={anchorRef}
                    aria-hidden
                    style={{
                        position: 'fixed',
                        left: point.x,
                        top: point.y,
                        width: 0,
                        height: 0,
                        pointerEvents: 'none',
                    }}
                />
            )}
            <Popover
                open={open}
                triggerRef={anchorRef}
                offset={2}
                placement="bottom"
                minWidth={minWidth}
            >
                <div
                    ref={menuRef}
                    role="menu"
                    tabIndex={-1}
                    data-ds-menu=""
                    style={{ minWidth: `${minWidth}px` }}
                    onKeyDown={(e) => onMenuKeyDown(e, close)}
                >
                    {items ? renderMenuItems(items) : content}
                </div>
            </Popover>
        </MenuContext.Provider>
    )
}
