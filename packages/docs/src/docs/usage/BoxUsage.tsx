import { Box, Divider, Grid, ScrollArea, Spacer, Stack } from '@ensnif/design-system'

export default function Example() {
    return (
        <Stack gap={12}>
            <Stack direction="row" align="center">
                <b>2라인 실적</b>
                <Spacer />
                <span>08:00 ~ 17:00</span>
            </Stack>
            <Grid columns={{ 0: 1, 768: 3 }} gap={12}>
                <Box surface="card" padding={12}>계획 1,200</Box>
                <Box surface="card" padding={12}>실적 1,064</Box>
                <Box tone="danger" padding={12} radius="md">불량 21</Box>
            </Grid>
            <Divider label="작업 로그" />
            <ScrollArea maxHeight={120} shadow aria-label="작업 로그">
                {['08:02 작업 시작', '10:15 금형 교체', '13:40 자주검사 합격'].map((t) => <p key={t}>{t}</p>)}
            </ScrollArea>
        </Stack>
    )
}
