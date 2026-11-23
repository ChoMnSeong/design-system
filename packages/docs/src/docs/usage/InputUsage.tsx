import { IconSearch, Input } from '@ensnif/design-system'

export default function Example() {
    return (
        <Input
            aria-label="품목 검색"
            placeholder="품목명 · 품번"
            prefix={<IconSearch size={16} />}
            clearable
            debounce={300}
            onValueChange={(keyword) => console.log(keyword)}
        />
    )
}
