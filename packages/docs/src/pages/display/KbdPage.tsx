import { Kbd } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const KbdPage = () => (
    <>
        <PageHeader title="Kbd" description="키보드 키. size xs 18 · sm 20 · md 24. keys 로 조합을 넘기면 '+' 를 자동으로 넣습니다." />
        <ComponentPreview
            title="size"
            code={`<Kbd size="xs">Esc</Kbd>
<Kbd>Enter</Kbd>
<Kbd size="md">Space</Kbd>`}
        >
            <Kbd size="xs">Esc</Kbd>
            <Kbd>Enter</Kbd>
            <Kbd size="md">Space</Kbd>
        </ComponentPreview>
        <ComponentPreview
            title="keys"
            code={`<Kbd keys={['Ctrl', 'K']} />
<Kbd keys={['Ctrl', '⇧', 'S']} />`}
        >
            <Kbd keys={['Ctrl', 'K']} />
            <Kbd keys={['Ctrl', '⇧', 'S']} />
        </ComponentPreview>
    </>
)
