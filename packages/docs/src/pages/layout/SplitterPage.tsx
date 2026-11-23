import { Card, CardDescription, CardTitle, Splitter } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const SplitterPage = () => (
    <>
        <PageHeader title="Splitter" description="두 영역 사이 손잡이로 크기를 나눕니다. 끌거나 ← → 키, stateKey 로 크기를 기억합니다." />
        <ComponentPreview title="collapsible · stateKey" description="손잡이를 끌거나 ← → 키. stateKey 로 크기를 기억합니다." code={`<Splitter defaultSize="55%" collapsible stateKey="wo-split">…</Splitter>`}>
            <div style={{ width: '100%', height: 220 }}>
                <Splitter defaultSize="55%" collapsible stateKey="docs-split">
                    <Card style={{ height: '100%' }}><CardTitle>목록</CardTitle></Card>
                    <Card style={{ height: '100%' }}><CardTitle>상세</CardTitle><CardDescription>손잡이를 끌거나 ← → 키</CardDescription></Card>
                </Splitter>
            </div>
        </ComponentPreview>
    </>
)
