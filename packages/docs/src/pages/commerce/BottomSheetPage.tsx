import { useState } from 'react'
import { LuHeart, LuHouse, LuLayoutGrid, LuSearch, LuUser } from 'react-icons/lu'
import { BottomSheet, Button, Media, MobileTabBar, OptionPicker, Price, QuantityInput } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { PICS } from '../shared/commerceDemo'

export const BottomSheetPage = () => {
    const [open, setOpen] = useState(true)
    const [tab, setTab] = useState('home')
    const [size, setSize] = useState('M')
    return (
        <>
            <PageHeader title="BottomSheet · MobileTabBar" description="모바일 하단 시트(끌어서 50% · 90% 에 멈춤)와 하단 탭(5개 이하)." />
            <ComponentPreview title="상품 옵션 시트 · 하단 탭" description="손잡이를 끌어 50% · 90% 에 멈춥니다. 아래로 끌면 닫힙니다." code={`<BottomSheet open={open} onOpenChange={setOpen} snapPoints={[0.5, 0.9]} footer={…}>…</BottomSheet>\n<MobileTabBar items={items} value={tab} onChange={setTab} />`}>
                <div style={{ position: 'relative', width: 375, height: 720, margin: '0 auto', borderRadius: 32, overflow: 'hidden', border: '8px solid #111', background: 'var(--ds-surface-card-background)' }}>
                    <Media src={PICS[1]} alt="캐시미어 니트" ratio="1" radius={0} />
                    <div style={{ padding: 16 }}>
                        <div style={{ fontSize: 15, marginBottom: 6 }}>캐시미어 니트</div>
                        <Price value={62300} listPrice={89000} size="lg" />
                        <div style={{ marginTop: 12 }}><Button size="lg" onClick={() => setOpen(true)} style={{ width: '100%', height: 48, fontSize: 15 }}>옵션 선택</Button></div>
                    </div>
                    <BottomSheet inline open={open} onOpenChange={setOpen} snapPoints={[0.55, 0.88]} title="옵션 선택" footer={<><Price value={62300 * 1} size="md" /><Button size="lg" style={{ flex: 1, height: 48, fontSize: 15 }} onClick={() => setOpen(false)}>장바구니 담기</Button></>}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <OptionPicker type="chip" label="사이즈" value={size} onChange={setSize} options={['S', 'M', 'L', 'XL'].map((s) => ({ value: s, label: s, stock: s === 'XL' ? 1 : 9 }))} />
                            <QuantityInput style={{ alignSelf: 'flex-start' }} />
                        </div>
                    </BottomSheet>
                    <MobileTabBar inline style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 0 }} value={tab} onChange={setTab} items={[
                        { key: 'home', icon: <LuHouse size={22} />, label: '홈' },
                        { key: 'cat', icon: <LuLayoutGrid size={22} />, label: '카테고리' },
                        { key: 'search', icon: <LuSearch size={22} />, label: '검색' },
                        { key: 'like', icon: <LuHeart size={22} />, label: '찜', badge: 3 },
                        { key: 'my', icon: <LuUser size={22} />, label: '마이' },
                    ]} />
                </div>
            </ComponentPreview>
        </>
    )
}
