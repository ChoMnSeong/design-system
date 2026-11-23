import { Carousel, Media } from '@ensnif/design-system'

const BANNERS = [
    { src: '/images/banner-outer.jpg', alt: '가을 아우터 기획전 최대 30%' },
    { src: '/images/banner-knit.jpg', alt: '캐시미어 니트 신상품' },
    { src: '/images/banner-coupon.jpg', alt: '첫 구매 10% 쿠폰' },
]

export default function Example() {
    return (
        <Carousel autoplay={5000} indicator="count" radius={12} aria-label="기획전 배너">
            {BANNERS.map((b) => (
                <Media key={b.src} src={b.src} alt={b.alt} ratio="16/9" radius={0} />
            ))}
        </Carousel>
    )
}
