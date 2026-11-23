import { Accordion, AccordionItem, Badge } from '@ensnif/design-system'

export default function Example() {
    return (
        <Accordion type="multiple" defaultValue={['ship']}>
            <AccordionItem value="ship" title="배송 안내" extra={<Badge size="xs">무료</Badge>}>
                오후 2시 전 주문은 당일 출고합니다.
            </AccordionItem>
            <AccordionItem value="return" title="교환 · 반품">
                수령 후 7일 안에 신청할 수 있습니다.
            </AccordionItem>
            <AccordionItem value="as" title="A/S" disabled>
                준비 중입니다.
            </AccordionItem>
        </Accordion>
    )
}
