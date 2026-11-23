import { Timeline } from '@ensnif/design-system'

export default function Example() {
    return (
        <Timeline
            items={[
                { title: '작업지시 등록', time: '09:00', description: 'WO-2411-001 · 브래킷 A형' },
                { title: '자재 출고', time: '09:40', tone: 'info' },
                { title: '1차 검사 불합격', time: '11:15', tone: 'danger', description: '치수 불량 3건' },
            ]}
            pending="재검사 대기"
        />
    )
}
