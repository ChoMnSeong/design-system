import { Button, ButtonGroup } from '@ensnif/design-system'

export default function Example() {
    return (
        <ButtonGroup size="sm" appearance="outline" tone="neutral" aria-label="작업지시 처리">
            <Button>승인</Button>
            <Button>보류</Button>
            <Button tone="danger">반려</Button>
        </ButtonGroup>
    )
}
