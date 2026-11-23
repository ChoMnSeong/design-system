import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'

/* 큰 제목 · 화면 폭 · 섹션 여백 */

export type DisplayProps = {
    /** sm 48 · md 64 · lg 80 (작은 화면에서는 줄어든다) */
    size?: 'sm' | 'md' | 'lg'
    /** 그릴 태그 */
    as?: ElementType
    /** 제목 글자 */
    children?: ReactNode
} & HTMLAttributes<HTMLHeadingElement>

/** 히어로용 큰 제목 */
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
    /** 그릴 태그 */
    as?: ElementType
    /** 폭을 맞출 내용 */
    children?: ReactNode
} & HTMLAttributes<HTMLElement>

/** 최대 폭 · 좌우 여백을 맞춘 가운데 정렬 틀 */
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
    /** 안쪽 Container 크기 (bleed 가 아닐 때) */
    containerSize?: ContainerProps['size']
    /** 배경. muted 옅은 배경 · inverse 반전 색 */
    tone?: 'default' | 'muted' | 'inverse'
    /** 그릴 태그 */
    as?: ElementType
    /** 섹션 내용 */
    children?: ReactNode
    /** 루트 인라인 스타일 */
    style?: CSSProperties
} & HTMLAttributes<HTMLElement>

/** 위아래 여백과 배경을 가진 페이지 구획 */
export const Section = ({ spacing = 'md', bleed, containerSize = 'lg', tone, as: As = 'section', children, ...rest }: SectionProps) => (
    <As data-ds-section="" data-spacing={spacing} data-tone={tone !== 'default' ? tone : undefined} {...rest}>
        {bleed ? children : <Container size={containerSize}>{children}</Container>}
    </As>
)
