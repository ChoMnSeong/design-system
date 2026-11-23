import { Section } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { PICS, Frame } from '../shared/commerceDemo'

export const ContainerPage = () => (
    <>
        <PageHeader title="Container · Section" description="화면 폭과 섹션 여백. Container 는 최대 1280 · 좌우 16 · 32 · 40, Section 은 위아래 48 · 80 · 120 이고 bleed 면 화면 끝까지 그립니다." />
        <ComponentPreview title="spacing · bleed" description="안쪽 점선이 Container 최대 폭, 위아래가 섹션 여백입니다." code={`<Section spacing="md"><h2>…</h2></Section>\n<Section bleed tone="muted">배너</Section>`}>
            <Frame h={460}>
                {(['sm', 'md'] as const).map((s) => (
                    <Section key={s} spacing={s} tone={s === 'sm' ? 'muted' : undefined}>
                        <div style={{ outline: '1px dashed var(--ds-palette-primary-500)', padding: 12, fontSize: 13 }}>spacing="{s}" · Container lg</div>
                    </Section>
                ))}
                <Section spacing="none" bleed>
                    <div style={{ height: 120, background: `url(${PICS[0]}) center/cover`, display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700 }}>bleed — 화면 끝까지</div>
                </Section>
            </Frame>
        </ComponentPreview>
    </>
)
