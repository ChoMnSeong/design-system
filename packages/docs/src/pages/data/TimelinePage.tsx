import { Timeline } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const TimelinePage = () => (
    <>
        <PageHeader title="Timeline" description="결재 · 이력. mode left · right · alternate, pending, reverse." />
        <ComponentPreview title="left · pending / alternate" code={`<Timeline items={[…]} pending="재승인 대기" />`}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, width: '100%' }}>
                <Timeline
                    pending="재승인 대기"
                    items={[
                        { time: '11/18', title: '작성 · 생산관리', description: '작업지시 등록' },
                        { time: '11/18', title: '승인 · 팀장', tone: 'success' },
                        { time: '11/19', title: '반려 · 품질', description: '검사 기준서 누락', tone: 'danger' },
                    ]}
                />
                <Timeline
                    mode="alternate"
                    items={[
                        { time: '11/02', title: '설계 완료' },
                        { time: '11/09', title: '개발 착수' },
                        { time: '12/07 예정', title: '통합 테스트', tone: 'neutral' },
                    ]}
                />
            </div>
        </ComponentPreview>
    </>
)
