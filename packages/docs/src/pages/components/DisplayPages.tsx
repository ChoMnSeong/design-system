import { useState } from 'react'
import {
    Avatar,
    AvatarGroup,
    Badge,
    Descriptions,
    IconCheck,
    IconMoreHorizontal,
    Progress,
    Stat,
    StatusIndicator,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeaderCell,
    TableRow,
    Tag,
    Timeline,
    Tree,
    type Tone,
    type TreeNode,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const TONES: Array<[Tone, string]> = [
    ['accent', 'accent'],
    ['neutral', 'neutral'],
    ['success', '완료'],
    ['warning', '보류'],
    ['danger', '불량'],
    ['info', '검사'],
]

export const BadgePage = () => (
    <>
        <PageHeader title="Badge" description="appearance solid · soft(기본) · outline × tone. dot · max · pulse · icon." />
        {(['solid', 'soft', 'outline'] as const).map((a) => (
            <ComponentPreview key={a} title={a} code={`<Badge appearance="${a}" tone="success">완료</Badge>`}>
                {TONES.map(([t, l]) => (
                    <Badge key={t} appearance={a} tone={t}>
                        {l}
                    </Badge>
                ))}
            </ComponentPreview>
        ))}
        <ComponentPreview title="dot · size · max · pulse" code={`<Badge tone="success" dot>가동</Badge> <Badge appearance="solid" tone="danger" max={99}>{120}</Badge> <Badge pulse tone="accent">pulse</Badge>`}>
            <Badge tone="success" dot>가동</Badge>
            <Badge tone="danger" dot>정지</Badge>
            <Badge appearance="solid" tone="danger" size="xs">N</Badge>
            <Badge appearance="solid" tone="danger" size="sm">12</Badge>
            <Badge appearance="solid" tone="danger" max={99}>{120}</Badge>
            <Badge pulse tone="accent">pulse</Badge>
            <Badge tone="success" icon={<IconCheck size={12} />}>승인</Badge>
        </ComponentPreview>
    </>
)

export const TagPage = () => {
    const [filter, setFilter] = useState('all')
    const [lines, setLines] = useState(['1라인', '2라인'])
    return (
        <>
            <PageHeader title="Tag" description="분류 · 속성 표시. closable, icon, 필터 칩(onClick + selected), maxWidth 말줄임." />
            <ComponentPreview title="soft · outline · solid" code={`<Tag tone="accent">브래킷 A형</Tag> <Tag appearance="outline">SUS304</Tag> <Tag appearance="solid" tone="accent">긴급</Tag>`}>
                <Tag>2라인</Tag>
                <Tag tone="accent">브래킷 A형</Tag>
                <Tag tone="success">합격</Tag>
                <Tag tone="danger">불합격</Tag>
                <Tag appearance="outline">SUS304</Tag>
                <Tag appearance="outline" tone="accent">긴급</Tag>
                <Tag appearance="solid" tone="accent">긴급</Tag>
            </ComponentPreview>
            <ComponentPreview title="closable · icon · size" code={`<Tag closable onClose={() => remove(l)}>1라인</Tag>`}>
                {lines.map((l) => (
                    <Tag key={l} closable onClose={() => setLines(lines.filter((x) => x !== l))}>
                        {l}
                    </Tag>
                ))}
                <Tag tone="accent" icon={<IconCheck size={12} />}>승인됨</Tag>
                <Tag appearance="outline" size="sm">sm</Tag>
            </ComponentPreview>
            <ComponentPreview title="필터 칩 · maxWidth" code={`<Tag appearance="outline" selected={filter === 'all'} onClick={() => setFilter('all')}>전체 412</Tag>`}>
                {[
                    ['all', '전체 412'],
                    ['wait', '대기 38'],
                    ['run', '작업중 12'],
                ].map(([k, l]) => (
                    <Tag key={k} appearance="outline" selected={filter === k} onClick={() => setFilter(k!)}>
                        {l}
                    </Tag>
                ))}
                <Tag appearance="outline" maxWidth={180}>maxWidth 넘는 아주 긴 품목명 하우징 커버 어셈블리</Tag>
            </ComponentPreview>
        </>
    )
}

export const AvatarPage = () => (
    <>
        <PageHeader title="Avatar · StatusIndicator" description="size xs~xl, tone, status. AvatarGroup 은 max 로 +N 을 붙입니다." />
        <ComponentPreview title="size · tone · shape" code={`<Avatar name="김민지" size="lg" /> <Avatar name="QA" shape="rounded" tone="neutral" />`}>
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
                <Avatar key={s} name="김민지" size={s} />
            ))}
            <Avatar name="생산" tone="success" />
            <Avatar name="설비" tone="info" />
            <Avatar name="자재" tone="warning" />
            <Avatar name="QA" shape="rounded" tone="neutral" />
        </ComponentPreview>
        <ComponentPreview title="status · group" code={`<Avatar name="김" status="online" /> <AvatarGroup max={4} size="sm">…</AvatarGroup>`}>
            <Avatar name="김민지" status="online" />
            <Avatar name="이서준" tone="info" status="away" />
            <Avatar name="박도윤" tone="success" status="busy" />
            <Avatar name="최하은" tone="neutral" status="offline" />
            <AvatarGroup max={4} size="sm">
                {['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'].map((n, i) => (
                    <Avatar key={n} name={n} tone={(['accent', 'success', 'info', 'warning'] as Tone[])[i % 4]} />
                ))}
            </AvatarGroup>
        </ComponentPreview>
        <ComponentPreview title="StatusIndicator" code={`<StatusIndicator tone="success" label="가동" pulse />`}>
            <StatusIndicator tone="success" label="가동" pulse />
            <StatusIndicator tone="info" label="대기" />
            <StatusIndicator tone="danger" label="정지" pulse />
            <StatusIndicator tone="neutral" label="점검" />
            <StatusIndicator tone="warning" label="경고" />
            <StatusIndicator tone="success" label="sm" size="sm" />
        </ComponentPreview>
    </>
)

export const ProgressPage = () => (
    <>
        <PageHeader title="Progress" description="appearance bar · segmented · circle. size xs~lg, valueLabel, target 마커, indeterminate." />
        <ComponentPreview title="size · tone · valueLabel" code={`<Progress value={62} size="lg" /> <Progress value={96} tone="success" valueLabel="end" />`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
                {(['xs', 'sm', 'md', 'lg'] as const).map((s) => (
                    <Progress key={s} value={62} size={s} aria-label={`진행 ${s}`} />
                ))}
                <Progress value={96} tone="success" valueLabel="end" aria-label="가동률" />
                <Progress value={72} tone="warning" valueLabel="end" aria-label="달성률" />
                <Progress value={34} tone="danger" valueLabel="end" aria-label="품질" />
                <Progress value={68} size="lg" valueLabel="inside" aria-label="inside" />
            </div>
        </ComponentPreview>
        <ComponentPreview title="target · segments · indeterminate" code={`<Progress value={82} target={85} tone="warning" /> <Progress size="lg" segments={[…]} />`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
                <Progress value={82} target={85} tone="warning" valueLabel="end" aria-label="목표 대비" />
                <Progress
                    size="lg"
                    aria-label="설비 상태 비율"
                    segments={[
                        { value: 58, tone: 'success', label: '가동' },
                        { value: 12, tone: 'info', label: '대기' },
                        { value: 6, tone: 'danger', label: '정지' },
                        { value: 8, tone: 'neutral', label: '점검' },
                    ]}
                />
                <Progress indeterminate aria-label="불러오는 중" />
            </div>
        </ComponentPreview>
        <ComponentPreview title="circle" code={`<Progress appearance="circle" value={72} valueLabel="end" size="lg" />`}>
            <Progress appearance="circle" value={72} valueLabel="end" size="lg" aria-label="원형 72" />
            <Progress appearance="circle" value={45} valueLabel="end" tone="success" aria-label="원형 45" />
            <Progress appearance="circle" indeterminate size="sm" aria-label="로딩" />
        </ComponentPreview>
    </>
)

export const StatPage = () => (
    <>
        <PageHeader title="Stat" description="appearance plain · card, delta(trend 로 좋고 나쁨), target 달성률, sparkline, loading." />
        <ComponentPreview title="기본" code={`<Stat label="생산량" value="12,480" delta={{ value: '+4.2%' }} />
<Stat label="가동률" value="96.0%" target={95} sparkline={[…]} />
<Stat label="불량률" value="1.8%" trend="down-good" delta={{ value: '+0.3%p' }} />`}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, width: '100%' }}>
                <Stat appearance="card" label="생산량" value="12,480" delta={{ value: '+4.2%' }} helper="전일 대비" />
                <Stat appearance="card" label="가동률" value="96.0" target={95} sparkline={[88, 91, 90, 94, 93, 95, 96]} />
                <Stat appearance="card" label="불량률" value="1.8%" trend="down-good" delta={{ value: '+0.3%p' }} />
                <Stat appearance="card" label="설비 OEE" value="" loading />
            </div>
        </ComponentPreview>
    </>
)

export const TablePage = () => (
    <>
        <PageHeader title="Table" description="variant · density · striped · bordered · stickyHeader, TableFooter, 셀 align, 정렬 표시." />
        <ComponentPreview title="default · footer" code={`<Table><TableHead>…</TableHead><TableBody>…</TableBody><TableFooter>…</TableFooter></Table>`}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%', alignItems: 'start' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>품목</TableHeaderCell>
                            <TableHeaderCell align="right">계획</TableHeaderCell>
                            <TableHeaderCell align="right" sortDirection="desc">실적</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[
                            ['브래킷 A형', '1,200', '1,188'],
                            ['하우징 커버', '1,200', '1,160'],
                            ['샤프트 Ø32', '800', '512'],
                        ].map(([a, b, c]) => (
                            <TableRow key={a}>
                                <TableCell>{a}</TableCell>
                                <TableCell align="right">{b}</TableCell>
                                <TableCell align="right">{c}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell>합계</TableCell>
                            <TableCell align="right">3,200</TableCell>
                            <TableCell align="right">2,860</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
                <Table striped bordered density="compact" stickyHeader maxHeight={160}>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>LOT</TableHeaderCell>
                            <TableHeaderCell>검사</TableHeaderCell>
                            <TableHeaderCell align="right">측정값</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[118, 119, 121, 122, 123, 124].map((n) => (
                            <TableRow key={n}>
                                <TableCell>L2611-{n}</TableCell>
                                <TableCell>
                                    <Badge size="xs" tone={n === 121 ? 'danger' : 'success'}>{n === 121 ? '불합격' : '합격'}</Badge>
                                </TableCell>
                                <TableCell align="right">{n === 121 ? '10.34' : '10.02'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </ComponentPreview>
    </>
)

export const DescriptionsPage = () => (
    <>
        <PageHeader title="Descriptions" description="상세 화면의 라벨 : 값. columns · span · bordered · layout." />
        <ComponentPreview title="columns=3 · bordered · span" code={`<Descriptions bordered columns={3} items={[…, { label: '비고', value: '…', span: 3 }]} />`}>
            <Descriptions
                bordered
                columns={3}
                style={{ width: '100%' }}
                items={[
                    { label: '작업지시', value: 'WO-2611-0042' },
                    { label: '품목', value: '브래킷 A형' },
                    { label: '라인', value: '1라인' },
                    { label: '계획', value: '1,200 EA' },
                    { label: '실적', value: '1,064 EA' },
                    { label: '상태', value: <Badge size="sm" tone="info">작업중</Badge> },
                    { label: '비고', value: '고객 요청으로 납기 1일 앞당김', span: 3 },
                ]}
            />
        </ComponentPreview>
        <ComponentPreview title="layout=vertical" code={`<Descriptions layout="vertical" columns={4} items={…} />`}>
            <Descriptions
                layout="vertical"
                columns={4}
                style={{ width: '100%' }}
                items={[
                    { label: '거래처', value: '(주)한빛정밀' },
                    { label: '납기', value: '2026-11-21' },
                    { label: '담당', value: '생산1팀' },
                    { label: '우선순위', value: <Badge size="sm" tone="danger">긴급</Badge> },
                ]}
            />
        </ComponentPreview>
    </>
)

export const TimelinePage = () => (
    <>
        <PageHeader title="Timeline" description="결재 · 이력. mode left · right · alternate, pending, reverse." />
        <ComponentPreview title="left · pending / alternate" code={`<Timeline items={[…]} pending="재승인 대기" />`}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, width: '100%' }}>
                <Timeline
                    pending="재승인 대기"
                    items={[
                        { time: '11/18', title: '작성 · 생산관리', description: '작업지시 등록' },
                        { time: '11/18', title: '승인 · 팀장', tone: 'success' },
                        { time: '11/19', title: '반려 · 품질', description: '검사 기준서 누락', tone: 'danger' },
                    ]}
                />
                <Timeline
                    mode="alternate"
                    items={[
                        { time: '11/02', title: '설계 완료' },
                        { time: '11/09', title: '개발 착수' },
                        { time: '12/07 예정', title: '통합 테스트', tone: 'neutral' },
                    ]}
                />
            </div>
        </ComponentPreview>
    </>
)

const BOM: TreeNode[] = [
    {
        id: 'asm',
        label: '브래킷 어셈블리',
        badge: 4,
        children: [
            { id: 'a', label: '브래킷 A형', badge: '×2', children: [{ id: 'sus', label: 'SUS304 1.2T 판재' }, { id: 'bolt', label: '볼트 M6' }] },
            { id: 'cover', label: '하우징 커버', children: [{ id: 'c1', label: '커버 판재' }] },
            { id: 'gasket', label: '가스켓', hasChildren: true },
        ],
    },
]
const PLANT: TreeNode[] = [
    {
        id: 'p1',
        label: '1공장',
        children: [
            {
                id: 'l2',
                label: '2라인',
                children: [
                    { id: 'press3', label: 'PRESS-03', icon: <StatusIndicator tone="danger" size="sm" />, actions: <IconMoreHorizontal size={16} /> },
                    { id: 'press4', label: 'PRESS-04', icon: <StatusIndicator tone="success" size="sm" />, actions: <IconMoreHorizontal size={16} /> },
                ],
            },
            { id: 'l3', label: '3라인', children: [{ id: 'weld1', label: 'WELD-01' }] },
        ],
    },
]

export const TreePage = () => (
    <>
        <PageHeader title="Tree" description="checkable(부분 체크 전파) · loadChildren · searchable · selectable · draggable. 방향키로 이동, → 펼치기 · ← 접기." />
        <ComponentPreview title="BOM · checkable · loadChildren / 설비 · searchable · actions" code={`<Tree data={BOM} checkable defaultChecked={['sus','bolt']} loadChildren={…} />`}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%', alignItems: 'start' }}>
                <Tree
                    aria-label="BOM"
                    data={BOM}
                    checkable
                    selectable="none"
                    defaultExpanded={['asm', 'a']}
                    defaultChecked={['sus', 'bolt']}
                    loadChildren={() => new Promise((r) => setTimeout(() => r([{ id: 'g1', label: 'NBR 고무' }]), 800))}
                />
                <Tree aria-label="설비" data={PLANT} searchable searchPlaceholder="설비 검색" defaultExpanded={['p1', 'l2']} defaultSelected={['press3']} draggable />
            </div>
        </ComponentPreview>
    </>
)
