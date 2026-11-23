import { AnnouncementBar, SearchBox, SiteHeader } from '@ensnif/design-system'
import { LuShoppingCart, LuUser } from 'react-icons/lu'

export default function Example() {
    return (
        <SiteHeader
            announcement={<AnnouncementBar>신규 회원 첫 구매 10% 할인 · 11/30까지</AnnouncementBar>}
            logo={<b>ENSNIF</b>}
            search={<SearchBox placeholder="상품명 · 브랜드 검색" />}
            actions={[
                { icon: <LuUser size={20} />, label: '마이페이지', href: '/my' },
                { icon: <LuShoppingCart size={20} />, label: '장바구니', badge: 3, href: '/cart' },
            ]}
            nav={[
                { key: 'outer', label: '아우터', mega: [{ key: 'coat', label: '코트', columns: [{ title: '코트', links: [{ label: '울 코트' }, { label: '트렌치' }] }] }] },
                { key: 'knit', label: '니트', href: '/knit' },
                { key: 'sale', label: '세일', href: '/sale', highlight: true },
            ]}
            activeNav="knit"
        />
    )
}
