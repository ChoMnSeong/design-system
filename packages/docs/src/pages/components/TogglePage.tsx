import { useState } from 'react'
import { Toggle, ToggleGroup } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const TogglePage = () => {
    const [defect, setDefect] = useState(true)
    const [view, setView] = useState<string | null>('card')
    const [lines, setLines] = useState<string[]>(['1', '2'])
    return (
        <>
            <PageHeader
                title="Toggle · ToggleGroup"
                description="켜고 끄는 버튼. appearance(outline · ghost · soft) × tone. 눌림은 aria-pressed 로 나갑니다."
            />
            <ComponentPreview
                title="appearance"
                description="outline · ghost 는 눌리면 강조색 옅은 바탕, soft + 의미 톤은 눌리면 그 톤 solid 가 됩니다."
                code={`<Toggle pressed={defect} onValueChange={setDefect}>불량만</Toggle>
<Toggle appearance="ghost" defaultPressed>고정</Toggle>
<Toggle appearance="soft" tone="danger" defaultPressed>알람 켜짐</Toggle>`}
            >
                <Toggle pressed={defect} onValueChange={setDefect}>
                    불량만
                </Toggle>
                <Toggle appearance="ghost" defaultPressed>
                    고정
                </Toggle>
                <Toggle appearance="soft" tone="danger" defaultPressed>
                    알람 켜짐
                </Toggle>
                <Toggle appearance="soft" tone="success">
                    자동 갱신
                </Toggle>
            </ComponentPreview>
            <ComponentPreview
                title="iconOnly"
                code={`<Toggle appearance="ghost" size="sm" iconOnly aria-label="굵게" defaultPressed><b>B</b></Toggle>`}
            >
                <Toggle appearance="ghost" size="sm" iconOnly aria-label="굵게" defaultPressed>
                    <b>B</b>
                </Toggle>
                <Toggle appearance="ghost" size="sm" iconOnly aria-label="기울임">
                    <i>I</i>
                </Toggle>
                <Toggle appearance="ghost" size="sm" iconOnly aria-label="밑줄">
                    <u>U</u>
                </Toggle>
            </ComponentPreview>
            <ComponentPreview
                title="ToggleGroup · single"
                description="하나만 켜집니다. 기본으로 붙어서 그려집니다."
                code={`<ToggleGroup value={view} onValueChange={setView} aria-label="보기">
    <Toggle value="list">목록</Toggle>
    <Toggle value="card">카드</Toggle>
    <Toggle value="kanban">칸반</Toggle>
</ToggleGroup>`}
            >
                <ToggleGroup value={view} onValueChange={setView} aria-label="보기">
                    <Toggle value="list">목록</Toggle>
                    <Toggle value="card">카드</Toggle>
                    <Toggle value="kanban">칸반</Toggle>
                </ToggleGroup>
            </ComponentPreview>
            <ComponentPreview
                title="ToggleGroup · multiple"
                code={`<ToggleGroup type="multiple" size="sm" value={lines} onValueChange={setLines} aria-label="라인 필터">
    <Toggle value="1">1라인</Toggle>
    ...
</ToggleGroup>`}
            >
                <ToggleGroup
                    type="multiple"
                    size="sm"
                    value={lines}
                    onValueChange={setLines}
                    aria-label="라인 필터"
                >
                    {['1', '2', '3', '4'].map((l) => (
                        <Toggle key={l} value={l}>
                            {l}라인
                        </Toggle>
                    ))}
                </ToggleGroup>
            </ComponentPreview>
        </>
    )
}
