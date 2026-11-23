import { useState } from 'react'
import { Button, Dialog, DialogActions, Input, confirm } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const DialogPage = () => {
    const [dirty, setDirty] = useState('')
    const [result, setResult] = useState<string>('')
    return (
        <>
            <PageHeader title="Dialog · confirm()" description="open · onOpenChange 또는 trigger 로 비제어. size xs~xl · fullscreen, tone, scrollBehavior, draggable, onBeforeClose. confirm() 은 Promise<boolean>." />
            <ComponentPreview
                title="기본 · draggable · onBeforeClose"
                code={`<Dialog trigger={<Button>열기</Button>} title="작업지시 수정" draggable onBeforeClose={() => !dirty || window.confirm('저장하지 않고 닫을까요?')} footer={…}>…</Dialog>`}
            >
                <Dialog
                    trigger={<Button>작업지시 수정</Button>}
                    title="작업지시 수정"
                    description="제목 줄을 끌어 옮길 수 있습니다."
                    draggable
                    onBeforeClose={() => !dirty || window.confirm('저장하지 않은 변경이 있습니다. 닫을까요?')}
                    footer={
                        <DialogActions>
                            <Button appearance="outline" tone="neutral">취소</Button>
                            <Button>저장</Button>
                        </DialogActions>
                    }
                >
                    <Input fullWidth placeholder="비고 (입력하면 닫을 때 확인)" value={dirty} onChange={(e) => setDirty(e.target.value)} />
                </Dialog>
                <Dialog trigger={<Button appearance="outline" tone="neutral">긴 본문 (outside 스크롤)</Button>} title="검사 기준서" size="lg" scrollBehavior="outside">
                    {Array.from({ length: 40 }, (_, i) => <p key={i}>{i + 1}. 치수 공차 ±0.05mm 이내, 표면 스크래치 0.2mm 이하.</p>)}
                </Dialog>
            </ComponentPreview>
            <ComponentPreview
                title="confirm()"
                code={`const ok = await confirm({ title: '작업지시 3건을 삭제할까요?', description: '투입 자재 이력도 삭제됩니다.', tone: 'danger', confirmText: '삭제' })`}
            >
                <Button
                    appearance="soft"
                    tone="danger"
                    onClick={async () => {
                        const ok = await confirm({ title: '작업지시 3건을 삭제할까요?', description: '투입 자재 이력도 삭제됩니다.', tone: 'danger', confirmText: '삭제' })
                        setResult(ok ? '삭제함' : '취소함')
                    }}
                >
                    삭제
                </Button>
                {result && <span style={{ fontSize: 13 }}>결과: {result}</span>}
            </ComponentPreview>
        </>
    )
}
