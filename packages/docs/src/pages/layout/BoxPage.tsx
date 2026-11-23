import { Box, Divider, Grid, ScrollArea, Stack } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { full } from '../shared/demoStyles'

export const BoxPage = () => (
    <>
        <PageHeader title="Box · Stack · Grid · Divider · ScrollArea" description="Stack direction · Grid columns 는 화면 폭 단계별 값({ 0: 1, 768: 3 })을 받습니다. 간격 숫자는 px, 토큰은 space(3)." />
        <ComponentPreview title="Box tone · radius" code={`<Box tone="info" padding={12} radius="md">…</Box>`}>
            <Box tone="info" padding={12} radius="md">tone="info"</Box>
            <Box tone="warning" padding={12} radius="lg">tone="warning"</Box>
            <Box surface="card" padding={12}>surface="card"</Box>
        </ComponentPreview>
        <ComponentPreview title="Stack divider · responsive direction" code={`<Stack direction={{ 0: 'column', 768: 'row' }} divider gap={12}>…</Stack>`}>
            <Stack direction={{ 0: 'column', 768: 'row' }} divider gap={12} style={full}>
                <span>계획 1,200</span>
                <span>실적 1,064</span>
                <span>불량 21</span>
            </Stack>
        </ComponentPreview>
        <ComponentPreview title="Grid · responsive columns" code={`<Grid columns={{ 0: 1, 640: 2, 1024: 4 }} gap={12}>…</Grid>`}>
            <Grid columns={{ 0: 1, 640: 2, 1024: 4 }} gap={12} style={full}>
                {[1, 2, 3, 4].map((n) => <Box key={n} surface="card" padding={16}>칸 {n}</Box>)}
            </Grid>
        </ComponentPreview>
        <ComponentPreview title="Divider" code={`<Divider label="이전 기록" /> <Divider dashed tone="danger" label="기준선" labelPosition="start" />`}>
            <Stack gap={14} style={full}>
                <Divider />
                <Divider label="이전 기록" />
                <Divider dashed tone="danger" label="기준선" labelPosition="start" />
            </Stack>
        </ComponentPreview>
        <ComponentPreview title="ScrollArea · shadow" code={`<ScrollArea maxHeight={140} shadow scrollbar="hover">…</ScrollArea>`}>
            <ScrollArea maxHeight={140} shadow scrollbar="hover" style={{ width: 280, border: '1px solid var(--ds-color-border-subtle)', borderRadius: 8 }}>
                {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ padding: '6px 12px', fontSize: 13 }}>알람 {i + 1} · PRESS-0{(i % 4) + 1}</div>)}
            </ScrollArea>
        </ComponentPreview>
    </>
)
