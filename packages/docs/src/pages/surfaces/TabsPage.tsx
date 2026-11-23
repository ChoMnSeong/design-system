import { useState } from 'react'
import { Stack, Tab, TabList, TabPanel, Tabs } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { full } from '../shared/demoStyles'

export const TabsPage = () => {
    const [docs, setDocs] = useState(['WO-0042', 'WO-0047'])
    return (
        <>
            <PageHeader title="Tabs" description="appearance underline · pill · enclosed · segmented, size, orientation, overflow(scroll · menu), keepMounted. Tab icon · badge · closable." />
            {(['underline', 'pill', 'segmented'] as const).map((a) => (
                <ComponentPreview key={a} title={a} code={`<Tabs appearance="${a}" defaultValue="a">…</Tabs>`}>
                    <Tabs appearance={a} defaultValue="a" style={full}>
                        <TabList aria-label={a}>
                            <Tab value="a">개요</Tab>
                            <Tab value="b" badge={12}>작업지시</Tab>
                            <Tab value="c">검사</Tab>
                            <Tab value="d" disabled>이력</Tab>
                        </TabList>
                        <TabPanel value="a">개요 패널</TabPanel>
                        <TabPanel value="b">작업지시 패널</TabPanel>
                        <TabPanel value="c">검사 패널</TabPanel>
                    </Tabs>
                </ComponentPreview>
            ))}
            <ComponentPreview title="enclosed · closable" code={`<Tab value="WO-0042" closable onClose={() => close('WO-0042')}>WO-0042</Tab>`}>
                <Tabs appearance="enclosed" defaultValue="WO-0042" style={full}>
                    <TabList aria-label="열린 작업지시">
                        {docs.map((d) => <Tab key={d} value={d} closable onClose={() => setDocs(docs.filter((x) => x !== d))}>{d}</Tab>)}
                    </TabList>
                    {docs.map((d) => <TabPanel key={d} value={d}>{d} 상세</TabPanel>)}
                </Tabs>
            </ComponentPreview>
            <ComponentPreview title="vertical · overflow=menu" code={`<Tabs orientation="vertical">…</Tabs> <Tabs overflow="menu">…</Tabs>`}>
                <Stack gap={20} style={full}>
                    <Tabs orientation="vertical" defaultValue="info">
                        <TabList aria-label="품목 정보">
                            <Tab value="info">기본 정보</Tab>
                            <Tab value="bom">BOM</Tab>
                            <Tab value="route">라우팅</Tab>
                        </TabList>
                        <TabPanel value="info">기본 정보 패널</TabPanel>
                        <TabPanel value="bom">BOM 패널</TabPanel>
                        <TabPanel value="route">라우팅 패널</TabPanel>
                    </Tabs>
                    <div style={{ width: 360 }}>
                        <Tabs overflow="menu" defaultValue="t1" size="sm">
                            <TabList aria-label="많은 탭">
                                {Array.from({ length: 9 }, (_, i) => <Tab key={i} value={`t${i + 1}`}>공정 {i + 1}</Tab>)}
                            </TabList>
                        </Tabs>
                    </div>
                </Stack>
            </ComponentPreview>
        </>
    )
}
