import { Progress } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const ProgressPage = () => (
    <>
        <PageHeader title="Progress" description="appearance bar · segmented · circle. size xs~lg, valueLabel, target 마커, indeterminate." />
        <ComponentPreview title="size · tone · valueLabel" code={`<Progress value={62} size="lg" /> <Progress value={96} tone="success" valueLabel="end" />`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
                {(['xs', 'sm', 'md', 'lg'] as const).map((s) => (
                    <Progress key={s} value={62} size={s} aria-label={`진행 ${s}`} />
                ))}
                <Progress value={96} tone="success" valueLabel="end" aria-label="가동률" />
                <Progress value={72} tone="warning" valueLabel="end" aria-label="달성률" />
                <Progress value={34} tone="danger" valueLabel="end" aria-label="품질" />
                <Progress value={68} size="lg" valueLabel="inside" aria-label="inside" />
            </div>
        </ComponentPreview>
        <ComponentPreview title="target · segments · indeterminate" code={`<Progress value={82} target={85} tone="warning" /> <Progress size="lg" segments={[…]} />`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
                <Progress value={82} target={85} tone="warning" valueLabel="end" aria-label="목표 대비" />
                <Progress
                    size="lg"
                    aria-label="설비 상태 비율"
                    segments={[
                        { value: 58, tone: 'success', label: '가동' },
                        { value: 12, tone: 'info', label: '대기' },
                        { value: 6, tone: 'danger', label: '정지' },
                        { value: 8, tone: 'neutral', label: '점검' },
                    ]}
                />
                <Progress indeterminate aria-label="불러오는 중" />
            </div>
        </ComponentPreview>
        <ComponentPreview title="circle" code={`<Progress appearance="circle" value={72} valueLabel="end" size="lg" />`}>
            <Progress appearance="circle" value={72} valueLabel="end" size="lg" aria-label="원형 72" />
            <Progress appearance="circle" value={45} valueLabel="end" tone="success" aria-label="원형 45" />
            <Progress appearance="circle" indeterminate size="sm" aria-label="로딩" />
        </ComponentPreview>
    </>
)
