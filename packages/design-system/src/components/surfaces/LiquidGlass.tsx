import { useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'

export type LiquidGlassProps = {
    /** 굴절 세기 (px) */
    refraction?: number
    /** 렌즈 가장자리 두께 비율 0~0.5 */
    bezel?: number
    /** 흐림 정도 (px) */
    blur?: number
    /** 밝은 배경 위에서 글자가 안 읽히면 어둡게. auto 는 배경 밝기를 모르면 옅게 어둡힌다 */
    legibility?: 'auto' | 'light' | 'dark' | 'none'
    /** 모서리 둥글기 (px) */
    radius?: number
    /** 유리 위에 놓을 내용 */
    children?: ReactNode
    /** 루트 인라인 스타일 */
    style?: CSSProperties
} & HTMLAttributes<HTMLDivElement>

/**
 * Liquid Glass 렌즈 (material="liquid").
 * 배경이 고정된 KPI 위젯 전용 — 대시보드 · 현장 대형 화면 · 사진/지도 위.
 * 표 · 폼 · 스크롤 영역에는 쓰지 않는다.
 * 굴절은 SVG 변위 필터를 backdrop-filter 로 걸어 만들고, 지원하지 않는 브라우저에서는 일반 유리(blur)로 내려간다.
 */
export const LiquidGlass = ({ refraction = 28, bezel = 0.22, blur = 2, legibility = 'auto', radius = 24, children, style, ...rest }: LiquidGlassProps) => {
    const id = useId().replace(/[^a-zA-Z0-9]/g, '')
    // 가장자리일수록 바깥으로 밀어내는 변위 지도 (초타원 근사: 가운데 평평, 테두리에서 급격히 굽음)
    const inner = Math.round((1 - bezel * 2) * 100)
    const map = `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs>` +
            `<linearGradient id="x" x1="0" x2="1"><stop offset="0" stop-color="#000"/><stop offset="${bezel}" stop-color="#808080"/><stop offset="${1 - bezel}" stop-color="#808080"/><stop offset="1" stop-color="#fff"/></linearGradient>` +
            `<linearGradient id="y" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="${bezel}" stop-color="#808080"/><stop offset="${1 - bezel}" stop-color="#808080"/><stop offset="1" stop-color="#fff"/></linearGradient>` +
            `</defs><rect width="200" height="200" fill="url(#x)"/><rect width="200" height="200" fill="url(#y)" style="mix-blend-mode:screen" opacity=".5"/>` +
            `<rect x="${100 - inner}" y="${100 - inner}" width="${inner * 2}" height="${inner * 2}" rx="40" fill="#808080" opacity=".0"/></svg>`,
    )}`
    return (
        <div
            data-ds-liquid=""
            data-legibility={legibility}
            style={{ ['--_r' as string]: `${radius}px`, ['--_blur' as string]: `${blur}px`, ['--_filter' as string]: `url(#ds-liquid-${id})`, ...style } as CSSProperties}
            {...rest}
        >
            <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
                <filter id={`ds-liquid-${id}`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
                    <feImage href={map} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="soft" />
                    <feDisplacementMap in="soft" in2="map" scale={refraction} xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </svg>
            <div data-slot="content">{children}</div>
        </div>
    )
}
