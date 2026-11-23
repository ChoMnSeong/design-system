import { useState } from 'react'
import { Card, CartesianChart, DashboardGrid, DashboardGridItem, Switch } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { PHOTO, KpiCardDemo } from '../shared/dashboardDemo'

export const DashboardGridPage = () => {
    const [editable, setEditable] = useState(false)
    return (
        <>
            <PageHeader title="DashboardGrid" description="대시보드 bento 배치: colSpan · rowSpan · areas · 화면 폭별 columns · dense, editable 이면 끌어서 순서 · 크기를 바꿉니다." />
            <ComponentPreview title="DashboardGrid" code={`<DashboardGrid columns={{ sm: 2, md: 4 }} rowHeight={150} gap={12} editable={editable}>
    <DashboardGrid.Item colSpan={2} rowSpan={2}>…</DashboardGrid.Item>
</DashboardGrid>`}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Switch label="editable (드래그 순서 · 모서리 크기)" checked={editable} onCheckedChange={setEditable} />
                    <DashboardGrid columns={{ sm: 2, md: 4 }} rowHeight={160} gap={12} editable={editable}>
                        <DashboardGridItem id="trend" colSpan={2} rowSpan={2}>
                            <Card>
                                <Card.Eyebrow>주간 생산 추이</Card.Eyebrow>
                                <Card.Visual style={{ flex: 1 }}>
                                    <CartesianChart labels={['W43', 'W44', 'W45', 'W46', 'W47']} data={[1320, 1290, 1380, 1260, 1410].map((v) => ({ v }))} series={[{ type: 'area', key: 'v', label: '실적', smooth: true }]} legend="none" height={240} />
                                </Card.Visual>
                            </Card>
                        </DashboardGridItem>
                        <DashboardGridItem id="kpi"><KpiCardDemo /></DashboardGridItem>
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
        </>
    )
}
