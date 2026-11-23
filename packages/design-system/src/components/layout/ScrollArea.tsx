import { useEffect, useRef, useState, type HTMLAttributes, type Ref } from 'react'

export type ScrollAreaProps = {
    /** 최대 높이. 숫자는 px */
    maxHeight?: number | string
    /** 스크롤 방향. both 는 가로 · 세로 모두 */
    direction?: 'vertical' | 'horizontal' | 'both'
    /** auto: 필요할 때 · always: 항상 · hover: 올렸을 때만 */
    scrollbar?: 'auto' | 'always' | 'hover'
    /** 더 스크롤할 내용이 있는 쪽 가장자리에 그림자 */
    shadow?: boolean
    /** DOM 요소 ref */
    ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

/** 스크롤바 표시 · 가장자리 그림자를 다루는 스크롤 영역 */
export const ScrollArea = ({ maxHeight, direction = 'vertical', scrollbar = 'auto', shadow, style, ref, onScroll, children, ...rest }: ScrollAreaProps) => {
    const inner = useRef<HTMLDivElement | null>(null)
    const [edges, setEdges] = useState({ top: false, bottom: false, left: false, right: false })
    const measure = () => {
        const el = inner.current
        if (!el || !shadow) return
        setEdges({
            top: el.scrollTop > 1,
            bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 1,
            left: el.scrollLeft > 1,
            right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
        })
    }
    useEffect(() => {
        measure()
        if (!shadow || !inner.current) return
        const ro = new ResizeObserver(measure)
        ro.observe(inner.current)
        return () => ro.disconnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shadow])
    return (
        <div
            ref={(n) => {
                inner.current = n
                if (typeof ref === 'function') ref(n)
                else if (ref) (ref as { current: HTMLDivElement | null }).current = n
            }}
            data-ds-scrollbar=""
            data-ds-scroll-area=""
            data-direction={direction}
            data-scrollbar={scrollbar}
            data-shadow-top={edges.top ? '' : undefined}
            data-shadow-bottom={edges.bottom ? '' : undefined}
            data-shadow-left={edges.left ? '' : undefined}
            data-shadow-right={edges.right ? '' : undefined}
            tabIndex={0}
            onScroll={(e) => {
                measure()
                onScroll?.(e)
            }}
            style={{ maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight, ...style }}
            {...rest}
        >
            {children}
        </div>
    )
}
