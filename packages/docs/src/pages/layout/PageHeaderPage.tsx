import { Badge, Button, PageHeader as DsPageHeader, Tab, TabList, Tabs } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { full } from '../shared/demoStyles'

export const PageHeaderPage = () => (
    <>
        <PageHeader title="PageHeader" description="화면 제목 줄: 경로 · 제목 · 상태 배지 · 오른쪽 버튼 · 보조 정보 · 탭." />
        <ComponentPreview title="breadcrumb · extra · actions · meta · tabs · onBack" code={`<PageHeader breadcrumb="…" title="브래킷 A형" extra={<Badge>사용</Badge>} actions={…} meta="…" tabs={<Tabs>…</Tabs>} onBack={…} />`}>
            <div style={full}>
                <DsPageHeader
                    onBack={() => {}}
                    breadcrumb="기준정보 / 품목 / BR-A01"
                    title="브래킷 A형"
                    extra={<Badge size="sm" tone="success">사용</Badge>}
                    actions={<><Button size="sm" appearance="outline" tone="neutral">복사</Button><Button size="sm">편집</Button></>}
                    meta="SUS304 1.2T · 단위 EA · 최종 수정 11/18"
                    tabs={<Tabs defaultValue="b" size="sm"><TabList aria-label="품목"><Tab value="b">기본</Tab><Tab value="bom">BOM</Tab><Tab value="h">이력</Tab></TabList></Tabs>}
                />
            </div>
        </ComponentPreview>
    </>
)
