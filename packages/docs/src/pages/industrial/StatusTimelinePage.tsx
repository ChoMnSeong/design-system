import { useState } from 'react'
import { BulletChart, StatusTimeline } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { full } from '../shared/demoStyles'

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
