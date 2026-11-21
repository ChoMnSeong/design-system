import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'

/* 보드 12-01 · 큰 제목 · 화면 폭 · 섹션 여백 */

export type DisplayProps = {
    /** sm 48 · md 64 · lg 80 (작은 화면에서는 줄어든다) */
    size?: 'sm' | 'md' | 'lg'
    as?: ElementType
    children?: ReactNode
} & HTMLAttributes<HTMLHeadingElement>

export const Display = ({ size = 'md', as: As = 'h1', children, ...rest }: DisplayProps) => (
    <As data-ds-display="" data-size={size} {...rest}>
        {children}
    </As>
)

export type ContainerProps = {
    /** sm 768 · md 1024 · lg 1280 · full */
    size?: 'sm' | 'md' | 'lg' | 'full'
    /** 'responsive' = 16 · 32 · 40 */
    padding?: 'responsive' | 'none'
    as?: ElementType
    children?: ReactNode
} & HTMLAttributes<HTMLElement>

export const Container = ({ size = 'lg', padding = 'responsive', as: As = 'div', children, ...rest }: ContainerProps) => (
    <As data-ds-container="" data-size={size} data-padding={padding} {...rest}>
        {children}
    </As>
)

export type SectionProps = {
    /** sm 48 · md 80 · lg 120 (모바일은 줄어든다) */
    spacing?: 'none' | 'sm' | 'md' | 'lg'
    /** 내용을 Container 없이 화면 끝까지 */
    bleed?: boolean
    containerSize?: ContainerProps['size']
    tone?: 'default' | 'muted' | 'inverse'
    as?: ElementType
    children?: ReactNode
    style?: CSSProperties
} & HTMLAttributes<HTMLElement>

export const Section = ({ spacing = 'md', bleed, containerSize = 'lg', tone, as: As = 'section', children, ...rest }: SectionProps) => (
    <As data-ds-section="" data-spacing={spacing} data-tone={tone !== 'default' ? tone : undefined} {...rest}>
        {bleed ? children : <Container size={containerSize}>{children}</Container>}
    </As>
)
