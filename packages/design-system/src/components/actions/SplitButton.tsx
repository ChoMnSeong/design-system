import type { ReactNode } from 'react'
import { Button, type ButtonProps } from './Button.js'
import { ButtonGroup } from './ButtonGroup.js'
import { Menu, type MenuItemDef } from '../overlay/Menu.js'
import { IconChevronDown } from '../icons.js'

export type SplitButtonProps = Omit<ButtonProps, 'iconRight' | 'shape' | 'iconOnly'> & {
    /** 화살표 버튼이 여는 보조 동작. */
    items: MenuItemDef[]
    /** 화살표 버튼의 접근성 이름. */
    menuLabel?: string
    /** 메뉴를 화살표 버튼의 시작/끝 쪽에 맞춤 */
    menuAlign?: 'start' | 'end'
    /** 메뉴 최소 폭 (px) */
    menuMinWidth?: number
    /** 주 동작 버튼 내용 */
    children: ReactNode
}

/** 주 동작 버튼 + 보조 동작 메뉴. 주 동작은 onClick, 나머지는 items 로 받는다. */
export const SplitButton = ({
    items,
    menuLabel = '옵션 더 보기',
    menuAlign = 'end',
    menuMinWidth = 220,
    appearance,
    tone,
    size = 'md',
    variant,
    disabled,
    loading,
    fullWidth,
    children,
    ...rest
}: SplitButtonProps) => {
    const shared = { appearance, tone, size, variant }
    const iconSize = size === 'xs' ? 12 : size === 'lg' ? 20 : 16
    return (
        <ButtonGroup attached fullWidth={fullWidth}>
            <Button {...shared} disabled={disabled} loading={loading} {...rest}>
                {children}
            </Button>
            <Menu
                align={menuAlign}
                minWidth={menuMinWidth}
                items={items}
                trigger={
                    <Button
                        {...shared}
                        shape="square"
                        aria-label={menuLabel}
                        disabled={disabled || loading}
                        iconLeft={<IconChevronDown size={iconSize} />}
                        style={fullWidth ? { flex: '0 0 auto' } : undefined}
                    />
                }
            />
        </ButtonGroup>
    )
}
