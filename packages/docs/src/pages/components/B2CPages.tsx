import { useState } from 'react'
import { LuHeart, LuHouse, LuLayoutGrid, LuSearch, LuShieldCheck, LuShoppingBag, LuTruck, LuUndo2, LuUser } from 'react-icons/lu'
import {
    AnnouncementBar, BottomSheet, Button, Carousel, Display, Hero, Media, MobileTabBar, OptionPicker, Price, QuantityInput, Rail, RankNumber, RatingDisplay, SearchBox, Section, SiteFooter, SiteHeader, VideoPlayer, WatchProgress,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

/** 데모용 그라디언트 이미지 (외부 요청 없이) */
const img = (a: string, b: string, label = '') =>
    `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="800" height="800" fill="url(#g)"/><text x="40" y="760" font-family="sans-serif" font-size="40" fill="rgba(255,255,255,.6)">${label}</text></svg>`)}`
const PICS = [img('#8a6f5a', '#2f2723', '울 블렌드 코트'), img('#c9b8a6', '#6f5d4e', '캐시미어 니트'), img('#4a5d78', '#1d2736', '와이드 데님'), img('#2b2b2b', '#6b5444', '레더 스니커즈'), img('#b9a089', '#5e4a3a', '미니 숄더백'), img('#6f7d6a', '#2d3529', '패딩 조끼')]
const NAMES = ['울 블렌드 코트', '캐시미어 니트', '와이드 데님', '레더 스니커즈', '미니 숄더백', '패딩 조끼']

const Frame = ({ children, h = 420, id }: { children: React.ReactNode; h?: number; id?: string }) => (
    <div id={id} style={{ width: '100%', position: 'relative', height: h, overflow: 'auto', border: '1px solid var(--ds-color-border-subtle)', borderRadius: 12, background: 'var(--ds-surface-page-background, var(--ds-surface-card-background))' }}>{children}</div>
)

/* 12-01 */
export const B2CLayoutPage = () => (
    <>
        <PageHeader title="큰 제목 · 화면 폭 · 섹션 여백" description="보드 12-01. Display(48 · 64 · 80), Container(최대 1280, 좌우 16 · 32 · 40), Section(48 · 80 · 120, bleed)." />
        <ComponentPreview title="Display" code={`<Display size="lg">가을 신상</Display>`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Display size="lg">가을 신상</Display>
                <Display size="md" as="h2">오늘의 추천</Display>
                <Display size="sm" as="h3">지금 가장 많이 본</Display>
            </div>
        </ComponentPreview>
        <ComponentPreview title="Section · Container" description="안쪽 점선이 Container 최대 폭, 위아래가 섹션 여백입니다." code={`<Section spacing="md"><h2>…</h2></Section>\n<Section bleed tone="muted">배너</Section>`}>
            <Frame h={460}>
                {(['sm', 'md'] as const).map((s) => (
                    <Section key={s} spacing={s} tone={s === 'sm' ? 'muted' : undefined}>
                        <div style={{ outline: '1px dashed var(--ds-palette-primary-500)', padding: 12, fontSize: 13 }}>spacing="{s}" · Container lg</div>
                    </Section>
                ))}
                <Section spacing="none" bleed>
                    <div style={{ height: 120, background: `url(${PICS[0]}) center/cover`, display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700 }}>bleed — 화면 끝까지</div>
                </Section>
            </Frame>
        </ComponentPreview>
    </>
)

/* 12-02 */
const MEGA = [
    { key: 'outer', label: '아우터', columns: [{ title: '아우터', links: ['코트', '재킷', '패딩', '점퍼', '트렌치'].map((l) => ({ label: l })) }, { title: '니트 · 가디건', links: ['가디건', '베스트', '무스탕'].map((l) => ({ label: l })) }, { title: '인기 브랜드', links: ['아우터랩', '노스필드', '모노룸', '그레이데이'].map((l) => ({ label: l })) }], promo: <Media src={PICS[0]} alt="가을 아우터 기획전" ratio="4/3" overlay={<div style={{ position: 'absolute', left: 12, bottom: 10, color: '#fff', fontSize: 13 }}><b>가을 아우터 기획전</b><br />최대 30% · 11/30까지</div>} /> },
    { key: 'top', label: '상의', columns: [{ title: '상의', links: ['니트', '셔츠', '티셔츠', '맨투맨'].map((l) => ({ label: l })) }] },
    { key: 'bottom', label: '하의', columns: [{ title: '하의', links: ['데님', '슬랙스', '스커트'].map((l) => ({ label: l })) }] },
]
const NAV = [
    { key: 'all', label: '전체' }, { key: 'new', label: '신상품' }, { key: 'wear', label: '의류', mega: MEGA }, { key: 'shoes', label: '신발' }, { key: 'bag', label: '가방' }, { key: 'life', label: '라이프' }, { key: 'sale', label: '세일', highlight: true },
]
const ACTIONS = [
    { icon: <LuUser size={20} />, label: '로그인' },
    { icon: <LuHeart size={20} />, label: '찜', badge: 3 },
    { icon: <LuShoppingBag size={20} />, label: '장바구니', badge: 2 },
]
export const B2CSitePage = () => (
    <>
        <PageHeader title="사이트 머리말 · 큰 메뉴 · 꼬리말 · 공지 띠" description="보드 12-02. 데스크톱 68 + 48, 모바일 56 + 44. 스크롤 내리면 2단만 숨깁니다." />
        <ComponentPreview title="SiteHeader · MegaMenu · AnnouncementBar" description="'의류'에 마우스를 올리면 큰 메뉴가 열립니다. 아래로 스크롤하면 카테고리 줄이 숨습니다." code={`<SiteHeader logo="ENSNIF" search={<SearchBox />} actions={actions} nav={nav} hideRowOnScroll announcement={<AnnouncementBar>…</AnnouncementBar>} />`}>
            <Frame h={480} id="b2c-scroll-1">
                <SiteHeader
                    logo="ENSNIF"
                    search={<SearchBox placeholder="브랜드, 상품, 스타일 검색" trending={['캐시미어 니트', '패딩 조끼', '레더 재킷']} />}
                    actions={ACTIONS}
                    nav={NAV}
                    activeNav="new"
                    scrollContainer={() => document.getElementById('b2c-scroll-1')}
                    announcement={<AnnouncementBar storageKey="docs-announce-demo" dismissDays={0}>첫 구매 15% 쿠폰 · 3만원 이상 무료배송</AnnouncementBar>}
                />
                <div style={{ height: 900, padding: 24, color: 'var(--ds-color-foreground-tertiary)' }}>본문 (스크롤해 보세요)</div>
            </Frame>
        </ComponentPreview>
        <ComponentPreview title="transparentOnTop" description="배너 위에서는 투명 + 흰 글자, 스크롤하면 채워집니다." code={`<SiteHeader transparentOnTop layout="single" />`}>
            <div id="b2c-scroll-2" style={{ position: 'relative', height: 360, overflow: 'auto', borderRadius: 12 }}>
                <SiteHeader logo="ENSNIF" layout="single" transparentOnTop actions={ACTIONS.slice(1)} scrollContainer={() => document.getElementById('b2c-scroll-2')} />
                <Hero media={PICS[0]} title="가을, 새로 입는 계절" titleSize="sm" height={360} />
                <div style={{ height: 600 }} />
            </div>
        </ComponentPreview>
        <ComponentPreview title="SiteFooter" code={`<SiteFooter benefits={…} support={…} columns={…} legal={…} />`}>
            <SiteFooter
                benefits={[
                    { icon: <LuTruck size={18} />, title: '3만원 이상 무료배송', description: '제주 · 도서산간 제외' },
                    { icon: <LuShieldCheck size={18} />, title: '신규 가입 15% 쿠폰', description: '가입 즉시 지급' },
                    { icon: <LuUndo2 size={18} />, title: '30일 무료 반품', description: '단순 변심 포함' },
                ]}
                support={{ phone: '1588-0000', hours: <>평일 09–18시 (점심 12–13시)<br />주말 · 공휴일 휴무</>, actions: <><Button size="sm" appearance="outline" tone="neutral">1:1 문의</Button><Button size="sm" appearance="ghost" tone="neutral">자주 묻는 질문</Button></> }}
                columns={[
                    { title: '쇼핑', links: ['신상품', '랭킹', '세일', '브랜드'].map((l) => ({ label: l })) },
                    { title: '고객 지원', links: ['주문 · 배송 조회', '교환 · 반품', '공지사항', '입점 문의'].map((l) => ({ label: l })) },
                    { title: '회사', links: ['회사 소개', '이용약관', '개인정보처리방침'].map((l) => ({ label: <b key={l}>{l}</b> })) },
                ]}
                legal={{ items: [['상호', '(주)엔스니프'], ['대표', '홍길동'], ['사업자등록번호', '000-00-00000'], ['통신판매업', '제2026-서울-0000호'], ['주소', '서울특별시 ○○구 ○○로 00']], copyright: '© 2026 ENSNIF' }}
            />
        </ComponentPreview>
    </>
)

/* 12-03 */
export const B2CHeroPage = () => (
    <>
        <PageHeader title="큰 배너 · 슬라이드 · 가로로 넘기는 줄" description="보드 12-03. 글은 왼쪽 아래, 아래쪽만 어둡게(scrim). Rail 은 다음 칸이 30% 비칩니다." />
        <ComponentPreview title="Hero overlay" code={`<Hero media={src} eyebrow="AUTUMN 2026" title="가을, 새로 입는 계절" actions={…} />`}>
            <Hero style={{ width: '100%' }} media={PICS[0]} radius={16} eyebrow="AUTUMN 2026" title="가을, 새로 입는 계절" description="올해 처음 선보이는 아우터 42종" actions={<><Button size="lg">지금 보기</Button><Button size="lg" appearance="outline" tone="neutral" style={{ color: '#fff', borderColor: 'rgb(255 255 255 / .6)' }}>영상 보기</Button></>} />
        </ComponentPreview>
        <ComponentPreview title="Carousel + Hero split" description="점 · 화살표 · 쪽수 표시, 마우스를 올리면 멈춥니다." code={`<Carousel autoplay={5000} indicator="count">…</Carousel>`}>
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
        <ComponentPreview title="Rail" code={`<Rail style={{ width: '100%' }} title="지금 가장 많이 본" subtitle="오늘 09시 기준" action={<a>전체 보기</a>} peek={0.3}>…</Rail>`}>
            <Rail style={{ width: '100%' }} title="지금 가장 많이 본" subtitle="오늘 09시 기준" arrows action={<Button size="sm" appearance="link" tone="neutral">전체 보기</Button>}>
                {PICS.map((p, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Media src={p} alt={NAMES[i]!} ratio="3/4" />
                        <span style={{ fontSize: 13 }}>{NAMES[i]}</span>
                        <Price value={[62300, 129000, 59000, 89000, 45000, 79000][i]!} listPrice={i % 2 ? undefined : 89000 + i * 1000} size="sm" layout="inline" />
                    </div>
                ))}
            </Rail>
        </ComponentPreview>
    </>
)

/* 12-04 */
export const B2CCommercePage = () => (
    <>
        <PageHeader title="비율 고정 이미지 · 가격 · 별점 · 순위 · 이어보기" description="보드 12-04." />
        <ComponentPreview title="Media" description="비율이 같아야 목록 줄이 맞습니다. 불러오기 전엔 흐린 미리보기." code={`<Media src={src} alt="…" ratio="4/3" placeholder="blur" placeholderSrc={tiny} />`}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, alignItems: 'start', width: '100%' }}>
                <Media src={PICS[1]} alt="상품" ratio="1" />
                <Media src={PICS[2]} alt="기사" ratio="4/3" />
                <Media src={PICS[3]} alt="포스터" ratio="2/3" />
                <Media alt="불러오는 중" ratio="1" placeholderSrc={PICS[4]} />
            </div>
        </ComponentPreview>
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
        <ComponentPreview title="RankNumber · WatchProgress" code={`<RankNumber value={1} />\n<WatchProgress value={0.21} label="시즌 2 · 5화" remaining="38분 남음" />`}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                {[1, 2].map((n) => (
                    <div key={n} style={{ display: 'flex', alignItems: 'flex-end', width: 200 }}>
                        <RankNumber value={n} size={96} />
                        <Media src={PICS[n + 2]} alt={`${n}위`} ratio="2/3" style={{ width: 110, marginLeft: -16 }} />
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

/* 12-05 */
const ALL = ['니트 가디건', '캐시미어 니트', '니트 조끼', '울 코트', '와이드 데님', '레더 재킷', '스니커즈']
export const B2CShoppingPage = () => {
    const [recent, setRecent] = useState(['울 코트', '와이드 데님', '스니커즈'])
    return (
        <>
            <PageHeader title="수량 선택 · 옵션 선택 · 검색창" description="보드 12-05." />
            <ComponentPreview title="QuantityInput" code={`<QuantityInput size="sm" />  <QuantityInput max={5} defaultValue={2} />`}>
                <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                    <QuantityInput size="sm" />
                    <QuantityInput defaultValue={3} />
                    <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--ds-color-foreground-tertiary)' }}><QuantityInput defaultValue={5} max={5} /> 재고 5개 · 최대 5</span>
                </div>
            </ComponentPreview>
            <ComponentPreview title="OptionPicker" description="품절은 사선, 빨간 점은 재고 3개 이하." code={`<OptionPicker type="swatch" label="색상" options={colors} />\n<OptionPicker type="chip" label="사이즈" options={sizes} />`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
                    <OptionPicker type="swatch" label="색상" defaultValue="charcoal" options={[{ value: 'charcoal', label: '차콜', color: '#3a3a3a' }, { value: 'beige', label: '베이지', color: '#d9c7ad' }, { value: 'navy', label: '네이비', color: '#24324d' }, { value: 'brown', label: '브라운', color: '#6b4a33', stock: 2 }, { value: 'ivory', label: '아이보리', color: '#f3eee4', stock: 0 }]} />
                    <OptionPicker type="chip" label="사이즈" defaultValue="XL" options={[{ value: 'XS', label: 'XS', stock: 0 }, { value: 'S', label: 'S', stock: 8 }, { value: 'M', label: 'M', stock: 12 }, { value: 'L', label: 'L', stock: 5 }, { value: 'XL', label: 'XL', stock: 1 }, { value: 'XXL', label: 'XXL', stock: 0 }]} />
                    <OptionPicker type="select" label="사이즈 (드롭다운)" options={[{ value: 'S', label: 'S' }, { value: 'M', label: 'M', stock: 2 }, { value: 'L', label: 'L', stock: 0 }]} style={{ maxWidth: 240 }} />
                </div>
            </ComponentPreview>
            <ComponentPreview title="SearchBox" description="비었을 때 최근·인기, 입력하면 연관 검색어(입력어 강조)." code={`<SearchBox recent={recent} trending={trending} suggest={(q) => fetch…} />`}>
                <div style={{ width: '100%', maxWidth: 420, minHeight: 360 }}>
                    <SearchBox recent={recent} onRecentRemove={(q) => setRecent(q ? recent.filter((r) => r !== q) : [])} trending={['캐시미어 니트', '패딩 조끼', '레더 재킷']} suggest={(q) => new Promise((r) => setTimeout(() => r(ALL.filter((x) => x.includes(q))), 120))} />
                </div>
            </ComponentPreview>
        </>
    )
}

/* 12-06 */
const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
export const B2CMobilePage = () => {
    const [open, setOpen] = useState(true)
    const [tab, setTab] = useState('home')
    const [size, setSize] = useState('M')
    return (
        <>
            <PageHeader title="영상 재생기 · 하단 시트 · 하단 탭" description="보드 12-06." />
            <ComponentPreview title="VideoPlayer" description="컨트롤은 아래쪽만 어둡게. 0~5초 구간에 '오프닝 건너뛰기', 설정 메뉴에 화질 · 속도 · 자막." code={`<VideoPlayer src={src} title="새벽의 공장" subtitle="시즌 2 · 5화" skip={{ from: 0, to: 5 }} next={{ title: '6화', at: 4 }} />`}>
                <VideoPlayer src={SAMPLE} poster={PICS[5]} title="새벽의 공장" subtitle="시즌 2 · 5화" skip={{ from: 0, to: 2.5 }} next={{ title: '6화 · 교대 근무', at: 4 }} subtitles={[{ lang: 'ko', label: '한국어', src: 'data:text/vtt,WEBVTT' }]} style={{ maxWidth: 720 }} />
            </ComponentPreview>
            <ComponentPreview title="BottomSheet · MobileTabBar" description="손잡이를 끌어 50% · 90% 에 멈춥니다. 아래로 끌면 닫힙니다." code={`<BottomSheet open={open} onOpenChange={setOpen} snapPoints={[0.5, 0.9]} footer={…}>…</BottomSheet>\n<MobileTabBar items={items} value={tab} onChange={setTab} />`}>
                <div style={{ position: 'relative', width: 375, height: 720, margin: '0 auto', borderRadius: 32, overflow: 'hidden', border: '8px solid #111', background: 'var(--ds-surface-card-background)' }}>
                    <Media src={PICS[1]} alt="캐시미어 니트" ratio="1" radius={0} />
                    <div style={{ padding: 16 }}>
                        <div style={{ fontSize: 15, marginBottom: 6 }}>캐시미어 니트</div>
                        <Price value={62300} listPrice={89000} size="lg" />
                        <div style={{ marginTop: 12 }}><Button onClick={() => setOpen(true)} style={{ width: '100%' }}>옵션 선택</Button></div>
                    </div>
                    <BottomSheet inline open={open} onOpenChange={setOpen} snapPoints={[0.55, 0.88]} title="옵션 선택" footer={<><Price value={62300 * 1} size="md" /><Button style={{ flex: 1 }} onClick={() => setOpen(false)}>장바구니 담기</Button></>}>
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

