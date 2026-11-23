import { Badge } from '@ensnif/design-system'

export default function Example() {
    return (
        <div style={{ display: 'flex', gap: 8 }}>
            <Badge tone="success" dot>가동</Badge>
            <Badge tone="warning">점검 예정</Badge>
            <Badge tone="danger" appearance="solid" max={99}>{128}</Badge>
        </div>
    )
}
