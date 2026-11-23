import { Tab, TabList, TabPanel, Tabs } from '@ensnif/design-system'

export default function Example() {
    return (
        <Tabs defaultValue="info">
            <TabList aria-label="작업지시 상세">
                <Tab value="info">기본 정보</Tab>
                <Tab value="bom" badge={12}>자재(BOM)</Tab>
                <Tab value="history">이력</Tab>
            </TabList>
            <TabPanel value="info">WO-24-1182 · 2라인 · 1,200 EA</TabPanel>
            <TabPanel value="bom">자재 12건</TabPanel>
            <TabPanel value="history">변경 이력</TabPanel>
        </Tabs>
    )
}
