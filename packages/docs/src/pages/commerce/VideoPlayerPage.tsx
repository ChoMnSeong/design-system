import { VideoPlayer } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { PICS } from '../shared/commerceDemo'

const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

export const VideoPlayerPage = () => (
    <>
        <PageHeader title="VideoPlayer" description="영상 재생기. 컨트롤은 아래쪽만 어둡게, 오프닝 건너뛰기 · 다음 화 · 화질 / 속도 / 자막 설정." />
        <ComponentPreview title="skip · next · settings" description="컨트롤은 아래쪽만 어둡게. 0~5초 구간에 '오프닝 건너뛰기', 설정 메뉴에 화질 · 속도 · 자막." code={`<VideoPlayer src={src} title="새벽의 공장" subtitle="시즌 2 · 5화" skip={{ from: 0, to: 5 }} next={{ title: '6화', at: 4 }} />`}>
            <VideoPlayer src={SAMPLE} poster={PICS[5]} title="새벽의 공장" subtitle="시즌 2 · 5화" skip={{ from: 0, to: 2.5 }} next={{ title: '6화 · 교대 근무', at: 4 }} subtitles={[{ lang: 'ko', label: '한국어', src: 'data:text/vtt,WEBVTT' }]} style={{ maxWidth: 720 }} />
        </ComponentPreview>
    </>
)
