import { useState } from 'react'
import { Button, Drawer } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const DrawerPage = () => {
    const [open, setOpen] = useState<null | 'right' | 'bottom' | 'detail'>(null)
    return (
        <>
            <PageHeader title="Drawer" description="side 4방향, size sm~xl, resizable, modal=false(페이지와 함께 쓰는 상세 패널)." />
            <ComponentPreview title="기본" code={`<Drawer open={open} onOpenChange={setOpen} title="설비 상세" size="md" resizable>…</Drawer>`}>
                <Button onClick={() => setOpen('right')}>오른쪽 · resizable</Button>
                <Button appearance="outline" tone="neutral" onClick={() => setOpen('bottom')}>아래</Button>
                <Button appearance="outline" tone="neutral" onClick={() => setOpen('detail')}>modal=false</Button>
                <Drawer open={open === 'right'} onOpenChange={(o) => !o && setOpen(null)} title="설비 상세" description="PRESS-03 · 2라인" resizable footer={<Button onClick={() => setOpen(null)}>확인</Button>}>
                    가장자리를 끌어 폭을 바꿀 수 있습니다.
                </Drawer>
                <Drawer open={open === 'bottom'} onOpenChange={(o) => !o && setOpen(null)} side="bottom" size="sm" title="필터">
                    모바일 하단 시트처럼 씁니다.
                </Drawer>
                <Drawer open={open === 'detail'} onOpenChange={(o) => !o && setOpen(null)} modal={false} size="sm" title="상세 패널">
                    뒤 페이지를 계속 조작할 수 있습니다.
                </Drawer>
            </ComponentPreview>
        </>
    )
}
