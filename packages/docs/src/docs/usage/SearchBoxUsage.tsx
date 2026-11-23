import { SearchBox } from '@ensnif/design-system'

const PRODUCTS = ['캐시미어 니트', '캐시미어 머플러', '울 코트', '울 블렌드 재킷', '코듀로이 팬츠']

export default function Example() {
    return (
        <SearchBox
            placeholder="상품명 · 브랜드 검색"
            recent={['니트', '코트']}
            trending={['패딩', '캐시미어', '부츠', '머플러']}
            suggest={(q) => PRODUCTS.filter((p) => p.includes(q))}
            onSearch={(q) => console.log('검색', q)}
        />
    )
}
