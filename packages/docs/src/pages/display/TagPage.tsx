import { useState } from 'react'
import { IconCheck, Tag } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const TagPage = () => {
    const [filter, setFilter] = useState('all')
    const [lines, setLines] = useState(['1라인', '2라인'])
    return (
        <>
            <PageHeader title="Tag" description="분류 · 속성 표시. closable, icon, 필터 칩(onClick + selected), maxWidth 말줄임." />
            <ComponentPreview title="soft · outline · solid" code={`<Tag tone="accent">브래킷 A형</Tag> <Tag appearance="outline">SUS304</Tag> <Tag appearance="solid" tone="accent">긴급</Tag>`}>
                <Tag>2라인</Tag>
                <Tag tone="accent">브래킷 A형</Tag>
                <Tag tone="success">합격</Tag>
                <Tag tone="danger">불합격</Tag>
                <Tag appearance="outline">SUS304</Tag>
                <Tag appearance="outline" tone="accent">긴급</Tag>
                <Tag appearance="solid" tone="accent">긴급</Tag>
            </ComponentPreview>
            <ComponentPreview title="closable · icon · size" code={`<Tag closable onClose={() => remove(l)}>1라인</Tag>`}>
                {lines.map((l) => (
                    <Tag key={l} closable onClose={() => setLines(lines.filter((x) => x !== l))}>
                        {l}
                    </Tag>
                ))}
                <Tag tone="accent" icon={<IconCheck size={12} />}>승인됨</Tag>
                <Tag appearance="outline" size="sm">sm</Tag>
            </ComponentPreview>
            <ComponentPreview title="필터 칩 · maxWidth" code={`<Tag appearance="outline" selected={filter === 'all'} onClick={() => setFilter('all')}>전체 412</Tag>`}>
                {[
                    ['all', '전체 412'],
                    ['wait', '대기 38'],
                    ['run', '작업중 12'],
                ].map(([k, l]) => (
                    <Tag key={k} appearance="outline" selected={filter === k} onClick={() => setFilter(k!)}>
                        {l}
                    </Tag>
                ))}
                <Tag appearance="outline" maxWidth={180}>maxWidth 넘는 아주 긴 품목명 하우징 커버 어셈블리</Tag>
            </ComponentPreview>
        </>
    )
}
