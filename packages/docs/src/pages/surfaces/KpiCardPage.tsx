import { Button, Grid, KpiCard, StatusCard, type StatusDef } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { full } from '../shared/demoStyles'

const EQUIP: Record<string, StatusDef> = {
    run: { label: '가동', tone: 'success', pulse: true },
    idle: { label: '대기', tone: 'info' },
    stop: { label: '정지', tone: 'danger', pulse: true },
    pm: { label: '점검', tone: 'warning' },
}

export const KpiCardPage = () => (
    <>
        <PageHeader title="KpiCard · StatusCard" description="Card 프리셋. KpiCard: 값 · 단위 · 목표 달성률 · 증감(trend) · sparkline. StatusCard: 사용자 정의 상태 · 지표 · 갱신 시각." />
        <ComponentPreview title="KpiCard" code={`<KpiCard label="금일 생산량" value="12,480" unit="EA" target={13000} delta={{ value: '+4.2%' }} sparkline={[…]} />`}>
            <Grid columns={4} gap={12} style={full}>
                <KpiCard label="금일 생산량" value="12,480" unit="EA" target={13000} delta={{ value: '+4.2%' }} sparkline={[9.8, 10.4, 11.2, 10.9, 11.8, 12.1, 12.48]} />
                <KpiCard label="양품률" value="98.7" unit="%" target={98} targetLabel={(t) => `목표 ${t.toFixed(1)}%`} delta={{ value: '+0.3%p' }} sparkline={[98.1, 98.3, 98.2, 98.5, 98.7]} />
                <KpiCard label="설비 종합효율 OEE" value="82.4" unit="%" target={85} targetLabel={(t) => `목표 ${t.toFixed(1)}%`} delta={{ value: '-3.1%p' }} sparkline={{ type: 'bar', data: [86, 84, 85, 83, 82.4] }} />
                <KpiCard label="불량 건수" value="37" unit="건" trend="down-good" delta={{ value: '+12건' }} sparkline={[22, 25, 30, 28, 37]} footer={<span style={{ fontSize: 12, color: 'var(--ds-color-foreground-tertiary)' }}>trend="down-good" 이라 늘면 빨강</span>} />
            </Grid>
        </ComponentPreview>
        <ComponentPreview title="StatusCard" code={`<StatusCard title="CNC-01" status="run" statusMap={EQUIP} metrics={[…]} updatedAt={new Date()} caption="WO-2611-0042" />`}>
            <Grid columns={4} gap={12} style={full}>
                <StatusCard title="CNC-01" status="run" statusMap={EQUIP} metrics={[{ label: '가동률', value: '91.2%' }, { label: '사이클', value: '42s' }, { label: '생산', value: '1,284' }]} updatedAt={new Date(Date.now() - 10000)} caption="WO-2611-0042" />
                <StatusCard title="CNC-02" status="idle" statusMap={EQUIP} metrics={[{ label: '가동률', value: '64.8%' }, { label: '대기', value: '12분' }]} updatedAt={new Date(Date.now() - 60000)} />
                <StatusCard title="PRESS-03" status="stop" statusMap={EQUIP} metrics={[{ label: '정지', value: '23분', tone: 'danger' }, { label: '원인', value: '금형' }]} updatedAt={new Date(Date.now() - 5000)} actions={<Button size="xs" tone="danger">조치</Button>} />
                <StatusCard title="WELD-01" status="pm" statusMap={EQUIP} metrics={[{ label: '점검', value: '예방보전' }, { label: '종료', value: '16:00' }]} />
            </Grid>
        </ComponentPreview>
    </>
)
