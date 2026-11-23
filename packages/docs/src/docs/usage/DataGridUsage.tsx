import { DataGrid, type GridColumn } from '@ensnif/design-system'

type Lot = { id: string; line: string; item: string; plan: number; actual: number }

const rows: Lot[] = [
    { id: 'LOT-1001', line: '1라인', item: '브래킷 A형', plan: 1200, actual: 1140 },
    { id: 'LOT-1002', line: '2라인', item: '하우징 커버', plan: 800, actual: 812 },
]

const columns: GridColumn<Lot>[] = [
    { field: 'id', headerName: 'LOT', width: 110, pinned: 'left' },
    { field: 'line', headerName: '라인', filter: 'set', filterValues: ['1라인', '2라인'] },
    { field: 'item', headerName: '품목', flex: 1, filter: 'text' },
    {
        field: 'qty',
        headerName: '수량',
        children: [
            { field: 'plan', headerName: '계획', align: 'right', valueFormatter: 'number', aggFunc: 'sum' },
            { field: 'actual', headerName: '실적', align: 'right', valueFormatter: 'number', aggFunc: 'sum', editable: true },
        ],
    },
]

export default function Example() {
    return <DataGrid rows={rows} columns={columns} getRowId={(r) => r.id} height={240} pinnedBottomRow="total" aria-label="LOT 실적" />
}
