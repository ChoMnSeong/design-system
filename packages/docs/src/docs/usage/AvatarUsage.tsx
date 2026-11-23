import { Avatar, AvatarGroup, StatusIndicator } from '@ensnif/design-system'

export default function Example() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar name="김도윤" status="online" />
            <AvatarGroup max={3} size="sm">
                <Avatar name="이서연" />
                <Avatar name="박지호" />
                <Avatar name="최유나" />
                <Avatar name="정하준" />
            </AvatarGroup>
            <StatusIndicator tone="success" label="가동" pulse />
        </div>
    )
}
