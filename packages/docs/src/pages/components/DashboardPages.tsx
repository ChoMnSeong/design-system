import { useState } from 'react'
import { Button, Card, CartesianChart, DashboardGrid, DashboardGridItem, Grid, IconArrowRight, IconInfo, IconMoreHorizontal, Sparkline, Switch } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const PHOTO = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b4a6b"/><stop offset="1" stop-color="#8a6a3b"/></linearGradient></defs><rect width="400" height="240" fill="url(#g)"/><rect x="40" y="90" width="120" height="90" rx="6" fill="#26324a"/><rect x="200" y="60" width="150" height="120" rx="6" fill="#2a2a2a"/></svg>')

const KpiCardDemo = () => (
    <Card>
        <Card.Eyebrow icon={<IconInfo size={14} />}>금일 생산 실적</Card.Eyebrow>
        <Card.Actions>
            <Button size="sm" appearance="ghost" tone="neutral" shape="square" aria-label="더보기" iconLeft={<IconMoreHorizontal size={16} />} />
        </Card.Actions>
        <Card.Metric value={12480} unit="EA" />
        <Card.Delta value={4.2} comparison="계획 대비" />
        <Card.Visual height={36}>
            <Sparkline data={[9.8, 10.4, 11.2, 10.9, 11.8, 12.1, 12.48]} height={36} />
        </Card.Visual>
        <Card.Note action={<Button size="xs" appearance="link" linkStyle="arrow">상세 보기</Button>}>3주 연속 증가</Card.Note>
    </Card>
)

export const DashboardGridPage = () => {
    const [editable, setEditable] = useState(false)
    return (
        <>
            <PageHeader title="DashboardGrid · Card 슬롯 · surface" description="bento 배치(colSpan · rowSpan · areas · 단계별 columns · dense · editable), Card.Eyebrow · Actions · Metric · Delta · Visual · Note, surface inverse · tinted · nested · media · glass." />
            <ComponentPreview title="DashboardGrid" code={`<DashboardGrid columns={{ sm: 2, md: 4 }} rowHeight={150} gap={12} editable={editable}>
    <DashboardGrid.Item colSpan={2} rowSpan={2}>…</DashboardGrid.Item>
</DashboardGrid>`}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Switch label="editable (드래그 순서 · 모서리 크기)" checked={editable} onCheckedChange={setEditable} />
                    <DashboardGrid columns={{ sm: 2, md: 4 }} rowHeight={160} gap={12} editable={editable}>
                        <DashboardGridItem id="trend" colSpan={2} rowSpan={2}>
                            <Card>
                                <Card.Eyebrow>주간 생산 추이</Card.Eyebrow>
                                <Card.Visual style={{ flex: 1 }}>
                                    <CartesianChart labels={['W43', 'W44', 'W45', 'W46', 'W47']} data={[1320, 1290, 1380, 1260, 1410].map((v) => ({ v }))} series={[{ type: 'area', key: 'v', label: '실적', smooth: true }]} legend="none" height={240} />
                                </Card.Visual>
                            </Card>
                        </DashboardGridItem>
                        <DashboardGridItem id="kpi"><KpiCardDemo /></DashboardGridItem>
                        <DashboardGridItem id="stop">
                            <Card surface="inverse">
                                <Card.Eyebrow>WELD-04 · 24시간 정지</Card.Eyebrow>
                                <Card.Metric value={54} unit="분" />
                                <Card.Delta value={18} goodWhen="down" format={(n) => `+${n}분`} comparison="어제 대비" />
                            </Card>
                        </DashboardGridItem>
                        <DashboardGridItem id="yield">
                            <Card status="success">
                                <Card.Eyebrow>양품률</Card.Eyebrow>
                                <Card.Metric value="99.2" unit="%" />
                                <Card.Delta value={0.3} format={(n) => `+${n}%p`} />
                            </Card>
                        </DashboardGridItem>
                        <DashboardGridItem id="temp">
                            <Card surface="media" media={{ src: PHOTO, alt: '2라인 현장 사진' }}>
                                <Card.Eyebrow>현장 2라인 · 14:00</Card.Eyebrow>
                                <Card.Metric value="29.6" unit="℃" />
                            </Card>
                        </DashboardGridItem>
                    </DashboardGrid>
                </div>
            </ComponentPreview>
            <ComponentPreview title="Card.Metric size · Delta goodWhen · surface" code={`<Card.Metric size="lg" … /> <Card.Delta value={-12} goodWhen="down" /> <Card surface="nested">…</Card>`}>
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
}
