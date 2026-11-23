import { useState } from 'react'
import { Toggle, ToggleGroup } from '@ensnif/design-system'

export default function Example() {
    const [view, setView] = useState<string | null>('list')
    return (
        <>
            <Toggle defaultPressed onValueChange={() => {}}>
                불량만 보기
            </Toggle>
            <ToggleGroup value={view} onValueChange={setView} aria-label="보기 방식">
                <Toggle value="list">목록</Toggle>
                <Toggle value="board">보드</Toggle>
                <Toggle value="gantt">간트</Toggle>
            </ToggleGroup>
        </>
    )
}
