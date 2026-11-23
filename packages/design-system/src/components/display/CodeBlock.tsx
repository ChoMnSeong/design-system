import { useState, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { mergeStyles } from '../types.js'
import { IconCheck } from '../icons.js'

export type CodeBlockProps = {
    /** 표시할 코드 문자열 */
    code: string
    /** 머리글에 표시할 언어 이름 (하이라이팅 없음) */
    language?: string
    /** 머리글에 표시할 파일 이름 */
    fileName?: ReactNode
    /** 왼쪽 줄 번호 표시 */
    showLineNumbers?: boolean
    /** 머리글의 복사 버튼 표시 */
    showCopy?: boolean
    /** 최대 높이 (숫자는 px). 넘으면 스크롤 */
    maxHeight?: number | string
    /** 강조할 줄 번호 (1부터) */
    highlightLines?: number[]
    /** 긴 줄을 줄바꿈한다 (기본은 가로 스크롤) */
    wrap?: boolean
    /** DOM 요소 ref */
    ref?: Ref<HTMLDivElement>
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

/** 파일명·언어·복사 버튼이 달린 코드 블록 */
export const CodeBlock = ({
    code,
    language,
    fileName,
    showLineNumbers,
    showCopy = true,
    maxHeight,
    highlightLines,
    wrap,
    style,
    ref,
    ...rest
}: CodeBlockProps) => {
    const [copied, setCopied] = useState(false)
    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1200)
        } catch {
            /* ignore */
        }
    }
    const lines = code.split('\n')
    const lineNumberWidth = String(lines.length).length

    return (
        <div
            ref={ref}
            style={mergeStyles(
                {
                    border: '1px solid var(--ds-color-border-subtle)',
                    borderRadius: 'var(--ds-radius-md)',
                    overflow: 'hidden',
                    background: 'var(--ds-color-background-inset)',
                    fontFamily: 'var(--ds-typography-font-family-mono)',
                },
                style,
            )}
            {...rest}
        >
            {(fileName || language || showCopy) && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px 6px 14px',
                        background: 'var(--ds-color-background-card)',
                        borderBottom: '1px solid var(--ds-color-border-subtle)',
                        fontSize: '11px',
                    }}
                >
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: 'var(--ds-color-foreground-tertiary)',
                            fontFamily:
                                'var(--ds-typography-font-family-mono)',
                        }}
                    >
                        {fileName && <span>{fileName}</span>}
                        {language && (
                            <span
                                style={{
                                    padding: '2px 6px',
                                    background:
                                        'var(--ds-color-background-inset)',
                                    border: '1px solid var(--ds-color-border-subtle)',
                                    borderRadius: 'var(--ds-radius-xs)',
                                    fontWeight: 600,
                                    fontSize: '10px',
                                }}
                            >
                                {language}
                            </span>
                        )}
                    </span>
                    {showCopy && (
                        <button
                            data-ds-interactive="subtle"
                            type="button"
                            onClick={onCopy}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 8px',
                                background: 'transparent',
                                color: copied
                                    ? 'var(--ds-color-state-success)'
                                    : 'var(--ds-color-foreground-secondary)',
                                border: '1px solid var(--ds-color-border-subtle)',
                                borderRadius: 'var(--ds-radius-sm)',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: 600,
                                fontFamily: 'inherit',
                            }}
                        >
                            {copied && <IconCheck size={12} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    )}
                </div>
            )}
            <pre
                translate="no"
                data-ds-scrollbar=""
                style={{
                    margin: 0,
                    padding: '14px 16px',
                    fontSize: '12px',
                    lineHeight: 1.6,
                    color: 'var(--ds-color-foreground-secondary)',
                    overflowX: 'auto',
                    maxHeight:
                        typeof maxHeight === 'number'
                            ? `${maxHeight}px`
                            : maxHeight,
                }}
            >
                {showLineNumbers || highlightLines?.length || wrap ? (
                    <code>
                        {lines.map((line, i) => (
                            <div
                                key={i}
                                data-highlight={highlightLines?.includes(i + 1) ? '' : undefined}
                                style={{
                                    display: 'flex',
                                    margin: '0 -16px',
                                    padding: '0 16px',
                                    ...(highlightLines?.includes(i + 1)
                                        ? {
                                              background: 'color-mix(in oklab, var(--ds-palette-primary-500) 12%, transparent)',
                                              boxShadow: 'inset 3px 0 0 var(--ds-palette-primary-500)',
                                          }
                                        : null),
                                }}
                            >
                                {showLineNumbers && <span
                                    aria-hidden
                                    style={{
                                        flex: '0 0 auto',
                                        width: `${lineNumberWidth}ch`,
                                        marginRight: '14px',
                                        color: 'var(--ds-color-foreground-muted)',
                                        userSelect: 'none',
                                        textAlign: 'right',
                                    }}
                                >
                                    {i + 1}
                                </span>}
                                <span style={{ flex: 1, whiteSpace: wrap ? 'pre-wrap' : 'pre', overflowWrap: wrap ? 'anywhere' : undefined }}>
                                    {line || ' '}
                                </span>
                            </div>
                        ))}
                    </code>
                ) : (
                    <code>{code}</code>
                )}
            </pre>
        </div>
    )
}
