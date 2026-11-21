import { useState } from 'react'
import { BulletChart, ControlChart, GanttChart, Heatmap, ParetoChart, Sparkline, StatusTimeline, WaterfallChart, type GanttTask } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const full = { width: '100%' } as const
const MEAS = [10.02, 9.98, 10.05, 10.01, 9.97, 10.03, 10.0, 10.06, 10.08, 10.07, 10.09, 10.1, 10.11, 10.34, 10.04, 9.99, 10.02, 10.0]

export const ParetoPage = () => (
    <>
        <PageHeader title="ParetoChart · ControlChart" description="파레토: 정렬 + 누적 비율 + vitalFew 강조. 관리도: CL·UCL·LCL 자동 계산(I-MR), USL·LSL, Western Electric · Nelson 규칙, σ 구간 음영." />
        <ComponentPreview title="ParetoChart" code={`<ParetoChart data={[{ label: '치수불량', value: 42 }, …]} vitalFew={0.8} />`}>
            <div style={full}>
                <ParetoChart data={[{ label: '치수불량', value: 42 }, { label: '스크래치', value: 28 }, { label: '변형', value: 14 }, { label: '이물', value: 9 }, { label: '도장', value: 4 }, { label: '포장', value: 3 }]} formatValue={(n) => `${n}건`} />
            </div>
        </ComponentPreview>
        <ComponentPreview title="ControlChart" code={`<ControlChart data={measurements} usl={10.3} lsl={9.7} rules="western-electric" />`}>
            <div style={full}>
                <ControlChart data={MEAS.map((y, i) => ({ x: `L${118 + i}`, y }))} usl={10.3} lsl={9.7} rules="western-electric" />
            </div>
        </ComponentPreview>
    </>
)

const H = (h: number, m = 0) => new Date(2026, 10, 21, h, m)
const STATUS = { run: { label: '가동', tone: 'success' as const }, idle: { label: '대기', tone: 'info' as const }, stop: { label: '정지', tone: 'danger' as const }, pm: { label: '점검', tone: 'warning' as const } }

export const StatusTimelinePage = () => {
    const [picked, setPicked] = useState('')
    return (
        <>
            <PageHeader title="StatusTimeline · BulletChart" description="상태 타임라인: 설비별 구간 · now · highlight · 드래그 확대. 불릿: 실적 · 목표 · 구간(불량·보통·양호)." />
            <ComponentPreview title="StatusTimeline" code={`<StatusTimeline rows={…} statusMap={…} range={[06:00, 18:00]} now={…} zoom />`}>
                <div style={full}>
                    <StatusTimeline
                        range={[H(6), H(18)]}
                        now={H(14, 20)}
                        zoom
                        statusMap={STATUS}
                        highlight={{ rowId: 'p3', from: H(11, 40), to: H(12, 30) }}
                        onSegmentClick={(r, s) => setPicked(`${r} · ${STATUS[s.status as keyof typeof STATUS].label}`)}
                        rows={[
                            { id: 'c1', label: 'CNC-01', segments: [{ from: H(6), to: H(9, 30), status: 'run' }, { from: H(9, 30), to: H(10), status: 'idle' }, { from: H(10), to: H(14, 20), status: 'run' }] },
                            { id: 'c2', label: 'CNC-02', segments: [{ from: H(6), to: H(8), status: 'pm' }, { from: H(8), to: H(13), status: 'run' }, { from: H(13), to: H(14, 20), status: 'idle' }] },
                            { id: 'p3', label: 'PRESS-03', segments: [{ from: H(6), to: H(11, 40), status: 'run' }, { from: H(11, 40), to: H(12, 30), status: 'stop', note: '금형 이상' }, { from: H(12, 30), to: H(14, 20), status: 'run' }] },
                        ]}
                    />
                    {picked && <p style={{ fontSize: 12 }}>선택: {picked}</p>}
                </div>
            </ComponentPreview>
            <ComponentPreview title="BulletChart" code={`<BulletChart label="생산량" value={12480} target={13000} ranges={[{ to: 10000 }, { to: 12000 }, { to: 14000 }]} />`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
                    <BulletChart label="생산량" value={12480} target={13000} ranges={[{ to: 10000, label: '불량' }, { to: 12000, label: '보통' }, { to: 14000, label: '양호' }]} />
                    <BulletChart label="가동률" value={82.4} target={85} max={100} tone="warning" ranges={[{ to: 70 }, { to: 85 }, { to: 100 }]} formatValue={(n) => `${n}%`} />
                    <BulletChart label="양품률" value={98.7} target={98} max={100} tone="success" ranges={[{ to: 95 }, { to: 98 }, { to: 100 }]} formatValue={(n) => `${n}%`} />
                </div>
            </ComponentPreview>
        </>
    )
}

export const GanttPage = () => {
    const [tasks, setTasks] = useState<GanttTask[]>([
        { id: 'm', name: '금형 제작', start: '2026-11-16', end: '2026-11-28', progress: 45 },
        { id: 'd', name: '설계', start: '2026-11-16', end: '2026-11-19', progress: 100, parent: 'm' },
        { id: 'c', name: '가공', start: '2026-11-19', end: '2026-11-25', progress: 40, parent: 'm' },
        { id: 't', name: '시사출', start: '2026-11-25', end: '2026-11-27', progress: 0, parent: 'm' },
        { id: 'ok', name: '양산 승인', start: '2026-11-28', end: '2026-11-28', type: 'milestone' },
    ])
    return (
        <>
            <PageHeader title="Gantt · Heatmap · Waterfall · Sparkline" description="간트: 의존선 · 오늘 · 상위 접기 · 드래그 일정 변경. 히트맵: sequential · diverging. 워터폴: 증감 톤. Sparkline: 셀 · 카드용." />
            <ComponentPreview title="GanttChart" code={`<GanttChart tasks={tasks} dependencies={[{ from: 'd', to: 'c' }, …]} today="2026-11-21" onTaskChange={update} />`}>
                <div style={full}>
                    <GanttChart
                        tasks={tasks}
                        dependencies={[{ from: 'd', to: 'c' }, { from: 'c', to: 't' }, { from: 't', to: 'ok' }]}
                        today="2026-11-21"
                        onTaskChange={(nt) => setTasks((ts) => ts.map((x) => (x.id === nt.id ? nt : x)))}
                    />
                </div>
            </ComponentPreview>
            <ComponentPreview title="Heatmap" code={`<Heatmap rows={['1라인', …]} columns={['06', …]} values={…} />`}>
                <Heatmap
                    aria-label="시간대별 불량 건수"
                    rows={['1라인', '2라인', '3라인']}
                    columns={['06', '08', '10', '12', '14', '16', '18']}
                    values={[[1, 2, 0, 3, 5, 2, 1], [0, 1, 1, 2, 8, 4, 2], [2, 1, null, 1, 3, 2, 0]]}
                />
            </ComponentPreview>
            <ComponentPreview title="WaterfallChart · Sparkline" code={`<WaterfallChart increase="danger" decrease="success" steps={[{ label: '전월', value: 4200, type: 'total' }, …]} /> <Sparkline data={…} />`}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, width: '100%', alignItems: 'center' }}>
                    <WaterfallChart
                        height={220}
                        increase="danger"
                        decrease="success"
                        formatValue={(n) => n.toLocaleString('ko-KR')}
                        steps={[
                            { label: '전월 원가', value: 4200, type: 'total' },
                            { label: '원자재', value: 380 },
                            { label: '인건비', value: 120 },
                            { label: '불량 감소', value: -260 },
                            { label: '공정 개선', value: -180 },
                            { label: '당월 원가', value: 4260, type: 'total' },
                        ]}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12 }}>
                        <span>생산량 <Sparkline data={[9, 11, 10, 12, 13, 12, 14]} width={100} /></span>
                        <span>불량 <Sparkline data={[3, 4, 2, 6, 5, 8, 7]} tone="danger" type="bar" width={100} /></span>
                        <span>가동률 <Sparkline data={[88, 90, 92, 91, 94]} tone="success" type="area" width={100} reference={90} /></span>
                    </div>
                </div>
            </ComponentPreview>
        </>
    )
}
