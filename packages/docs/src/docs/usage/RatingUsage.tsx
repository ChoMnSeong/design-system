import { useState } from 'react'
import { Rating } from '@ensnif/design-system'

export default function Example() {
    const [score, setScore] = useState(4)
    return <Rating value={score} onValueChange={setScore} allowHalf />
}
