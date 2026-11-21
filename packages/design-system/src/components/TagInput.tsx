import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { IconClose } from './icons.js'
import type { BorderVariant } from './borderVariant.js'
import { useBorderVariant } from '../provider/useDesignSystem.js'
import type { FieldSize } from './types.js'
import { FieldBox, useFormSize } from './Field.js'

export type TagInputProps = {
    value?: string[]
    defaultValue?: string[]
    onValueChange?: (tags: string[]) => void
    /** 이 글자를 치거나 붙여넣으면 태그로 나눈다. Enter 는 항상 동작. 기본 [',', '\n', '\t'] */
    separators?: string[]
    /** false 면 태그는 만들되 오류로 표시한다 (지우기 전까지 남는다). */
    validate?: (tag: string) => boolean
    /** 같은 값을 두 번 넣지 않는다. 기본 true */
    unique?: boolean
    maxTags?: number
    placeholder?: string
    size?: FieldSize
    variant?: BorderVariant
    invalid?: boolean
    readOnly?: boolean
    disabled?: boolean
    fullWidth?: boolean
    style?: CSSProperties
    'aria-label'?: string
    id?: string
    /** 태그 글꼴을 고정폭으로 (LOT·코드 값) */
    mono?: boolean
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const TagInput = ({
    value: valueProp,
    defaultValue = [],
    onValueChange,
    separators = [',', '\n', '\t'],
    validate,
    unique = true,
    maxTags,
    placeholder = '입력 후 Enter',
    size: sizeProp,
    variant: variantProp,
    invalid,
    readOnly,
    disabled,
    fullWidth,
    style,
    mono,
    id,
    'aria-label': ariaLabel,
}: TagInputProps) => {
    const variant = useBorderVariant(variantProp)
    const size = useFormSize(sizeProp)
    const [inner, setInner] = useState<string[]>(defaultValue)
    const tags = valueProp ?? inner
    const [draft, setDraft] = useState('')
    const inputRef = useRef<HTMLInputElement | null>(null)

    const set = (next: string[]) => {
        if (valueProp === undefined) setInner(next)
        onValueChange?.(next)
    }
    const add = (raw: string) => {
        const splitter = new RegExp(separators.map(escape).join('|') || '\\n')
        const parts = raw
            .split(splitter)
            .map((s) => s.trim())
            .filter(Boolean)
        if (!parts.length) return
        let next = [...tags]
        for (const p of parts) {
            if (unique && next.includes(p)) continue
            if (maxTags !== undefined && next.length >= maxTags) break
            next.push(p)
        }
        set(next)
    }

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || separators.includes(e.key)) {
            if (e.nativeEvent.isComposing) return
            e.preventDefault()
            add(draft)
            setDraft('')
        } else if (e.key === 'Backspace' && draft === '' && tags.length) {
            set(tags.slice(0, -1))
        }
    }

    const bad = validate ? tags.filter((t) => !validate(t)).length : 0
    return (
        <FieldBox
            size={size}
            variant={variant}
            invalid={invalid || bad > 0}
            readOnly={readOnly}
            disabled={disabled}
            fullWidth={fullWidth}
            data-ds-taginput=""
            style={style}
            onMouseDown={(e) => {
                if (e.target !== inputRef.current && !(e.target as HTMLElement).closest('button')) {
                    e.preventDefault()
                    inputRef.current?.focus()
                }
            }}
        >
            {tags.map((t, i) => {
                const ok = !validate || validate(t)
                return (
                    <span
                        key={`${t}-${i}`}
                        data-ds-chip=""
                        data-invalid={ok ? undefined : ''}
                        data-mono={mono ? '' : undefined}
                    >
                        {t}
                        {!disabled && !readOnly && (
                            <button
                                type="button"
                                tabIndex={-1}
                                aria-label={`${t} 제거`}
                                onClick={() => set(tags.filter((_, k) => k !== i))}
                            >
                                <IconClose size={12} />
                            </button>
                        )}
                    </span>
                )
            })}
            <input
                ref={inputRef}
                id={id}
                data-slot="control"
                aria-label={ariaLabel}
                aria-invalid={invalid || bad > 0 || undefined}
                value={draft}
                disabled={disabled}
                readOnly={readOnly}
                placeholder={tags.length ? '' : placeholder}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                onBlur={() => {
                    if (draft.trim()) {
                        add(draft)
                        setDraft('')
                    }
                }}
                onPaste={(e) => {
                    const text = e.clipboardData.getData('text')
                    if (separators.some((s) => text.includes(s))) {
                        e.preventDefault()
                        add(draft + text)
                        setDraft('')
                    }
                }}
                style={{ minWidth: 80, flex: '1 0 80px', height: 24 }}
            />
        </FieldBox>
    )
}
