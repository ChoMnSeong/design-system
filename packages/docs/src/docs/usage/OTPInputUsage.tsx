import { useState } from 'react'
import { OTPInput } from '@ensnif/design-system'

export default function Example() {
    const [code, setCode] = useState('')
    return (
        <OTPInput
            aria-label="인증번호"
            length={6}
            value={code}
            onChange={setCode}
            onComplete={() => {}}
            autoFocus
        />
    )
}
