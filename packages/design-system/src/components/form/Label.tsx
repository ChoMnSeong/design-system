import type { LabelHTMLAttributes, ReactNode, Ref } from 'react'
import { Tooltip } from '../overlay/Tooltip.js'
import { IconInfo } from '../icons.js'

export type LabelProps = {
    required?: boolean
    /** true 면 "(선택)", 문자열이면 그 문구 */
    optional?: boolean | ReactNode
    /** 라벨 옆 (i) 도움말 */
    tooltip?: ReactNode
    /** sm 12px · md 14px. 12px 보다 작은 라벨은 두지 않는다 */
    size?: 'sm' | 'md'
    ref?: Ref<HTMLLabelElement>
} & LabelHTMLAttributes<HTMLLabelElement>

export const Label = ({ required, optional, tooltip, size = 'sm', children, ref, ...rest }: LabelProps) => (
    <label ref={ref} data-ds-label="" data-size={size} {...rest}>
        {children}
        {required && (
            <span data-slot="req" aria-hidden>
                *
            </span>
        )}
        {required && <span data-ds-sr-only="">(필수)</span>}
        {!required && optional && <span data-slot="opt">{optional === true ? '(선택)' : optional}</span>}
        {tooltip && (
            <Tooltip content={tooltip}>
                <span data-slot="tip" tabIndex={0} role="img" aria-label={typeof tooltip === 'string' ? tooltip : '도움말'}>
                    <IconInfo size={14} />
                </span>
            </Tooltip>
        )}
    </label>
)
