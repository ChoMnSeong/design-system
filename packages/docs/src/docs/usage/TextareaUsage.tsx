import { useState } from 'react'
import { Textarea } from '@ensnif/design-system'

export default function Example() {
    const [memo, setMemo] = useState('')
    return (
        <Textarea
            aria-label="작업 메모"
            placeholder="교대 인수인계 사항을 적어 주세요"
            value={memo}
            onValueChange={setMemo}
            minRows={3}
            maxRows={8}
            maxLength={500}
            showCount
            fullWidth
        />
    )
}
