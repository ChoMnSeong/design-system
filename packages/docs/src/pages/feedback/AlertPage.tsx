import { Alert, Button, type Tone } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { grid } from '../shared/demoStyles'

export const AlertPage = () => (
    <>
        <PageHeader title="Alert" description="appearance soft · solid · outline · accent-left × tone 6종. actions · closable · banner · size." />
        <ComponentPreview title="soft × tone" code={`<Alert tone="danger" title="soft · danger">PLC 연결이 끊겼습니다.</Alert>`}>
            <div style={grid(2)}>
                {([['info', '11월 마감은 12/03 18:00입니다.'], ['success', '실적 128건이 반영되었습니다.'], ['warning', '안전재고 미달 품목 3건'], ['danger', 'PLC 연결이 끊겼습니다.'], ['accent', '새 화면이 추가되었습니다.'], ['neutral', '읽기 전용 기간입니다.']] as Array<[Tone, string]>).map(([t, m]) => (
                    <Alert key={t} tone={t} title={`soft · ${t}`}>{m}</Alert>
                ))}
            </div>
        </ComponentPreview>
        <ComponentPreview title="solid · outline · accent-left · actions · banner" code={`<Alert appearance="solid" tone="danger" title="solid">설비 정지 2건</Alert>
<Alert tone="danger" closable title="actions" actions={<Button size="sm" tone="danger">품질보류 처리</Button>}>…</Alert>
<Alert banner appearance="solid" tone="accent" actions={…}>12/01 시스템 점검</Alert>`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
                <div style={grid(3)}>
                    <Alert appearance="solid" tone="danger" title="solid">설비 정지 2건</Alert>
                    <Alert appearance="outline" tone="warning" title="outline">검사 대기 6건</Alert>
                    <Alert appearance="accent-left" tone="info" title="accent-left">기준 정보 변경</Alert>
                </div>
                <Alert tone="danger" closable title="actions · closable" actions={<><Button size="sm" tone="danger">품질보류 처리</Button><Button size="sm" appearance="ghost" tone="neutral">자세히</Button></>}>
                    하우징 커버 불량률 1.98%로 기준 1.5%를 넘었습니다.
                </Alert>
                <Alert banner appearance="solid" tone="accent" actions={<Button size="sm" appearance="outline" tone="neutral" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.5)' }}>자세히</Button>}>
                    12/01 02:00~04:00 시스템 점검이 예정되어 있습니다.
                </Alert>
            </div>
        </ComponentPreview>
    </>
)
