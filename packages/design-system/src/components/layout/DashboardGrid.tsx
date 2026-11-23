import { Children, createContext, isValidElement, useContext, useId, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactElement, type ReactNode } from 'react'

type BP = 'sm' | 'md' | 'lg'
type Resp<T> = T | Partial<Record<BP, T>>
const BREAK: Record<BP, number> = { sm: 640, md: 1024, lg: 1440 }

export type DashboardLayoutItem = { id: string; colSpan: number; rowSpan: number; order: number }

type Ctx = { editable: boolean; dragId: string | null; setDrag: (id: string | null) => void; drop: (target: string) => void; resize: (id: string, dc: number, dr: number) => void }
const GridCtx = createContext<Ctx | null>(null)

export type DashboardGridProps = {
    /** 열 수. 단계별: { sm: 4, md: 8, lg: 12 } */
    columns?: Resp<number>
    /** 한 줄 높이(px) 또는 'auto' */
    rowHeight?: number | 'auto'
    /** px */
    gap?: number
    /** 빈칸을 뒤 카드로 채운다 (grid-auto-flow: dense) */
    dense?: boolean
    /** 화면 배치를 글자로: ['kpi kpi oee', 'trend trend oee'] (Item 의 area 와 짝) */
    areas?: Resp<string[]>
    /** 단계 기준 폭(px). 기본 sm 640 · md 1024 · lg 1440 */
    breakpoints?: Partial<Record<BP, number>>
    /** 드래그로 순서 바꾸기 · 오른쪽 아래 모서리로 크기 조절 */
    editable?: boolean
    /** 편집으로 순서 · 크기가 바뀔 때 (전체 배치) */
    onLayoutChange?: (layout: DashboardLayoutItem[]) => void
    /** DashboardGrid.Item 들 */
    children: ReactNode
} & HTMLAttributes<HTMLDivElement>

const at = <T,>(v: Resp<T> | undefined, bp: BP | 'base'): T | undefined => {
    if (v === undefined) return undefined
    if (typeof v !== 'object' || Array.isArray(v)) return bp === 'base' ? (v as T) : undefined
    return (v as Partial<Record<BP, T>>)[bp as BP]
}

/** 불규칙(bento) 대시보드 배치 */
const DashboardGridRoot = ({ columns = 12, rowHeight = 120, gap = 12, dense, areas, breakpoints, editable, onLayoutChange, children, style, ...rest }: DashboardGridProps) => {
    const id = useId().replace(/[^a-zA-Z0-9]/g, '')
    const bps = { ...BREAK, ...breakpoints }
    const items = Children.toArray(children).filter(isValidElement) as ReactElement<DashboardGridItemProps>[]
    const [layout, setLayout] = useState<DashboardLayoutItem[]>(() =>
        items.map((c, i) => {
            const p = c.props
            return { id: p.id ?? String(i), colSpan: (typeof p.colSpan === 'number' ? p.colSpan : undefined) ?? 1, rowSpan: (typeof p.rowSpan === 'number' ? p.rowSpan : undefined) ?? 1, order: i }
        }),
    )
    const [dragId, setDrag] = useState<string | null>(null)
    const commit = (next: DashboardLayoutItem[]) => {
        setLayout(next)
        onLayoutChange?.(next)
    }
    const ctx: Ctx = {
        editable: !!editable,
        dragId,
        setDrag,
        drop: (target) => {
            if (!dragId || dragId === target) return
            const a = layout.find((l) => l.id === dragId)!
            const b = layout.find((l) => l.id === target)!
            commit(layout.map((l) => (l.id === a.id ? { ...l, order: b.order } : l.id === b.id ? { ...l, order: a.order } : l)))
        },
        resize: (iid, dc, dr) => commit(layout.map((l) => (l.id === iid ? { ...l, colSpan: Math.max(1, l.colSpan + dc), rowSpan: Math.max(1, l.rowSpan + dr) } : l))),
    }
    // 단계별 CSS
    // 기본값도 스타일시트에 둔다 (인라인이면 @media 가 이기지 못한다)
    const colsBase = at(columns, 'base') ?? (typeof columns === 'object' ? (at(columns, 'sm') ?? 1) : 12)
    const css: string[] = [`[data-ds-dash="${id}"]{grid-template-columns:repeat(${colsBase},minmax(0,1fr))}`]
    const areasBase = at(areas, 'base')
    for (const bp of ['sm', 'md', 'lg'] as BP[]) {
        const c = typeof columns === 'object' && bp === 'sm' ? undefined : at(columns, bp)
        const a = at(areas, bp)
        const decl = [c ? `grid-template-columns:repeat(${c},minmax(0,1fr))` : '', a ? `grid-template-areas:${a.map((r) => `"${r}"`).join(' ')}` : ''].filter(Boolean).join(';')
        if (decl) css.push(`@media (min-width:${bps[bp]}px){[data-ds-dash="${id}"]{${decl}}}`)
    }
    items.forEach((c, i) => {
        const p = c.props
        for (const bp of ['sm', 'md', 'lg'] as BP[]) {
            const cs = at(p.colSpan, bp)
            const rs = at(p.rowSpan, bp)
            if (cs || rs) css.push(`@media (min-width:${bps[bp]}px){[data-ds-dash="${id}"]>[data-i="${i}"]{${cs ? `grid-column:span ${cs};` : ''}${rs ? `grid-row:span ${rs}` : ''}}}`)
        }
    })
    return (
        <GridCtx.Provider value={ctx}>
            <style>{css.join('')}</style>
            <div
                data-ds-dashboard-grid=""
                data-ds-dash={id}
                data-editable={editable ? '' : undefined}
                style={{
                    display: 'grid',
                    gridAutoRows: rowHeight === 'auto' ? 'auto' : `${rowHeight}px`,
                    gridAutoFlow: dense ? 'row dense' : undefined,
                    gridTemplateAreas: areasBase ? areasBase.map((r) => `"${r}"`).join(' ') : undefined,
                    gap,
                    ...style,
                }}
                {...rest}
            >
                {items.map((c, i) => {
                    const l = layout[i]
                    const key = c.props.id ?? String(i)
                    return (
                        <DashboardGridItem
                            key={key}
                            {...c.props}
                            data-i={i}
                            style={{
                                ...(editable && l ? { gridColumn: `span ${l.colSpan}`, gridRow: `span ${l.rowSpan}`, order: l.order } : null),
                                ...c.props.style,
                            }}
                            _id={key}
                        />
                    )
                })}
            </div>
        </GridCtx.Provider>
    )
}

export type DashboardGridItemProps = {
    /** 배치(onLayoutChange)에서 쓰는 항목 키. 없으면 순서 번호 */
    id?: string
    /** 차지할 열 수. 단계별 { sm, md, lg } 도 된다 */
    colSpan?: Resp<number>
    /** 차지할 줄 수. 단계별 { sm, md, lg } 도 된다 */
    rowSpan?: Resp<number>
    /** areas 의 이름 */
    area?: string
    /** 칸 내용 (카드 등) */
    children?: ReactNode
    /** 인라인 스타일. 배치 스타일 위에 덮는다 */
    style?: CSSProperties
    /** 내부용. 그리드가 넣는 항목 키 */
    _id?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'style'>

/** DashboardGrid 의 한 칸. 편집 모드에서 끌기 · 크기 조절 */
export const DashboardGridItem = ({ id: _ignored, colSpan, rowSpan, area, children, style, _id, ...rest }: DashboardGridItemProps) => {
    const ctx = useContext(GridCtx)
    const cs = typeof colSpan === 'number' ? colSpan : (colSpan?.sm ?? 1)
    const rs = typeof rowSpan === 'number' ? rowSpan : (rowSpan?.sm ?? 1)
    const startRef = useRef<{ x: number; y: number } | null>(null)
    const editable = ctx?.editable
    return (
        <div
            data-ds-dashboard-item=""
            data-dragging={ctx?.dragId === _id ? '' : undefined}
            draggable={editable}
            onDragStart={() => _id && ctx?.setDrag(_id)}
            onDragEnd={() => ctx?.setDrag(null)}
            onDragOver={(e) => editable && e.preventDefault()}
            onDrop={() => _id && ctx?.drop(_id)}
            style={{ gridColumn: area ? undefined : `span ${cs}`, gridRow: area ? undefined : `span ${rs}`, ...(area ? { gridArea: area } : null), minWidth: 0, minHeight: 0, position: 'relative', ...style }}
            {...rest}
        >
            {children}
            {editable && (
                <span
                    data-slot="resize"
                    role="button"
                    aria-label="크기 조절 (방향키)"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        const d = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[e.key]
                        if (d && _id) {
                            e.preventDefault()
                            ctx?.resize(_id, d[0]!, d[1]!)
                        }
                    }}
                    onPointerDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        startRef.current = { x: e.clientX, y: e.clientY }
                        const cell = (e.currentTarget.parentElement!.getBoundingClientRect().width / cs) || 80
                        const rowH = (e.currentTarget.parentElement!.getBoundingClientRect().height / rs) || 80
                        const up = (ev: PointerEvent) => {
                            window.removeEventListener('pointerup', up)
                            const s = startRef.current!
                            const dc = Math.round((ev.clientX - s.x) / cell)
                            const dr = Math.round((ev.clientY - s.y) / rowH)
                            if (_id && (dc || dr)) ctx?.resize(_id, dc, dr)
                        }
                        window.addEventListener('pointerup', up)
                    }}
                />
            )}
        </div>
    )
}

/** 대시보드 bento 배치. 칸은 DashboardGrid.Item(= DashboardGridItem) 으로 넣는다 */
export const DashboardGrid = Object.assign(DashboardGridRoot, { Item: DashboardGridItem })
