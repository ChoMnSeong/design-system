import {
    useEffect,
    useState,
    type CSSProperties,
    type KeyboardEvent as ReactKeyboardEvent,
    type ImgHTMLAttributes,
    type ReactNode,
    type Ref,
} from 'react'
import { createPortal } from 'react-dom'
import { mergeStyles } from '../types.js'

export type ImageProps = {
    /** 이미지 주소 */
    src: string
    /** 대체 텍스트 */
    alt?: string
    /** 폭 (숫자는 px, img width 속성으로도 전달) */
    width?: number | string
    /** 높이 (숫자는 px, img height 속성으로도 전달) */
    height?: number | string
    /** 가로세로 비율 (예: 1.5, "16/9") */
    aspectRatio?: number | string
    /** 틀 안에 맞추는 방식 (object-fit) */
    fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
    /** 반경 토큰(xs~3xl · full) 또는 CSS 값 */
    radius?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' | (string & {})
    /** 누르면 원본을 크게 본다 */
    preview?: boolean
    /** 이미지 아래 설명 (figure · figcaption) */
    caption?: ReactNode
    /** 로드 실패 시 대신 보일 내용 (없으면 "이미지 없음") */
    fallback?: ReactNode
    /** 로드가 끝나기 전 가운데 보일 내용 */
    placeholder?: ReactNode
    /** 기본 'lazy'. 첫 화면에 보이는 이미지에만 'eager' 를 준다. */
    loading?: 'lazy' | 'eager'
    /** 바깥 틀 DOM 요소 ref */
    ref?: Ref<HTMLDivElement>
} & Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    'width' | 'height' | 'src' | 'alt' | 'loading'
>

const dim = (v: number | string | undefined) =>
    v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v

/** 로딩·실패·크게 보기를 처리하는 이미지 */
export const Image = ({
    src,
    alt = '',
    width,
    height,
    aspectRatio,
    fit = 'cover',
    radius: radiusProp,
    preview,
    caption,
    fallback,
    placeholder,
    loading = 'lazy',
    style,
    ref,
    ...rest
}: ImageProps) => {
    const radius =
        radiusProp && /^(none|xs|sm|md|lg|xl|2xl|3xl|full)$/.test(radiusProp)
            ? `var(--ds-radius-${radiusProp})`
            : radiusProp
    const [open, setOpen] = useState(false)
    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open])
    const [loaded, setLoaded] = useState(false)
    const [errored, setErrored] = useState(false)
    // 숫자 크기는 HTML 속성으로도 넘긴다. 브라우저가 로드 전에 자리를 잡아 CLS 를 막는다.
    const intrinsicWidth = typeof width === 'number' ? width : undefined
    const intrinsicHeight = typeof height === 'number' ? height : undefined

    const containerStyle: CSSProperties = {
        position: 'relative',
        width: dim(width),
        height: dim(height),
        aspectRatio: aspectRatio !== undefined ? String(aspectRatio) : undefined,
        background: 'var(--ds-color-background-inset)',
        borderRadius: radius,
        overflow: 'hidden',
        display: 'inline-block',
    }

    if (errored) {
        return (
            <div
                ref={ref}
                style={mergeStyles(containerStyle, style)}
                aria-label={alt}
            >
                {fallback ?? (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--ds-color-foreground-muted)',
                            fontSize: '11px',
                        }}
                    >
                        이미지 없음
                    </div>
                )}
            </div>
        )
    }

    const body = (
        <div
            ref={ref}
            style={mergeStyles(containerStyle, preview ? { cursor: 'zoom-in' } : null, style)}
            {...(preview
                ? {
                      role: 'button',
                      tabIndex: 0,
                      'aria-label': `${alt || '이미지'} 크게 보기`,
                      onClick: () => setOpen(true),
                      onKeyDown: (e: ReactKeyboardEvent) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setOpen(true)
                          }
                      },
                  }
                : null)}
        >
            {!loaded && placeholder && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {placeholder}
                </div>
            )}
            <img
                src={src}
                alt={alt}
                width={intrinsicWidth}
                height={intrinsicHeight}
                loading={loading}
                decoding="async"
                onLoad={() => setLoaded(true)}
                onError={() => setErrored(true)}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: fit,
                    display: 'block',
                    opacity: loaded ? 1 : 0,
                    transition: 'opacity 200ms ease',
                }}
                {...rest}
            />
        </div>
    )
    const overlay =
        open && typeof document !== 'undefined'
            ? createPortal(
                  <div
                      role="dialog"
                      aria-modal="true"
                      aria-label={alt || '이미지 미리보기'}
                      onClick={() => setOpen(false)}
                      style={{
                          position: 'fixed',
                          inset: 0,
                          zIndex: 'var(--ds-z-index-modal)' as unknown as number,
                          background: 'var(--ds-color-background-scrim)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '32px',
                          cursor: 'zoom-out',
                      }}
                  >
                      <img src={src} alt={alt} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 'var(--ds-radius-md)', boxShadow: 'var(--ds-shadow-xl)' }} />
                  </div>,
                  document.body,
              )
            : null
    if (!caption) return <>{body}{overlay}</>
    return (
        <figure style={{ margin: 0, display: 'inline-flex', flexDirection: 'column', gap: '6px', width: dim(width) }}>
            {body}
            <figcaption style={{ fontSize: '12px', color: 'var(--ds-color-foreground-tertiary)' }}>{caption}</figcaption>
            {overlay}
        </figure>
    )
}
