import { Badge, Marquee } from '@ensnif/design-system'

const notices = ['2라인 금형 교체 14:00', '3라인 정기 점검', '자재 입고 지연: 샤프트 Ø32']

export default function Example() {
    return (
        <Marquee speed={20} gap={32}>
            {notices.map((n) => (
                <span key={n} style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                    <Badge size="sm" tone="info">공지</Badge>
                    {n}
                </span>
            ))}
        </Marquee>
    )
}
