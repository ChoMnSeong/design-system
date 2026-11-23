import { useState } from 'react'
import { Button, Descriptions, Drawer } from '@ensnif/design-system'

export default function Example() {
    const [open, setOpen] = useState(false)
    return (
        <>
            <Button appearance="outline" tone="neutral" onClick={() => setOpen(true)}>설비 상세</Button>
            <Drawer
                open={open}
                onOpenChange={setOpen}
                title="PRESS-03"
                description="1공장 · 2라인"
                footer={<Button onClick={() => setOpen(false)}>확인</Button>}
            >
                <Descriptions columns={1} items={[{ label: '상태', value: '가동' }, { label: '가동률', value: '92.4%' }]} />
            </Drawer>
        </>
    )
}
