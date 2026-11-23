import { Accordion, AccordionItem, Badge, Grid } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { full } from '../shared/demoStyles'

export const AccordionPage = () => (
    <>
        <PageHeader title="Accordion" description="appearance default · separated · flush, collapsible, density. AccordionItem icon · extra · disabled." />
        <ComponentPreview title="default · separated" code={`<Accordion defaultValue="spec"><AccordionItem value="spec" title="검사 기준" extra={<Badge>3</Badge>}>…</AccordionItem></Accordion>`}>
            <Grid columns={2} gap={20} style={full}>
                <Accordion defaultValue="spec">
                    <AccordionItem value="spec" title="검사 기준" extra={<Badge size="xs" tone="success">3</Badge>}>외경 Ø32 ±0.05 · 표면 조도 Ra 1.6 · 경도 HRC 40~45</AccordionItem>
                    <AccordionItem value="mat" title="투입 자재">SUS304 1.2T · 볼트 M6</AccordionItem>
                    <AccordionItem value="hist" title="이력 (disabled)" disabled>—</AccordionItem>
                </Accordion>
                <Accordion appearance="separated" type="multiple">
                    <AccordionItem value="1" title="1공정 · 절단">절단 조건</AccordionItem>
                    <AccordionItem value="2" title="2공정 · 절곡" extra={<Badge size="xs" tone="warning">대기</Badge>}>절곡 조건</AccordionItem>
                    <AccordionItem value="3" title="3공정 · 용접">용접 조건</AccordionItem>
                </Accordion>
            </Grid>
        </ComponentPreview>
    </>
)
