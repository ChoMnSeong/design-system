import { TimePicker } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

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
