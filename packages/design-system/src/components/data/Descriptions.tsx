import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

export type DescriptionItem = { /** 라벨 (dt) */ label: ReactNode; /** 값 (dd) */ value: ReactNode; /** 차지할 칸 수 (열 수를 넘지 않음) */ span?: number }

export type DescriptionsProps = {
    /** 라벨 · 값 항목 목록 */
    items: DescriptionItem[]
    /** 한 줄의 항목 수. 객체면 컨테이너 폭 기준 { 0: 1, 640: 2, 960: 3 } */
    columns?: number | Record<number, number>
    /** horizontal: 라벨 왼쪽 · vertical: 라벨 위 */
    layout?: 'horizontal' | 'vertical'
    /** 칸마다 테두리 + 라벨 칸 배경 */
    bordered?: boolean
    /** 라벨 칸 폭(px) */
    labelWidth?: number
    /** sm 은 글자 13px · 간격 좁게 */
    size?: 'sm' | 'md'
    /** 위에 붙는 제목 */
    title?: ReactNode
} & Omit<HTMLAttributes<HTMLDListElement>, 'title'>

/** 상세 화면의 "라벨 : 값" 묶음. dl/dt/dd 로 그린다. */
export const Descriptions = ({
    items,
    columns = 3,
    layout = 'horizontal',
    bordered,
    labelWidth = 110,
    size = 'md',
    title,
    style,
    ...rest
}: DescriptionsProps) => {
    const n = typeof columns === 'number' ? columns : (columns[0] ?? 1)
    const steps = typeof columns === 'object' ? Object.entries(columns).filter(([w]) => +w > 0) : []
    const id = `dsc${Math.abs(items.length * 31 + n)}`
    return (
        <div data-ds-descriptions-wrap="" style={{ ...(steps.length ? { containerType: 'inline-size' as const } : null), ...style }}>
            {title && <div data-slot="title">{title}</div>}
            {steps.length > 0 && (
                <style>
                    {steps
                        .map(([w, c]) => `@container (min-width:${w}px){[data-ds-descriptions][data-k="${id}"]{--_cols:${c}}}`)
                        .join('')}
                </style>
            )}
            <dl
                data-ds-descriptions=""
                data-k={id}
                data-layout={layout}
                data-bordered={bordered ? '' : undefined}
                data-size={size}
                style={{ ['--_cols' as string]: n, ['--_lw' as string]: `${labelWidth}px` } as CSSProperties}
                {...rest}
            >
                {items.map((it, i) => (
                    <div key={i} data-slot="item" style={it.span ? { gridColumn: `span min(${it.span}, var(--_cols))` } : undefined}>
                        <dt>{it.label}</dt>
                        <dd>{it.value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}
