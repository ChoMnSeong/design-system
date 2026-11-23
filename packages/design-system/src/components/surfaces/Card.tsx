import { createContext, useContext, useState, type CSSProperties, type HTMLAttributes, type KeyboardEvent, type MouseEvent as ReactMouseEvent, type ReactNode, type Ref } from 'react'
import type { BorderVariant } from '../borderVariant.js'
import { useBorderVariant } from '../../provider/useDesignSystem.js'
import { IconChevronDown } from '../icons.js'
import { space, type Density, type SpaceToken, type Tone } from '../types.js'

type CardCtx = { collapsible: boolean; collapsed: boolean; toggle: () => void; bodyId: string }
const CardContext = createContext<CardCtx | null>(null)

let cardSeq = 0

export type CardSurface = 'card' | 'panel' | 'overlay' | 'inverse' | 'tinted' | 'nested' | 'media' | 'glass'

export type CardProps = {
    /** card · panel · overlay · inverse(강조 1장) · tinted(tone 배경) · nested(회색 껍데기) · media(사진 배경) · glass */
    surface?: CardSurface
    /** surface="media": 사진과 아래쪽 어둡게 */
    media?: { src: string; alt?: string; position?: string; scrim?: number }
    /** surface="glass": 흐림 정도와 뒤에 깔 배경 */
    glass?: { blur?: number; backdrop?: ReactNode }
    /** 목표 밖일 때만 톤을 깐다 (tinted 를 조건부로) */
    status?: Tone
    /** 테두리 방식. 없으면 Provider 설정 */
    variant?: BorderVariant
    /** 안쪽 여백. false 면 없음 (Card.Media 를 끝까지) */
    padding?: SpaceToken | false
    /** @deprecated padding 을 쓴다 */
    padded?: boolean
    /** 강조 색 (accent 띠 · 선택 · 배경) */
    tone?: Tone
    /** 톤 색 띠 위치 */
    accent?: 'none' | 'top' | 'left'
    /** touch: 현장 태블릿용 (액션 44px) */
    density?: Density | 'touch'
    /** hover · 포커스 링 · 클릭. onClick 이 있으면 자동으로 켜진다 */
    interactive?: boolean
    /** 눌러서 선택을 켜고 끈다 (체크박스 역할) */
    selectable?: boolean
    /** 제어 모드 선택 */
    selected?: boolean
    /** 비제어 초기 선택 */
    defaultSelected?: boolean
    /** 선택이 바뀔 때 (새 상태) */
    onSelectedChange?: (selected: boolean) => void
    /** 머리말을 눌러 본문을 접는다 */
    collapsible?: boolean
    /** 제어 모드 접힘 */
    collapsed?: boolean
    /** 비제어 초기 접힘 */
    defaultCollapsed?: boolean
    /** 접힘이 바뀔 때 (새 상태) */
    onCollapsedChange?: (collapsed: boolean) => void
    /** 내용 대신 스켈레톤 */
    loading?: boolean
    /** 클릭 · 선택을 막는다 */
    disabled?: boolean
    /** DOM 요소 ref */
    ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

const PAD: Record<Density | 'touch', SpaceToken> = { compact: 3, default: 5, comfortable: 6, touch: 5 }

type CardComponent = ((props: CardProps) => ReactNode) & {
    Eyebrow: typeof CardEyebrow; Actions: typeof CardActions; Metric: typeof CardMetric; Delta: typeof CardDelta; Visual: typeof CardVisual; Note: typeof CardNote
    Header: typeof CardHeader; Title: typeof CardTitle; Description: typeof CardDescription; Body: typeof CardBody; Footer: typeof CardFooter; Media: typeof CardMedia; Section: typeof CardSection
}

/** 내용을 묶는 카드 표면. 선택 · 접기 · 로딩 표시 */
export const Card: CardComponent = (({
    surface = 'card',
    media,
    glass,
    status,
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
                data-surface={status ? 'tinted' : surface}
                data-variant={variant}
                data-tone={status ?? tone}
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
                style={{
                    ...(pad === false ? { padding: 0 } : { padding: space(pad) }),
                    ...(pad !== false ? ({ '--_pad': space(pad) } as CSSProperties) : null),
                    ...(surface === 'media' && media ? ({ '--_img': `url("${media.src}")`, '--_pos': media.position ?? 'center', '--_scrim': media.scrim ?? 0.8 } as CSSProperties) : null),
                    ...(surface === 'glass' && glass?.blur !== undefined ? ({ '--_blur': `${glass.blur}px` } as CSSProperties) : null),
                    ...style,
                }}
                {...rest}
            >
                {surface === 'media' && media?.alt && <span data-ds-sr-only="">{media.alt}</span>}
                {surface === 'glass' && glass?.backdrop && <div data-slot="glass-backdrop" aria-hidden>{glass.backdrop}</div>}
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
}) as CardComponent

export type CardHeaderProps = {
    /** 오른쪽 버튼 영역 */
    actions?: ReactNode
    /** 제목 옆 보조 정보 (배지 · 개수) */
    extra?: ReactNode
} & HTMLAttributes<HTMLDivElement>

/** 카드 머리말. collapsible 카드면 눌러서 접는다 */
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

/** 카드 제목 (h3) */
export const CardTitle = ({ children, ...rest }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 data-ds-card-title="" {...rest}>
        {children}
    </h3>
)
/** 카드 설명 문단 */
export const CardDescription = (props: HTMLAttributes<HTMLParagraphElement>) => <p data-ds-card-description="" {...props} />

const useHidden = () => {
    const ctx = useContext(CardContext)
    return { hidden: !!ctx?.collapsible && ctx.collapsed, id: ctx?.bodyId }
}
/** 카드 본문. 접히면 숨는다 */
export const CardBody = (props: HTMLAttributes<HTMLDivElement>) => {
    const { hidden, id } = useHidden()
    return <div data-ds-card-body="" id={id} hidden={hidden} {...props} />
}
/** 카드 아래 영역. 접히면 숨는다 */
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

/* ── 대시보드 카드 슬롯 ── */

/** 아이콘 + 짧은 라벨 */
export const CardEyebrow = ({ icon, children, ...rest }: { /** 라벨 앞 아이콘 */ icon?: ReactNode } & HTMLAttributes<HTMLDivElement>) => (
    <div data-ds-card-eyebrow="" {...rest}>
        {icon && <span aria-hidden>{icon}</span>}
        {children}
    </div>
)

/** 오른쪽 위 아이콘 버튼 묶음 */
export const CardActions = (props: HTMLAttributes<HTMLDivElement>) => <div data-ds-card-actions="" {...props} />

export type CardMetricProps = {
    /** 값. 숫자면 천 단위 구분 */
    value: number | string
    /** 값 뒤 작은 단위 */
    unit?: ReactNode
    /** sm 24 · md 32 · lg 40 */
    size?: 'sm' | 'md' | 'lg'
    /** 숫자 서식 (toLocaleString 옵션) */
    format?: Intl.NumberFormatOptions
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

/** 큰 숫자 + 작은 단위 */
export const CardMetric = ({ value, unit, size = 'md', format, ...rest }: CardMetricProps) => (
    <div data-ds-card-metric="" data-size={size} {...rest}>
        <b>{typeof value === 'number' ? value.toLocaleString('ko-KR', format) : value}</b>
        {unit && <span>{unit}</span>}
    </div>
)

export type CardDeltaProps = {
    /** 증감 값. 부호로 ▲▼ 와 색을 정한다 */
    value: number
    /** 비교 기준 (예: 계획 대비) */
    comparison?: ReactNode
    /** 감소가 좋은 지표(불량 · 정지시간)는 down */
    goodWhen?: 'up' | 'down'
    /** 값을 글자로 바꿀 때 (값) */
    format?: (n: number) => string
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

/** 증감 + 비교 기준 */
export const CardDelta = ({ value, comparison, goodWhen = 'up', format = (n) => `${n > 0 ? '+' : ''}${n}%`, ...rest }: CardDeltaProps) => {
    const good = value === 0 ? null : (value > 0) === (goodWhen === 'up')
    return (
        <div data-ds-card-delta="" {...rest}>
            <span data-ds-badge="" data-appearance="soft" data-size="sm" data-tone={good === null ? 'neutral' : good ? 'success' : 'danger'}>
                {value > 0 ? '▲' : value < 0 ? '▼' : '–'} {format(value)}
            </span>
            {comparison && <span data-slot="cmp">{comparison}</span>}
        </div>
    )
}

/** 그래프 자리. bleed 면 카드 가장자리까지 */
export const CardVisual = ({ bleed, height, style, ...rest }: { /** 카드 여백을 넘어 가장자리까지. true: 좌우 · 아래 모두 · x: 좌우만 · bottom: 아래만 */ bleed?: boolean | 'x' | 'bottom'; /** 높이(px) */ height?: number } & HTMLAttributes<HTMLDivElement>) => (
    <div data-ds-card-visual="" data-bleed={bleed === true ? 'all' : bleed || undefined} style={{ height, ...style }} {...rest} />
)

/** 한 줄 설명 + 링크 (위 구분선) */
export const CardNote = ({ icon, action, children, ...rest }: { /** 문구 앞 아이콘 */ icon?: ReactNode; /** 오른쪽 링크 · 버튼 */ action?: ReactNode } & HTMLAttributes<HTMLDivElement>) => (
    <div data-ds-card-note="" {...rest}>
        {icon && <span aria-hidden>{icon}</span>}
        <span data-slot="text">{children}</span>
        {action}
    </div>
)

Card.Eyebrow = CardEyebrow
Card.Actions = CardActions
Card.Metric = CardMetric
Card.Delta = CardDelta
Card.Visual = CardVisual
Card.Note = CardNote
Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription
Card.Body = CardBody
Card.Footer = CardFooter
Card.Media = CardMedia
Card.Section = CardSection
