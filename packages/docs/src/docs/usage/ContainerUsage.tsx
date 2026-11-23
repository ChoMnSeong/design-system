import { Container, Section } from '@ensnif/design-system'

export default function Example() {
    return (
        <>
            <Section spacing="md">
                <h2>이번 주 추천 상품</h2>
                <p>Section 은 안쪽을 Container(최대 1280)로 감싸고 위아래 여백을 둡니다.</p>
            </Section>
            <Section spacing="sm" tone="muted" bleed>
                <div>화면 끝까지 닿는 배너</div>
            </Section>
            <Container size="md" as="footer">
                고객센터 1588-0000
            </Container>
        </>
    )
}
