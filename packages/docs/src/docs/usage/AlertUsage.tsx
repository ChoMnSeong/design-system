import { Alert, Button } from '@ensnif/design-system'

export default function Example() {
    return (
        <Alert
            tone="warning"
            title="자재 재고 부족"
            closable
            actions={<Button size="sm" appearance="outline" tone="neutral">발주 요청</Button>}
        >
            샤프트 Ø32 재고가 안전 재고(500) 아래로 떨어졌습니다.
        </Alert>
    )
}
