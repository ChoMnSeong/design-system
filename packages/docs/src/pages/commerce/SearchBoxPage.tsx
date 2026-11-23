import { useState } from 'react'
import { SearchBox } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const ALL = ['니트 가디건', '캐시미어 니트', '니트 조끼', '울 코트', '와이드 데님', '레더 재킷', '스니커즈']

export const SearchBoxPage = () => {
    const [recent, setRecent] = useState(['울 코트', '와이드 데님', '스니커즈'])
    return (
        <>
            <PageHeader title="SearchBox" description="자동완성 검색창. 비었을 때 최근 · 인기 검색어, 입력하면 연관 검색어를 강조해 보여 줍니다." />
            <ComponentPreview title="recent · trending · suggest" description="비었을 때 최근·인기, 입력하면 연관 검색어(입력어 강조)." code={`<SearchBox recent={recent} trending={trending} suggest={(q) => fetch…} />`}>
                <div style={{ width: '100%', maxWidth: 420, minHeight: 360 }}>
                    <SearchBox recent={recent} onRecentRemove={(q) => setRecent(q ? recent.filter((r) => r !== q) : [])} trending={['캐시미어 니트', '패딩 조끼', '레더 재킷']} suggest={(q) => new Promise((r) => setTimeout(() => r(ALL.filter((x) => x.includes(q))), 120))} />
                </div>
            </ComponentPreview>
        </>
    )
}
