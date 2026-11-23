import { useState } from 'react'
import { Pagination } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const PaginationPage = () => {
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(50)
    const [p2, setP2] = useState(5)
    return (
        <>
            <PageHeader title="Pagination" description="appearance full · simple · compact, size, showEdges, pageSize · pageSizeOptions, totalCount · showTotal, showJumper." />
            <ComponentPreview title="full · 총계 · 페이지 크기 · 이동" code={`<Pagination page={page} onPageChange={setPage} totalCount={1284} pageSize={size} pageSizeOptions={[20, 50, 100]} onPageSizeChange={setSize} showTotal showJumper />`}>
                <Pagination page={page} onPageChange={setPage} totalCount={1284} pageSize={size} pageSizeOptions={[20, 50, 100]} onPageSizeChange={(s) => { setSize(s); setPage(1) }} showTotal showJumper />
            </ComponentPreview>
            <ComponentPreview title="outlined · showEdges / simple · compact" code={`<Pagination variant="outlined" showEdges … /> <Pagination appearance="simple" size="sm" … /> <Pagination appearance="compact" … />`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <Pagination variant="outlined" showEdges page={p2} pageCount={26} onPageChange={setP2} />
                    <div style={{ display: 'flex', gap: 24 }}>
                        <Pagination appearance="simple" size="sm" page={p2} pageCount={26} onPageChange={setP2} />
                        <Pagination appearance="compact" size="sm" page={2} totalCount={1284} pageSize={50} />
                    </div>
                </div>
            </ComponentPreview>
        </>
    )
}
