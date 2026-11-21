import { useState } from 'react'
import { Button, Card, CartesianChart, DashboardGrid, DashboardGridItem, DesignSystemProvider, Grid, LiquidGlass, SegmentedControl, IconArrowRight, IconInfo, IconMoreHorizontal, InlineBar, MiniGauge, RadarChart, SegmentMeter, Sparkline, StepChart, Switch, TargetScatter, UptimeBar } from '@ensnif/design-system'
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

const D = (h: number, m = 0) => new Date(2026, 10, 21, h, m)

export const MiniChartsPage = () => (
    <>
        <PageHeader title="대시보드 소형 차트" description="SegmentMeter · UptimeBar · InlineBar · StepChart · MiniGauge(arc · lollipop) · RadarChart 비교 · TargetScatter." />
        <ComponentPreview title="SegmentMeter · UptimeBar" code={`<SegmentMeter segments={…} max={24} markers={[{ at: 20, label: '목표' }]} legend="rows" />
<UptimeBar data={days} statusMap={…} cells={30} label="1라인 · 30일" />`}>
            <Grid columns={2} gap={24} style={{ width: '100%' }}>
                <SegmentMeter
                    max={24}
                    remainder="hatch"
                    markers={[{ at: 20, label: '목표 20h' }]}
                    showScale={{ format: (n) => `${n}h` }}
                    legend="rows"
                    segments={[
                        { label: '가동', value: 17.5, tone: 'success', delta: '+1.2h' },
                        { label: '대기', value: 2.5, tone: 'info', delta: '-0.4h' },
                        { label: '정지', value: 0.9, tone: 'danger', delta: '+0.3h' },
                    ]}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <UptimeBar label="1라인 · 30일" cells={30} statusMap={{ ok: { label: '정상', tone: 'success' }, warn: { label: '부분 정지', tone: 'warning' }, down: { label: '정지', tone: 'danger' } }} data={Array.from({ length: 26 }, (_, i) => ({ at: `11/${i - 4 > 0 ? i - 4 : i + 26}`, status: i === 9 ? 'down' : i % 7 === 3 ? 'warn' : 'ok' }))} />
                    <UptimeBar label="2라인" size="sm" cells={30} statusMap={{ ok: { label: '정상', tone: 'success' }, down: { label: '정지', tone: 'danger' } }} data={Array.from({ length: 30 }, (_, i) => (i === 21 || i === 22 ? 'down' : 'ok'))} highlight={21} />
                </div>
            </Grid>
        </ComponentPreview>
        <ComponentPreview title="InlineBar · StepChart" code={`<InlineBar value={1240} max={1500} suffix="/일" target={1300} /> <InlineBar diverging value={-2.8} max={10} /> <StepChart data={…} levels={['가동','대기','정지']} highlight="정지" />`}>
            <Grid columns={2} gap={24} style={{ width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                    <span>브래킷 A형 <InlineBar value={1240} max={1500} suffix="/일" target={1300} width={220} /></span>
                    <span>하우징 C <InlineBar value={860} max={1500} suffix="/일" target={1300} width={220} tone="warning" /></span>
                    <span>전일 대비 <InlineBar diverging value={4.1} max={10} format={(n) => `${n}%`} width={160} /></span>
                    <span>전일 대비 <InlineBar diverging value={-2.8} max={10} format={(n) => `${n}%`} width={160} /></span>
                </div>
                <StepChart
                    levels={['가동', '대기', '정지']}
                    levelTone={{ 가동: 'success', 대기: 'info', 정지: 'danger' }}
                    highlight="정지"
                    data={[
                        { from: D(6), to: D(9), level: '가동' },
                        { from: D(9), to: D(9, 40), level: '대기' },
                        { from: D(9, 40), to: D(11, 30), level: '가동' },
                        { from: D(11, 30), to: D(12, 10), level: '정지' },
                        { from: D(12, 10), to: D(14), level: '가동' },
                    ]}
                />
            </Grid>
        </ComponentPreview>
        <ComponentPreview title="MiniGauge · RadarChart 비교 · TargetScatter" code={`<MiniGauge value={182} min={150} max={220} zones={…} ticks={[170, 195]} unit="℃" /> <RadarChart curve="smooth" series={[{ name: '1라인', … }, { name: '2라인', … }]} aside={…} /> <TargetScatter points={…} rings={…} distribution="x" />`}>
            <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <MiniGauge value={182} min={150} max={220} unit="℃" zones={[{ from: 150, to: 170, tone: 'info' }, { from: 170, to: 195, tone: 'success' }, { from: 195, to: 220, tone: 'danger' }]} ticks={[170, 195]} statusLabel={(_v, z) => (z?.tone === 'success' ? '정상' : '주의')} />
                    <MiniGauge variant="lollipop" value={0.82} min={0} max={1.5} unit="MPa" zones={[{ from: 0, to: 1, tone: 'success' }, { from: 1, to: 1.5, tone: 'danger' }]} ticks={[1]} format={(n) => n.toFixed(2)} />
                </div>
                <RadarChart
                    size={220}
                    curve="smooth"
                    axes={['가용성', '성능', '품질', '납기', '안전']}
                    series={[
                        { name: '1라인', values: [91, 94, 96, 88, 99], tone: 'accent' },
                        { name: '2라인', values: [84, 90, 98, 92, 97], tone: 'info' },
                    ]}
                    max={100}
                    aside={<div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}><b>OEE</b><span>1라인 82.1%</span><span>2라인 74.1%</span></div>}
                />
                <TargetScatter
                    size={200}
                    distribution="x"
                    rings={[{ r: 0.05, label: '±0.05' }, { r: 0.1, label: '±0.10' }]}
                    points={Array.from({ length: 24 }, (_, i) => ({ id: `P${i}`, x: Math.round(Math.sin(i * 1.7) * 0.09 * 1000) / 1000, y: Math.round(Math.cos(i * 2.3) * 0.07 * 1000) / 1000 }))}
                />
            </div>
        </ComponentPreview>
    </>
)

const KpiMini = () => (
    <Card>
        <Card.Eyebrow>설비 종합효율 OEE</Card.Eyebrow>
        <Card.Metric value="82.4" unit="%" />
        <Card.Delta value={-2.6} format={(n) => `${n}%p`} comparison="지난주" />
        <Button size="sm">작업지시 저장</Button>
    </Card>
)

export const ThemePresetPage = () => {
    const [backdrop, setBackdrop] = useState<'pattern' | 'neutral' | 'tint'>('pattern')
    return (
        <>
            <PageHeader title="테마 프리셋 · 유리 배경 · Liquid Glass" description="Provider preset(default · editorial · neon · photo · definePreset), glass.backdrop(pattern · neutral · tint · image), LiquidGlass(material='liquid' · 고정 배경 KPI 전용)." />
            <ComponentPreview title="preset" code={`<DesignSystemProvider applyTo="scope" preset="editorial">…</DesignSystemProvider>`}>
                <Grid columns={4} gap={12} style={{ width: '100%' }}>
                    {(['default', 'editorial', 'neon', 'photo'] as const).map((p) => (
                        <DesignSystemProvider key={p} applyTo="scope" preset={p} style={{ padding: 10, borderRadius: 12 }}>
                            <div style={{ fontSize: 12, marginBottom: 6, color: 'var(--ds-color-foreground-tertiary)' }}>{p}</div>
                            <KpiMini />
                        </DesignSystemProvider>
                    ))}
                </Grid>
            </ComponentPreview>
            <ComponentPreview title="glass.backdrop" code={`<DesignSystemProvider variant="glassmorphism" glass={{ backdrop: 'pattern' }}>…</DesignSystemProvider>`}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <SegmentedControl size="sm" aria-label="배경" value={backdrop} onValueChange={setBackdrop} options={[{ value: 'pattern', label: 'pattern (plant)' }, { value: 'neutral', label: 'neutral' }, { value: 'tint', label: 'tint' }]} />
                    <DesignSystemProvider applyTo="scope" variant="glassmorphism" mode="light" glass={{ backdrop }} style={{ background: 'var(--ds-surface-page-background)', padding: 20, borderRadius: 12 }}>
                        <Grid columns={3} gap={12}>
                            <KpiMini />
                            <KpiMini />
                            <KpiMini />
                        </Grid>
                    </DesignSystemProvider>
                </div>
            </ComponentPreview>
            <ComponentPreview title="LiquidGlass · 고정 배경 위 KPI" code={`<LiquidGlass legibility="auto"><Card.Metric value="182" unit="°" /></LiquidGlass>`}>
                <div style={{ position: 'relative', width: '100%', height: 220, borderRadius: 16, overflow: 'hidden', background: `url("${PHOTO}") center / cover` }}>
                    <div style={{ position: 'absolute', left: 24, top: 24, display: 'flex', gap: 16 }}>
                        <LiquidGlass style={{ width: 200 }}>
                            <div style={{ fontSize: 12, opacity: 0.85 }}>PRESS-03 금형</div>
                            <div style={{ fontSize: 32, fontWeight: 700 }}>182°</div>
                            <div style={{ fontSize: 12 }}>정상 170–195℃</div>
                        </LiquidGlass>
                        <LiquidGlass style={{ width: 200 }}>
                            <div style={{ fontSize: 12, opacity: 0.85 }}>2라인 생산</div>
                            <div style={{ fontSize: 32, fontWeight: 700 }}>12,480</div>
                            <div style={{ fontSize: 12 }}>EA · +4.2%</div>
                        </LiquidGlass>
                    </div>
                </div>
            </ComponentPreview>
        </>
    )
}
