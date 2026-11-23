import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@ensnif/design-system'

const rows = [
    { wo: 'WO-2411-001', item: '브래킷 A형', qty: 1200 },
    { wo: 'WO-2411-002', item: '하우징 커버', qty: 800 },
]

export default function Example() {
    return (
        <Table striped>
            <TableHead>
                <TableRow>
                    <TableHeaderCell>작업지시</TableHeaderCell>
                    <TableHeaderCell>품목</TableHeaderCell>
                    <TableHeaderCell align="right">수량</TableHeaderCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((r) => (
                    <TableRow key={r.wo}>
                        <TableCell>{r.wo}</TableCell>
                        <TableCell>{r.item}</TableCell>
                        <TableCell align="right">{r.qty.toLocaleString()}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
