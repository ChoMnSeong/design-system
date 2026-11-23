import { Price, RatingDisplay } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const PricePage = () => (
    <>
        <PageHeader title="Price · RatingDisplay" description="가격(할인율 · 쿠폰가 · 단위 가격 · 품절)과 별점 표시." />
        <ComponentPreview title="Price" code={`<Price value={62300} listPrice={89000} coupon={56070} />\n<Price value={12900} unitPrice="100g당 2,580원" />\n<Price value={45000} soldOut />`}>
            <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <Price value={62300} listPrice={89000} coupon={56070} />
                <Price value={12900} unitPrice="100g당 2,580원" />
                <Price value={45000} soldOut />
                <Price value={62300} listPrice={89000} size="sm" layout="inline" />
                <Price value={129} currency="USD" locale="en-US" />
            </div>
        </ComponentPreview>
        <ComponentPreview title="RatingDisplay" code={`<RatingDisplay value={4.6} count={1284} distribution={[78,14,5,2,1]} layout="summary" />`}>
            <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
                <RatingDisplay value={4.6} count={1284} distribution={[78, 14, 5, 2, 1]} layout="summary" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <RatingDisplay value={4.6} count={1284} />
                    <RatingDisplay value={4.6} count={1284} layout="compact" />
                </div>
            </div>
        </ComponentPreview>
    </>
)
