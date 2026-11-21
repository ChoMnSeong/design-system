import { Radio, RadioGroup } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const RadioPage = () => (
    <>
        <PageHeader title="Radio · RadioGroup" description="appearance default · card · button. options 배열이나 children 으로 그립니다." />
        <ComponentPreview title="default" code={`<RadioGroup direction="row" defaultValue="day">…</RadioGroup>`}>
            <RadioGroup direction="row" defaultValue="day" aria-label="근무조">
                <Radio value="day" label="주간" />
                <Radio value="night" label="야간" />
                <Radio value="three" label="3교대 (disabled)" disabled />
            </RadioGroup>
        </ComponentPreview>
        <ComponentPreview
            title="card"
            code={`<RadioGroup appearance="card" options={[{ value: 'pm', label: '정기 보전', description: '주기 기반 예방보전' }, …]} />`}
        >
            <RadioGroup
                appearance="card"
                defaultValue="pm"
                aria-label="보전 유형"
                style={{ width: '100%' }}
                options={[
                    { value: 'pm', label: '정기 보전', description: '주기 기반 예방보전' },
                    { value: 'bm', label: '사후 보전', description: '고장 발생 후 수리' },
                    { value: 'cbm', label: '예지 보전', description: '센서 이상 감지' },
                ]}
            />
        </ComponentPreview>
        <ComponentPreview title="button" code={`<RadioGroup appearance="button" size="sm" options={…} />`}>
            <RadioGroup
                appearance="button"
                size="sm"
                defaultValue="week"
                aria-label="단위"
                options={[
                    { value: 'day', label: '일' },
                    { value: 'week', label: '주' },
                    { value: 'month', label: '월' },
                ]}
            />
        </ComponentPreview>
    </>
)
