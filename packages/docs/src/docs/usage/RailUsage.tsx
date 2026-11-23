import { Button, Media, Price, Rail } from '@ensnif/design-system'

const ITEMS = [
    { id: 1, name: '캐시미어 라운드 니트', price: 89000, list: 129000 },
    { id: 2, name: '울 블렌드 싱글 코트', price: 219000, list: 259000 },
    { id: 3, name: '코듀로이 와이드 팬츠', price: 59000 },
    { id: 4, name: '램스울 가디건', price: 79000, list: 99000 },
    { id: 5, name: '경량 패딩 베스트', price: 49000 },
]

export default function Example() {
    return (
        <Rail title="지금 많이 찾는 상품" subtitle="최근 24시간 기준" action={<Button size="sm" appearance="ghost">전체 보기</Button>} arrows>
            {ITEMS.map((it) => (
                <div key={it.id}>
                    <Media src={`/images/products/${it.id}.jpg`} alt={it.name} ratio="3/4" />
                    <div>{it.name}</div>
                    <Price value={it.price} listPrice={it.list} size="sm" layout="inline" />
                </div>
            ))}
        </Rail>
    )
}
