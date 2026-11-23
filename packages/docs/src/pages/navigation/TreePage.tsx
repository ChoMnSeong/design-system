import { IconMoreHorizontal, StatusIndicator, Tree, type TreeNode } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const BOM: TreeNode[] = [
    {
        id: 'asm',
        label: '브래킷 어셈블리',
        badge: 4,
        children: [
            { id: 'a', label: '브래킷 A형', badge: '×2', children: [{ id: 'sus', label: 'SUS304 1.2T 판재' }, { id: 'bolt', label: '볼트 M6' }] },
            { id: 'cover', label: '하우징 커버', children: [{ id: 'c1', label: '커버 판재' }] },
            { id: 'gasket', label: '가스켓', hasChildren: true },
        ],
    },
]

const PLANT: TreeNode[] = [
    {
        id: 'p1',
        label: '1공장',
        children: [
            {
                id: 'l2',
                label: '2라인',
                children: [
                    { id: 'press3', label: 'PRESS-03', icon: <StatusIndicator tone="danger" size="sm" />, actions: <IconMoreHorizontal size={16} /> },
                    { id: 'press4', label: 'PRESS-04', icon: <StatusIndicator tone="success" size="sm" />, actions: <IconMoreHorizontal size={16} /> },
                ],
            },
            { id: 'l3', label: '3라인', children: [{ id: 'weld1', label: 'WELD-01' }] },
        ],
    },
]

export const TreePage = () => (
    <>
        <PageHeader title="Tree" description="checkable(부분 체크 전파) · loadChildren · searchable · selectable · draggable. 방향키로 이동, → 펼치기 · ← 접기." />
        <ComponentPreview title="BOM · checkable · loadChildren / 설비 · searchable · actions" code={`<Tree data={BOM} checkable defaultChecked={['sus','bolt']} loadChildren={…} />`}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%', alignItems: 'start' }}>
                <Tree
                    aria-label="BOM"
                    data={BOM}
                    checkable
                    selectable="none"
                    defaultExpanded={['asm', 'a']}
                    defaultChecked={['sus', 'bolt']}
                    loadChildren={() => new Promise((r) => setTimeout(() => r([{ id: 'g1', label: 'NBR 고무' }]), 800))}
                />
                <Tree aria-label="설비" data={PLANT} searchable searchPlaceholder="설비 검색" defaultExpanded={['p1', 'l2']} defaultSelected={['press3']} draggable />
            </div>
        </ComponentPreview>
    </>
)
