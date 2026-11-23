import { useCallback, useEffect, useRef, type HTMLAttributes, type KeyboardEvent, type Ref } from 'react'
import { ButtonGroupContext } from './ButtonGroup.js'
import { Button } from './Button.js'
import { Menu, type MenuItemDef } from '../overlay/Menu.js'
import { IconMoreHorizontal } from '../icons.js'
import type { Density } from '../types.js'

export type ToolbarSize = 'xs' | 'sm' | 'md'

const ITEM = 'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [role="button"]:not([aria-disabled="true"]), [role="switch"], [role="checkbox"], [role="combobox"]'

export type ToolbarProps = {
    /** 안쪽 Button 의 기본 크기. density="compact" 면 xs. */
    size?: ToolbarSize
    /** size 가 없을 때 크기 결정. compact xs · default sm · comfortable md */
    density?: Density
    /**
     * 공간이 모자랄 때.
     * - wrap: 다음 줄로
     * - scroll: 가로 스크롤
     * - menu: 한 줄로 자르고 overflowItems 를 끝의 ··· 메뉴로 보여 준다
     */
    overflow?: 'wrap' | 'scroll' | 'menu'
    /** overflow="menu" 일 때 ··· 메뉴 항목. */
    overflowItems?: MenuItemDef[]
    /** ··· 메뉴 버튼의 접근성 이름 */
    overflowLabel?: string
    /** 스크롤해도 위에 붙어 있게 한다. */
    sticky?: boolean
    /** DOM 요소 ref */
    ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

/** 작업 버튼 묶음. 안쪽 Button 은 기본으로 ghost · neutral · sm 이 된다. */
export const Toolbar = ({
    size,
    density = 'default',
    overflow = 'wrap',
    overflowItems,
    overflowLabel = '더 보기',
    sticky,
    ref,
    children,
    ...rest
}: ToolbarProps) => {
    const resolvedSize: ToolbarSize =
        size ?? (density === 'compact' ? 'xs' : density === 'comfortable' ? 'md' : 'sm')
    const iconSize = resolvedSize === 'xs' ? 14 : resolvedSize === 'md' ? 20 : 16

    // 툴바 키보드 (WAI-ARIA toolbar): Tab 으로 한 번 들어오고 ← → · Home · End 로 항목 사이를 옮긴다
    const boxRef = useRef<HTMLDivElement | null>(null)
    const current = useRef(0)
    const items = () =>
        boxRef.current ? Array.from(boxRef.current.querySelectorAll<HTMLElement>(ITEM)).filter((el) => !el.closest('[data-ds-toolbar] [role="menu"]') && el.offsetParent !== null) : []
    const roving = useCallback(() => {
        const list = items()
        if (!list.length) return
        if (current.current >= list.length) current.current = list.length - 1
        list.forEach((el, i) => (el.tabIndex = i === current.current ? 0 : -1))
    }, [])
    useEffect(() => {
        roving()
        const box = boxRef.current
        if (!box) return
        const mo = new MutationObserver(roving)
        mo.observe(box, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled'] })
        return () => mo.disconnect()
    }, [roving])
    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        rest.onKeyDown?.(e)
        if (e.defaultPrevented) return
        const t = e.target as HTMLElement
        // 글자 입력칸 안의 화살표는 커서 이동이 우선
        if (t.matches('input:not([type=checkbox]):not([type=radio]), textarea, select, [contenteditable="true"]')) return
        const list = items()
        const i = list.indexOf(t)
        if (i < 0) return
        const next = e.key === 'ArrowRight' ? (i + 1) % list.length : e.key === 'ArrowLeft' ? (i - 1 + list.length) % list.length : e.key === 'Home' ? 0 : e.key === 'End' ? list.length - 1 : -1
        if (next < 0) return
        e.preventDefault()
        current.current = next
        roving()
        list[next]!.focus()
    }

    return (
        <ButtonGroupContext.Provider
            value={{ size: resolvedSize, appearance: 'ghost', tone: 'neutral' }}
        >
            <div
                role="toolbar"
                ref={(n) => {
                    boxRef.current = n
                    if (typeof ref === 'function') ref(n)
                    else if (ref) (ref as { current: HTMLDivElement | null }).current = n
                }}
                data-ds-toolbar=""
                data-density={density}
                data-overflow={overflow}
                data-sticky={sticky ? '' : undefined}
                {...rest}
                onKeyDown={onKeyDown}
                onFocus={(e) => {
                    rest.onFocus?.(e)
                    const i = items().indexOf(e.target as HTMLElement)
                    if (i >= 0 && i !== current.current) {
                        current.current = i
                        roving()
                    }
                }}
            >
                {children}
                {overflow === 'menu' && overflowItems && overflowItems.length > 0 && (
                    <span data-ds-toolbar-overflow="">
                        <Menu
                            align="end"
                            items={overflowItems}
                            trigger={
                                <Button
                                    shape="square"
                                    aria-label={overflowLabel}
                                    iconLeft={<IconMoreHorizontal size={iconSize} />}
                                />
                            }
                        />
                    </span>
                )}
            </div>
        </ButtonGroupContext.Provider>
    )
}

export type ToolbarSeparatorProps = HTMLAttributes<HTMLDivElement>

/** 툴바 항목 사이 세로 구분선 */
export const ToolbarSeparator = (props: ToolbarSeparatorProps) => (
    <div
        role="separator"
        aria-orientation="vertical"
        data-ds-toolbar-separator=""
        {...props}
    />
)

export type ToolbarGroupProps = HTMLAttributes<HTMLDivElement>

/** 툴바 안에서 관련 항목을 묶는 그룹 */
export const ToolbarGroup = (props: ToolbarGroupProps) => (
    <div role="group" data-ds-toolbar-group="" {...props} />
)

/** 남은 공간을 채워 뒤의 항목을 오른쪽 끝으로 민다. */
export const ToolbarSpacer = () => <span aria-hidden data-ds-toolbar-spacer="" />
