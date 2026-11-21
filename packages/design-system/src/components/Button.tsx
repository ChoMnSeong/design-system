import {
    useState,
    type ButtonHTMLAttributes,
    type MouseEvent,
    type ReactNode,
    type Ref,
} from 'react'
import type { Tone } from './types.js'
import { Kbd } from './Kbd.js'
import { Tooltip } from './Tooltip.js'
import { Dialog, DialogActions } from './Dialog.js'

/** @deprecated appearance + tone 을 쓴다. */
export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'success'
    | 'warning'
    | 'danger'

export type ButtonAppearance = 'solid' | 'soft' | 'outline' | 'ghost' | 'link'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'
export type ButtonShape = 'default' | 'pill' | 'square'
export type ButtonLinkStyle = 'underline' | 'hover' | 'arrow' | 'external'

export type ButtonConfirm = {
    title: ReactNode
    description?: ReactNode
    /** 확인 버튼 문구. 기본값은 버튼 자신의 children. */
    confirmText?: ReactNode
    cancelText?: ReactNode
    /** 확인 버튼 톤. 기본값은 버튼의 tone. */
    tone?: Tone
}

export type ButtonProps = {
    /** @deprecated appearance + tone 으로 매핑된다. primary → solid·accent, secondary → outline·neutral, ghost → ghost·neutral, success/warning/danger → solid·해당 톤 */
    variant?: ButtonVariant
    appearance?: ButtonAppearance
    tone?: Tone
    /** appearance="link" 일 때만 쓴다. */
    linkStyle?: ButtonLinkStyle
    size?: ButtonSize
    shape?: ButtonShape
    /** 아이콘만 있는 정사각 버튼. aria-label(또는 문자열 tooltip)이 필요하다. */
    iconOnly?: boolean
    iconLeft?: ReactNode
    iconRight?: ReactNode
    loading?: boolean
    /** 로딩 중 children 대신 보여 줄 문구 (예: "저장 중…"). */
    loadingText?: ReactNode
    /** 토글 버튼의 눌림 상태. aria-pressed 로 나간다. */
    selected?: boolean
    /** 오른쪽 위 숫자 배지. */
    badge?: ReactNode
    /** 단축키 표시 (예: "Ctrl S"). 공백으로 키를 나눠 Kbd 로 그리고 aria-keyshortcuts 로도 알린다. */
    shortcut?: string
    /** 누르면 바로 실행하지 않고 확인 대화상자를 먼저 띄운다. */
    confirm?: ButtonConfirm
    tooltip?: ReactNode
    fullWidth?: boolean
    ref?: Ref<HTMLButtonElement>
} & ButtonHTMLAttributes<HTMLButtonElement>

const fromVariant = (
    v: ButtonVariant | undefined,
): { appearance: ButtonAppearance; tone: Tone } => {
    switch (v) {
        case 'secondary':
            return { appearance: 'outline', tone: 'neutral' }
        case 'ghost':
            return { appearance: 'ghost', tone: 'neutral' }
        case 'success':
        case 'warning':
        case 'danger':
            return { appearance: 'solid', tone: v }
        case 'primary':
        default:
            return { appearance: 'solid', tone: 'accent' }
    }
}

const ARIA_KEY: Record<string, string> = {
    ctrl: 'Control',
    cmd: 'Meta',
    '⌘': 'Meta',
    opt: 'Alt',
    option: 'Alt',
    alt: 'Alt',
    shift: 'Shift',
    enter: 'Enter',
    esc: 'Escape',
}

const toAriaShortcut = (keys: string[]) =>
    keys.map((k) => ARIA_KEY[k.toLowerCase()] ?? k).join('+')

export const Button = ({
    variant,
    appearance: appearanceProp,
    tone: toneProp,
    linkStyle = 'underline',
    size = 'md',
    shape = 'default',
    iconOnly,
    iconLeft,
    iconRight,
    loading,
    loadingText,
    selected,
    badge,
    shortcut,
    confirm,
    tooltip,
    fullWidth,
    disabled,
    children,
    onClick,
    ref,
    ...rest
}: ButtonProps) => {
    const mapped = fromVariant(variant)
    const appearance = appearanceProp ?? mapped.appearance
    const tone = toneProp ?? (appearanceProp ? 'accent' : mapped.tone)
    const isDisabled = disabled || loading
    const square = iconOnly || shape === 'square'
    const keys = shortcut?.split(/\s+/).filter(Boolean)

    const [pendingEvent, setPendingEvent] =
        useState<MouseEvent<HTMLButtonElement> | null>(null)

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        if (confirm) {
            setPendingEvent(e)
            return
        }
        onClick?.(e)
    }

    const ariaLabel =
        rest['aria-label'] ??
        (iconOnly && typeof tooltip === 'string' ? tooltip : undefined)

    const button = (
        <button
            ref={ref}
            disabled={isDisabled}
            data-ds-button=""
            data-ds-focusable=""
            data-appearance={appearance}
            data-tone={tone}
            data-size={size}
            data-shape={shape === 'pill' ? 'pill' : undefined}
            data-icon-only={square ? '' : undefined}
            data-link-style={appearance === 'link' ? linkStyle : undefined}
            data-full-width={fullWidth ? '' : undefined}
            aria-pressed={selected === undefined ? undefined : selected}
            aria-busy={loading || undefined}
            aria-keyshortcuts={keys?.length ? toAriaShortcut(keys) : undefined}
            aria-haspopup={confirm ? 'dialog' : undefined}
            onClick={handleClick}
            {...rest}
            aria-label={ariaLabel}
        >
            {loading ? (
                <span data-ds-button-icon="">
                    <span aria-hidden data-ds-spinner="" data-ds-button-spinner="" />
                </span>
            ) : iconLeft ? (
                <span data-ds-button-icon="" aria-hidden>
                    {iconLeft}
                </span>
            ) : null}
            {loading && loadingText !== undefined ? loadingText : children}
            {!loading && iconRight && (
                <span data-ds-button-icon="" aria-hidden>
                    {iconRight}
                </span>
            )}
            {keys?.length ? (
                <span aria-hidden style={{ display: 'inline-flex', gap: '2px' }}>
                    {keys.map((k) => (
                        <Kbd key={k} size="sm">
                            {k}
                        </Kbd>
                    ))}
                </span>
            ) : null}
            {badge !== undefined && badge !== null && badge !== false && (
                <span data-ds-button-badge="">{badge}</span>
            )}
        </button>
    )

    return (
        <>
            {tooltip ? <Tooltip content={tooltip}>{button}</Tooltip> : button}
            {confirm && (
                <Dialog
                    open={pendingEvent !== null}
                    onClose={() => setPendingEvent(null)}
                    title={confirm.title}
                    description={confirm.description}
                    size="sm"
                    footer={
                        <DialogActions>
                            <Button
                                appearance="outline"
                                tone="neutral"
                                onClick={() => setPendingEvent(null)}
                            >
                                {confirm.cancelText ?? '취소'}
                            </Button>
                            <Button
                                appearance="solid"
                                tone={confirm.tone ?? tone}
                                onClick={() => {
                                    const e = pendingEvent
                                    setPendingEvent(null)
                                    if (e) onClick?.(e)
                                }}
                            >
                                {confirm.confirmText ?? children}
                            </Button>
                        </DialogActions>
                    }
                />
            )}
        </>
    )
}
