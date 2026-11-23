import { Avatar, AvatarGroup, StatusIndicator, type Tone } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const AvatarPage = () => (
    <>
        <PageHeader title="Avatar · StatusIndicator" description="size xs~xl, tone, status. AvatarGroup 은 max 로 +N 을 붙입니다." />
        <ComponentPreview title="size · tone · shape" code={`<Avatar name="김민지" size="lg" /> <Avatar name="QA" shape="rounded" tone="neutral" />`}>
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
                <Avatar key={s} name="김민지" size={s} />
            ))}
            <Avatar name="생산" tone="success" />
            <Avatar name="설비" tone="info" />
            <Avatar name="자재" tone="warning" />
            <Avatar name="QA" shape="rounded" tone="neutral" />
        </ComponentPreview>
        <ComponentPreview title="status · group" code={`<Avatar name="김" status="online" /> <AvatarGroup max={4} size="sm">…</AvatarGroup>`}>
            <Avatar name="김민지" status="online" />
            <Avatar name="이서준" tone="info" status="away" />
            <Avatar name="박도윤" tone="success" status="busy" />
            <Avatar name="최하은" tone="neutral" status="offline" />
            <AvatarGroup max={4} size="sm">
                {['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'].map((n, i) => (
                    <Avatar key={n} name={n} tone={(['accent', 'success', 'info', 'warning'] as Tone[])[i % 4]} />
                ))}
            </AvatarGroup>
        </ComponentPreview>
        <ComponentPreview title="StatusIndicator" code={`<StatusIndicator tone="success" label="가동" pulse />`}>
            <StatusIndicator tone="success" label="가동" pulse />
            <StatusIndicator tone="info" label="대기" />
            <StatusIndicator tone="danger" label="정지" pulse />
            <StatusIndicator tone="neutral" label="점검" />
            <StatusIndicator tone="warning" label="경고" />
            <StatusIndicator tone="success" label="sm" size="sm" />
        </ComponentPreview>
    </>
)
