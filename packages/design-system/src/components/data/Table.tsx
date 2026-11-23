import type {
    CSSProperties,
    HTMLAttributes,
    TableHTMLAttributes,
    TdHTMLAttributes,
    ThHTMLAttributes,
    Ref,
} from 'react'
import type { BorderVariant } from '../borderVariant.js'
import type { Density } from '../types.js'
import { useBorderVariant } from '../../provider/useDesignSystem.js'
import { IconArrowDown, IconArrowUp } from '../icons.js'

export type TableProps = {
    striped?: boolean
    hoverable?: boolean
    /** outlined(바깥 테두리) · underline(행 구분선만) · filled(헤더 배경) · ghost(구분선 없음) */
    variant?: BorderVariant
    density?: Density
    /** 셀 사이 세로 구분선 */
    bordered?: boolean
    /** 스크롤해도 헤더 고정. maxHeight 와 함께 */
    stickyHeader?: boolean
    maxHeight?: number | string
    /** 바깥 상자 스타일 (style 은 table 에 붙는다) */
    containerStyle?: CSSProperties
    ref?: Ref<HTMLTableElement>
} & TableHTMLAttributes<HTMLTableElement>

export const Table = ({
    striped,
    hoverable = true,
    variant: variantProp,
    density = 'default',
    bordered,
    stickyHeader,
    maxHeight,
    containerStyle,
    ref,
    ...rest
}: TableProps) => {
    const variant = useBorderVariant(variantProp)
    return (
        <div
            data-ds-table-wrap=""
            data-variant={variant}
            style={{ ...(maxHeight !== undefined ? { maxHeight, overflow: 'auto' } : null), ...containerStyle }}
        >
            <table
                ref={ref}
                data-ds-table=""
                data-density={density}
                data-striped={striped ? '' : undefined}
                data-hoverable={hoverable ? '' : undefined}
                data-bordered={bordered ? '' : undefined}
                data-sticky={stickyHeader ? '' : undefined}
                {...rest}
            />
        </div>
    )
}

export const TableHead = (props: HTMLAttributes<HTMLTableSectionElement>) => <thead {...props} />
export const TableBody = (props: HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />
/** 합계 등 tfoot 슬롯 */
export const TableFooter = (props: HTMLAttributes<HTMLTableSectionElement>) => <tfoot {...props} />
export const TableRow = (props: HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }) => {
    const { selected, ...rest } = props
    return <tr data-selected={selected ? '' : undefined} aria-selected={selected} {...rest} />
}

type Align = 'left' | 'right' | 'center'

export type TableHeaderCellProps = {
    align?: Align
    /** 정렬 표시만 한다 (정렬 동작은 부모가) */
    sortDirection?: 'asc' | 'desc' | null
} & ThHTMLAttributes<HTMLTableCellElement>

export const TableHeaderCell = ({ align, sortDirection, children, ...rest }: TableHeaderCellProps) => (
    <th
        data-align={align}
        aria-sort={sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : undefined}
        {...rest}
    >
        {children}
        {sortDirection && (
            <span data-slot="sort" aria-hidden>
                {sortDirection === 'asc' ? <IconArrowUp size={12} /> : <IconArrowDown size={12} />}
            </span>
        )}
    </th>
)

export const TableCell = ({ align, ...rest }: { align?: Align } & TdHTMLAttributes<HTMLTableCellElement>) => (
    <td data-align={align} {...rest} />
)
