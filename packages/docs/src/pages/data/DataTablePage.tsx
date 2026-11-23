import { useMemo, useState } from 'react'
import { Badge, Button, DataTable, IconMoreHorizontal, Progress, SegmentedControl, type DataTableColumn, type Tone } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

type WO = { wo: string; item: string; line: string; plan: number; actual: number; defect: number; status: string; due: string }

const ITEMS = ['브래킷 A형', '하우징 커버', '샤프트 Ø32', '플랜지 B', '가스켓']

const STATUS: Array<[string, Tone]> = [['대기', 'neutral'], ['작업중', 'info'], ['완료', 'success'], ['보류', 'warning']]

const seed = (n: number): WO[] =>
    Array.from({ length: n }, (_, i) => {
        const plan = [1200, 800, 600, 1000, 400][i % 5]!
        const actual = Math.round(plan * (0.55 + ((i * 37) % 45) / 100))
        return {
            wo: `WO-2611-${String(42 + i).padStart(4, '0')}`,
            item: ITEMS[i % 5]!,
            line: `${(i % 3) + 1}라인`,
            plan,
            actual,
            defect: (i * 7) % 26,
            status: STATUS[i % 4]![0],
            due: `2026-11-${String(18 + (i % 10)).padStart(2, '0')}`,
        }
    })

export const DataTablePage = () => {
    const [rows, setRows] = useState(() => seed(64))
    const [density, setDensity] = useState<'compact' | 'default' | 'comfortable'>('default')
    const columns = useMemo<DataTableColumn<WO>[]>(
        () => [
            { id: 'wo', header: '작업지시번호', pinned: 'left', width: 150, sortable: true, cell: (r) => <b>{r.wo}</b>, hideable: false },
            { id: 'item', header: '품목', sortable: true, filter: { type: 'text' }, resizable: true, width: 140 },
            { id: 'line', header: '라인', filter: { type: 'select', options: ['1라인', '2라인', '3라인'].map((v) => ({ value: v, label: v })) }, width: 90 },
            {
                id: 'qty',
                header: '수량',
                columns: [
                    { id: 'plan', header: '계획', align: 'right', sortable: true, aggregate: 'sum', width: 90 },
                    { id: 'actual', header: '실적', align: 'right', sortable: true, aggregate: 'sum', editor: 'number', width: 100 },
                    { id: 'defect', header: '불량', align: 'right', sortable: true, aggregate: 'sum', filter: { type: 'number' }, width: 80, cell: (r) => <span style={{ color: r.defect / r.plan > 0.015 ? 'var(--ds-tone-danger-text)' : undefined, fontWeight: r.defect / r.plan > 0.015 ? 600 : undefined }}>{r.defect}</span> },
                ],
            },
            {
                id: 'rate',
                header: '달성률',
                width: 150,
                accessor: (r) => r.actual / r.plan,
                sortable: true,
                cell: (r) => {
                    const p = (r.actual / r.plan) * 100
                    return <Progress value={p} size="sm" tone={p >= 95 ? 'success' : p >= 80 ? 'warning' : 'danger'} valueLabel="end" formatValue={() => `${p.toFixed(0)}%`} aria-label={`${r.wo} 달성률`} />
                },
            },
            { id: 'status', header: '상태', width: 96, editor: 'select', editorOptions: STATUS.map(([s]) => ({ value: s, label: s })), cell: (r) => <Badge size="sm" tone={STATUS.find(([s]) => s === r.status)?.[1]}>{r.status}</Badge> },
            { id: 'due', header: '납기', sortable: true, width: 110 },
            { id: 'menu', header: '', pinned: 'right', width: 48, hideable: false, cell: () => <Button size="xs" appearance="ghost" tone="neutral" shape="square" aria-label="행 메뉴" iconLeft={<IconMoreHorizontal size={14} />} /> },
        ],
        [],
    )
    return (
        <>
            <PageHeader
                title="DataTable"
                description="정렬 · 필터 · 검색 · 페이지, 선택 + 일괄 작업, 고정 열, 다단 헤더, 셀 편집, 그룹 + 소계, 펼침 상세, 행 톤, 열 설정 · 너비 저장, 내보내기, 서버 모드, 가상 스크롤."
            />
            <ComponentPreview
                title="작업지시 목록"
                description="실적 · 상태 셀은 더블클릭(또는 Enter)으로 편집합니다. 바뀐 셀은 오른쪽 위 모서리로 표시됩니다."
                code={`<DataTable
    title="작업지시 목록"
    columns={columns}         // pinned · columns(다단) · editor · aggregate · filter
    data={rows}
    rowKey={(r) => r.wo}
    selection="multiple"
    bulkActions={(sel) => <Button size="xs">일괄 승인</Button>}
    groupBy="line"
    editable
    onCellEdit={(row, col, v) => update(row.wo, col, v)}
    rowTone={(r) => (r.defect / r.plan > 0.015 ? 'danger' : undefined)}
    expandable={{ render: (r) => <Detail row={r} />, rowExpandable: (r) => r.defect > 0 }}
    pagination={{ pageSize: 20, pageSizeOptions: [20, 50, 100] }}
    showSearch
    exportable
    stateKey="wo-list"
/>`}
            >
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <SegmentedControl
                        size="sm"
                        aria-label="밀도"
                        value={density}
                        onValueChange={setDensity}
                        options={[
                            { value: 'compact', label: 'compact' },
                            { value: 'default', label: 'default' },
                            { value: 'comfortable', label: 'comfortable' },
                        ]}
                    />
                    <DataTable
                        title="작업지시 목록"
                        columns={columns}
                        data={rows}
                        rowKey={(r) => r.wo}
                        selection="multiple"
                        bulkActions={(sel) => (
                            <>
                                <Button size="xs" onClick={() => setRows((rs) => rs.map((r) => (sel.includes(r) ? { ...r, status: '완료' } : r)))}>일괄 승인</Button>
                                <Button size="xs" appearance="outline" tone="neutral">라인 변경</Button>
                                <Button size="xs" appearance="ghost" tone="danger">삭제</Button>
                            </>
                        )}
                        groupBy="line"
                        editable
                        onCellEdit={(row, col, v) => setRows((rs) => rs.map((r) => (r.wo === row.wo ? { ...r, [col]: v } : r)))}
                        rowTone={(r) => (r.defect / r.plan > 0.015 ? 'danger' : undefined)}
                        expandable={{
                            rowExpandable: (r) => r.defect > 0,
                            render: (r) => (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px 24px', fontSize: 12 }}>
                                    <span>불량 유형<br /><b>치수불량 {Math.ceil(r.defect * 0.6)} · 스크래치 {Math.floor(r.defect * 0.4)}</b></span>
                                    <span>불량률<br /><b style={{ color: 'var(--ds-tone-danger-text)' }}>{((r.defect / r.plan) * 100).toFixed(2)}%</b></span>
                                    <span>투입 LOT<br /><b>L2611-118, L2611-121</b></span>
                                    <span>품질 담당<br /><b>품질보증팀</b></span>
                                </div>
                            ),
                        }}
                        pagination={{ pageSize: 20, pageSizeOptions: [20, 50, 100] }}
                        showSearch
                        exportable
                        stateKey="docs-wo-list"
                        density={density}
                        maxHeight={520}
                    />
                </div>
            </ComponentPreview>
        </>
    )
}
