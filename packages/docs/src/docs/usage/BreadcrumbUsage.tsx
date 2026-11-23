import { Breadcrumb } from '@ensnif/design-system'

export default function Example() {
    return (
        <Breadcrumb
            maxItems={4}
            items={[
                { label: '홈', href: '/' },
                { label: '생산', href: '/production' },
                { label: '작업지시', href: '/production/orders' },
                { label: '2라인', href: '/production/orders?line=2' },
                { label: 'WO-24-1182' },
            ]}
        />
    )
}
