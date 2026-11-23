import { useState } from 'react'
import { Button, Dialog, DialogActions, Input, confirm } from '@ensnif/design-system'

export default function Example() {
    const [open, setOpen] = useState(false)
    const remove = async () => {
        if (await confirm({ title: '작업지시를 삭제할까요?', tone: 'danger', confirmText: '삭제' })) setOpen(false)
    }
    return (
        <>
            <Button onClick={() => setOpen(true)}>작업지시 수정</Button>
            <Dialog
                open={open}
                onOpenChange={setOpen}
                title="작업지시 수정"
                description="WO-2411-001 · 브래킷 A형"
                footer={
                    <DialogActions>
                        <Button appearance="ghost" tone="danger" onClick={remove}>삭제</Button>
                        <Button onClick={() => setOpen(false)}>저장</Button>
                    </DialogActions>
                }
            >
                <Input defaultValue="1200" aria-label="계획 수량" fullWidth />
            </Dialog>
        </>
    )
}
