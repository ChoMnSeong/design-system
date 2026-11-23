import { CodeBlock } from '@ensnif/design-system'

const code = `const ok = await confirm({ title: '작업지시를 삭제할까요?', tone: 'danger' })
if (ok) await deleteWorkOrder(id)`

export default function Example() {
    return <CodeBlock code={code} language="ts" fileName="workOrder.ts" showLineNumbers highlightLines={[2]} />
}
