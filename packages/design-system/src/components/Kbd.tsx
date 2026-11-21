import { Fragment, type HTMLAttributes, type Ref } from 'react'

export type KbdSize = 'xs' | 'sm' | 'md'

export type KbdProps = {
    /** xs 18 · sm 20 · md 24 */
    size?: KbdSize
    /** 키 조합. 각 키를 Kbd 로 그리고 사이에 '+' 를 넣는다. children 대신 쓴다. */
    keys?: string[]
    ref?: Ref<HTMLElement>
} & HTMLAttributes<HTMLElement>

export const Kbd = ({ size = 'sm', keys, children, ref, ...rest }: KbdProps) => {
    if (keys && keys.length > 0) {
        return (
            <span
                ref={ref as Ref<HTMLSpanElement>}
                data-ds-kbd-combo=""
                aria-label={keys.join(' + ')}
                {...rest}
            >
                {keys.map((k, i) => (
                    <Fragment key={`${k}-${i}`}>
                        {i > 0 && <span aria-hidden data-slot="plus">+</span>}
                        <kbd translate="no" data-ds-kbd="" data-size={size} aria-hidden>
                            {k}
                        </kbd>
                    </Fragment>
                ))}
            </span>
        )
    }
    return (
        <kbd translate="no" ref={ref} data-ds-kbd="" data-size={size} {...rest}>
            {children}
        </kbd>
    )
}
