import { useState } from 'react'
import { AppShellDemo } from './AppShellDemo'
import {
    Accordion,
    AccordionItem,
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    CardDescription,
    CardFooter,
    CardHeader,
    CardMedia,
    CardSection,
    CardTitle,
    DateRangePicker,
    Divider,
    FilterBar,
    FormField,
    Grid,
    IconMoreHorizontal,
    Input,
    KpiCard,
    MultiSelect,
    PageHeader as DsPageHeader,
    ScrollArea,
    SegmentedControl,
    Select,
    Splitter,
    Stack,
    StatusCard,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    type StatusDef,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const full = { width: '100%' } as const

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

const EQUIP: Record<string, StatusDef> = {
    run: { label: '가동', tone: 'success', pulse: true },
    idle: { label: '대기', tone: 'info' },
    stop: { label: '정지', tone: 'danger', pulse: true },
    pm: { label: '점검', tone: 'warning' },
}

export const KpiCardPage = () => (
    <>
        <PageHeader title="KpiCard · StatusCard" description="Card 프리셋. KpiCard: 값 · 단위 · 목표 달성률 · 증감(trend) · sparkline. StatusCard: 사용자 정의 상태 · 지표 · 갱신 시각." />
        <ComponentPreview title="KpiCard" code={`<KpiCard label="금일 생산량" value="12,480" unit="EA" target={13000} delta={{ value: '+4.2%' }} sparkline={[…]} />`}>
            <Grid columns={4} gap={12} style={full}>
                <KpiCard label="금일 생산량" value="12,480" unit="EA" target={13000} delta={{ value: '+4.2%' }} sparkline={[9.8, 10.4, 11.2, 10.9, 11.8, 12.1, 12.48]} />
                <KpiCard label="양품률" value="98.7" unit="%" target={98} targetLabel={(t) => `목표 ${t.toFixed(1)}%`} delta={{ value: '+0.3%p' }} sparkline={[98.1, 98.3, 98.2, 98.5, 98.7]} />
                <KpiCard label="설비 종합효율 OEE" value="82.4" unit="%" target={85} targetLabel={(t) => `목표 ${t.toFixed(1)}%`} delta={{ value: '-3.1%p' }} sparkline={{ type: 'bar', data: [86, 84, 85, 83, 82.4] }} />
                <KpiCard label="불량 건수" value="37" unit="건" trend="down-good" delta={{ value: '+12건' }} sparkline={[22, 25, 30, 28, 37]} footer={<span style={{ fontSize: 12, color: 'var(--ds-color-foreground-tertiary)' }}>trend="down-good" 이라 늘면 빨강</span>} />
            </Grid>
        </ComponentPreview>
        <ComponentPreview title="StatusCard" code={`<StatusCard title="CNC-01" status="run" statusMap={EQUIP} metrics={[…]} updatedAt={new Date()} caption="WO-2611-0042" />`}>
            <Grid columns={4} gap={12} style={full}>
                <StatusCard title="CNC-01" status="run" statusMap={EQUIP} metrics={[{ label: '가동률', value: '91.2%' }, { label: '사이클', value: '42s' }, { label: '생산', value: '1,284' }]} updatedAt={new Date(Date.now() - 10000)} caption="WO-2611-0042" />
                <StatusCard title="CNC-02" status="idle" statusMap={EQUIP} metrics={[{ label: '가동률', value: '64.8%' }, { label: '대기', value: '12분' }]} updatedAt={new Date(Date.now() - 60000)} />
                <StatusCard title="PRESS-03" status="stop" statusMap={EQUIP} metrics={[{ label: '정지', value: '23분', tone: 'danger' }, { label: '원인', value: '금형' }]} updatedAt={new Date(Date.now() - 5000)} actions={<Button size="xs" tone="danger">조치</Button>} />
                <StatusCard title="WELD-01" status="pm" statusMap={EQUIP} metrics={[{ label: '점검', value: '예방보전' }, { label: '종료', value: '16:00' }]} />
            </Grid>
        </ComponentPreview>
    </>
)

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

export const TabsPage = () => {
    const [docs, setDocs] = useState(['WO-0042', 'WO-0047'])
    return (
        <>
            <PageHeader title="Tabs" description="appearance underline · pill · enclosed · segmented, size, orientation, overflow(scroll · menu), keepMounted. Tab icon · badge · closable." />
            {(['underline', 'pill', 'segmented'] as const).map((a) => (
                <ComponentPreview key={a} title={a} code={`<Tabs appearance="${a}" defaultValue="a">…</Tabs>`}>
                    <Tabs appearance={a} defaultValue="a" style={full}>
                        <TabList aria-label={a}>
                            <Tab value="a">개요</Tab>
                            <Tab value="b" badge={12}>작업지시</Tab>
                            <Tab value="c">검사</Tab>
                            <Tab value="d" disabled>이력</Tab>
                        </TabList>
                        <TabPanel value="a">개요 패널</TabPanel>
                        <TabPanel value="b">작업지시 패널</TabPanel>
                        <TabPanel value="c">검사 패널</TabPanel>
                    </Tabs>
                </ComponentPreview>
            ))}
            <ComponentPreview title="enclosed · closable" code={`<Tab value="WO-0042" closable onClose={() => close('WO-0042')}>WO-0042</Tab>`}>
                <Tabs appearance="enclosed" defaultValue="WO-0042" style={full}>
                    <TabList aria-label="열린 작업지시">
                        {docs.map((d) => <Tab key={d} value={d} closable onClose={() => setDocs(docs.filter((x) => x !== d))}>{d}</Tab>)}
                    </TabList>
                    {docs.map((d) => <TabPanel key={d} value={d}>{d} 상세</TabPanel>)}
                </Tabs>
            </ComponentPreview>
            <ComponentPreview title="vertical · overflow=menu" code={`<Tabs orientation="vertical">…</Tabs> <Tabs overflow="menu">…</Tabs>`}>
                <Stack gap={20} style={full}>
                    <Tabs orientation="vertical" defaultValue="info">
                        <TabList aria-label="품목 정보">
                            <Tab value="info">기본 정보</Tab>
                            <Tab value="bom">BOM</Tab>
                            <Tab value="route">라우팅</Tab>
                        </TabList>
                        <TabPanel value="info">기본 정보 패널</TabPanel>
                        <TabPanel value="bom">BOM 패널</TabPanel>
                        <TabPanel value="route">라우팅 패널</TabPanel>
                    </Tabs>
                    <div style={{ width: 360 }}>
                        <Tabs overflow="menu" defaultValue="t1" size="sm">
                            <TabList aria-label="많은 탭">
                                {Array.from({ length: 9 }, (_, i) => <Tab key={i} value={`t${i + 1}`}>공정 {i + 1}</Tab>)}
                            </TabList>
                        </Tabs>
                    </div>
                </Stack>
            </ComponentPreview>
        </>
    )
}

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

export const AppShellPage = () => {
    const [line, setLine] = useState<string | null>('all')
    const [items, setItems] = useState<string[]>(['A', 'B', 'C', 'D'])
    return (
        <>
            <PageHeader title="AppShell · PageHeader · FilterBar · Splitter" description="업무 화면 뼈대. AppShell 은 사이드바 접기 · kiosk(현장 모니터) 모드, FilterBar 는 접힘 줄 수 · 적용 칩, Splitter 는 크기 저장." />
            <ComponentPreview title="AppShell" description="brand · headerSearch · headerActions 로 머리말을, navigation 으로 아이콘 · 선택 표시 · 그룹이 맞춰진 사이드바를 그립니다. 로고 옆 버튼이나 ⌘B · Ctrl+B 로 접으면 아이콘만 남습니다." code={`<AppShell
    brand={<><Logo /> MES</>}
    headerSearch={<Button>⌘K 검색</Button>}
    headerActions={<><Button iconOnly badge={3} /> <Menu trigger={<Avatar />} /></>}
    navigation={items}          // NavItem[] — icon · children · group · badge
    activeNavId={active}
    onNavigate={(n) => setActive(n.id)}
    footer={<StatusIndicator label="PLC 연결" />}
    kiosk={kiosk}
>
    …
</AppShell>`}>
                <AppShellDemo />
            </ComponentPreview>
            <ComponentPreview title="Splitter" description="손잡이를 끌거나 ← → 키. stateKey 로 크기를 기억합니다." code={`<Splitter defaultSize="55%" collapsible stateKey="wo-split">…</Splitter>`}>
                <div style={{ width: '100%', height: 220 }}>
                    <Splitter defaultSize="55%" collapsible stateKey="docs-split">
                        <Card style={{ height: '100%' }}><CardTitle>목록</CardTitle></Card>
                        <Card style={{ height: '100%' }}><CardTitle>상세</CardTitle><CardDescription>손잡이를 끌거나 ← → 키</CardDescription></Card>
                    </Splitter>
                </div>
            </ComponentPreview>
            <ComponentPreview title="PageHeader · tabs · onBack" code={`<PageHeader breadcrumb="…" title="브래킷 A형" extra={<Badge>사용</Badge>} actions={…} meta="…" tabs={<Tabs>…</Tabs>} onBack={…} />`}>
                <div style={full}>
                    <DsPageHeader
                        onBack={() => {}}
                        breadcrumb="기준정보 / 품목 / BR-A01"
                        title="브래킷 A형"
                        extra={<Badge size="sm" tone="success">사용</Badge>}
                        actions={<><Button size="sm" appearance="outline" tone="neutral">복사</Button><Button size="sm">편집</Button></>}
                        meta="SUS304 1.2T · 단위 EA · 최종 수정 11/18"
                        tabs={<Tabs defaultValue="b" size="sm"><TabList aria-label="품목"><Tab value="b">기본</Tab><Tab value="bom">BOM</Tab><Tab value="h">이력</Tab></TabList></Tabs>}
                    />
                </div>
            </ComponentPreview>
            <ComponentPreview title="FilterBar · collapsedRows · appliedChips" code={`<FilterBar columns={4} collapsedRows={1} fields={<>…</>} appliedChips={[…]} onSearch={search} onReset={reset} />`}>
                <FilterBar
                    style={full}
                    columns={4}
                    collapsedRows={1}
                    onSearch={() => {}}
                    onReset={() => {
                        setLine('all')
                        setItems([])
                    }}
                    appliedChips={[{ label: '11월' }, ...(items.length ? [{ label: `품목 ${items.length}개`, onRemove: () => setItems([]) }] : []), ...(line !== 'all' ? [{ label: `${line}라인`, onRemove: () => setLine('all') }] : [])]}
                    fields={
                        <>
                            <FormField label="작업일자"><DateRangePicker size="sm" defaultValue={['2026-11-01', '2026-11-30']} fullWidth /></FormField>
                            <FormField label="라인"><Select size="sm" value={line} onValueChange={setLine} options={[{ value: 'all', label: '전체' }, { value: '1', label: '1라인' }, { value: '2', label: '2라인' }]} fullWidth /></FormField>
                            <FormField label="품목"><MultiSelect size="sm" value={items} onValueChange={setItems} maxTagCount={1} options={['A', 'B', 'C', 'D', 'E'].map((v) => ({ value: v, label: `브래킷 ${v}형` }))} fullWidth /></FormField>
                            <FormField label="상태"><SegmentedControl size="sm" fullWidth defaultValue="run" options={[{ value: 'all', label: '전체' }, { value: 'run', label: '진행' }, { value: 'done', label: '완료' }]} /></FormField>
                            <FormField label="작업자"><Input size="sm" placeholder="이름" /></FormField>
                            <FormField label="LOT"><Input size="sm" placeholder="L2611-…" /></FormField>
                        </>
                    }
                />
            </ComponentPreview>
        </>
    )
}
