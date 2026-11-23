import { Button, Card, CardBody, CardDescription, CardFooter, CardHeader, CardMedia, CardSection, CardTitle, Grid, IconMoreHorizontal, Stack } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { full } from '../shared/demoStyles'

export const CardPage = () => (
    <>
        <PageHeader title="Card" description="surface · variant · padding · tone · accent · density · interactive · selectable · collapsible · loading · disabled. Card.Header actions · Media · Section." />
        <ComponentPreview title="variant · surface · Media" code={`<Card variant="filled">…</Card> <Card padding={false}><CardMedia>…</CardMedia>…</Card>`}>
            <Grid columns={4} gap={12} style={full}>
                {(['outlined', 'underline', 'filled', 'ghost'] as const).map((v) => (
                    <Card key={v} variant={v}>
                        <CardTitle>{v}</CardTitle>
                        <CardDescription>BorderVariant</CardDescription>
                    </Card>
                ))}
                <Card surface="overlay"><CardTitle>overlay</CardTitle><CardDescription>떠 있는 카드</CardDescription></Card>
                <Card surface="panel"><CardTitle>panel</CardTitle><CardDescription>그림자 없는 패널</CardDescription></Card>
                <Card padding={false}>
                    <CardMedia><div style={{ height: 64, background: 'linear-gradient(135deg, var(--ds-palette-primary-200), var(--ds-palette-info-200))' }} /></CardMedia>
                    <CardTitle>Card.Media</CardTitle>
                    <CardDescription>padding=false</CardDescription>
                </Card>
                <Card disabled><CardTitle>disabled</CardTitle><CardDescription>상호작용 차단</CardDescription></Card>
            </Grid>
        </ComponentPreview>
        <ComponentPreview title="tone · accent · 상호작용" code={`<Card tone="danger" accent="top" /> <Card selectable /> <Card interactive onClick={open} />`}>
            <Grid columns={4} gap={12} style={full}>
                <Card tone="danger" accent="top"><CardTitle>accent top</CardTitle><CardDescription>tone="danger"</CardDescription></Card>
                <Card tone="warning" accent="left"><CardTitle>accent left</CardTitle><CardDescription>tone="warning"</CardDescription></Card>
                <Card selectable defaultSelected><CardTitle>selectable</CardTitle><CardDescription>눌러서 선택 · 해제</CardDescription></Card>
                <Card interactive onClick={() => {}}><CardTitle>interactive</CardTitle><CardDescription>hover · 포커스 링</CardDescription></Card>
            </Grid>
        </ComponentPreview>
        <ComponentPreview title="Header actions · Section · Footer · collapsible · loading" code={`<Card><CardHeader actions={…}>…</CardHeader><CardSection>…</CardSection><CardFooter>…</CardFooter></Card>`}>
            <Grid columns={2} gap={12} style={full}>
                <Card>
                    <CardHeader actions={<><Button size="sm" appearance="ghost" tone="neutral">편집</Button><Button size="sm" appearance="ghost" tone="neutral" shape="square" aria-label="더보기" iconLeft={<IconMoreHorizontal size={16} />} /></>}>
                        <CardTitle>작업지시 WO-2611-0042</CardTitle>
                        <CardDescription>브래킷 A형 · 1라인</CardDescription>
                    </CardHeader>
                    <CardSection>Card.Section 으로 내부를 나눕니다.</CardSection>
                    <CardFooter><Button size="sm" appearance="ghost" tone="neutral">취소</Button><Button size="sm">저장</Button></CardFooter>
                </Card>
                <Stack gap={12}>
                    <Card collapsible defaultCollapsed>
                        <CardHeader><CardTitle>collapsible</CardTitle></CardHeader>
                        <CardBody>접었다 펼칩니다.</CardBody>
                    </Card>
                    <Card loading />
                    <Stack direction="row" gap={8} align="flex-start">
                        {(['compact', 'default', 'comfortable'] as const).map((d) => <Card key={d} density={d}><b style={{ fontSize: 13 }}>{d}</b></Card>)}
                    </Stack>
                </Stack>
            </Grid>
        </ComponentPreview>
    </>
)
