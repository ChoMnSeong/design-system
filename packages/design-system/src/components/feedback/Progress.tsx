import type { HTMLAttributes, ReactNode, Ref } from 'react'
import type { Tone } from '../types.js'

export type ProgressSegment = { /** 구간 값 (max 기준) */ value: number; /** 구간 톤 (없으면 tone) */ tone?: Tone; /** 구간 이름 (문자열이면 title) */ label?: ReactNode }

export type ProgressProps = {
    /** 현재 값 */
    value?: number
    /** 최대값 (100% 기준) */
    max?: number
    /** bar 높이 xs 3 · sm 4 · md 8 · lg 12 / circle 지름 xs 32 · sm 40 · md 56 · lg 72 */
    size?: 'xs' | 'sm' | 'md' | 'lg'
    /** 채움 색 톤 */
    tone?: Tone
    /** 값 글자 위치 */
    valueLabel?: 'none' | 'end' | 'inside'
    /** @deprecated valueLabel="end" */
    showLabel?: boolean
    /** 값 글자 형식 (value, max). 없으면 반올림한 % */
    formatValue?: (value: number, max: number) => string
    /** 진행률을 모를 때 반복 애니메이션 */
    indeterminate?: boolean
    /** bar · segmented(여러 구간 누적) · circle */
    appearance?: 'bar' | 'segmented' | 'circle'
    /** segmented 구간 목록. 주면 기본 appearance 가 segmented */
    segments?: ProgressSegment[]
    /** 목표 마커 (max 기준 값) */
    target?: number
    /** 진행 막대의 접근성 이름 */
    'aria-label'?: string
    /** DOM 요소 ref */
    ref?: Ref<HTMLDivElement>
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

const CIRCLE: Record<string, number> = { xs: 32, sm: 40, md: 56, lg: 72 }

/** 막대·구간·원형으로 진행률을 보여 주는 표시기 */
export const Progress = ({
    value = 0,
    max = 100,
    size = 'md',
    tone = 'accent',
    valueLabel,
    showLabel,
    formatValue = (v, m) => `${Math.round((v / m) * 100)}%`,
    indeterminate,
    appearance: appProp,
    segments,
    target,
    'aria-label': ariaLabel,
    ref,
    ...rest
}: ProgressProps) => {
    const appearance = appProp ?? (segments ? 'segmented' : 'bar')
    const label = valueLabel ?? (showLabel ? 'end' : 'none')
    const pct = Math.max(0, Math.min(100, (value / max) * 100))
    const text = formatValue(value, max)
    const aria = {
        role: 'progressbar' as const,
        'aria-label': ariaLabel,
        'aria-valuemin': 0,
        'aria-valuemax': max,
        'aria-valuenow': indeterminate ? undefined : value,
        'aria-valuetext': indeterminate ? '진행 중' : text,
    }

    if (appearance === 'circle') {
        const d = CIRCLE[size]!
        const sw = d >= 56 ? 6 : 4
        const r = (d - sw) / 2
        const c = 2 * Math.PI * r
        return (
            <div ref={ref} data-ds-progress="" data-appearance="circle" data-tone={tone} data-size={size} data-indeterminate={indeterminate ? '' : undefined} style={{ width: d, height: d }} {...aria} {...rest}>
                <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`} aria-hidden>
                    <circle cx={d / 2} cy={d / 2} r={r} fill="none" strokeWidth={sw} data-slot="track" />
                    <circle
                        cx={d / 2}
                        cy={d / 2}
                        r={r}
                        fill="none"
                        strokeWidth={sw}
                        strokeLinecap="round"
                        data-slot="fill"
                        strokeDasharray={c}
                        strokeDashoffset={indeterminate ? c * 0.7 : c * (1 - pct / 100)}
                        transform={`rotate(-90 ${d / 2} ${d / 2})`}
                    />
                </svg>
                {label !== 'none' && !indeterminate && d >= 40 && <span data-slot="center">{text}</span>}
            </div>
        )
    }

    const total = segments?.reduce((a, s) => a + s.value, 0) ?? 0
    const bar = (
        <div data-slot="bar" data-size={size}>
            {appearance === 'segmented' && segments ? (
                segments.map((s, i) => (
                    <span
                        key={i}
                        data-slot="fill"
                        data-tone={s.tone ?? tone}
                        title={typeof s.label === 'string' ? s.label : undefined}
                        style={{ width: `${(s.value / Math.max(max, total)) * 100}%` }}
                    />
                ))
            ) : (
                <span data-slot="fill" style={indeterminate ? undefined : { width: `${pct}%` }}>
                    {label === 'inside' && !indeterminate && size === 'lg' && <span data-slot="inside">{text}</span>}
                </span>
            )}
            {target !== undefined && <span data-slot="target" style={{ left: `${(target / max) * 100}%` }} aria-hidden />}
        </div>
    )
    return (
        <div
            ref={ref}
            data-ds-progress=""
            data-appearance={appearance}
            data-tone={tone}
            data-indeterminate={indeterminate ? '' : undefined}
            {...aria}
            {...rest}
        >
            {bar}
            {label === 'end' && !indeterminate && <span data-slot="end">{text}</span>}
        </div>
    )
}
