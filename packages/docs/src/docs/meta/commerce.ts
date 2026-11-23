import type { DocMetaMap } from '../types'
import BottomSheetUsage from '../usage/BottomSheetUsage?raw'
import CarouselUsage from '../usage/CarouselUsage?raw'
import HeroUsage from '../usage/HeroUsage?raw'
import MediaUsage from '../usage/MediaUsage?raw'
import PriceUsage from '../usage/PriceUsage?raw'
import PurchaseUsage from '../usage/PurchaseUsage?raw'
import RailUsage from '../usage/RailUsage?raw'
import SearchBoxUsage from '../usage/SearchBoxUsage?raw'
import SiteHeaderUsage from '../usage/SiteHeaderUsage?raw'
import VideoPlayerUsage from '../usage/VideoPlayerUsage?raw'

const PER_VIEW_FN = {
    name: 'usePerView',
    signature: 'usePerView(pv: PerView): number',
    description: '숫자 또는 { sm, md, lg } 를 받아 지금 화면 폭에 맞는 칸 수를 돌려줍니다(sm < 768 ≤ md < 1280 ≤ lg). 창 크기가 바뀌면 다시 계산합니다.',
}

export const commerceMeta: DocMetaMap = {
    'c-siteheader': {
        components: ['SiteHeader', 'MegaMenu', 'AnnouncementBar', 'SiteFooter'],
        usage: SiteHeaderUsage,
        composition: `
SiteHeader
├── announcement          AnnouncementBar 자리
├── 1단
│   ├── logo
│   ├── search            SearchBox 등
│   └── actions[]         { icon, label, badge, href | onClick }
└── 2단 nav[]             layout="double"
    └── { key, label, href, highlight, mega }
        └── mega: MegaMenuCategory[]
            ├── key · label           왼쪽 카테고리
            ├── columns[]
            │   ├── title
            │   └── links[]           { label, href, badge }
            └── promo

SiteFooter
├── benefits[]            { icon, title, description }
├── support               { title, phone, hours, actions }
├── columns[]             { title, links[] }
├── legal                 { summary, items: [이름, 값][], copyright }
└── bottom`,
        compositionNote: 'nav 항목에 mega 가 있으면 마우스를 올리거나 포커스가 갈 때 그 아래로 MegaMenu 를 펼칩니다. MegaMenu 를 따로 쓸 수도 있습니다.',
        a11y: [
            '1단 아이콘 버튼은 label 을 aria-label 로 쓰고, 배지는 "3개" 처럼 읽힙니다. 모바일 메뉴 버튼은 aria-label="메뉴" 입니다.',
            '2단은 <nav aria-label="카테고리"> 이고, activeNav 항목에 aria-current="page", mega 가 있는 항목에 aria-expanded 가 붙습니다.',
            'MegaMenu 카테고리는 role="tablist"(세로) · role="tab" 과 aria-selected 로 그리며, Tab 으로 포커스를 옮기면 해당 카테고리가 펼쳐집니다. 큰 메뉴 안에서 Esc 를 누르면 onClose 가 불려 SiteHeader 에서는 큰 메뉴가 닫힙니다.',
            'AnnouncementBar 는 role="region" aria-label="공지" 이고 닫기 버튼은 aria-label="공지 닫기" 입니다.',
            'SiteFooter 링크 열은 제목이 문자열이면 그 이름의 <nav> 가 되고, 사업자 정보는 <details> 로 접고 펼칩니다.',
        ],
    },
    'c-hero': {
        components: ['Hero'],
        usage: HeroUsage,
        a11y: [
            '<section> 안에 제목을 <h2> 로 그립니다. 페이지의 제목 단계에 맞는지 확인하세요.',
            'mediaAlt 는 이미지의 alt, 영상이면 aria-label 로 쓰입니다. 기본값이 "" 라 장식 이미지로 취급되니 내용이 있는 이미지면 꼭 넘기세요.',
            '영상 배경은 자동 재생 · 음소거 · 반복으로 재생됩니다.',
        ],
    },
    'c-carousel': {
        components: ['Carousel'],
        usage: CarouselUsage,
        a11y: [
            'role="region" 과 aria-roledescription="carousel" 로 그리고, aria-label 로 영역 이름을 줍니다. 각 장은 role="group" · aria-roledescription="slide" 와 "1 / 5" 이름을 가집니다.',
            '캐러셀 안에 포커스가 있을 때 ← → 로 이전 · 다음 장으로 넘깁니다. 화살표 버튼은 aria-label 이 "이전" · "다음" 이고, 점 · 썸네일 버튼은 "N번 슬라이드" 와 aria-current 로 현재 장을 알립니다.',
            '화면 밖 장은 aria-hidden 과 inert 로 읽기 · 포커스에서 빠집니다.',
            'autoplay 는 마우스를 올리거나 포커스가 있으면 멈추고, prefers-reduced-motion 이면 돌지 않습니다. 넘김이 멈춰 있을 때만 aria-live="polite" 로 바뀐 장을 알립니다. indicator="count" 면 멈춤 · 재생 버튼이 붙습니다.',
        ],
        functions: [PER_VIEW_FN],
    },
    'c-rail': {
        components: ['Rail'],
        usage: RailUsage,
        a11y: [
            '<section> 안에 제목을 <h3> 로 그리고, 카드 줄은 role="list" · 각 칸은 role="listitem" 입니다.',
            'arrows 를 켜면 머리 오른쪽에 aria-label "이전" · "다음" 버튼이 붙어 줄을 한 화면씩 스크롤합니다.',
        ],
        functions: [PER_VIEW_FN],
    },
    'c-media': {
        components: ['Media', 'RankNumber', 'WatchProgress'],
        usage: MediaUsage,
        composition: `
Media
├── 이미지               src · alt · ratio
├── caption             아래쪽 글 (아래만 어둡게)
└── overlay             이미지 위에 얹는 요소
    ├── WatchProgress overlay   이어보기 막대
    ├── RankNumber              순위 숫자
    └── Badge · 찜 버튼 등`,
        compositionNote: 'RankNumber 는 TOP 10 목록처럼 Media 옆에 겹쳐 놓기도 합니다.',
        a11y: [
            'Media 의 alt 는 필수입니다. 장식용 이미지면 alt="" 를 주세요. 불러오는 동안 깔리는 자리 표시는 aria-hidden 입니다.',
            'RankNumber 는 aria-label 로 "3위" 처럼 순위를 붙입니다.',
            'WatchProgress 막대는 role="progressbar" 에 aria-valuenow(0~100) · aria-label="시청 진행" 을 붙입니다.',
        ],
    },
    'c-price': {
        components: ['Price', 'RatingDisplay'],
        usage: PriceUsage,
        a11y: [
            'Price 의 할인율은 "30% 할인" 으로 읽히고, 취소선 정가 앞에는 화면에 보이지 않는 "정가" 글자가 붙습니다.',
            'RatingDisplay 는 "별점 4.6점, 리뷰 1,284개" 를 이름으로 가진 role="img"(summary 는 role="group")로 그리며, 별 모양은 aria-hidden 입니다.',
        ],
        functions: [
            {
                name: 'formatPrice',
                signature: "formatPrice(n: number, currency = 'KRW', locale = 'ko-KR'): string",
                description: 'Price 와 같은 형식으로 금액 글자를 만듭니다. KRW 는 "62,300원", 그 밖의 통화는 Intl 통화 형식입니다.',
            },
        ],
    },
    'c-purchase': {
        components: ['QuantityInput', 'OptionPicker'],
        usage: PurchaseUsage,
        a11y: [
            'QuantityInput 은 role="group"(aria-label 기본 "수량") 안에 "수량 줄이기" · "수량 늘리기" 버튼과 aria-label="수량" 숫자 입력을 둡니다. min · max 에 닿으면 해당 버튼이 비활성됩니다.',
            '수량 입력에서 Enter 를 누르거나 포커스를 옮기면 값이 min ~ max 로 맞춰 확정되고, 비우면 min 이 됩니다.',
            'OptionPicker(swatch · chip)는 <fieldset> · <legend> 안의 role="radiogroup" 이고, 각 옵션은 role="radio" · aria-checked 를 가집니다. 선택된 옵션(없으면 첫 옵션)만 Tab 에 잡히고 ← → ↑ ↓ 로 이전 · 다음 옵션을 고릅니다.',
            '품절 옵션은 aria-disabled 이고 화살표 이동에서 건너뜁니다(allowSoldOut 이면 포함). 이름에 ", 품절" · ", 2개 남음" 이 붙어 읽힙니다.',
            'type="select" 는 <label> 로 감싼 기본 <select> 입니다.',
        ],
    },
    'c-searchbox': {
        components: ['SearchBox'],
        usage: SearchBoxUsage,
        a11y: [
            '<form role="search"> 안의 입력칸이 role="combobox" 이고 aria-expanded · aria-controls · aria-autocomplete="list" 로 아래 목록(role="listbox")과 이어집니다.',
            '↑ ↓ 로 인기 · 연관 검색어를 옮기면 aria-activedescendant 와 aria-selected 로 현재 항목을 알리고, Enter 로 그 항목(없으면 입력어)을 검색합니다. Esc 는 패널을 닫습니다.',
            '지우기 버튼은 aria-label="지우기", 최근 검색어 삭제 버튼은 "니트 삭제" 처럼 이름이 붙습니다.',
        ],
    },
    'c-videoplayer': {
        components: ['VideoPlayer'],
        usage: VideoPlayerUsage,
        a11y: [
            '재생기 전체가 tabIndex=0 · aria-label="영상 재생기" 로 포커스를 받고, Space · k 재생/일시정지, ← → 10초 이동, m 음소거, f 전체 화면 키를 처리합니다.',
            '재생 위치 막대는 role="slider" 이고 aria-valuetext 로 "1:20 / 42:00" 처럼 현재 · 전체 시간을 읽습니다.',
            '아이콘 버튼은 모두 aria-label 이 있으며(재생 · 일시정지 · 음소거 · 설정 · 전체 화면), 자막 버튼은 aria-pressed, 설정 버튼은 aria-expanded 로 상태를 알립니다. 설정 메뉴는 role="dialog" aria-label="재생 설정" 입니다.',
            '음량은 aria-label="음량" 인 range 입력이라 화살표 키로 조절합니다.',
        ],
    },
    'c-bottomsheet': {
        components: ['BottomSheet', 'MobileTabBar'],
        usage: BottomSheetUsage,
        a11y: [
            'BottomSheet 는 role="dialog" 이고 dim 이면 aria-modal 이 붙습니다. 이름은 aria-label, 없으면 문자열 title 을 씁니다.',
            '열리면 시트로 포커스가 옮겨지고 Esc 로 닫힙니다. 포커스를 시트 안에 가두지는 않습니다.',
            '손잡이는 role="button" aria-label="시트 높이 조절" 로 Tab 에 잡히며, ↑ 로 한 단계 높이고 ↓ 로 낮춥니다. 가장 낮은 단계에서 ↓ 를 누르면 닫힙니다.',
            'MobileTabBar 는 <nav aria-label="주 메뉴"> 이고, 선택된 탭에 aria-current="page", 배지는 "3개" 처럼 읽힙니다.',
        ],
    },
}
