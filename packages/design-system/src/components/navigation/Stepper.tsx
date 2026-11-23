import type { HTMLAttributes, ReactNode } from 'react'
import { IconCheck } from '../icons.js'

export type StepStatus = 'wait' | 'process' | 'finish' | 'error' | 'skip'

export type StepperStep = {
    label: ReactNode
    description?: ReactNode
    /** 지정하지 않으면 current 로 정한다 (앞은 finish, current 는 process, 뒤는 wait) */
    status?: StepStatus
    icon?: ReactNode
    /** 처리 시각 등 보조 정보 */
    time?: ReactNode
}

export type StepperProps = {
    steps: StepperStep[]
    current: number
    orientation?: 'horizontal' | 'vertical'
    /** @deprecated orientation 을 쓴다 */
    direction?: 'horizontal' | 'vertical'
    /** number: 번호 · dot: 점 · icon: 단계별 아이콘 */
    appearance?: 'number' | 'dot' | 'icon'
    size?: 'sm' | 'md'
    /** 단계를 눌러 이동 */
    clickable?: boolean
    onStepClick?: (index: number) => void
} & HTMLAttributes<HTMLOListElement>

const STATUS_LABEL: Record<StepStatus, string> = { wait: '대기', process: '진행 중', finish: '완료', error: '오류', skip: '건너뜀' }

export const Stepper = ({ steps, current, orientation, direction, appearance = 'number', size = 'md', clickable, onStepClick, ...rest }: StepperProps) => {
    const ori = orientation ?? direction ?? 'horizontal'
    return (
        <ol data-ds-stepper="" data-orientation={ori} data-appearance={appearance} data-size={size} {...rest}>
            {steps.map((s, i) => {
                const status: StepStatus = s.status ?? (i < current ? 'finish' : i === current ? 'process' : 'wait')
                const marker =
                    appearance === 'dot' ? null : appearance === 'icon' && s.icon ? s.icon : status === 'finish' ? <IconCheck size={14} /> : status === 'error' ? '!' : i + 1
                const body = (
                    <>
                        <span data-slot="marker" aria-hidden>
                            {marker}
                        </span>
                        <span data-slot="text">
                            <span data-slot="label">{s.label}</span>
                            {(s.description || s.time) && (
                                <span data-slot="desc">
                                    {s.description}
                                    {s.description && s.time ? ' · ' : ''}
                                    {s.time}
                                </span>
                            )}
                        </span>
                        <span data-ds-sr-only="">{STATUS_LABEL[status]}</span>
                    </>
                )
                return (
                    <li key={i} data-status={status} aria-current={i === current ? 'step' : undefined}>
                        {clickable ? (
                            <button type="button" data-slot="step" onClick={() => onStepClick?.(i)}>
                                {body}
                            </button>
                        ) : (
                            <div data-slot="step">{body}</div>
                        )}
                    </li>
                )
            })}
        </ol>
    )
}
