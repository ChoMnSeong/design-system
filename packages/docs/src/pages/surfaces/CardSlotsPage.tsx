import { Card, Grid, IconArrowRight } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { KpiCardDemo } from '../shared/dashboardDemo'

export const CardSlotsPage = () => (
    <>
        <PageHeader title="Card 대시보드 슬롯" description="대시보드 카드용 슬롯: Card.Eyebrow · Actions · Metric · Delta · Visual · Note, surface(inverse · nested · media · glass)." />
        <ComponentPreview title="슬롯 조합" code={`<Card><Card.Eyebrow /><Card.Actions /><Card.Metric /><Card.Delta /><Card.Visual /><Card.Note /></Card>`}>
            <div style={{ width: 320 }}><KpiCardDemo /></div>
        </ComponentPreview>
        <ComponentPreview title="Metric size · Delta goodWhen · surface" code={`<Card.Metric size="lg" … /> <Card.Delta value={-12} goodWhen="down" /> <Card surface="nested">…</Card>`}>
            <Grid columns={4} gap={12} style={{ width: '100%' }}>
                <Card><Card.Metric size="sm" value="82.4" unit="%" /><Card.Metric value={12480} unit="EA" /><Card.Metric size="lg" value={3} unit="회" /></Card>
                <Card>
                    <Card.Delta value={4.2} comparison="생산량 (up = good)" />
                    <Card.Delta value={-12} goodWhen="down" format={(n) => `${n}건`} comparison="불량 (down = good)" />
                    <Card.Delta value={18} goodWhen="down" format={(n) => `+${n}분`} comparison="정지시간" />
                </Card>
                <Card surface="nested">
                    <Card.Eyebrow>nested</Card.Eyebrow>
                    <Card density="compact"><Card.Metric size="sm" value={860} unit="EA" /></Card>
                </Card>
                <Card surface="glass" glass={{ backdrop: <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 30%, var(--ds-palette-primary-300), transparent 60%), radial-gradient(circle at 80% 70%, var(--ds-palette-info-300), transparent 55%)' }} /> }}>
                    <Card.Eyebrow>glass</Card.Eyebrow>
                    <Card.Metric value="29.6" unit="℃" />
                    <Card.Note action={<IconArrowRight size={14} />}>backdrop 위 흐림</Card.Note>
                </Card>
            </Grid>
        </ComponentPreview>
    </>
)
