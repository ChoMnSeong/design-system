import { InlineBar, SegmentMeter, Sparkline } from '@ensnif/design-system'

export default function Example() {
    return (
        <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
            <SegmentMeter
                segments={[
                    { label: '가동', value: 18, tone: 'success' },
                    { label: '대기', value: 4, tone: 'warning' },
                    { label: '정지', value: 2, tone: 'danger' },
                ]}
                max={26}
                markers={[{ at: 20, label: '목표' }]}
            />
            <Sparkline data={[42, 48, 45, 53, 51, 58, 61]} type="area" height={32} aria-label="최근 7일 생산량 추이" />
            <InlineBar value={72} target={85} suffix="%" />
        </div>
    )
}
