import { useState } from 'react'
import {
    Button,
    Calendar,
    DatePicker,
    DateRangePicker,
    FileUpload,
    Form,
    FormField,
    Input,
    Label,
    NumberInput,
    Select,
    TimePicker,
    type DateRange,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const field = { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--ds-color-foreground-tertiary)' } as const

export const DatePickerPage = () => {
    const [range, setRange] = useState<DateRange>(['2026-11-16', '2026-11-20'])
    return (
        <>
            <PageHeader title="DatePicker · DateRangePicker" description="picker date · week · month · quarter · year, showTime, presets, maxRange. 로케일과 주 시작은 Provider 기본값을 따릅니다." />
            <ComponentPreview
                title="picker · 상태"
                code={`<DatePicker defaultValue="2026-11-20" />
<DatePicker picker="week" defaultValue="2026-11-16" />
<DatePicker picker="month" defaultValue="2026-11-01" />
<DatePicker showTime={{ minuteStep: 10 }} defaultValue="2026-11-20T14:30" />
<DatePicker maxDate="2026-11-30" defaultValue="2026-12-10" />  // invalid`}
            >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, width: '100%' }}>
                    <label style={field}>date<DatePicker defaultValue="2026-11-20" clearable fullWidth /></label>
                    <label style={field}>week<DatePicker picker="week" defaultValue="2026-11-16" fullWidth /></label>
                    <label style={field}>quarter<DatePicker picker="quarter" defaultValue="2026-10-01" fullWidth /></label>
                    <label style={field}>showTime<DatePicker showTime={{ minuteStep: 10 }} defaultValue="2026-11-20T14:30" fullWidth /></label>
                    <label style={field}>filled<DatePicker variant="filled" fullWidth /></label>
                    <label style={field}>underline<DatePicker variant="underline" defaultValue="2026-11-20" fullWidth /></label>
                    <label style={field}>invalid (maxDate 초과)<DatePicker maxDate="2026-11-30" defaultValue="2026-12-10" fullWidth /></label>
                    <label style={field}>readOnly<DatePicker readOnly defaultValue="2026-11-01" fullWidth /></label>
                </div>
            </ComponentPreview>
            <ComponentPreview
                title="DateRangePicker · presets · maxRange=31"
                code={`<DateRangePicker value={range} onValueChange={setRange} maxRange={31} />`}
            >
                <DateRangePicker value={range} onValueChange={setRange} maxRange={31} width={340} clearable />
            </ComponentPreview>
        </>
    )
}

const PROD: Record<number, string> = { 2: '11.8k', 3: '12.1k', 4: '12.4k', 5: '9.2k', 6: '12.6k', 9: '12.0k', 10: '12.3k', 11: '11.1k', 12: '12.5k', 13: '12.7k', 16: '12.2k', 17: '12.6k', 18: '12.9k', 19: '12.4k', 20: '9.2k' }

export const CalendarPage = () => (
    <>
        <PageHeader title="Calendar" description="mode single · range · multiple, renderDay, holidays, numberOfMonths. 방향키 · PageUp/Down · Home/End 로 이동합니다." />
        <ComponentPreview
            title="renderDay · holidays · showToday"
            code={`<Calendar defaultValue="2026-11-20" showToday cellHeight={46}
    holidays={['2026-11-11']}
    renderDay={(d, st) => d.getMonth() === 10 && PROD[d.getDate()] && <span data-slot="sub">{PROD[d.getDate()]}</span>} />`}
        >
            <div style={{ width: 420 }}>
                <Calendar
                    defaultValue="2026-11-20"
                    showToday
                    cellHeight={46}
                    holidays={['2026-11-11']}
                    renderDay={(d, st) =>
                        d.getMonth() === 10 && PROD[d.getDate()] ? (
                            <span data-slot="sub" style={{ fontSize: 11, color: st.selected ? 'inherit' : d.getDate() === 5 ? 'var(--ds-tone-danger-text)' : 'var(--ds-color-foreground-tertiary)' }}>
                                {PROD[d.getDate()]}
                            </span>
                        ) : null
                    }
                />
            </div>
        </ComponentPreview>
        <ComponentPreview title="range · 2개월" code={`<Calendar mode="range" numberOfMonths={2} defaultValue={['2026-11-16', '2026-11-20']} />`}>
            <Calendar mode="range" numberOfMonths={2} defaultValue={['2026-11-16', '2026-11-20']} />
        </ComponentPreview>
        <ComponentPreview title="multiple" code={`<Calendar mode="multiple" defaultValue={['2026-11-03', '2026-11-10']} />`}>
            <div style={{ width: 300 }}>
                <Calendar mode="multiple" defaultValue={['2026-11-03', '2026-11-10', '2026-11-17']} />
            </div>
        </ComponentPreview>
    </>
)

export const TimePickerPage = () => (
    <>
        <PageHeader title="TimePicker" description="minuteStep · secondStep · use24Hours · minTime/maxTime · range." />
        <ComponentPreview
            title="기본"
            code={`<TimePicker minuteStep={10} defaultValue="14:30" />
<TimePicker use24Hours={false} range defaultValue={['08:00', '17:00']} />
<TimePicker minTime="06:00" maxTime="22:00" defaultValue="23:10" />`}
        >
            <TimePicker minuteStep={10} defaultValue="14:30" width={160} />
            <TimePicker use24Hours={false} range defaultValue={['08:00', '17:00']} width={240} />
            <TimePicker minTime="06:00" maxTime="22:00" defaultValue="23:10" width={140} />
            <TimePicker secondStep={5} defaultValue="09:15:30" width={160} />
        </ComponentPreview>
    </>
)

const fakeUpload = (_file: File, onProgress: (p: number) => void) =>
    new Promise<string>((resolve) => {
        let p = 0
        const t = setInterval(() => {
            p += 12
            onProgress(p)
            if (p >= 100) {
                clearInterval(t)
                resolve('https://example.com/file')
            }
        }, 200)
    })

export const FileUploadPage = () => (
    <>
        <PageHeader title="FileUpload" description="appearance dropzone · button · list. upload 로 진행률을 받고, 거부된 파일은 이유와 함께 목록에 남습니다." />
        <ComponentPreview
            title="dropzone · upload"
            code={`<FileUpload accept=".xlsx,.csv,.pdf,image/*" multiple maxSize={20 * 1024 * 1024} maxFiles={5} upload={uploadToServer} preview />`}
        >
            <div style={{ width: '100%' }}>
                <FileUpload accept=".xlsx,.csv,.pdf,image/*" multiple maxSize={20 * 1024 * 1024} maxFiles={5} upload={fakeUpload} preview />
            </div>
        </ComponentPreview>
        <ComponentPreview
            title="button · list"
            code={`<FileUpload appearance="button" multiple defaultValue={[…]} />`}
        >
            <div style={{ width: '100%' }}>
                <FileUpload
                    appearance="button"
                    multiple
                    defaultValue={[
                        { id: 'a', name: '11월_생산계획.xlsx', size: 1258291, type: '', status: 'done', progress: 100 },
                        { id: 'b', name: '검사성적서_L2611-118.pdf', size: 820000, type: '', status: 'uploading', progress: 64 },
                        { id: 'c', name: '설비영상.mov', size: 48000000, type: '', status: 'error', error: '20MB를 넘어 거부되었습니다' },
                    ]}
                />
            </div>
        </ComponentPreview>
    </>
)

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

export const LabelPage = () => (
    <>
        <PageHeader title="Label" description="size sm 12 · md 14. 12px 보다 작은 라벨은 두지 않습니다." />
        <ComponentPreview title="기본" code={`<Label required>sm 라벨</Label> <Label size="md" optional>md 라벨</Label> <Label tooltip="도움말">도움말</Label>`}>
            <Label required>sm 라벨</Label>
            <Label size="md" optional>md 라벨</Label>
            <Label tooltip="라벨 옆 도움말">도움말 있는 라벨</Label>
        </ComponentPreview>
    </>
)
