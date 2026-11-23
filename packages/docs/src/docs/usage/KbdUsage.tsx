import { Kbd } from '@ensnif/design-system'

export default function Example() {
    return (
        <p>
            검색 창은 <Kbd keys={['Ctrl', 'K']} /> 로 열고 <Kbd>Esc</Kbd> 로 닫습니다.
        </p>
    )
}
