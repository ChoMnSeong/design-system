import { Media, RankNumber, WatchProgress } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { PICS } from '../shared/commerceDemo'

export const MediaPage = () => (
    <>
        <PageHeader title="Media · WatchProgress" description="비율 고정 이미지(불러오기 전 흐린 미리보기)와 이미지 위에 얹는 순위 숫자 · 이어보기 막대." />
        <ComponentPreview title="ratio · placeholder" description="비율이 같아야 목록 줄이 맞습니다. 불러오기 전엔 흐린 미리보기." code={`<Media src={src} alt="…" ratio="4/3" placeholder="blur" placeholderSrc={tiny} />`}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, alignItems: 'start', width: '100%' }}>
                <Media src={PICS[1]} alt="상품" ratio="1" caption="캐시미어 니트" />
                <Media src={PICS[2]} alt="기사" ratio="4/3" />
                <Media src={PICS[3]} alt="포스터" ratio="2/3" />
                <Media alt="불러오는 중" ratio="1" placeholderSrc={PICS[4]} />
            </div>
        </ComponentPreview>
        <ComponentPreview title="RankNumber · WatchProgress" code={`<RankNumber value={1} />\n<WatchProgress value={0.21} label="시즌 2 · 5화" remaining="38분 남음" />`}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                {[1, 2].map((n) => (
                    <div key={n} style={{ display: 'flex', alignItems: 'flex-end', width: 200 }}>
                        <RankNumber value={n} size={96} />
                        <Media src={PICS[n + 2]} alt={`${n}위`} ratio="2/3" style={{ width: 110, marginLeft: -8 }} />
                    </div>
                ))}
                <div style={{ width: 260, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Media src={PICS[5]} alt="새벽의 공장 5화" ratio="16/9" overlay={<WatchProgress value={0.21} overlay />} />
                    <WatchProgress value={0.21} label="시즌 2 · 5화" remaining="38분 남음" />
                </div>
                <RankNumber value={3} appearance="badge" />
            </div>
        </ComponentPreview>
    </>
)
