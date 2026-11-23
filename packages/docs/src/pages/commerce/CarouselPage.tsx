import { Button, Carousel, Hero, Media } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { PICS, NAMES } from '../shared/commerceDemo'

export const CarouselPage = () => (
    <>
        <PageHeader title="Carousel" description="슬라이드. 자동 넘김(마우스를 올리면 멈춤) · 화면 폭별 개수 · 점 / 쪽수 / 썸네일 표시." />
        <ComponentPreview title="autoplay · indicator · perView" description="점 · 화살표 · 쪽수 표시, 마우스를 올리면 멈춥니다." code={`<Carousel autoplay={5000} indicator="count">…</Carousel>`}>
            <div style={{ width: '100%' }}>
            <Carousel autoplay={5000} indicator="count" radius={16} aria-label="기획전">
                {[1, 2, 3, 4].map((i) => (
                    <Hero key={i} layout="split" media={PICS[i]} eyebrow="회원 전용" title={`첫 구매 ${10 + i * 5}% 쿠폰`} titleSize="sm" description="가입하고 바로 쓰는 할인 쿠폰을 받으세요." actions={<Button>쿠폰 받기</Button>} />
                ))}
            </Carousel>
            <div style={{ height: 24 }} />
            <Carousel perView={{ sm: 1, md: 2, lg: 3 }} gap={12} indicator="dots" loop={false} aria-label="추천">
                {PICS.map((p, i) => <Media key={i} src={p} alt={NAMES[i]!} ratio="16/9" />)}
            </Carousel>
            </div>
        </ComponentPreview>
    </>
)
