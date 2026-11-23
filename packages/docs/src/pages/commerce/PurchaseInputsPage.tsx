import { OptionPicker, QuantityInput } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const PurchaseInputsPage = () => (
    <>
        <PageHeader title="QuantityInput · OptionPicker" description="구매 입력. 수량은 재고까지, 옵션은 품절 사선 · 재고 적음 표시." />
        <ComponentPreview title="QuantityInput" code={`<QuantityInput size="sm" />  <QuantityInput max={5} defaultValue={2} />`}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                <QuantityInput size="sm" />
                <QuantityInput defaultValue={3} />
                <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--ds-color-foreground-tertiary)' }}><QuantityInput defaultValue={5} max={5} /> 재고 5개 · 최대 5</span>
            </div>
        </ComponentPreview>
        <ComponentPreview title="OptionPicker" description="품절은 사선, 빨간 점은 재고 3개 이하." code={`<OptionPicker type="swatch" label="색상" options={colors} />\n<OptionPicker type="chip" label="사이즈" options={sizes} />`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
                <OptionPicker type="swatch" label="색상" defaultValue="charcoal" options={[{ value: 'charcoal', label: '차콜', color: '#3a3a3a' }, { value: 'beige', label: '베이지', color: '#d9c7ad' }, { value: 'navy', label: '네이비', color: '#24324d' }, { value: 'brown', label: '브라운', color: '#6b4a33', stock: 2 }, { value: 'ivory', label: '아이보리', color: '#f3eee4', stock: 0 }]} />
                <OptionPicker type="chip" label="사이즈" defaultValue="XL" options={[{ value: 'XS', label: 'XS', stock: 0 }, { value: 'S', label: 'S', stock: 8 }, { value: 'M', label: 'M', stock: 12 }, { value: 'L', label: 'L', stock: 5 }, { value: 'XL', label: 'XL', stock: 1 }, { value: 'XXL', label: 'XXL', stock: 0 }]} />
                <OptionPicker type="select" label="사이즈 (드롭다운)" options={[{ value: 'S', label: 'S' }, { value: 'M', label: 'M', stock: 2 }, { value: 'L', label: 'L', stock: 0 }]} style={{ maxWidth: 240 }} />
            </div>
        </ComponentPreview>
    </>
)
