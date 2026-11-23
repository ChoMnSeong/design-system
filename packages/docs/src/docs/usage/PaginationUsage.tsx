import { useState } from 'react'
import { Pagination } from '@ensnif/design-system'

export default function Example() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    return (
        <Pagination
            page={page}
            onPageChange={setPage}
            totalCount={1284}
            pageSize={pageSize}
            pageSizeOptions={[20, 50, 100]}
            onPageSizeChange={(n) => {
                setPageSize(n)
                setPage(1)
            }}
            showTotal
        />
    )
}
