import { Button, Card } from '@ensnif/design-system'

export default function Example() {
    return (
        <Card>
            <Card.Header actions={<Button size="sm" appearance="ghost">편집</Button>}>
                <Card.Title>설비 상태</Card.Title>
                <Card.Description>1공장 · 2라인</Card.Description>
            </Card.Header>
            <Card.Body>본문</Card.Body>
            <Card.Footer>
                <Button size="sm">상세 보기</Button>
            </Card.Footer>
        </Card>
    )
}
