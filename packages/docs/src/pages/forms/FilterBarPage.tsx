import { useState } from 'react'
import { DateRangePicker, FilterBar, FormField, Input, MultiSelect, SegmentedControl, Select } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { full } from '../shared/demoStyles'

export const FilterBarPage = () => {
    const [line, setLine] = useState<string | null>('all')
    const [items, setItems] = useState<string[]>(['A', 'B', 'C', 'D'])
    return (
        <>
            <PageHeader title="FilterBar" description="조회 조건 막대: 넘치는 조건은 접고, 적용된 조건은 칩으로 보여 줍니다." />
            <ComponentPreview title="collapsedRows · appliedChips" code={`<FilterBar columns={4} collapsedRows={1} fields={<>…</>} appliedChips={[…]} onSearch={search} onReset={reset} />`}>
                <FilterBar
                    style={full}
                    columns={4}
                    collapsedRows={1}
                    onSearch={() => {}}
                    onReset={() => {
                        setLine('all')
                        setItems([])
                    }}
                    appliedChips={[{ label: '11월' }, ...(items.length ? [{ label: `품목 ${items.length}개`, onRemove: () => setItems([]) }] : []), ...(line !== 'all' ? [{ label: `${line}라인`, onRemove: () => setLine('all') }] : [])]}
                    fields={
                        <>
                            <FormField label="작업일자"><DateRangePicker size="sm" defaultValue={['2026-11-01', '2026-11-30']} fullWidth /></FormField>
                            <FormField label="라인"><Select size="sm" value={line} onValueChange={setLine} options={[{ value: 'all', label: '전체' }, { value: '1', label: '1라인' }, { value: '2', label: '2라인' }]} fullWidth /></FormField>
                            <FormField label="품목"><MultiSelect size="sm" value={items} onValueChange={setItems} maxTagCount={1} options={['A', 'B', 'C', 'D', 'E'].map((v) => ({ value: v, label: `브래킷 ${v}형` }))} fullWidth /></FormField>
                            <FormField label="상태"><SegmentedControl size="sm" fullWidth defaultValue="run" options={[{ value: 'all', label: '전체' }, { value: 'run', label: '진행' }, { value: 'done', label: '완료' }]} /></FormField>
                            <FormField label="작업자"><Input size="sm" placeholder="이름" /></FormField>
                            <FormField label="LOT"><Input size="sm" placeholder="L2611-…" /></FormField>
                        </>
                    }
                />
            </ComponentPreview>
        </>
    )
}
