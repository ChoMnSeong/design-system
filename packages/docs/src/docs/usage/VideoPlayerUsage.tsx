import { VideoPlayer } from '@ensnif/design-system'

export default function Example() {
    return (
        <VideoPlayer
            src="/videos/s2e5.mp4"
            poster="/images/episodes/s2e5.jpg"
            title="새벽의 공장"
            subtitle="시즌 2 · 5화"
            skip={{ from: 0, to: 85 }}
            next={{ title: '6화 · 교대 근무', at: 2580, onPlay: () => {} }}
            subtitles={[{ lang: 'ko', label: '한국어', src: '/subs/s2e5.ko.vtt' }]}
            onProgress={(time, duration) => console.log(time, duration)}
        />
    )
}
