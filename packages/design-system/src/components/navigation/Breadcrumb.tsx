import { Fragment, type HTMLAttributes, type ReactNode } from 'react'
import { IconChevronDown, IconMoreHorizontal } from '../icons.js'
import { Menu, type MenuItemDef } from '../overlay/Menu.js'

export type BreadcrumbItem = {
    /** 표시 이름 */
    label: ReactNode
    /** 링크 주소 (있으면 <a>) */
    href?: string
    /** 항목을 누를 때 */
    onClick?: () => void
    /** 이름 앞 아이콘 */
    icon?: ReactNode
    /** 형제 페이지로 바로 이동하는 드롭다운 */
    menu?: MenuItemDef[]
}

export type BreadcrumbProps = {
    /** 경로 항목 (마지막이 현재 페이지) */
    items: BreadcrumbItem[]
    /** 항목 사이 구분자 */
    separator?: ReactNode
    /** 넘으면 가운데를 ··· 로 접는다 (처음 1개 + 마지막 maxItems-1 개) */
    maxItems?: number
    /** 글자 sm 12 · md 13 (px) */
    size?: 'sm' | 'md'
    /** 라우터 링크로 바꿔 그림 (항목, 내용). 마지막 항목 제외 */
    renderLink?: (item: BreadcrumbItem, children: ReactNode) => ReactNode
} & HTMLAttributes<HTMLElement>

/** 현재 페이지까지의 경로 표시 */
export const Breadcrumb = ({ items, separator = '/', maxItems, size = 'md', renderLink, ...rest }: BreadcrumbProps) => {
    const collapse = maxItems && items.length > maxItems
    const head = collapse ? items.slice(0, 1) : items
    const hiddenItems = collapse ? items.slice(1, items.length - (maxItems - 1)) : []
    const tail = collapse ? items.slice(items.length - (maxItems - 1)) : []
    const shown: Array<BreadcrumbItem | 'more'> = collapse ? [...head, 'more', ...tail] : head

    const render = (it: BreadcrumbItem, last: boolean) => {
        const content = (
            <>
                {it.icon && <span data-slot="icon" aria-hidden>{it.icon}</span>}
                {it.label}
            </>
        )
        let node: ReactNode
        if (last) node = <span data-slot="current" aria-current="page">{content}</span>
        else if (renderLink) node = renderLink(it, content)
        else if (it.href) node = <a data-slot="link" href={it.href} onClick={it.onClick}>{content}</a>
        else if (it.onClick) node = <button type="button" data-slot="link" onClick={it.onClick}>{content}</button>
        else node = <span data-slot="text">{content}</span>
        if (!it.menu?.length) return node
        return (
            <Menu
                items={it.menu}
                trigger={
                    <button type="button" data-slot={last ? 'current-menu' : 'link'} aria-current={last ? 'page' : undefined}>
                        {content}
                        <IconChevronDown size={12} aria-hidden />
                    </button>
                }
            />
        )
    }

    return (
        <nav aria-label="경로" data-ds-breadcrumb="" data-size={size} {...rest}>
            <ol>
                {shown.map((it, i) => (
                    <Fragment key={i}>
                        {i > 0 && <li data-slot="sep" aria-hidden>{separator}</li>}
                        <li>
                            {it === 'more' ? (
                                <Menu
                                    items={hiddenItems.map((h) => ({ label: h.label, icon: h.icon, onSelect: () => (h.onClick ? h.onClick() : h.href ? (window.location.href = h.href) : undefined) }))}
                                    trigger={
                                        <button type="button" data-slot="more" aria-label={`숨겨진 경로 ${hiddenItems.length}개`}>
                                            <IconMoreHorizontal size={14} />
                                        </button>
                                    }
                                />
                            ) : (
                                render(it, i === shown.length - 1)
                            )}
                        </li>
                    </Fragment>
                ))}
            </ol>
        </nav>
    )
}
