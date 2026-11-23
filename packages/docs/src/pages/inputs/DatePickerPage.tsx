import { useState } from 'react'
import { DatePicker, DateRangePicker, type DateRange } from '@ensnif/design-system'
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
