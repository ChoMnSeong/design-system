import { Children, Fragment, isValidElement, type CSSProperties, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { baseOf, useResponsiveCss, type Responsive } from '../responsive.js'

/** 숫자는 px (기존 호환). 토큰은 space(3) → var(--ds-spacing-3) */
const gapOf = (g: string | number) => (typeof g === 'number' ? `${g}px` : g)

export type StackProps = {
    direction?: Responsive<'row' | 'column'>
    /** px 숫자 또는 CSS 길이. 토큰은 space(3) */
    gap?: Responsive<number | string>
    align?: CSSProperties['alignItems']
    justify?: CSSProperties['justifyContent']
    wrap?: boolean
    inline?: boolean
    /** 자식 사이 구분선. true 면 기본 선, 노드면 그 노드 */
    divider?: boolean | ReactNode
    ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

export const Stack = ({ direction = 'column', gap = 8, align, justify, wrap, inline, divider, style, children, ref, ...rest }: StackProps) => {
    const { attr, css } = useResponsiveCss({
        direction: [direction, (d) => `flex-direction:${d}`],
        gap: [gap, (g) => `gap:${gapOf(g)}`],
    })
    const dir = baseOf(direction)
    const kids = divider ? Children.toArray(children) : null
    const sep = divider === true ? <span data-ds-stack-divider="" data-dir={dir} role="separator" aria-orientation={dir === 'row' ? 'vertical' : 'horizontal'} /> : divider
    return (
        <>
            {css}
            <div
                ref={ref}
                data-ds-r={attr}
                style={{
                    display: inline ? 'inline-flex' : 'flex',
                    flexDirection: dir,
                    gap: gapOf(baseOf(gap)),
                    alignItems: align,
                    justifyContent: justify,
                    flexWrap: wrap ? 'wrap' : undefined,
                    ...style,
                }}
                {...rest}
            >
                {kids
                    ? kids.map((c, i) => (
                          <Fragment key={isValidElement(c) && c.key != null ? c.key : i}>
                              {i > 0 && sep}
                              {c}
                          </Fragment>
                      ))
                    : children}
            </div>
        </>
    )
}

export const HStack = (props: Omit<StackProps, 'direction'>) => <Stack {...props} direction="row" />
export const VStack = (props: Omit<StackProps, 'direction'>) => <Stack {...props} direction="column" />

export type SpacerProps = {
    size?: string | number
    axis?: 'horizontal' | 'vertical' | 'both'
} & HTMLAttributes<HTMLSpanElement>

export const Spacer = ({ size = 'auto', axis = 'both', style, ...rest }: SpacerProps) => {
    const value = typeof size === 'number' ? `${size}px` : size
    return (
        <span
            aria-hidden
            style={{
                display: 'block',
                flex: size === 'auto' ? 1 : undefined,
                width: axis !== 'vertical' ? value : undefined,
                height: axis !== 'horizontal' ? value : undefined,
                ...style,
            }}
            {...rest}
        />
    )
}

export type GridProps = {
    /** 열 수 또는 단계별 열 수 { 0: 1, 640: 2, 1024: 4 } */
    columns?: Responsive<number>
    gap?: number | string
    /** 지정하면 columns 대신 auto-fill 로 최소 폭(px)에 맞춰 채운다 */
    minChildWidth?: number
    ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

export const Grid = ({ columns = 2, gap = 16, minChildWidth, style, ref, ...rest }: GridProps) => {
    const { attr, css } = useResponsiveCss({ columns: [minChildWidth ? undefined : columns, (n) => `grid-template-columns:repeat(${n},minmax(0,1fr))`] })
    return (
        <>
            {css}
            <div
                ref={ref}
                data-ds-r={attr}
                style={{
                    display: 'grid',
                    gridTemplateColumns: minChildWidth ? `repeat(auto-fill, minmax(min(${minChildWidth}px, 100%), 1fr))` : `repeat(${baseOf(columns)}, minmax(0, 1fr))`,
                    gap: gapOf(gap),
                    ...style,
                }}
                {...rest}
            />
        </>
    )
}
