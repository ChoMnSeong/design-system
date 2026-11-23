import { BottomSheet, Button } from '@ensnif/design-system'
import { useState } from 'react'

export default function Example() {
    const [open, setOpen] = useState(false)
    return (
        <>
            <Button onClick={() => setOpen(true)}>옵션 선택</Button>
            <BottomSheet
                open={open}
                onOpenChange={setOpen}
                title="옵션 선택"
                footer={<Button style={{ width: '100%' }} onClick={() => setOpen(false)}>장바구니 담기</Button>}
            >
                색상 · 사이즈를 고르세요.
            </BottomSheet>
        </>
    )
}
