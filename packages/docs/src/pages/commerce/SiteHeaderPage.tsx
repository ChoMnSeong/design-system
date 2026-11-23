import { LuHeart, LuShieldCheck, LuShoppingBag, LuTruck, LuUndo2, LuUser } from 'react-icons/lu'
import { AnnouncementBar, Button, Hero, Media, SearchBox, SiteFooter, SiteHeader } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { PICS, Frame } from '../shared/commerceDemo'

const MEGA = [
    { key: 'outer', label: '아우터', columns: [{ title: '아우터', links: ['코트', '재킷', '패딩', '점퍼', '트렌치'].map((l) => ({ label: l })) }, { title: '니트 · 가디건', links: ['가디건', '베스트', '무스탕'].map((l) => ({ label: l })) }, { title: '인기 브랜드', links: ['아우터랩', '노스필드', '모노룸', '그레이데이'].map((l) => ({ label: l })) }], promo: <Media src={PICS[0]} alt="가을 아우터 기획전" ratio="4/3" caption={<><b>가을 아우터 기획전</b><br />최대 30% · 11/30까지</>} /> },
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

export const SiteHeaderPage = () => (
    <>
        <PageHeader title="SiteHeader · SiteFooter" description="쇼핑몰 머리말(공지 띠 · 큰 메뉴 · 투명 머리말)과 꼬리말. 데스크톱 68 + 48, 모바일 56 + 44." />
        <ComponentPreview title="머리말 · 큰 메뉴 · 공지 띠" description="'의류'에 마우스를 올리면 큰 메뉴가 열립니다. 아래로 스크롤하면 카테고리 줄이 숨습니다." code={`<SiteHeader logo="ENSNIF" search={<SearchBox />} actions={actions} nav={nav} hideRowOnScroll announcement={<AnnouncementBar>…</AnnouncementBar>} />`}>
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
        <ComponentPreview title="꼬리말" code={`<SiteFooter benefits={…} support={…} columns={…} legal={…} />`}>
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
                    { title: '회사', links: ['회사 소개', '이용약관', '개인정보처리방침'].map((l) => ({ label: l })) },
                ]}
                legal={{ items: [['상호', '(주)엔스니프'], ['대표', '홍길동'], ['사업자등록번호', '000-00-00000'], ['통신판매업', '제2026-서울-0000호'], ['주소', '서울특별시 ○○구 ○○로 00']], copyright: '© 2026 ENSNIF' }}
            />
        </ComponentPreview>
    </>
)
