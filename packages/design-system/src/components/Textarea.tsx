import {
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
    type ChangeEvent,
    type Ref,
    type TextareaHTMLAttributes,
} from 'react'
import type { FieldSize } from './types.js'
import type { BorderVariant } from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'
import { FieldBox, useFormSize } from './Field.js'

export type TextareaProps = {
    size?: FieldSize
    variant?: BorderVariant
    invalid?: boolean
    fullWidth?: boolean
    /** @deprecated minRows · maxRows 를 쓴다. true 면 minRows=rows, maxRows 없음. */
    autoResize?: boolean
    /** 내용에 맞춰 높이를 늘린다. minRows 이상 maxRows 이하. */
    minRows?: number
    maxRows?: number
    /** maxLength 와 함께 글자 수를 보여 준다. */
    showCount?: boolean
    resize?: 'none' | 'vertical' | 'both'
    onValueChange?: (value: string) => void
    ref?: Ref<HTMLTextAreaElement>
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>

export const Textarea = ({
    size: sizeProp,
    variant: variantProp,
    invalid = false,
    fullWidth,
    rows = 3,
    autoResize,
    minRows,
    maxRows,
    showCount,
    resize,
    onValueChange,
    style,
    className,
    ref,
    onChange,
    ...rest
}: TextareaProps) => {
    const variant = useBorderVariant(variantProp)
    const size = useFormSize(sizeProp)
    const node = useRef<HTMLTextAreaElement | null>(null)
    const setRefs = useCallback(
        (el: HTMLTextAreaElement | null) => {
            node.current = el
            if (typeof ref === 'function') ref(el)
            else if (ref) ref.current = el
        },
        [ref],
    )
    const auto = autoResize || minRows !== undefined || maxRows !== undefined
    const lo = minRows ?? rows

    const isControlled = rest.value !== undefined
    const [innerLen, setInnerLen] = useState(() => String(rest.defaultValue ?? '').length)
    const length = isControlled ? String(rest.value ?? '').length : innerLen

    const fit = useCallback(() => {
        const el = node.current
        if (!el || !auto) return
        const cs = getComputedStyle(el)
        const line = parseFloat(cs.lineHeight) || 20
        el.style.height = 'auto'
        const min = lo * line
        const max = maxRows ? maxRows * line : Infinity
        const h = Math.min(Math.max(el.scrollHeight, min), max)
        el.style.height = `${h}px`
        el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden'
    }, [auto, lo, maxRows])

    useLayoutEffect(fit, [fit, rest.value])

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (!isControlled) setInnerLen(e.target.value.length)
        onChange?.(e)
        onValueChange?.(e.target.value)
        fit()
    }

    const over = rest.maxLength !== undefined && length > rest.maxLength
    return (
        <FieldBox
            size={size}
            variant={variant}
            invalid={invalid}
            readOnly={rest.readOnly}
            disabled={rest.disabled}
            fullWidth={fullWidth}
            multiline
            style={{ flexDirection: 'column', gap: '4px', ...style }}
            className={className}
        >
            <textarea
                ref={setRefs}
                rows={auto ? lo : rows}
                aria-invalid={invalid || undefined}
                onChange={handleChange}
                style={{ resize: auto ? 'none' : (resize ?? 'vertical') }}
                {...rest}
            />
            {showCount && rest.maxLength !== undefined && (
                <span data-slot="count" data-over={over ? '' : undefined} style={{ alignSelf: 'flex-end' }}>
                    {length} / {rest.maxLength}
                </span>
            )}
        </FieldBox>
    )
}
