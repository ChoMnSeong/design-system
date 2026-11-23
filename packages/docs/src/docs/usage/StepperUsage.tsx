import { Stepper } from '@ensnif/design-system'

export default function Example() {
    return (
        <Stepper
            current={2}
            steps={[
                { label: '주문 접수', time: '11/20 09:12' },
                { label: '결제 완료', time: '11/20 09:13' },
                { label: '상품 준비', description: '출고 대기' },
                { label: '배송 중' },
                { label: '배송 완료' },
            ]}
        />
    )
}
