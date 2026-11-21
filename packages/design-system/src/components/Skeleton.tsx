import type { HTMLAttributes, Ref } from 'react'

export type SkeletonProps = {
    width?: string | number
    height?: string | number
    radius?: string
    circle?: boolean
    /** 여러 줄 (마지막 줄은 짧게) */
    lines?: number
    animation?: 'pulse' | 'wave' | 'none'
    ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

const dim = (v?: string | number) => (typeof v === 'number' ? `${v}px` : v)

const SkeletonBase = ({ width, height = 14, radius, circle, lines, animation = 'wave', style, ref, ...rest }: SkeletonProps) => {
    if (lines && lines > 1) {
        return (
            <div ref={ref} aria-hidden data-ds-skeleton-lines="" style={{ display: 'flex', flexDirection: 'column', gap: 6, width: dim(width), ...style }} {...rest}>
                {Array.from({ length: lines }, (_, i) => (
                    <span key={i} data-ds-skeleton="" data-animation={animation} style={{ height: dim(height), width: i === lines - 1 ? '60%' : '100%', borderRadius: radius }} />
                ))}
            </div>
        )
    }
    return (
        <div
            ref={ref}
            aria-hidden
            data-ds-skeleton=""
            data-animation={animation}
            style={{
                width: dim(circle ? (width ?? height) : width),
                height: dim(height),
                borderRadius: circle ? '50%' : radius,
                flexShrink: circle ? 0 : undefined,
                ...style,
            }}
            {...rest}
        />
    )
}

const SkeletonTable = ({ rows = 4, columns = 4, animation }: { rows?: number; columns?: number; animation?: SkeletonProps['animation'] }) => (
    <div role="status" aria-label="표 불러오는 중" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 12 }}>
            {Array.from({ length: columns }, (_, i) => (
                <SkeletonBase key={i} height={20} animation={animation} />
            ))}
        </div>
        {Array.from({ length: rows }, (_, r) => (
            <div key={r} style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 12, opacity: 0.75 }}>
                {Array.from({ length: columns }, (_, i) => (
                    <SkeletonBase key={i} height={14} width={`${70 + ((r * 7 + i * 11) % 30)}%`} animation={animation} />
                ))}
            </div>
        ))}
    </div>
)

const SkeletonCard = ({ animation }: { animation?: SkeletonProps['animation'] }) => (
    <div role="status" aria-label="카드 불러오는 중" data-ds-skeleton-card="">
        <SkeletonBase height={12} width="50%" animation={animation} />
        <SkeletonBase height={26} width="70%" animation={animation} />
        <SkeletonBase height={6} animation={animation} />
    </div>
)

/** 자리 표시. Skeleton.Table · Skeleton.Card 프리셋이 있다 */
export const Skeleton = Object.assign(SkeletonBase, { Table: SkeletonTable, Card: SkeletonCard })
