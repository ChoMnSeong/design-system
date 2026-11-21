import type { CSSProperties, ReactNode } from 'react'

export type Size = 'sm' | 'md' | 'lg'
export type Tone =
    | 'accent'
    | 'neutral'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'

export const mergeStyles = (
    ...parts: Array<CSSProperties | undefined | false | null>
): CSSProperties =>
    parts.reduce<CSSProperties>(
        (acc, part) => (part ? { ...acc, ...part } : acc),
        {},
    )

export const sizeText: Record<Size, string> = {
    sm: '12px',
    md: '14px',
    lg: '15px',
}

export const sizePadX: Record<Size, string> = {
    sm: '10px',
    md: '14px',
    lg: '18px',
}

export const sizePadY: Record<Size, string> = {
    sm: '6px',
    md: '9px',
    lg: '12px',
}

export const sizeHeight: Record<Size, string> = {
    sm: '28px',
    md: '36px',
    lg: '44px',
}

/** solid 배경으로 toneColor 를 썼을 때 그 위에 얹을 글자색. */
export const onToneColor = (tone: Tone): string => {
    switch (tone) {
        case 'accent':
            return 'var(--ds-color-foreground-on-primary)'
        case 'success':
            return 'var(--ds-color-foreground-on-success)'
        case 'warning':
            return 'var(--ds-color-foreground-on-warning)'
        case 'danger':
            return 'var(--ds-color-foreground-on-danger)'
        case 'info':
            return 'var(--ds-color-foreground-on-info)'
        case 'neutral':
        default:
            return 'var(--ds-color-background-page)'
    }
}

export const toneColor = (tone: Tone): string => {
    switch (tone) {
        case 'accent':
            return 'var(--ds-palette-primary-500)'
        case 'success':
            return 'var(--ds-color-state-success)'
        case 'warning':
            return 'var(--ds-color-state-warning)'
        case 'danger':
            return 'var(--ds-color-state-danger)'
        case 'info':
            return 'var(--ds-color-state-info)'
        case 'neutral':
        default:
            return 'var(--ds-color-foreground-secondary)'
    }
}

/** spacing 토큰 단계. var(--ds-spacing-<n>) 으로 풀린다. */
export type SpaceToken = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32
export const space = (t: SpaceToken | string): string =>
    typeof t === 'number' ? `var(--ds-spacing-${t})` : t

/** 정보 밀도. compact 는 업무 화면의 표·툴바, comfortable 은 B2C·터치 화면. */
export type Density = 'compact' | 'default' | 'comfortable'

/** 입력 컨트롤 공통 크기. xs 24 · sm 28 · md 36 · lg 44 */
export type FieldSize = 'xs' | 'sm' | 'md' | 'lg'
/** Size(sm·md·lg) 를 쓰던 컴포넌트가 FieldSize 로 넘어갈 때 아이콘 크기 등에 쓴다. */
export const fieldIconSize: Record<FieldSize, number> = { xs: 12, sm: 14, md: 16, lg: 18 }

/** 선택형 컨트롤(Select · RadioGroup · SegmentedControl · CheckboxGroup) 공용 옵션. */
export type Option<V extends string = string> = {
    value: V
    label: ReactNode
    description?: ReactNode
    icon?: ReactNode
    disabled?: boolean
    group?: string
}
