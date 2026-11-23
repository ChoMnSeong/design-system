import { useState } from 'react'
import { ComboBox, MultiSelect, Select, TagInput, type SelectOption } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const STATUS: SelectOption[] = [
    { value: 'wait', label: '대기' },
    { value: 'run', label: '작업중' },
    { value: 'done', label: '완료' },
    { value: 'cancel', label: '취소', disabled: true },
]

const ITEMS: SelectOption[] = [
    { value: 'BR-A01', label: '브래킷 A형', description: 'BR-A01', group: '완제품' },
    { value: 'BR-B01', label: '브래킷 B형', description: 'BR-B01', group: '완제품' },
    { value: 'HS-C01', label: '하우징 커버', description: 'HS-C01', group: '완제품' },
    { value: 'BR-BL', label: '브래킷 블랭크', description: 'BR-BL', group: '반제품' },
]

const LINES = ['1', '2', '3', '4', '5'].map((n) => ({ value: n, label: `${n}라인` }))

const VENDORS = Array.from({ length: 40 }, (_, i) => ({ value: `V${i}`, label: `거래처 ${i + 1}` }))

export const ComboBoxPage = () => {
    const [items, setItems] = useState(ITEMS)
    return (
        <>
            <PageHeader title="Select · ComboBox · MultiSelect · TagInput" description="같은 엔진. searchable · multiple · creatable · loadOptions · groupBy 를 조합합니다." />
            <ComponentPreview title="Select · 코드값" code={`<Select options={STATUS} defaultValue="run" />`}>
                <Select options={STATUS} defaultValue="run" aria-label="상태" width={200} />
                <Select options={STATUS} clearable placeholder="상태" aria-label="상태 2" width={200} />
            </ComponentPreview>
            <ComponentPreview
                title="ComboBox · searchable · groupBy · creatable"
                code={`<ComboBox options={items} creatable onCreate={(t) => setItems([...items, { value: t, label: t, group: '신규' }])} />`}
            >
                <ComboBox
                    options={items}
                    creatable
                    onCreate={(t) => setItems([...items, { value: t, label: t, group: '신규' }])}
                    aria-label="품목"
                    width={280}
                />
            </ComponentPreview>
            <ComponentPreview title="MultiSelect · maxTagCount=2" code={`<MultiSelect options={LINES} defaultValue={['1','2','3','4']} maxTagCount={2} />`}>
                <MultiSelect options={LINES} defaultValue={['1', '2', '3', '4']} maxTagCount={2} aria-label="라인" width={280} />
                <MultiSelect options={LINES} searchable placeholder="라인 검색" aria-label="라인 검색" width={280} />
            </ComponentPreview>
            <ComponentPreview
                title="TagInput · loadOptions"
                code={`<TagInput mono defaultValue={['L2611-118']} validate={(t) => /^L\\d{4}-\\d{3}$/.test(t)} />
<ComboBox loadOptions={(q) => fetchVendors(q)} />`}
            >
                <TagInput
                    mono
                    defaultValue={['L2611-118', 'L2611-121', 'L26-?']}
                    validate={(t) => /^L\d{4}-\d{3}$/.test(t)}
                    placeholder="LOT 번호 입력 후 Enter"
                    aria-label="LOT"
                    style={{ width: 340 }}
                />
                <ComboBox
                    aria-label="거래처"
                    width={220}
                    placeholder="거래처 검색"
                    loadOptions={(q) =>
                        new Promise((r) => setTimeout(() => r(VENDORS.filter((v) => v.label.includes(q))), 600))
                    }
                    virtualized
                />
            </ComponentPreview>
        </>
    )
}
