import { useState, type HTMLAttributes, type ReactNode } from 'react'
import type { BorderVariant } from './borderVariant.js'
import { IconChevronLeft, IconChevronRight } from './icons.js'
import { Select } from './Select.js'

export type PaginationProps = {
    page: number
    pageCount?: number
    onPageChange?: (page: number) => void
    /** @deprecated onPageChange 를 쓴다 */
    onChange?: (page: number) => void
    siblings?: number
    /** 처음 · 끝 버튼 */
    showEdges?: boolean
    /** outlined: 버튼마다 테두리 · 그 밖: 테두리 없음 */
    variant?: BorderVariant
    pageSize?: number
    pageSizeOptions?: number[]
    onPageSizeChange?: (size: number) => void
    /** pageCount 대신 줄 수 있다 (pageSize 와 함께) */
    totalCount?: number
    /** true: "총 1,284건" · 함수: 직접 */
    showTotal?: boolean | ((total: number, range: [number, number]) => ReactNode)
    /** 페이지 번호 직접 입력 */
    showJumper?: boolean
    /** full: 번호 · simple: 5 / 26 · compact: 이전/다음 + 범위 */
    appearance?: 'full' | 'simple' | 'compact'
    size?: 'sm' | 'md'
} & Omit<HTMLAttributes<HTMLElement>, 'onChange'>

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i)

/** 1 … 4 5 6 … 26 */
export const pageItems = (page: number, count: number, siblings: number): Array<number | 'gap'> => {
    const total = siblings * 2 + 5
    if (count <= total) return range(1, count)
    const left = Math.max(page - siblings, 2)
    const right = Math.min(page + siblings, count - 1)
    const out: Array<number | 'gap'> = [1]
    if (left > 2) out.push('gap')
    out.push(...range(left, right))
    if (right < count - 1) out.push('gap')
    out.push(count)
    return out
}

const ICON_FIRST = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
    </svg>
)
const ICON_LAST = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
    </svg>
)

export const Pagination = ({
    page,
    pageCount: pageCountProp,
    onPageChange,
    onChange,
    siblings = 1,
    showEdges,
    variant = 'ghost',
    pageSize,
    pageSizeOptions,
    onPageSizeChange,
    totalCount,
    showTotal,
    showJumper,
    appearance = 'full',
    size = 'md',
    ...rest
}: PaginationProps) => {
    const pageCount = Math.max(1, pageCountProp ?? (totalCount !== undefined && pageSize ? Math.ceil(totalCount / pageSize) : 1))
    const go = (p: number) => {
        const n = Math.min(pageCount, Math.max(1, p))
        if (n === page) return
        onPageChange?.(n)
        onChange?.(n)
    }
    const [jump, setJump] = useState('')
    const ps = pageSize ?? 0
    const from = totalCount !== undefined && ps ? Math.min(totalCount, (page - 1) * ps + 1) : 0
    const to = totalCount !== undefined && ps ? Math.min(totalCount, page * ps) : 0
    const iconSize = size === 'sm' ? 14 : 16
    const nav = (label: string, icon: ReactNode, target: number, disabled: boolean) => (
        <button type="button" data-slot="btn" aria-label={label} disabled={disabled} onClick={() => go(target)}>
            {icon}
        </button>
    )

    return (
        <nav aria-label="페이지" data-ds-pagination="" data-variant={variant === 'outlined' ? 'outlined' : 'ghost'} data-size={size} {...rest}>
            {showTotal && totalCount !== undefined && (
                <span data-slot="total">
                    {typeof showTotal === 'function' ? showTotal(totalCount, [from, to]) : <>총 <b>{totalCount.toLocaleString('ko-KR')}</b>건</>}
                </span>
            )}
            {pageSizeOptions && pageSize && (
                <Select
                    size={size === 'sm' ? 'xs' : 'sm'}
                    width={size === 'sm' ? 88 : 100}
                    aria-label="페이지당 행 수"
                    value={String(pageSize)}
                    options={pageSizeOptions.map((n) => ({ value: String(n), label: `${n}개씩` }))}
                    onValueChange={(v: string | null) => v && onPageSizeChange?.(Number(v))}
                />
            )}
            <div data-slot="pages">
                {showEdges && appearance === 'full' && nav('처음', ICON_FIRST, 1, page <= 1)}
                {nav('이전 페이지', <IconChevronLeft size={iconSize} />, page - 1, page <= 1)}
                {appearance === 'full' &&
                    pageItems(page, pageCount, siblings).map((p, i) =>
                        p === 'gap' ? (
                            <span key={`g${i}`} data-slot="gap" aria-hidden>
                                …
                            </span>
                        ) : (
                            <button key={p} type="button" data-slot="btn" aria-current={p === page ? 'page' : undefined} aria-label={`${p} 페이지`} onClick={() => go(p)}>
                                {p}
                            </button>
                        ),
                    )}
                {appearance === 'simple' && (
                    <span data-slot="simple">
                        {page} / {pageCount}
                    </span>
                )}
                {nav('다음 페이지', <IconChevronRight size={iconSize} />, page + 1, page >= pageCount)}
                {showEdges && appearance === 'full' && nav('끝', ICON_LAST, pageCount, page >= pageCount)}
                {appearance === 'compact' && totalCount !== undefined && (
                    <span data-slot="simple">
                        {from}–{to}
                    </span>
                )}
            </div>
            {showJumper && (
                <form
                    data-slot="jumper"
                    onSubmit={(e) => {
                        e.preventDefault()
                        const n = parseInt(jump, 10)
                        if (!Number.isNaN(n)) go(n)
                        setJump('')
                    }}
                >
                    <label>
                        이동
                        <input inputMode="numeric" value={jump} placeholder={String(page)} onChange={(e) => setJump(e.target.value.replace(/\D/g, ''))} aria-label="이동할 페이지" />
                    </label>
                </form>
            )}
        </nav>
    )
}
