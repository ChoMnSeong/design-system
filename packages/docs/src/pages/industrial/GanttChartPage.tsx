import { useState } from 'react'
import { GanttChart, Heatmap, Sparkline, WaterfallChart, type GanttTask } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { full } from '../shared/demoStyles'

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
            <PageHeader title="GanttChart · Heatmap · WaterfallChart" description="간트: 의존선 · 오늘 · 상위 접기 · 드래그 일정 변경. 히트맵: sequential · diverging. 워터폴: 증감 톤. Sparkline: 셀 · 카드용." />
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
