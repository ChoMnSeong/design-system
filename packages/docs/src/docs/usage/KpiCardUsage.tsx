import { Grid, KpiCard, StatusCard } from '@ensnif/design-system'

const lineStatus = {
    run: { label: '가동', tone: 'success' as const, pulse: true },
    stop: { label: '정지', tone: 'danger' as const },
    setup: { label: '셋업', tone: 'warning' as const },
}

export default function Example() {
    return (
        <Grid columns={2} gap={12}>
            <KpiCard label="생산량" value={1064} unit="EA" target={1200} delta={{ value: '+4.2%' }} sparkline={[820, 910, 980, 1020, 1064]} />
            <StatusCard
                title="2라인 프레스"
                status="run"
                statusMap={lineStatus}
                metrics={[{ label: '실적', value: '1,064' }, { label: '불량', value: 21, tone: 'danger' }]}
                caption="WO-24-1182"
                updatedAt={new Date()}
            />
        </Grid>
    )
}
