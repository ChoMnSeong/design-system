import { useState } from 'react'
import { Button, Card, DesignSystemProvider, Grid, LiquidGlass, SegmentedControl } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { PHOTO } from '../shared/dashboardDemo'

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
            <PageHeader title="Presets" description="Provider preset(default · editorial · neon · photo · definePreset), glass.backdrop(pattern · neutral · tint · image), LiquidGlass(material='liquid' · 고정 배경 KPI 전용)." />
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
