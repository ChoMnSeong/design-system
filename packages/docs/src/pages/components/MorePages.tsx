import { useState } from 'react'
import {
    Button,
    CodeBlock,
    CommandPalette,
    DonutChart,
    Gauge,
    HStack,
    IconArrowRight,
    IconCheck,
    IconClose,
    IconError,
    IconInfo,
    IconSearch,
    IconSun,
    Image,
    Kbd,
    NavigationMenu,
    PieChart,
    ScrollArea,
    Stack,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const ImagePage = () => (
    <>
        <PageHeader
            title="Image"
            description="로딩 placeholder + 에러 fallback. width/height/aspectRatio 지원."
        />
        <ComponentPreview
            title="기본"
            code={`<Image src="..." alt="profile" width={120} height={120} />
<Image src="https://broken-url" alt="broken" width={120} height={120} />`}
        >
            <HStack gap={12}>
                <Image
                    src="https://i.pravatar.cc/200?img=12"
                    alt="profile"
                    width={120}
                    height={120}
                    radius="var(--ds-radius-md)"
                />
                <Image
                    src="https://broken-url"
                    alt="broken"
                    width={120}
                    height={120}
                    radius="var(--ds-radius-md)"
                />
            </HStack>
        </ComponentPreview>
        <ComponentPreview
            title="Aspect ratio"
            code={`<Image src="..." alt="banner" width="100%" aspectRatio={16 / 9} />`}
        >
            <Image
                src="https://picsum.photos/seed/lanime/640/360"
                alt="banner"
                width="100%"
                aspectRatio={16 / 9}
                radius="var(--ds-radius-lg)"
                style={{ maxWidth: '480px', display: 'block' }}
            />
        </ComponentPreview>
    </>
)

export const ScrollAreaPage = () => (
    <>
        <PageHeader
            title="ScrollArea"
            description="얇은 커스텀 스크롤바 적용. maxHeight, direction 옵션."
        />
        <ComponentPreview
            title="기본"
            code={`<ScrollArea maxHeight={200}>
    {items.map((item) => <div>{item}</div>)}
</ScrollArea>`}
        >
            <ScrollArea
                maxHeight={200}
                style={{
                    width: '320px',
                    border: '1px solid var(--ds-color-border-subtle)',
                    borderRadius: 'var(--ds-radius-md)',
                    padding: '12px',
                }}
            >
                {Array.from({ length: 30 }, (_, i) => (
                    <div
                        key={i}
                        style={{
                            padding: '6px 8px',
                            borderBottom:
                                '1px solid var(--ds-color-border-subtle)',
                            fontSize: '13px',
                        }}
                    >
                        목록 항목 {i + 1}
                    </div>
                ))}
            </ScrollArea>
        </ComponentPreview>
    </>
)

const PIE_DATA = [
    { label: '액션', value: 38 },
    { label: '로맨스', value: 24 },
    { label: '판타지', value: 18 },
    { label: 'SF', value: 12 },
    { label: '기타', value: 8 },
]

export const PiePage = () => (
    <>
        <PageHeader
            title="PieChart / DonutChart"
            description="SVG 기반 원형 차트. legend 자동, custom color 지원."
        />
        <ComponentPreview
            title="PieChart"
            code={`<PieChart data={data} size={180} />`}
        >
            <PieChart data={PIE_DATA} size={180} />
        </ComponentPreview>
        <ComponentPreview
            title="DonutChart with center"
            code={`<DonutChart
    data={data}
    size={200}
    thickness={32}
    centerValue="100%"
    centerLabel="시청 비중"
/>`}
        >
            <DonutChart
                data={PIE_DATA}
                size={200}
                thickness={32}
                centerValue="100%"
                centerLabel="시청 비중"
            />
        </ComponentPreview>
    </>
)

export const GaugePage = () => (
    <>
        <PageHeader
            title="Gauge"
            description="원형 진행률. value/max, 사이즈, 두께, 색상."
        />
        <ComponentPreview
            title="기본"
            code={`<Gauge value={62} label="달성" />
<Gauge value={84} label="완료" color="var(--ds-color-state-success)" />`}
        >
            <HStack gap={20}>
                <Gauge value={62} label="달성" />
                <Gauge
                    value={84}
                    label="완료"
                    color="var(--ds-color-state-success)"
                />
                <Gauge
                    value={28}
                    label="남음"
                    color="var(--ds-color-state-warning)"
                />
            </HStack>
        </ComponentPreview>
    </>
)

export const CommandPalettePage = () => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <PageHeader
                title="CommandPalette"
                description="⌘K 검색 메뉴. group 묶음, 키워드, 단축키 표시 지원."
            />
            <ComponentPreview
                title="기본"
                code={`<CommandPalette open={open} onClose={...} items={items} />`}
            >
                <Stack gap={8} align="center">
                    <Button onClick={() => setOpen(true)}>
                        명령 열기 <Kbd size="sm">⌘</Kbd>
                        <Kbd size="sm">K</Kbd>
                    </Button>
                </Stack>
                <CommandPalette
                    open={open}
                    onClose={() => setOpen(false)}
                    items={[
                        {
                            id: 'new',
                            label: '새 컬렉션',
                            description: '내 라이브러리 추가',
                            group: '액션',
                            shortcut: '⌘N',
                            icon: <IconArrowRight size={14} />,
                            onSelect: () => alert('새 컬렉션'),
                        },
                        {
                            id: 'search',
                            label: '검색',
                            group: '액션',
                            shortcut: '⌘F',
                            icon: <IconSearch size={14} />,
                            onSelect: () => alert('검색'),
                        },
                        {
                            id: 'theme',
                            label: '다크 모드 전환',
                            group: '설정',
                            icon: <IconSun size={14} />,
                            onSelect: () => alert('테마'),
                        },
                        {
                            id: 'help',
                            label: '도움말',
                            group: '설정',
                            icon: <IconInfo size={14} />,
                            onSelect: () => alert('help'),
                        },
                        {
                            id: 'logout',
                            label: '로그아웃',
                            group: '계정',
                            icon: <IconClose size={14} />,
                            onSelect: () => alert('logout'),
                        },
                    ]}
                />
            </ComponentPreview>
        </>
    )
}

export const NavigationMenuPage = () => (
    <>
        <PageHeader
            title="NavigationMenu"
            description="앱 사이드바용 계층 네비. 아이콘, 배지, 펼침 지원."
        />
        <ComponentPreview
            title="기본"
            code={`<NavigationMenu
    activeId="trending"
    defaultExpanded={['library']}
    items={[
        { id: 'home', label: '홈', icon: <IconHome /> },
        {
            id: 'library',
            label: '라이브러리',
            children: [
                { id: 'all', label: '전체' },
                { id: 'fav', label: '즐겨찾기', badge: '12' },
            ],
        },
        { id: 'noti', label: '알림', badge: '3' },
    ]}
/>`}
        >
            <NavigationMenu
                activeId="trending"
                defaultExpanded={['library']}
                items={[
                    {
                        id: 'home',
                        label: '홈',
                        icon: <IconArrowRight size={14} />,
                    },
                    {
                        id: 'library',
                        label: '라이브러리',
                        icon: <IconSearch size={14} />,
                        children: [
                            { id: 'all', label: '전체' },
                            { id: 'fav', label: '즐겨찾기', badge: '12' },
                            { id: 'trending', label: '인기' },
                        ],
                    },
                    {
                        id: 'noti',
                        label: '알림',
                        icon: <IconError size={14} />,
                        badge: '3',
                    },
                ]}
                style={{ width: '240px' }}
            />
        </ComponentPreview>
    </>
)
