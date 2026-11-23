import { renderThemeCss } from '../themes/ssr.js'
import type { BuildThemeInput } from '../themes/types.js'

export type DesignSystemStyleProps = BuildThemeInput & {
    /** CSS 변수를 선언할 선택자 (없으면 :root) */
    selector?: string
    /** CSP 용 style 태그 nonce */
    nonce?: string
}

/** SSR 첫 화면용 테마 CSS 변수 <style> (applyTo="root" Provider 가 마운트되면 제거) */
export const DesignSystemStyle = ({
    selector,
    nonce,
    ...input
}: DesignSystemStyleProps) => {
    const css = renderThemeCss(input, { selector, nonce })
    return (
        <style
            data-ds-init="true"
            {...(nonce ? { nonce } : {})}
            dangerouslySetInnerHTML={{ __html: css }}
        />
    )
}
