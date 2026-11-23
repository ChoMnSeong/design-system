import { Button, Empty, Skeleton, Spinner } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { grid } from '../shared/demoStyles'

export const SkeletonPage = () => (
    <>
        <PageHeader title="Skeleton · Spinner · Empty" description="Skeleton animation · Table · Card 프리셋. Spinner size 토큰 · tone · overlay. Empty preset · size · compact." />
        <ComponentPreview title="Skeleton" code={`<Skeleton circle height={40} /> <Skeleton lines={2} /> <Skeleton.Table rows={3} /> <Skeleton.Card />`}>
            <div style={grid(3)}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Skeleton circle height={40} />
                    <Skeleton lines={2} height={12} style={{ flex: 1 }} />
                </div>
                <Skeleton.Table rows={3} columns={3} />
                <Skeleton.Card />
            </div>
        </ComponentPreview>
        <ComponentPreview title="Spinner" code={`<Spinner size="xs" /> … <Spinner size="lg" tone="danger" /> <Spinner overlay label="불러오는 중" />`}>
            {(['xs', 'sm', 'md', 'lg'] as const).map((s) => <Spinner key={s} size={s} />)}
            <Spinner size="md" tone="success" />
            <Spinner size="md" tone="danger" />
            <div style={{ position: 'relative', width: 180, height: 64, border: '1px solid var(--ds-color-border-subtle)', borderRadius: 8 }}>
                <Spinner overlay label="불러오는 중" />
            </div>
        </ComponentPreview>
        <ComponentPreview title="Empty · preset" code={`<Empty preset="noData" action={<Button size="sm">작업지시 등록</Button>} />`}>
            <div style={grid(4)}>
                <Empty preset="noData" description="등록된 작업지시가 없습니다" action={<Button size="sm" appearance="soft">작업지시 등록</Button>} />
                <Empty preset="noResult" action={<Button size="sm" appearance="ghost" tone="neutral">조건 초기화</Button>} />
                <Empty preset="error" action={<Button size="sm" appearance="outline" tone="neutral">다시 시도</Button>} />
                <Empty preset="noPermission" size="sm" />
            </div>
        </ComponentPreview>
        <ComponentPreview title="compact" code={`<Empty preset="noResult" appearance="compact" />`}>
            <Empty preset="noResult" appearance="compact" description="필터를 바꿔 보세요" style={{ width: '100%' }} />
        </ComponentPreview>
    </>
)
