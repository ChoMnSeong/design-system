import { Button, Card, IconArrowRight, IconMoreHorizontal } from '@ensnif/design-system'

export default function Example() {
    return (
        <Card>
            <Card.Eyebrow>오늘 생산량</Card.Eyebrow>
            <Card.Actions>
                <Button size="sm" appearance="ghost" iconOnly aria-label="더보기" iconLeft={<IconMoreHorizontal size={16} />} />
            </Card.Actions>
            <Card.Metric value={12480} unit="EA" />
            <Card.Delta value={4.2} comparison="계획 대비" />
            <Card.Delta value={-12} goodWhen="down" format={(n) => `${n}건`} comparison="불량" />
            <Card.Visual height={48}>{/* Sparkline · 차트 */}</Card.Visual>
            <Card.Note action={<IconArrowRight size={14} />}>2라인 기준 · 10분 전 갱신</Card.Note>
        </Card>
    )
}
