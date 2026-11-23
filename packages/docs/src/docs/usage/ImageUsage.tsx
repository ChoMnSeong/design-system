import { Image } from '@ensnif/design-system'

export default function Example() {
    return (
        <Image
            src="https://picsum.photos/seed/bracket/480/320"
            alt="브래킷 A형 제품 사진"
            width={240}
            aspectRatio={3 / 2}
            radius="md"
            preview
            caption="브래킷 A형 · 표준 시료"
        />
    )
}
