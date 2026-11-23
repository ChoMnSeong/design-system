import { StatusTimeline } from '@ensnif/design-system'

export default function Example() {
    return (
        <StatusTimeline
            statusMap={{
                run: { label: '가동', tone: 'success' },
                idle: { label: '대기', tone: 'warning' },
                down: { label: '정지', tone: 'danger' },
            }}
            rows={[
                { id: 'p1', label: '프레스 1호', segments: [{ from: '2026-11-23T06:00', to: '2026-11-23T10:30', status: 'run' }, { from: '2026-11-23T10:30', to: '2026-11-23T11:10', status: 'down', note: '금형 교체' }, { from: '2026-11-23T11:10', to: '2026-11-23T14:00', status: 'run' }] },
                { id: 'p2', label: '프레스 2호', segments: [{ from: '2026-11-23T06:00', to: '2026-11-23T08:00', status: 'idle' }, { from: '2026-11-23T08:00', to: '2026-11-23T14:00', status: 'run' }] },
            ]}
            range={['2026-11-23T06:00', '2026-11-23T14:00']}
            now="2026-11-23T12:20"
            onSegmentClick={(rowId, seg) => console.log(rowId, seg.status)}
        />
    )
}
