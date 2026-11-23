import { Badge, Breadcrumb, Button, PageHeader } from '@ensnif/design-system'

export default function Example() {
    return (
        <PageHeader
            breadcrumb={<Breadcrumb items={[{ label: '생산', href: '#' }, { label: '작업지시', href: '#' }, { label: 'WO-24-1182' }]} />}
            title="WO-24-1182"
            extra={<Badge tone="info" appearance="soft">진행 중</Badge>}
            description="2라인 · 브래킷 A-102 · 1,200 EA"
            actions={
                <>
                    <Button appearance="ghost">수정</Button>
                    <Button appearance="solid" tone="accent">완료 처리</Button>
                </>
            }
            onBack={() => history.back()}
        />
    )
}
