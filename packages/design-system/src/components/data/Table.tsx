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
    /** 줄마다 번갈아 배경 */
    striped?: boolean
    /** 행에 마우스를 올리면 배경 강조 */
    hoverable?: boolean
    /** outlined(바깥 테두리) · underline(행 구분선만) · filled(헤더 배경) · ghost(구분선 없음) */
    variant?: BorderVariant
    /** 셀 여백 · 글자 크기 (compact 12px · comfortable 14px) */
    density?: Density
    /** 셀 사이 세로 구분선 */
    bordered?: boolean
    /** 스크롤해도 헤더 고정. maxHeight 와 함께 */
    stickyHeader?: boolean
    /** 바깥 상자 최대 높이. 넘으면 스크롤 */
    maxHeight?: number | string
    /** 바깥 상자 스타일 (style 은 table 에 붙는다) */
    containerStyle?: CSSProperties
    /** DOM 요소 ref */
    ref?: Ref<HTMLTableElement>
} & TableHTMLAttributes<HTMLTableElement>

/** 기본 표. TableHead · TableBody · TableRow · TableCell 을 안에 넣는다 */
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
export const TableRow = (props: HTMLAttributes<HTMLTableRowElement> & { /** 선택된 행 강조 (aria-selected) */ selected?: boolean }) => {
    const { selected, ...rest } = props
    return <tr data-selected={selected ? '' : undefined} aria-selected={selected} {...rest} />
}

type Align = 'left' | 'right' | 'center'

export type TableHeaderCellProps = {
    /** 글 정렬 */
    align?: Align
    /** 정렬 표시만 한다 (정렬 동작은 부모가) */
    sortDirection?: 'asc' | 'desc' | null
} & ThHTMLAttributes<HTMLTableCellElement>

/** 표 머리 칸 (th). 정렬 방향 화살표를 붙일 수 있다 */
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

export const TableCell = ({ align, ...rest }: { /** 글자 정렬. 숫자는 right */ align?: Align } & TdHTMLAttributes<HTMLTableCellElement>) => (
    <td data-align={align} {...rest} />
)
