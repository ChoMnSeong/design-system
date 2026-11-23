import { Media, WatchProgress } from '@ensnif/design-system'

export default function Example() {
    return (
        <div style={{ width: 280 }}>
            <Media
                src="/images/episodes/s2e5.jpg"
                alt="새벽의 공장 5화"
                ratio="16/9"
                radius={8}
                overlay={<WatchProgress value={0.62} overlay />}
            />
            <WatchProgress value={0.62} label="시즌 2 · 5화" remaining="18분 남음" />
        </div>
    )
}
