import { Checkbox, CheckboxGroup } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const CheckboxPage = () => (
    <>
        <PageHeader title="Checkbox · CheckboxGroup" description="size xs~lg, tone, description. CheckboxGroup 은 selectAll 로 전체 선택을 붙입니다." />
        <ComponentPreview title="size · 상태 · tone" code={`<Checkbox size="lg" defaultChecked /> <Checkbox indeterminate /> <Checkbox tone="danger" defaultChecked />`}>
            <Checkbox size="xs" aria-label="xs" />
            <Checkbox size="sm" aria-label="sm" />
            <Checkbox aria-label="md" />
            <Checkbox size="lg" aria-label="lg" />
            <Checkbox defaultChecked aria-label="checked" />
            <Checkbox indeterminate aria-label="indeterminate" />
            <Checkbox defaultChecked disabled aria-label="disabled" />
            <Checkbox tone="success" defaultChecked aria-label="success" />
            <Checkbox tone="danger" defaultChecked aria-label="danger" />
        </ComponentPreview>
        <ComponentPreview
            title="group · description"
            code={`<CheckboxGroup selectAll options={[{ value: 'in', label: '수입검사' }, { value: 'proc', label: '공정검사' }]} />
<Checkbox label="자동 실적 등록" description="설비 카운터 값으로 실적을 등록합니다" />`}
        >
            <CheckboxGroup
                selectAll
                defaultValue={['in']}
                aria-label="검사 종류"
                options={[
                    { value: 'in', label: '수입검사' },
                    { value: 'proc', label: '공정검사' },
                    { value: 'out', label: '출하검사' },
                ]}
            />
            <Checkbox defaultChecked label="자동 실적 등록" description="설비 카운터 값으로 실적을 등록합니다" />
        </ComponentPreview>
    </>
)
