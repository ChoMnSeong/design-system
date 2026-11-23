import { Button, Card, IconInfo, IconMoreHorizontal, Sparkline } from '@ensnif/design-system'

export const PHOTO = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b4a6b"/><stop offset="1" stop-color="#8a6a3b"/></linearGradient></defs><rect width="400" height="240" fill="url(#g)"/><rect x="40" y="90" width="120" height="90" rx="6" fill="#26324a"/><rect x="200" y="60" width="150" height="120" rx="6" fill="#2a2a2a"/></svg>')

export const KpiCardDemo = () => (
    <Card>
        <Card.Eyebrow icon={<IconInfo size={14} />}>금일 생산 실적</Card.Eyebrow>
        <Card.Actions>
            <Button size="sm" appearance="ghost" tone="neutral" shape="square" aria-label="더보기" iconLeft={<IconMoreHorizontal size={16} />} />
        </Card.Actions>
        <Card.Metric value={12480} unit="EA" />
        <Card.Delta value={4.2} comparison="계획 대비" />
        <Card.Visual height={36}>
            <Sparkline data={[9.8, 10.4, 11.2, 10.9, 11.8, 12.1, 12.48]} height={36} />
        </Card.Visual>
        <Card.Note action={<Button size="xs" appearance="link" linkStyle="arrow">상세 보기</Button>}>3주 연속 증가</Card.Note>
    </Card>
)
