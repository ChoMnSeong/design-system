import { Button, DatePicker, Form, FormField, Input, NumberInput, Select } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const FormFieldPage = () => (
    <>
        <PageHeader title="FormField · Form" description="layout vertical · horizontal · inline. Form 이 size · disabled · readOnly · columns 를 하위에 일괄로 내려줍니다." />
        <ComponentPreview
            title="vertical"
            code={`<FormField label="작업지시 번호" required hint="자동 채번됩니다"><Input defaultValue="WO-2611-0042" /></FormField>
<FormField label="비고" optional description="라벨 아래 설명"><Input placeholder="메모" /></FormField>
<FormField label="투입 수량" required tooltip="계획 수량 이하" error="계획 수량(1,200)을 넘을 수 없습니다"><NumberInput defaultValue={1500} /></FormField>`}
        >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, width: '100%', alignItems: 'start' }}>
                <FormField label="작업지시 번호" required hint="자동 채번됩니다">
                    <Input defaultValue="WO-2611-0042" />
                </FormField>
                <FormField label="비고" optional description="description 은 라벨 아래">
                    <Input placeholder="메모" />
                </FormField>
                <FormField label="투입 수량" required tooltip="계획 수량 이하로 입력" error="계획 수량(1,200)을 넘을 수 없습니다">
                    <NumberInput defaultValue={1500} stepper="none" />
                </FormField>
            </div>
        </ComponentPreview>
        <ComponentPreview title="Form · horizontal · columns=2" code={`<Form layout="horizontal" labelWidth={120} columns={2}>…</Form>`}>
            <Form layout="horizontal" labelWidth={120} columns={2} style={{ width: '100%' }}>
                <FormField label="품목" required><Input defaultValue="브래킷 A형" /></FormField>
                <FormField label="라인"><Select defaultValue="1" options={[{ value: '1', label: '1라인' }, { value: '2', label: '2라인' }]} /></FormField>
                <FormField label="계획 수량"><NumberInput defaultValue={1200} unit="EA" stepper="none" /></FormField>
                <FormField label="납기"><DatePicker defaultValue="2026-11-21" /></FormField>
            </Form>
        </ComponentPreview>
        <ComponentPreview title="Form readOnly · 조회 화면" code={`<Form readOnly columns={4}>…</Form>`}>
            <Form readOnly columns={4} style={{ width: '100%' }}>
                <FormField label="품목"><Input defaultValue="브래킷 A형" /></FormField>
                <FormField label="라인"><Select defaultValue="1" options={[{ value: '1', label: '1라인' }]} /></FormField>
                <FormField label="계획 수량"><NumberInput defaultValue={1200} unit="EA" stepper="none" /></FormField>
                <FormField label="납기"><DatePicker defaultValue="2026-11-21" /></FormField>
            </Form>
        </ComponentPreview>
        <ComponentPreview title="layout inline · FilterBar 용" code={`<Form layout="inline" size="sm">…</Form>`}>
            <Form layout="inline" size="sm" onSubmit={(e) => e.preventDefault()}>
                <FormField label="라인"><Select defaultValue="all" width={120} options={[{ value: 'all', label: '전체' }, { value: '1', label: '1라인' }]} /></FormField>
                <FormField label="상태"><Select defaultValue="run" width={120} options={[{ value: 'run', label: '진행' }, { value: 'done', label: '완료' }]} /></FormField>
                <Button size="sm" type="submit">조회</Button>
            </Form>
        </ComponentPreview>
    </>
)
