import { Card, CardDescription, CardTitle, Splitter } from '@ensnif/design-system'

export default function Example() {
    return (
        <div style={{ height: 320 }}>
            <Splitter defaultSize="40%" minSize={200} collapsible stateKey="work-orders">
                <Card style={{ height: '100%' }}>
                    <CardTitle>작업지시 목록</CardTitle>
                </Card>
                <Card style={{ height: '100%' }}>
                    <CardTitle>WO-24-1182</CardTitle>
                    <CardDescription>2라인 · 브래킷 A-102</CardDescription>
                </Card>
            </Splitter>
        </div>
    )
}
