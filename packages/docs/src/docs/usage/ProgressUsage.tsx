import { Progress } from '@ensnif/design-system'

export default function Example() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
            <Progress value={1140} max={1200} valueLabel="end" tone="success" aria-label="1라인 생산 달성률" />
            <Progress value={62} target={80} aria-label="설비 가동률" />
            <Progress indeterminate aria-label="실적 집계 중" />
        </div>
    )
}
