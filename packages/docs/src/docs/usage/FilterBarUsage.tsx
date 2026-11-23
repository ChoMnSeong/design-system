import { useState } from 'react'
import { DateRangePicker, FilterBar, FormField, Input, Select, type DateRange } from '@ensnif/design-system'

export default function Example() {
    const [period, setPeriod] = useState<DateRange>(['2026-11-01', '2026-11-30'])
    const [line, setLine] = useState<string | null>(null)
    return (
        <FilterBar
            columns={3}
            onSearch={() => {}}
            onReset={() => setLine(null)}
            appliedChips={line ? [{ label: `${line}라인`, onRemove: () => setLine(null) }] : []}
            fields={
                <>
                    <FormField label="작업일자"><DateRangePicker size="sm" value={period} onValueChange={setPeriod} fullWidth /></FormField>
                    <FormField label="라인"><Select size="sm" value={line} onValueChange={setLine} options={[{ value: '1', label: '1라인' }, { value: '2', label: '2라인' }]} fullWidth /></FormField>
                    <FormField label="품목"><Input size="sm" placeholder="품목명 · 품번" /></FormField>
                </>
            }
        />
    )
}
