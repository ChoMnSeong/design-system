import { Textarea } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const TextareaPage = () => (
    <>
        <PageHeader title="Textarea" description="minRows · maxRows 로 내용에 맞게 늘어나고, showCount 로 글자 수를 보입니다." />
        <ComponentPreview
            title="기본"
            code={`<Textarea maxLength={200} showCount defaultValue="조치 내용: 유압 호스 교체" />
<Textarea variant="filled" minRows={2} maxRows={6} placeholder="특이사항 입력" />
<Textarea invalid placeholder="반려 사유" />`}
        >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: '100%' }}>
                <Textarea maxLength={200} showCount defaultValue="조치 내용: 유압 호스 교체" aria-label="조치 내용" fullWidth />
                <Textarea variant="filled" minRows={2} maxRows={6} placeholder="특이사항 입력 (늘어남)" aria-label="특이사항" fullWidth />
                <Textarea invalid placeholder="반려 사유를 입력하세요" aria-label="반려 사유" fullWidth />
            </div>
        </ComponentPreview>
    </>
)
