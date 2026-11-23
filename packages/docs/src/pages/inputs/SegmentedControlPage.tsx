import { SegmentedControl } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const SegmentedControlPage = () => (
    <>
        <PageHeader title="SegmentedControl" description="보기·기간처럼 짧고 배타적인 선택. ←→ 키로 옮깁니다." />
        <ComponentPreview title="기본 · size" code={`<SegmentedControl options={[{ value: 'd', label: '일' }, …]} />`}>
            <SegmentedControl
                aria-label="기간"
                options={[
                    { value: 'd', label: '일' },
                    { value: 'w', label: '주' },
                    { value: 'm', label: '월' },
                    { value: 'q', label: '분기' },
                ]}
            />
            <SegmentedControl
                size="sm"
                aria-label="조"
                defaultValue="night"
                options={[
                    { value: 'day', label: '주간' },
                    { value: 'night', label: '야간' },
                ]}
            />
        </ComponentPreview>
    </>
)
