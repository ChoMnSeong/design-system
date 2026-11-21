import { createContext, useContext, useId, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import type { BorderVariant } from './borderVariant.js'
import type { Density } from './types.js'
import { IconChevronDown } from './icons.js'

type Ctx = { type: 'single' | 'multiple'; open: string[]; toggle: (v: string) => void }
const AccCtx = createContext<Ctx | null>(null)

export type AccordionProps = {
    type?: 'single' | 'multiple'
    value?: string | string[]
    defaultValue?: string | string[]
    onValueChange?: (value: string | string[]) => void
    /** default: 구분선 · separated: 항목마다 카드 · flush: 선·여백 없이 */
    appearance?: 'default' | 'separated' | 'flush'
    /** @deprecated appearance 로 통합 */
    variant?: BorderVariant
    /** single 에서 열린 항목을 다시 눌러 닫을 수 있는지. 기본 true */
    collapsible?: boolean
    density?: Density
    children: ReactNode
    style?: CSSProperties
    className?: string
}

export const Accordion = ({
    type = 'single',
    value,
    defaultValue,
    onValueChange,
    appearance,
    variant,
    collapsible = true,
    density = 'default',
    children,
    style,
    className,
}: AccordionProps) => {
    const toArr = (v?: string | string[]) => (v === undefined ? [] : Array.isArray(v) ? v : v ? [v] : [])
    const [inner, setInner] = useState<string[]>(toArr(defaultValue))
    const open = value === undefined ? inner : toArr(value)
    const toggle = (v: string) => {
        let next: string[]
        if (type === 'single') next = open.includes(v) ? (collapsible ? [] : open) : [v]
        else next = open.includes(v) ? open.filter((x) => x !== v) : [...open, v]
        if (value === undefined) setInner(next)
        onValueChange?.(type === 'single' ? (next[0] ?? '') : next)
    }
    const app = appearance ?? (variant === 'ghost' ? 'flush' : 'default')
    return (
        <AccCtx.Provider value={{ type, open, toggle }}>
            <div data-ds-accordion="" data-appearance={app} data-density={density} className={className} style={style}>
                {children}
            </div>
        </AccCtx.Provider>
    )
}

export type AccordionItemProps = {
    value: string
    title: ReactNode
    icon?: ReactNode
    /** 제목 오른쪽 보조 (배지 · 개수) */
    extra?: ReactNode
    disabled?: boolean
    children: ReactNode
} & Omit<HTMLAttributes<HTMLDivElement>, 'title'>

export const AccordionItem = ({ value, title, icon, extra, disabled, children, ...rest }: AccordionItemProps) => {
    const ctx = useContext(AccCtx)!
    const isOpen = ctx.open.includes(value)
    const id = useId()
    return (
        <div data-ds-accordion-item="" data-open={isOpen ? '' : undefined} data-disabled={disabled ? '' : undefined} {...rest}>
            <h3 data-slot="heading">
                <button
                    type="button"
                    id={`${id}-h`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-p`}
                    disabled={disabled}
                    data-slot="trigger"
                    onClick={() => ctx.toggle(value)}
                >
                    {icon && <span data-slot="icon" aria-hidden>{icon}</span>}
                    <span data-slot="title">{title}</span>
                    {extra && <span data-slot="extra">{extra}</span>}
                    <IconChevronDown size={16} data-slot="chevron" aria-hidden />
                </button>
            </h3>
            <div id={`${id}-p`} role="region" aria-labelledby={`${id}-h`} hidden={!isOpen} data-slot="panel">
                {children}
            </div>
        </div>
    )
}
