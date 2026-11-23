import { Card, DashboardGrid, DashboardGridItem } from '@ensnif/design-system'

export default function Example() {
    return (
        <DashboardGrid columns={{ sm: 2, md: 4 }} rowHeight={140} gap={12}>
            <DashboardGridItem id="trend" colSpan={2} rowSpan={2}>
                <Card style={{ height: '100%' }}><Card.Eyebrow>주간 생산 추이</Card.Eyebrow></Card>
            </DashboardGridItem>
            <DashboardGridItem id="output">
                <Card><Card.Eyebrow>생산량</Card.Eyebrow><Card.Metric value={12480} unit="EA" /></Card>
            </DashboardGridItem>
            <DashboardGridItem id="oee">
                <Card><Card.Eyebrow>OEE</Card.Eyebrow><Card.Metric value="82.4" unit="%" /></Card>
            </DashboardGridItem>
            <DashboardGridItem id="defect" colSpan={2}>
                <Card><Card.Eyebrow>불량</Card.Eyebrow><Card.Metric value={21} unit="건" /></Card>
            </DashboardGridItem>
        </DashboardGrid>
    )
}
