import { Grid, InlineBar, MiniGauge, RadarChart, SegmentMeter, StepChart, TargetScatter, UptimeBar } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const D = (h: number, m = 0) => new Date(2026, 10, 21, h, m)

export const MiniChartsPage = () => (
    <>
        <PageHeader title="Mini Charts" description="SegmentMeter · UptimeBar · InlineBar · StepChart · MiniGauge(arc · lollipop) · RadarChart 비교 · TargetScatter." />
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
