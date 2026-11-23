import { Button, Hero } from '@ensnif/design-system'

export default function Example() {
    return (
        <Hero
            media="/images/autumn-outer.jpg"
            mediaAlt="코트를 입은 모델"
            eyebrow="AUTUMN 2026"
            title="가을, 새로 입는 계절"
            description="올해 처음 선보이는 아우터 42종"
            actions={<Button size="lg">지금 보기</Button>}
            radius={16}
        />
    )
}
