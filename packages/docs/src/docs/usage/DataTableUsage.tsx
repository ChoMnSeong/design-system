import { Badge, DataTable, type DataTableColumn } from '@ensnif/design-system'

type WorkOrder = { wo: string; item: string; line: string; qty: number; status: string }

const data: WorkOrder[] = [
    { wo: 'WO-2411-001', item: '브래킷 A형', line: '1라인', qty: 1200, status: '진행' },
    { wo: 'WO-2411-002', item: '하우징 커버', line: '2라인', qty: 800, status: '대기' },
]

const columns: DataTableColumn<WorkOrder>[] = [
    { id: 'wo', header: '작업지시', sortable: true },
    { id: 'item', header: '품목', filter: { type: 'text' } },
    { id: 'line', header: '라인' },
    { id: 'qty', header: '수량', align: 'right', sortable: true, aggregate: 'sum' },
    { id: 'status', header: '상태', cell: (r) => <Badge size="sm">{r.status}</Badge> },
]

export default function Example() {
    return <DataTable columns={columns} data={data} rowKey={(r) => r.wo} showSearch selection="multiple" />
}
