import type { HTMLAttributes, Ref } from 'react'
import { ButtonGroupContext } from './ButtonGroup.js'
import { Button } from './Button.js'
import { Menu, type MenuItemDef } from '../overlay/Menu.js'
import { IconMoreHorizontal } from '../icons.js'
import type { Density } from '../types.js'

export type ToolbarSize = 'xs' | 'sm' | 'md'

export type ToolbarProps = {
    /** 안쪽 Button 의 기본 크기. density="compact" 면 xs. */
    size?: ToolbarSize
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
    overflowLabel?: string
    /** 스크롤해도 위에 붙어 있게 한다. */
    sticky?: boolean
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
    return (
        <ButtonGroupContext.Provider
            value={{ size: resolvedSize, appearance: 'ghost', tone: 'neutral' }}
        >
            <div
                role="toolbar"
                ref={ref}
                data-ds-toolbar=""
                data-density={density}
                data-overflow={overflow}
                data-sticky={sticky ? '' : undefined}
                {...rest}
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

export const ToolbarSeparator = (props: ToolbarSeparatorProps) => (
    <div
        role="separator"
        aria-orientation="vertical"
        data-ds-toolbar-separator=""
        {...props}
    />
)

export type ToolbarGroupProps = HTMLAttributes<HTMLDivElement>

export const ToolbarGroup = (props: ToolbarGroupProps) => (
    <div role="group" data-ds-toolbar-group="" {...props} />
)

/** 남은 공간을 채워 뒤의 항목을 오른쪽 끝으로 민다. */
export const ToolbarSpacer = () => <span aria-hidden data-ds-toolbar-spacer="" />
