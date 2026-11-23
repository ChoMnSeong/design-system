import { Badge, IconCheck, type Tone } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const TONES: Array<[Tone, string]> = [
    ['accent', 'accent'],
    ['neutral', 'neutral'],
    ['success', '완료'],
    ['warning', '보류'],
    ['danger', '불량'],
    ['info', '검사'],
]

export const BadgePage = () => (
    <>
        <PageHeader title="Badge" description="appearance solid · soft(기본) · outline × tone. dot · max · pulse · icon." />
        {(['solid', 'soft', 'outline'] as const).map((a) => (
            <ComponentPreview key={a} title={a} code={`<Badge appearance="${a}" tone="success">완료</Badge>`}>
                {TONES.map(([t, l]) => (
                    <Badge key={t} appearance={a} tone={t}>
                        {l}
                    </Badge>
                ))}
            </ComponentPreview>
        ))}
        <ComponentPreview title="dot · size · max · pulse" code={`<Badge tone="success" dot>가동</Badge> <Badge appearance="solid" tone="danger" max={99}>{120}</Badge> <Badge pulse tone="accent">pulse</Badge>`}>
            <Badge tone="success" dot>가동</Badge>
            <Badge tone="danger" dot>정지</Badge>
            <Badge appearance="solid" tone="danger" size="xs">N</Badge>
            <Badge appearance="solid" tone="danger" size="sm">12</Badge>
            <Badge appearance="solid" tone="danger" max={99}>{120}</Badge>
            <Badge pulse tone="accent">pulse</Badge>
            <Badge tone="success" icon={<IconCheck size={12} />}>승인</Badge>
        </ComponentPreview>
    </>
)
