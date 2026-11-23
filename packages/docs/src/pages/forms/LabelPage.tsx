import { Label } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const LabelPage = () => (
    <>
        <PageHeader title="Label" description="size sm 12 · md 14. 12px 보다 작은 라벨은 두지 않습니다." />
        <ComponentPreview title="기본" code={`<Label required>sm 라벨</Label> <Label size="md" optional>md 라벨</Label> <Label tooltip="도움말">도움말</Label>`}>
            <Label required>sm 라벨</Label>
            <Label size="md" optional>md 라벨</Label>
            <Label tooltip="라벨 옆 도움말">도움말 있는 라벨</Label>
        </ComponentPreview>
    </>
)
