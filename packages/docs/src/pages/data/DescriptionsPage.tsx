import { Badge, Descriptions } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const DescriptionsPage = () => (
    <>
        <PageHeader title="Descriptions" description="상세 화면의 라벨 : 값. columns · span · bordered · layout." />
        <ComponentPreview title="columns=3 · bordered · span" code={`<Descriptions bordered columns={3} items={[…, { label: '비고', value: '…', span: 3 }]} />`}>
            <Descriptions
                bordered
                columns={3}
                style={{ width: '100%' }}
                items={[
                    { label: '작업지시', value: 'WO-2611-0042' },
                    { label: '품목', value: '브래킷 A형' },
                    { label: '라인', value: '1라인' },
                    { label: '계획', value: '1,200 EA' },
                    { label: '실적', value: '1,064 EA' },
                    { label: '상태', value: <Badge size="sm" tone="info">작업중</Badge> },
                    { label: '비고', value: '고객 요청으로 납기 1일 앞당김', span: 3 },
                ]}
            />
        </ComponentPreview>
        <ComponentPreview title="layout=vertical" code={`<Descriptions layout="vertical" columns={4} items={…} />`}>
            <Descriptions
                layout="vertical"
                columns={4}
                style={{ width: '100%' }}
                items={[
                    { label: '거래처', value: '(주)한빛정밀' },
                    { label: '납기', value: '2026-11-21' },
                    { label: '담당', value: '생산1팀' },
                    { label: '우선순위', value: <Badge size="sm" tone="danger">긴급</Badge> },
                ]}
            />
        </ComponentPreview>
    </>
)
