import { Breadcrumb, IconInfo } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const BreadcrumbPage = () => (
    <>
        <PageHeader title="Breadcrumb" description="separator · maxItems(가운데 ···) · size · icon · menu(형제 페이지) · renderLink." />
        <ComponentPreview title="기본 · maxItems · menu" code={`<Breadcrumb maxItems={3} items={[…, { label: 'BR-A01', menu: [{ label: 'BR-B01' }, …] }]} />`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Breadcrumb items={[{ label: '생산', href: '#' }, { label: '작업지시', href: '#' }, { label: 'WO-2611-0042' }]} />
                <Breadcrumb separator="›" size="sm" items={[{ label: '홈', icon: <IconInfo size={12} />, href: '#' }, { label: '기준정보', href: '#' }, { label: '품목' }]} />
                <Breadcrumb
                    maxItems={3}
                    items={[
                        { label: '홈', href: '#' },
                        { label: '기준정보', href: '#' },
                        { label: '품목', href: '#' },
                        { label: 'BOM', href: '#' },
                        { label: 'BR-A01', menu: [{ label: 'BR-A02' }, { label: 'BR-B01' }, { label: 'HS-C01' }] },
                    ]}
                />
            </div>
        </ComponentPreview>
    </>
)
