import { Input, Label } from '@ensnif/design-system'

export default function Example() {
    return (
        <>
            <Label htmlFor="lot-no" required tooltip="바코드를 스캔하면 자동으로 채워집니다">
                LOT 번호
            </Label>
            <Input id="lot-no" placeholder="L2611-…" />
        </>
    )
}
