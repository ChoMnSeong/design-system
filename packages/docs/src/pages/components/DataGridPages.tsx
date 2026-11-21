import { useMemo, useState } from 'react'
import { Button, DataGrid, type CellChange, type GridColumn } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

type Lot = { id: string; line: string; item: string; shift: string; date: string; plan: number; actual: number; defect: number; yield: number; delta: number; owner: string; status: string; trend: number[] }

const LINES = ['1라인', '2라인', '3라인']
const ITEMS = ['브래킷 A형', '하우징 커버', '샤프트 Ø32', '플랜지 B']
const OWNERS = ['김도윤', '이서연', '박지호', '최유나']
const STATUS = ['정상', '주의', '정지']
const lots = (n: number): Lot[] =>
    Array.from({ length: n }, (_, i) => {
        const plan = [1200, 800, 600, 1000][i % 4]!
        const actual = Math.round(plan * (0.7 + ((i * 37) % 35) / 100))
        const defect = (i * 7) % 23
        return {
            id: `LOT-${String(1001 + i)}`,
            line: LINES[i % 3]!,
            item: ITEMS[(i >> 1) % 4]!,
            shift: i % 2 ? '야간' : '주간',
            date: `2026-11-${String(10 + (i % 12)).padStart(2, '0')}`,
            plan,
            actual,
            defect,
            yield: +(100 - (defect / actual) * 100).toFixed(1),
            delta: ((i * 13) % 21) - 10,
            owner: OWNERS[i % 4]!,
            status: STATUS[i % 7 === 0 ? 2 : i % 3 === 0 ? 1 : 0]!,
            trend: Array.from({ length: 8 }, (_, k) => 60 + ((i * 11 + k * 17) % 40)),
        }
    })

const cols = (): GridColumn<Lot>[] => [
    { field: 'id', headerName: 'LOT', width: 110, pinned: 'left', floatingFilter: true, filter: 'text' },
    {
        field: 'g-info',
        headerName: '기본 정보',
        children: [
            { field: 'line', headerName: '라인', width: 90, filter: 'set', filterValues: LINES, floatingFilter: true },
            { field: 'item', headerName: '품목', width: 130, filter: 'set', filterValues: () => new Promise((r) => setTimeout(() => r(ITEMS), 300)), floatingFilter: true },
            { field: 'date', headerName: '일자', width: 112, filter: 'date', floatingFilter: true, valueFormatter: 'date' },
        ],
    },
    {
        field: 'g-qty',
        headerName: '생산 실적',
        children: [
            { field: 'plan', headerName: '계획', width: 90, align: 'right', valueFormatter: 'number', aggFunc: 'sum', filter: 'number', floatingFilter: true },
            { field: 'actual', headerName: '실적', width: 90, align: 'right', valueFormatter: 'number', aggFunc: 'sum', filter: 'number', floatingFilter: true, editable: true, validate: (v) => (v < 0 ? '0 이상이어야 합니다' : null) },
            { field: 'defect', headerName: '불량', width: 80, align: 'right', aggFunc: 'sum', editable: true, cellClassRules: { danger: (p) => p.value >= 18, warning: (p) => p.value >= 12 && p.value < 18 } },
        ],
    },
    { field: 'yield', headerName: '수율', width: 150, cellRenderer: 'bar', cellRendererParams: { max: 100, tone: (v: number) => (v < 97 ? 'danger' : v < 98.5 ? 'warning' : 'success') }, valueFormatter: (v) => `${v}%`, aggFunc: 'avg' },
    { field: 'delta', headerName: '전일 대비', width: 100, align: 'right', cellRenderer: 'delta' },
    { field: 'trend', headerName: '8주 추이', width: 120, cellRenderer: 'sparkline', sortable: false, menu: [] },
    { field: 'owner', headerName: '담당', width: 110, cellRenderer: 'avatar' },
    { field: 'status', headerName: '상태', width: 90, pinned: 'right', cellRenderer: 'badge', cellRendererParams: { toneMap: { 정상: 'success', 주의: 'warning', 정지: 'danger' } }, editable: true, cellEditor: 'select', cellEditorOptions: STATUS.map((s) => ({ value: s, label: s })), filter: 'set', filterValues: STATUS },
]

export const DataGridPage = () => {
    const rows = useMemo(() => lots(40), [])
    const columns = useMemo(cols, [])
    const [log, setLog] = useState<string>('')
    return (
        <>
            <PageHeader title="DataGrid" description="열 그룹 · 고정 · 다중 정렬 · 필터 · 편집 · 범위 선택 · 행 그룹 · 피벗 · 트리 · 마스터-디테일 · 가상화를 갖춘 업무용 그리드 (보드 10-01 ~ 10-07)." />

            <ComponentPreview title="10-01 · 10-02 헤더 · 필터" description="Shift+클릭으로 다중 정렬, 헤더 ⋮ 메뉴로 고정·너비·숨김. 숫자 필터는 >100, 10..20 처럼 씁니다." code={`<DataGrid rows={rows} columns={columns} showQuickFilter advancedFilter savedViews={views} exportFileName="lots" />`}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    height={420}
                    showQuickFilter
                    advancedFilter
                    defaultSortModel={[{ key: 'line', dir: 'asc' }, { key: 'actual', dir: 'desc' }]}
                    savedViews={[
                        { name: '정지 LOT', filterModel: { status: { type: 'set', values: ['정지'] } } },
                        { name: '1라인 · 실적순', filterModel: { line: { type: 'set', values: ['1라인'] } }, sortModel: [{ key: 'actual', dir: 'desc' }] },
                    ]}
                    exportFileName="lots"
                    statusBar={['count']}
                />
            </ComponentPreview>

            <ComponentPreview title="10-03 편집 · 범위 선택 · 상태 막대" description="셀을 끌어 범위를 고르면 합계·평균이 나옵니다. 채우기 핸들, Ctrl+C/V, Ctrl+Z, 일괄 저장." code={`<DataGrid cellSelection clipboard undoRedo statusBar pendingChanges onSaveChanges={save} />`}>
                <DataGrid rows={rows.slice(0, 12)} columns={columns} cellSelection clipboard undoRedo statusBar={['count', 'selected', 'sum', 'avg', 'min', 'max', 'changes']} pendingChanges onSaveChanges={(c: CellChange<Lot>[]) => setLog(`${c.length}건 저장: ${c.map((x) => `${x.rowId}.${x.field}=${x.newValue}`).join(', ')}`)} />
                {log && <div style={{ fontSize: 12, marginTop: 8, color: 'var(--ds-color-foreground-secondary)' }}>{log}</div>}
            </ComponentPreview>

            <ComponentPreview title="10-04 행 그룹 · 집계 · 도구 패널" description="머리글을 그룹 패널로 끌어 다단 그룹을 만듭니다. 오른쪽 패널에서 열 표시와 필터를 바꿉니다." code={`<DataGrid groupPanel defaultGroupBy={['line', 'item']} sideBar pinnedBottomRow="total" />`}>
                <DataGrid rows={rows} columns={columns} height={420} groupPanel defaultGroupBy={['line', 'item']} sideBar pinnedBottomRow="total" />
            </ComponentPreview>

            <ComponentPreview title="10-04 피벗" description="라인 × 교대 로 계획·실적을 집계합니다." code={`<DataGrid defaultGroupBy={['line']} pivot={{ columns: ['shift'], values: ['plan', 'actual'] }} pinnedBottomRow="total" />`}>
                <DataGrid rows={rows} columns={columns} defaultGroupBy={['line']} pivot={{ columns: ['shift'], values: ['plan', 'actual'] }} />
            </ComponentPreview>
            <TreeAndDetail />
            <StatesDemo />
        </>
    )
}

type Bom = { path: string[]; qty: number; cost: number; supplier?: string }
const BOM: Bom[] = [
    { path: ['감속기 GX-200'], qty: 1, cost: 0 },
    { path: ['감속기 GX-200', '하우징'], qty: 1, cost: 0 },
    { path: ['감속기 GX-200', '하우징', '하우징 본체'], qty: 1, cost: 42000, supplier: '대성주물' },
    { path: ['감속기 GX-200', '하우징', '커버'], qty: 2, cost: 8600, supplier: '대성주물' },
    { path: ['감속기 GX-200', '기어 어셈블리'], qty: 1, cost: 0 },
    { path: ['감속기 GX-200', '기어 어셈블리', '입력 샤프트'], qty: 1, cost: 15400, supplier: '한일정밀' },
    { path: ['감속기 GX-200', '기어 어셈블리', '헬리컬 기어'], qty: 3, cost: 22100, supplier: '한일정밀' },
    { path: ['감속기 GX-200', '베어링 6205'], qty: 4, cost: 3200, supplier: 'NSK' },
]

const TreeAndDetail = () => {
    const rows = useMemo(() => lots(8), [])
    const columns = useMemo(cols, [])
    return (
        <>
            <ComponentPreview title="10-05 트리 데이터 (BOM)" description="getDataPath 로 계층을 만들고 하위 원가를 부모에 합산합니다." code={`<DataGrid rows={bom} getDataPath={(r) => r.path} treeColumnName="부품" columns={[...]} />`}>
                <DataGrid
                    rows={BOM}
                    getRowId={(r) => r.path.join('/')}
                    getDataPath={(r) => r.path}
                    treeColumnName="부품"
                    groupDefaultExpanded={2}
                    columns={[
                        { field: 'qty', headerName: '수량', width: 80, align: 'right' },
                        { field: 'cost', headerName: '원가', width: 120, align: 'right', valueFormatter: 'number', aggFunc: 'sum' },
                        { field: 'supplier', headerName: '공급사', width: 120 },
                    ]}
                />
            </ComponentPreview>
            <ComponentPreview title="10-05 마스터-디테일" description="행을 펼치면 renderDetail 내용이 아래에 붙습니다." code={`<DataGrid renderDetail={(row) => <LotDetail row={row} />} />`}>
                <DataGrid rows={rows} columns={columns.slice(0, 4)} renderDetail={(r) => (
                    <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
                        <span>담당 <b>{r.owner}</b></span>
                        <span>교대 <b>{r.shift}</b></span>
                        <span>불량 <b>{r.defect}</b></span>
                        <span>수율 <b>{r.yield}%</b></span>
                    </div>
                )} />
            </ComponentPreview>
        </>
    )
}

const StatesDemo = () => {
    const big = useMemo(() => lots(5000), [])
    const columns = useMemo(() => cols().filter((c) => !c.children), [])
    const [state, setState] = useState<'loading' | 'empty' | 'error'>('loading')
    const [inf, setInf] = useState(() => lots(30))
    const [busy, setBusy] = useState(false)
    return (
        <>
            <ComponentPreview title="10-07 상태" description="로딩 · 빈 결과 · 오류(다시 시도)." code={`<DataGrid loading /> <DataGrid rows={[]} /> <DataGrid error="…" onRetry={reload} />`}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                    {(['loading', 'empty', 'error'] as const).map((s) => <Button key={s} size="sm" appearance={state === s ? 'soft' : 'ghost'} tone="neutral" onClick={() => setState(s)}>{s}</Button>)}
                </div>
                <DataGrid rows={[]} columns={columns} height={220} loading={state === 'loading'} error={state === 'error' ? '데이터를 불러오지 못했습니다 (504)' : undefined} onRetry={() => setState('loading')} emptyText="조건에 맞는 LOT 가 없습니다" />
            </ComponentPreview>
            <ComponentPreview title="10-07 대용량 · 무한 스크롤 · 페이지" description="5,000행은 보이는 행만 그립니다. 아래는 끝에 닿으면 30행씩 더 불러오고, 마지막은 페이지 나눔입니다." code={`<DataGrid rows={rows5000} height={360} />\n<DataGrid onLoadMore={more} hasMore loading={busy} />\n<DataGrid pageSize={10} />`}>
                <DataGrid rows={big} columns={columns} height={360} statusBar={['count']} />
                <div style={{ height: 16 }} />
                <DataGrid rows={inf} columns={columns} height={260} hasMore={inf.length < 150} loading={busy} onLoadMore={() => { setBusy(true); setTimeout(() => { setInf((r) => [...r, ...lots(r.length + 30).slice(r.length)]); setBusy(false) }, 600) }} statusBar={['count']} />
                <div style={{ height: 16 }} />
                <DataGrid rows={big.slice(0, 57)} columns={columns} pageSize={10} statusBar={['count']} />
            </ComponentPreview>
        </>
    )
}
