import { Badge, Table, TableBody, TableCell, TableFooter, TableHead, TableHeaderCell, TableRow } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const TablePage = () => (
    <>
        <PageHeader title="Table" description="variant · density · striped · bordered · stickyHeader, TableFooter, 셀 align, 정렬 표시." />
        <ComponentPreview title="default · footer" code={`<Table><TableHead>…</TableHead><TableBody>…</TableBody><TableFooter>…</TableFooter></Table>`}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%', alignItems: 'start' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>품목</TableHeaderCell>
                            <TableHeaderCell align="right">계획</TableHeaderCell>
                            <TableHeaderCell align="right" sortDirection="desc">실적</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[
                            ['브래킷 A형', '1,200', '1,188'],
                            ['하우징 커버', '1,200', '1,160'],
                            ['샤프트 Ø32', '800', '512'],
                        ].map(([a, b, c]) => (
                            <TableRow key={a}>
                                <TableCell>{a}</TableCell>
                                <TableCell align="right">{b}</TableCell>
                                <TableCell align="right">{c}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell>합계</TableCell>
                            <TableCell align="right">3,200</TableCell>
                            <TableCell align="right">2,860</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
                <Table striped bordered density="compact" stickyHeader maxHeight={160}>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>LOT</TableHeaderCell>
                            <TableHeaderCell>검사</TableHeaderCell>
                            <TableHeaderCell align="right">측정값</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[118, 119, 121, 122, 123, 124].map((n) => (
                            <TableRow key={n}>
                                <TableCell>L2611-{n}</TableCell>
                                <TableCell>
                                    <Badge size="xs" tone={n === 121 ? 'danger' : 'success'}>{n === 121 ? '불합격' : '합격'}</Badge>
                                </TableCell>
                                <TableCell align="right">{n === 121 ? '10.34' : '10.02'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </ComponentPreview>
    </>
)
