import { createContext, useContext, useState, type HTMLAttributes, type KeyboardEvent, type MouseEvent as ReactMouseEvent, type ReactNode, type Ref } from 'react'
import type { BorderVariant } from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'
import { IconChevronDown } from './icons.js'
import { space, type Density, type SpaceToken, type Tone } from './types.js'

type CardCtx = { collapsible: boolean; collapsed: boolean; toggle: () => void; bodyId: string }
const CardContext = createContext<CardCtx | null>(null)

let cardSeq = 0

export type CardProps = {
    surface?: 'card' | 'panel' | 'overlay'
    variant?: BorderVariant
    /** 안쪽 여백. false 면 없음 (Card.Media 를 끝까지) */
    padding?: SpaceToken | false
    /** @deprecated padding 을 쓴다 */
    padded?: boolean
    /** 강조 색 (accent 띠 · 선택 · 배경) */
    tone?: Tone
    /** 톤 색 띠 위치 */
    accent?: 'none' | 'top' | 'left'
    density?: Density
    /** hover · 포커스 링 · 클릭. onClick 이 있으면 자동으로 켜진다 */
    interactive?: boolean
    selectable?: boolean
    selected?: boolean
    defaultSelected?: boolean
    onSelectedChange?: (selected: boolean) => void
    collapsible?: boolean
    collapsed?: boolean
    defaultCollapsed?: boolean
    onCollapsedChange?: (collapsed: boolean) => void
    /** 내용 대신 스켈레톤 */
    loading?: boolean
    disabled?: boolean
    ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

const PAD: Record<Density, SpaceToken> = { compact: 3, default: 5, comfortable: 6 }

export const Card = ({
    surface = 'card',
    variant: variantProp,
    padding,
    padded,
    tone,
    accent = 'none',
    density = 'default',
    interactive,
    selectable,
    selected: selectedProp,
    defaultSelected = false,
    onSelectedChange,
    collapsible,
    collapsed: collapsedProp,
    defaultCollapsed = false,
    onCollapsedChange,
    loading,
    disabled,
    onClick,
    onKeyDown,
    children,
    style,
    ref,
    ...rest
}: CardProps) => {
    const variant = useBorderVariant(variantProp)
    const [selInner, setSelInner] = useState(defaultSelected)
    const selected = selectedProp ?? selInner
    const [colInner, setColInner] = useState(defaultCollapsed)
    const collapsed = collapsedProp ?? colInner
    const [bodyId] = useState(() => `ds-card-${++cardSeq}`)
    const pad = padding === false || padded === false ? false : (padding ?? PAD[density])
    const clickable = !disabled && (interactive || !!onClick || selectable)

    const activate = (e: ReactMouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return
        if (selectable) {
            if (selectedProp === undefined) setSelInner(!selected)
            onSelectedChange?.(!selected)
        }
        onClick?.(e as ReactMouseEvent<HTMLDivElement>)
    }
    const toggle = () => {
        if (collapsedProp === undefined) setColInner(!collapsed)
        onCollapsedChange?.(!collapsed)
    }

    return (
        <CardContext.Provider value={{ collapsible: !!collapsible, collapsed, toggle, bodyId }}>
            <div
                ref={ref}
                data-ds-card=""
                data-surface={surface}
                data-variant={variant}
                data-tone={tone}
                data-accent={accent !== 'none' ? accent : undefined}
                data-density={density}
                data-flush={pad === false ? '' : undefined}
                data-interactive={clickable ? '' : undefined}
                data-selected={selected && selectable ? '' : undefined}
                data-disabled={disabled ? '' : undefined}
                data-collapsed={collapsed && collapsible ? '' : undefined}
                aria-disabled={disabled || undefined}
                aria-busy={loading || undefined}
                role={clickable && !collapsible ? (selectable ? 'checkbox' : 'button') : undefined}
                aria-checked={selectable && !collapsible ? selected : undefined}
                tabIndex={clickable && !collapsible ? 0 : undefined}
                onClick={clickable && !collapsible ? activate : onClick}
                onKeyDown={(e) => {
                    onKeyDown?.(e)
                    if (clickable && !collapsible && (e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
                        e.preventDefault()
                        activate(e)
                    }
                }}
                style={{ ...(pad === false ? { padding: 0 } : { padding: space(pad) }), ...style }}
                {...rest}
            >
                {loading ? (
                    <div data-slot="loading">
                        <span data-ds-skeleton="" style={{ height: 12, width: '50%' }} />
                        <span data-ds-skeleton="" style={{ height: 10, width: '85%' }} />
                        <span data-ds-skeleton="" style={{ height: 10, width: '65%' }} />
                    </div>
                ) : (
                    children
                )}
            </div>
        </CardContext.Provider>
    )
}

export type CardHeaderProps = {
    /** 오른쪽 버튼 영역 */
    actions?: ReactNode
    /** 제목 옆 보조 정보 (배지 · 개수) */
    extra?: ReactNode
} & HTMLAttributes<HTMLDivElement>

export const CardHeader = ({ actions, extra, children, ...rest }: CardHeaderProps) => {
    const ctx = useContext(CardContext)
    const main = (
        <div data-slot="main">
            {children}
            {extra && <span data-slot="extra">{extra}</span>}
        </div>
    )
    return (
        <div data-ds-card-header="" {...rest}>
            {ctx?.collapsible ? (
                <button type="button" data-slot="toggle" aria-expanded={!ctx.collapsed} aria-controls={ctx.bodyId} onClick={ctx.toggle}>
                    {main}
                    <IconChevronDown size={16} style={{ transform: ctx.collapsed ? 'rotate(-90deg)' : undefined }} aria-hidden />
                </button>
            ) : (
                main
            )}
            {actions && <div data-slot="actions">{actions}</div>}
        </div>
    )
}

export const CardTitle = ({ children, ...rest }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 data-ds-card-title="" {...rest}>
        {children}
    </h3>
)
export const CardDescription = (props: HTMLAttributes<HTMLParagraphElement>) => <p data-ds-card-description="" {...props} />

const useHidden = () => {
    const ctx = useContext(CardContext)
    return { hidden: !!ctx?.collapsible && ctx.collapsed, id: ctx?.bodyId }
}
export const CardBody = (props: HTMLAttributes<HTMLDivElement>) => {
    const { hidden, id } = useHidden()
    return <div data-ds-card-body="" id={id} hidden={hidden} {...props} />
}
export const CardFooter = (props: HTMLAttributes<HTMLDivElement>) => {
    const { hidden } = useHidden()
    return <div data-ds-card-footer="" hidden={hidden} {...props} />
}
/** 카드 여백을 무시하고 가장자리까지 닿는 영역 (이미지 · 차트) */
export const CardMedia = (props: HTMLAttributes<HTMLDivElement>) => <div data-ds-card-media="" {...props} />
/** 위에 구분선이 있는 내부 영역 */
export const CardSection = (props: HTMLAttributes<HTMLDivElement>) => {
    const { hidden } = useHidden()
    return <div data-ds-card-section="" hidden={hidden} {...props} />
}
