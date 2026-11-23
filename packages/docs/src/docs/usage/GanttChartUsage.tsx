import { GanttChart } from '@ensnif/design-system'

export default function Example() {
    return (
        <GanttChart
            tasks={[
                { id: 'mold', name: '금형 제작 (WO-2611-031)', start: '2026-11-02', end: '2026-11-20' },
                { id: 'design', name: '설계', start: '2026-11-02', end: '2026-11-06', progress: 100, parent: 'mold' },
                { id: 'cut', name: '가공', start: '2026-11-09', end: '2026-11-16', progress: 60, parent: 'mold' },
                { id: 'try', name: '시사출', start: '2026-11-17', end: '2026-11-20', progress: 0, parent: 'mold' },
                { id: 'ok', name: '고객 승인', start: '2026-11-21', end: '2026-11-21', type: 'milestone' },
            ]}
            dependencies={[{ from: 'design', to: 'cut' }, { from: 'cut', to: 'try' }]}
            today="2026-11-12"
        />
    )
}
