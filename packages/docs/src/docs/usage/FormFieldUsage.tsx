import { Button, Form, FormField, Input, NumberInput, Select } from '@ensnif/design-system'

export default function Example() {
    return (
        <Form layout="horizontal" labelWidth={100} columns={2} onSubmit={(e) => e.preventDefault()}>
            <FormField label="작업지시 번호" required hint="자동 채번됩니다">
                <Input defaultValue="WO-2611-0042" readOnly />
            </FormField>
            <FormField label="라인">
                <Select options={[{ value: 'L1', label: '1라인' }, { value: 'L2', label: '2라인' }]} />
            </FormField>
            <FormField label="투입 수량" required error="계획 수량(1,200)을 넘을 수 없습니다">
                <NumberInput defaultValue={1500} unit="EA" />
            </FormField>
            <FormField label="비고" optional>
                <Input placeholder="메모" />
            </FormField>
            <Button type="submit" appearance="solid" tone="accent">저장</Button>
        </Form>
    )
}
