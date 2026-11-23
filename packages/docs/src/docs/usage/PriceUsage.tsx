import { Price, RatingDisplay } from '@ensnif/design-system'

export default function Example() {
    return (
        <div style={{ display: 'grid', gap: 8 }}>
            <Price value={89000} listPrice={129000} coupon={80100} size="lg" />
            <RatingDisplay value={4.6} count={1284} />
        </div>
    )
}
