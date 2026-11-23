import { Empty, Skeleton, Spinner } from '@ensnif/design-system'

export default function Example() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* 불러오는 동안: 자리 잡기 */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Skeleton circle height={40} />
                <Skeleton lines={2} height={12} style={{ flex: 1 }} />
            </div>
            {/* 짧은 작업: 회전 링 */}
            <Spinner label="작업지시 불러오는 중" overlay />
            {/* 결과 없음 */}
            <Empty preset="noResult" description="검색 조건을 바꿔 보세요." />
        </div>
    )
}
