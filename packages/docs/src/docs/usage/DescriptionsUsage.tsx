import { Badge, Descriptions } from '@ensnif/design-system'

export default function Example() {
    return (
        <Descriptions
            title="작업지시 상세"
            bordered
            columns={2}
            items={[
                { label: '작업지시', value: 'WO-2411-001' },
                { label: '상태', value: <Badge tone="success">진행</Badge> },
                { label: '품목', value: '브래킷 A형' },
                { label: '라인', value: '1라인' },
                { label: '비고', value: '자재 입고 후 착수', span: 2 },
            ]}
        />
    )
}
