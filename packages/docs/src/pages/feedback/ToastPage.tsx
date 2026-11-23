import { Button, ToastProvider, useToast } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const ToastPage = () => (
    <ToastProvider placement="bottom-right" max={4}>
        <ToastDemo />
    </ToastProvider>
)

const ToastDemo = () => {
    const { toast, success, error, promise, dismiss } = useToast()
    return (
        <>
            <PageHeader title="Toast" description="ToastProvider placement 6종 · max. toast(opts) · success/error · update · promise · dismiss. action · persistent · progress · id 지정." />
            <ComponentPreview
                title="호출"
                code={`const { toast, success, promise } = useToast()
success({ title: '저장했습니다', progress: true })
toast({ tone: 'warning', title: '안전재고 미달', action: { label: '보기', onClick: open } })
toast({ id: 'plc', tone: 'danger', title: 'PLC 연결 끊김', persistent: true })
promise(save(), { loading: '저장 중…', success: '저장 완료', error: '저장 실패' })`}
            >
                <Button onClick={() => success({ title: '저장했습니다', description: '작업지시 WO-2611-0042', progress: true })}>성공</Button>
                <Button appearance="outline" tone="warning" onClick={() => toast({ tone: 'warning', title: '안전재고 미달 3건', action: { label: '보기', onClick: () => {} } })}>action</Button>
                <Button appearance="outline" tone="danger" onClick={() => toast({ id: 'plc', tone: 'danger', title: 'PLC 연결 끊김', description: '같은 id 는 하나만 남습니다', persistent: true })}>persistent · id</Button>
                <Button appearance="outline" tone="neutral" onClick={() => void promise(new Promise((r) => setTimeout(r, 1500)), { loading: '실적 반영 중…', success: '128건 반영', error: '반영 실패' }).catch(() => {})}>promise</Button>
                <Button appearance="ghost" tone="neutral" onClick={() => { error({ title: '실패 예시' }); setTimeout(() => dismiss(), 1500) }}>dismiss 전체</Button>
            </ComponentPreview>
        </>
    )
}
