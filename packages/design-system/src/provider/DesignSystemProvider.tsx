import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from 'react'
import { buildTheme } from '../themes/buildTheme.js'
import { themeToCssVars } from '../themes/cssVariables.js'
import type {
    BuildThemeInput,
    PaletteOverrides,
    ResolvedTheme,
} from '../themes/types.js'
import type { Mode, VariantName } from '../variants/types.js'
import type { CustomPalette, Palette, PaletteName } from '../palettes/types.js'
import type { BaseTokens } from '../tokens/types.js'
import type { BorderVariant } from '../components/borderVariant.js'
import { DesignSystemContext } from './context.js'
import { DEFAULT_LOCALE, LocaleContext } from './locale.js'
import { getPreset, glassPageBackground, presetVars, type GlassOptions, type ThemePreset } from '../presets/index.js'
import { FocusStyles } from './FocusStyles.js'
import { InteractionStyles } from './InteractionStyles.js'
import { ComponentStyles } from './ComponentStyles.js'
import { TypographyStyles } from './TypographyStyles.js'

export type FontFamilyOverrides = {
    /** 본문 글꼴 */
    sans?: string
    /** 세리프 글꼴 */
    serif?: string
    /** 고정폭 글꼴 (코드 · 숫자) */
    mono?: string
    /** 제목용 글꼴 */
    display?: string
}

export type DesignSystemProviderProps = {
    /** 색 팔레트 (이름 또는 객체). 바뀌면 컨텍스트 값도 이 값으로 */
    palette?: PaletteName | Palette | CustomPalette
    /** 표면 스타일 (minimal · neumorphism · glassmorphism · brutalism · retro) */
    variant?: VariantName
    /** light · dark 색 모드 */
    mode?: Mode
    /** 컨텍스트로 공유하는 기본 테두리 스타일 */
    borderVariant?: BorderVariant
    /** fontFamily 토큰 일부/전체 덮어쓰기. tokenOverrides의 단축. */
    fonts?: FontFamilyOverrides
    /** 팔레트 색 단계 일부 덮어쓰기 */
    paletteOverrides?: PaletteOverrides
    /** 기본 토큰 일부 덮어쓰기 */
    tokenOverrides?: Partial<BaseTokens>
    /** root: <html> 에 CSS 변수 적용 · scope: 감싸는 div 에만 적용 */
    applyTo?: 'root' | 'scope'
    /** 날짜·숫자 로케일. DatePicker · Calendar 의 기본값이 된다. */
    locale?: string
    /** 주 시작 요일 (0 일요일 · 1 월요일) */
    weekStartsOn?: 0 | 1
    /** 브랜드 프리셋: 'default' · 'editorial' · 'neon' · 'photo' · definePreset() 결과 */
    preset?: string | ThemePreset
    /** glassmorphism 배경 · 재질 */
    glass?: GlassOptions
    /** applyTo="scope" 일 때 감싸는 div 의 class */
    className?: string
    /** applyTo="scope" 일 때 감싸는 div 의 style */
    style?: CSSProperties
    /** 테마를 적용할 앱 영역 */
    children: ReactNode
}

const DEFAULT_PALETTE: PaletteName = 'lavender'
const DEFAULT_VARIANT: VariantName = 'minimal'
const DEFAULT_MODE: Mode = 'light'
const DEFAULT_BORDER_VARIANT: BorderVariant = 'outlined'

/**
 * prop 을 초기값 겸 재정의 신호로 쓰는 상태.
 * prop 이 바뀌면 그 값으로 되돌리고, 그 사이에는 반환된 setter(컨텍스트의 setPalette 등)로
 * 자유롭게 바꿀 수 있다.
 *
 * useEffect 로 맞추면 이전 값으로 한 번 커밋해 화면에 그린 뒤 다시 그려서 테마가 깜빡인다.
 * 렌더 중에 맞추면 React 가 커밋 전에 즉시 다시 렌더하므로 깜빡임이 없다.
 */
const usePropSyncedState = <T,>(
    prop: T | undefined,
    fallback: T,
): readonly [T, Dispatch<SetStateAction<T>>] => {
    const [value, setValue] = useState<T>(prop ?? fallback)
    const [prevProp, setPrevProp] = useState(prop)
    if (prop !== undefined && prop !== prevProp) {
        setPrevProp(prop)
        setValue(prop)
    }
    return [value, setValue] as const
}

const applyVarsToElement = (
    element: HTMLElement | null,
    vars: Record<string, string>,
    previousKeys: Set<string>,
): Set<string> => {
    if (!element) return previousKeys
    for (const key of previousKeys) {
        if (!(key in vars)) {
            element.style.removeProperty(key)
        }
    }
    const nextKeys = new Set<string>()
    for (const [key, value] of Object.entries(vars)) {
        element.style.setProperty(key, value)
        nextKeys.add(key)
    }
    return nextKeys
}

/** 테마 CSS 변수 · 컴포넌트 스타일 · 컨텍스트를 제공하는 최상위 Provider */
export const DesignSystemProvider = ({
    palette: paletteProp,
    variant: variantProp,
    mode: modeProp,
    borderVariant: borderVariantProp,
    fonts: fontsProp,
    paletteOverrides,
    tokenOverrides,
    applyTo = 'root',
    locale = DEFAULT_LOCALE.locale,
    weekStartsOn = DEFAULT_LOCALE.weekStartsOn,
    preset,
    glass,
    className,
    style,
    children,
}: DesignSystemProviderProps) => {
    const [fonts, setFontsState] = useState<FontFamilyOverrides | undefined>(
        fontsProp,
    )
    const [prevFontsProp, setPrevFontsProp] = useState(fontsProp)
    if (fontsProp !== prevFontsProp) {
        setPrevFontsProp(fontsProp)
        setFontsState(fontsProp)
    }

    const mergedTokenOverrides = useMemo<
        Partial<BaseTokens> | undefined
    >(() => {
        if (!fonts || Object.keys(fonts).length === 0) return tokenOverrides
        const fontFamily: Record<string, string> = {}
        if (fonts.sans) fontFamily.sans = fonts.sans
        if (fonts.serif) fontFamily.serif = fonts.serif
        if (fonts.mono) fontFamily.mono = fonts.mono
        if (fonts.display) fontFamily.display = fonts.display
        return {
            ...tokenOverrides,
            typography: {
                ...(tokenOverrides?.typography ?? {}),
                fontFamily: {
                    ...(tokenOverrides?.typography?.fontFamily ?? {}),
                    ...fontFamily,
                },
            } as BaseTokens['typography'],
        }
    }, [fonts, tokenOverrides])

    const [palette, setPaletteState] = usePropSyncedState<
        PaletteName | Palette | CustomPalette
    >(paletteProp, DEFAULT_PALETTE)
    const [variant, setVariantState] = usePropSyncedState<VariantName>(
        variantProp,
        DEFAULT_VARIANT,
    )
    const [mode, setModeState] = usePropSyncedState<Mode>(modeProp, DEFAULT_MODE)
    const [borderVariant, setBorderVariantState] =
        usePropSyncedState<BorderVariant>(
            borderVariantProp,
            DEFAULT_BORDER_VARIANT,
        )

    const theme: ResolvedTheme = useMemo(() => {
        const input: BuildThemeInput = {
            palette,
            variant,
            mode,
            paletteOverrides,
            tokenOverrides: mergedTokenOverrides,
        }
        return buildTheme(input)
    }, [palette, variant, mode, paletteOverrides, mergedTokenOverrides])

    const cssVars = useMemo(
        () => ({
            ...themeToCssVars(theme),
            ...presetVars(getPreset(preset), theme.mode),
            ...(theme.variantName === 'glassmorphism'
                ? { '--ds-surface-page-background': glassPageBackground(glass, theme.mode) }
                : null),
        }),
        [theme, preset, glass?.backdrop, glass?.backdropImage],
    )
    const presetName = typeof preset === 'object' ? preset.name : preset
    const glassAttrs = {
        'data-ds-preset': presetName,
        'data-ds-glass-backdrop': glass?.backdrop ?? 'pattern',
        'data-ds-glass-material': glass?.material ?? 'glass',
    }
    const scopeRef = useRef<HTMLDivElement | null>(null)
    const previousKeysRef = useRef<Set<string>>(new Set())

    useEffect(() => {
        if (applyTo !== 'root') return
        if (typeof document === 'undefined') return
        previousKeysRef.current = applyVarsToElement(
            document.documentElement,
            cssVars,
            previousKeysRef.current,
        )
        document.documentElement.dataset.dsPalette = theme.paletteName
        document.documentElement.dataset.dsVariant = theme.variantName
        document.documentElement.dataset.dsMode = theme.mode
        if (presetName) document.documentElement.dataset.dsPreset = presetName
        else delete document.documentElement.dataset.dsPreset
        document.documentElement.dataset.dsGlassBackdrop = glass?.backdrop ?? 'pattern'
        document.documentElement.dataset.dsGlassMaterial = glass?.material ?? 'glass'
        // 네이티브 위젯(스크롤바, select, date 피커)이 모드를 따라오게 한다.
        document.documentElement.style.colorScheme = theme.mode
        const ssrStyle = document.querySelector('style[data-ds-init="true"]')
        if (ssrStyle && ssrStyle.parentNode) {
            ssrStyle.parentNode.removeChild(ssrStyle)
        }
    }, [applyTo, cssVars, theme.paletteName, theme.variantName, theme.mode, presetName, glass?.backdrop, glass?.material])

    const scopeStyle = useMemo<CSSProperties | undefined>(() => {
        if (applyTo !== 'scope') return style
        return {
            ...(cssVars as CSSProperties),
            colorScheme: mode,
            ...style,
        }
    }, [applyTo, cssVars, mode, style])

    const setPalette = useCallback(
        (next: string) => setPaletteState(next as PaletteName),
        [],
    )
    const setVariant = useCallback(
        (next: VariantName) => setVariantState(next),
        [],
    )
    const setMode = useCallback((next: Mode) => setModeState(next), [])
    const setBorderVariant = useCallback(
        (next: BorderVariant) => setBorderVariantState(next),
        [],
    )
    const setFonts = useCallback(
        (next: FontFamilyOverrides | undefined) => setFontsState(next),
        [],
    )
    const toggleMode = useCallback(
        () => setModeState((prev) => (prev === 'light' ? 'dark' : 'light')),
        [],
    )

    const value = useMemo(
        () => ({
            theme,
            borderVariant,
            fonts,
            setPalette,
            setVariant,
            setMode,
            setBorderVariant,
            setFonts,
            toggleMode,
        }),
        [
            theme,
            borderVariant,
            fonts,
            setPalette,
            setVariant,
            setMode,
            setBorderVariant,
            setFonts,
            toggleMode,
        ],
    )

    const localeValue = useMemo(() => ({ locale, weekStartsOn }), [locale, weekStartsOn])

    if (applyTo === 'scope') {
        return (
            <DesignSystemContext.Provider value={value}>
            <LocaleContext.Provider value={localeValue}>
                <FocusStyles />
                <InteractionStyles />
                <ComponentStyles />
                <TypographyStyles />
                <div
                    ref={scopeRef}
                    className={className}
                    style={scopeStyle}
                    data-ds-palette={theme.paletteName}
                    data-ds-variant={theme.variantName}
                    data-ds-mode={theme.mode}
                    {...glassAttrs}
                >
                    {children}
                </div>
            </LocaleContext.Provider>
        </DesignSystemContext.Provider>
        )
    }

    return (
        <DesignSystemContext.Provider value={value}>
            <LocaleContext.Provider value={localeValue}>
            <FocusStyles />
            <InteractionStyles />
            <ComponentStyles />
            <TypographyStyles />
            {children}
        </LocaleContext.Provider>
        </DesignSystemContext.Provider>
    )
}
