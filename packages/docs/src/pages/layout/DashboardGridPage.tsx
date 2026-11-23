import { useState } from 'react'
import { Badge, Button, Card, CartesianChart, DashboardGrid, DashboardGridItem, Switch, type DashboardLayoutItem } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { PHOTO, KpiCardDemo } from '../shared/dashboardDemo'

export const DashboardGridPage = () => {
    const [editable, setEditable] = useState(false)
    return (
        <>
            <PageHeader title="DashboardGrid" description="대시보드 bento 배치: colSpan · rowSpan · areas · 화면 폭별 columns · dense, editable 이면 끌어서 순서 · 크기를 바꿉니다." />
            <ComponentPreview title="DashboardGrid" code={`<DashboardGrid columns={{ sm: 2, md: 4 }} rowHeight={184} gap={12} editable={editable}>
    <DashboardGrid.Item colSpan={2} rowSpan={2}>…</DashboardGrid.Item>
</DashboardGrid>`}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Switch label="editable (드래그 순서 · 모서리 크기)" checked={editable} onCheckedChange={setEditable} />
                    <DashboardGrid columns={{ sm: 2, md: 4 }} rowHeight={184} gap={12} editable={editable}>
                        <DashboardGridItem id="trend" colSpan={2} rowSpan={2}>
                            <Card>
                                <Card.Eyebrow>주간 생산 추이</Card.Eyebrow>
                                <Card.Visual style={{ flex: 1 }}>
                                    <CartesianChart labels={['W43', 'W44', 'W45', 'W46', 'W47']} data={[1320, 1290, 1380, 1260, 1410].map((v) => ({ v }))} series={[{ type: 'area', key: 'v', label: '실적', smooth: true }]} legend="none" height="fill" />
                                </Card.Visual>
                            </Card>
                        </DashboardGridItem>
                        <DashboardGridItem id="kpi"><KpiCardDemo density="compact" /></DashboardGridItem>
                        <DashboardGridItem id="stop">
                            <Card surface="inverse">
                                <Card.Eyebrow>WELD-04 · 24시간 정지</Card.Eyebrow>
                                <Card.Metric value={54} unit="분" />
                                <Card.Delta value={18} goodWhen="down" format={(n) => `+${n}분`} comparison="어제 대비" />
                            </Card>
                        </DashboardGridItem>
                        <DashboardGridItem id="yield">
                            <Card status="success">
                                <Card.Eyebrow>양품률</Card.Eyebrow>
                                <Card.Metric value="99.2" unit="%" />
                                <Card.Delta value={0.3} format={(n) => `+${n}%p`} />
                            </Card>
                        </DashboardGridItem>
                        <DashboardGridItem id="temp">
                            <Card surface="media" media={{ src: PHOTO, alt: '2라인 현장 사진' }}>
                                <Card.Eyebrow>현장 2라인 · 14:00</Card.Eyebrow>
                                <Card.Metric value="29.6" unit="℃" />
                            </Card>
                        </DashboardGridItem>
                    </DashboardGrid>
                </div>
            </ComponentPreview>
            <SavedLayoutDemo />
        </>
    )
}

const STORE = 'docs-dashboard-layout'
const readSaved = (): DashboardLayoutItem[] | null => {
    try {
        const v = localStorage.getItem(STORE)
        return v ? (JSON.parse(v) as DashboardLayoutItem[]) : null
    } catch {
        return null
    }
}

/** 편집한 배치를 저장해 두었다가 다시 불러온다 (새로고침해도 유지) */
const SavedLayoutDemo = () => {
    const [layout, setLayout] = useState<DashboardLayoutItem[] | undefined>(() => readSaved() ?? undefined)
    const [dirty, setDirty] = useState(false)
    const [msg, setMsg] = useState(readSaved() ? '저장된 배치를 불러왔습니다' : '')
    const save = () => {
        try {
            localStorage.setItem(STORE, JSON.stringify(layout))
            setMsg('저장했습니다')
        } catch {
            setMsg('저장할 수 없습니다')
        }
        setDirty(false)
    }
    const load = () => {
        const v = readSaved()
        setLayout(v ?? undefined)
        setDirty(false)
        setMsg(v ? '저장된 배치를 불러왔습니다' : '저장된 배치가 없습니다')
    }
    const reset = () => {
        try { localStorage.removeItem(STORE) } catch { /* 저장소를 못 쓰는 환경 */ }
        setLayout(undefined)
        setDirty(false)
        setMsg('기본 배치로 돌렸습니다')
    }
    return (
        <ComponentPreview
            title="배치 저장 · 불러오기"
            description="layout(제어) · onLayoutChange 로 편집 결과를 받아 저장하고, 다시 layout 으로 넣어 불러옵니다. 처음 한 번만 넣으려면 defaultLayout 을 씁니다. 새로고침해도 저장한 배치로 열립니다."
            code={`const [layout, setLayout] = useState(() => JSON.parse(localStorage.getItem('dash') ?? 'null') ?? undefined)

<DashboardGrid editable layout={layout} onLayoutChange={setLayout}>…</DashboardGrid>
<Button onClick={() => localStorage.setItem('dash', JSON.stringify(layout))}>배치 저장</Button>`}
        >
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Button size="sm" onClick={save} disabled={!dirty}>배치 저장</Button>
                    <Button size="sm" appearance="outline" tone="neutral" onClick={load}>불러오기</Button>
                    <Button size="sm" appearance="ghost" tone="neutral" onClick={reset}>기본 배치로</Button>
                    {dirty && <Badge size="sm" tone="warning">저장 안 함</Badge>}
                    <span role="status" style={{ fontSize: 12, color: 'var(--ds-color-foreground-tertiary)' }}>{msg}</span>
                </div>
                <DashboardGrid
                    columns={{ sm: 2, md: 4 }}
                    rowHeight={120}
                    gap={12}
                    editable
                    layout={layout}
                    onLayoutChange={(next) => {
                        setLayout(next)
                        setDirty(true)
                        setMsg('')
                    }}
                >
                    {['생산량', '양품률', '가동률', '불량', '정지', '에너지'].map((t, i) => (
                        <DashboardGridItem key={t} id={t} colSpan={i === 0 ? 2 : 1}>
                            <Card>
                                <Card.Eyebrow>{t}</Card.Eyebrow>
                                <Card.Metric size="sm" value={[12480, 99.2, 87.4, 38, 54, 1260][i]!} unit={['EA', '%', '%', '건', '분', 'kWh'][i]} />
                            </Card>
                        </DashboardGridItem>
                    ))}
                </DashboardGrid>
            </div>
        </ComponentPreview>
    )
}
