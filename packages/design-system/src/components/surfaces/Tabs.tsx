import {
    Children,
    createContext,
    isValidElement,
    useContext,
    useEffect,
    useId,
    useRef,
    useState,
    type CSSProperties,
    type HTMLAttributes,
    type KeyboardEvent,
    type ReactElement,
    type ReactNode,
} from 'react'
import { IconClose, IconMoreHorizontal } from '../icons.js'
import { Menu, MenuItem } from '../overlay/Menu.js'

type TabsCtx = {
    value: string | undefined
    select: (v: string) => void
    id: string
    appearance: TabsAppearance
    size: 'sm' | 'md' | 'lg'
    orientation: 'horizontal' | 'vertical'
    keepMounted: boolean
    visited: Set<string>
}
const Ctx = createContext<TabsCtx | null>(null)

export type TabsAppearance = 'underline' | 'pill' | 'enclosed' | 'segmented'

export type TabsProps = {
    /** 제어 모드 선택 탭 */
    value?: string
    /** 비제어 초기 선택 탭 */
    defaultValue?: string
    /** 선택 탭이 바뀔 때 (새 값) */
    onValueChange?: (v: string) => void
    /** underline 밑줄 · pill 알약 · enclosed 문서 탭 · segmented 분절 */
    appearance?: TabsAppearance
    /** @deprecated appearance 를 쓴다 */
    variant?: 'underline' | 'pill'
    /** 탭 높이. sm 30 · md 38 · lg 44 */
    size?: 'sm' | 'md' | 'lg'
    /** horizontal 위 탭 줄 · vertical 왼쪽 세로 탭 */
    orientation?: 'horizontal' | 'vertical'
    /** 탭이 넘칠 때: scroll 가로 스크롤 · menu 넘친 탭을 ··· 메뉴로 */
    overflow?: 'scroll' | 'menu'
    /** 한 번 연 패널은 숨겨도 마운트 유지 (폼 입력 보존) */
    keepMounted?: boolean
    /** TabList · TabPanel */
    children: ReactNode
    /** 루트 인라인 스타일 */
    style?: CSSProperties
    /** 루트 클래스 */
    className?: string
}

/** 탭을 눌러 패널을 바꿔 보는 묶음 */
export const Tabs = ({
    value: valueProp,
    defaultValue,
    onValueChange,
    appearance,
    variant,
    size = 'md',
    orientation = 'horizontal',
    overflow = 'scroll',
    keepMounted = false,
    children,
    style,
    className,
}: TabsProps) => {
    const [inner, setInner] = useState(defaultValue)
    const value = valueProp ?? inner
    const id = useId()
    const visited = useRef(new Set<string>())
    if (value) visited.current.add(value)
    return (
        <Ctx.Provider
            value={{
                value,
                select: (v) => {
                    if (valueProp === undefined) setInner(v)
                    onValueChange?.(v)
                },
                id,
                appearance: appearance ?? variant ?? 'underline',
                size,
                orientation,
                keepMounted,
                visited: visited.current,
            }}
        >
            <div data-ds-tabs="" data-orientation={orientation} data-overflow={overflow} className={className} style={style}>
                {children}
            </div>
        </Ctx.Provider>
    )
}

/** 탭 버튼 줄. 방향키 · Home · End 로 이동 */
export const TabList = ({ children, ...rest }: HTMLAttributes<HTMLDivElement>) => {
    const ctx = useContext(Ctx)!
    const ref = useRef<HTMLDivElement | null>(null)
    const [hidden, setHidden] = useState<string[]>([])

    // overflow="menu": 넘친 탭을 숨기고 메뉴로
    useEffect(() => {
        const el = ref.current
        if (!el || el.closest('[data-ds-tabs]')?.getAttribute('data-overflow') !== 'menu' || ctx.orientation === 'vertical') return
        const measure = () => {
            const tabs = Array.from(el.querySelectorAll<HTMLElement>('[role="tab"]'))
            tabs.forEach((t) => (t.style.display = ''))
            const limit = el.getBoundingClientRect().right - 44
            const out: string[] = []
            for (const t of tabs) if (t.getBoundingClientRect().right > limit) out.push(t.dataset.value!)
            out.forEach((v) => {
                const t = tabs.find((x) => x.dataset.value === v)
                if (t && v !== ctx.value) t.style.display = 'none'
            })
            setHidden(out.filter((v) => v !== ctx.value))
        }
        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(el)
        return () => ro.disconnect()
    }, [ctx.value, ctx.orientation, children])

    const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
        const keys = ctx.orientation === 'vertical' ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight']
        if (![...keys, 'Home', 'End'].includes(e.key)) return
        const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')).filter((t) => t.style.display !== 'none')
        const i = tabs.indexOf(document.activeElement as HTMLButtonElement)
        const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === keys[1] ? 1 : -1) + tabs.length) % tabs.length
        e.preventDefault()
        tabs[next]?.focus()
        ctx.select(tabs[next]!.dataset.value!)
    }
    const labels = new Map<string, ReactNode>()
    Children.forEach(children, (c) => {
        if (isValidElement(c)) labels.set((c as ReactElement<TabProps>).props.value, (c as ReactElement<TabProps>).props.children)
    })
    return (
        <div
            ref={ref}
            role="tablist"
            aria-orientation={ctx.orientation}
            data-ds-tablist=""
            data-appearance={ctx.appearance}
            data-size={ctx.size}
            onKeyDown={onKey}
            {...rest}
        >
            {children}
            {hidden.length > 0 && (
                <Menu
                    align="end"
                    trigger={
                        <button type="button" data-slot="more" aria-label={`탭 ${hidden.length}개 더 보기`}>
                            <IconMoreHorizontal size={16} />
                        </button>
                    }
                >
                    {hidden.map((v) => (
                        <MenuItem key={v} onClick={() => ctx.select(v)}>
                            {labels.get(v)}
                        </MenuItem>
                    ))}
                </Menu>
            )}
        </div>
    )
}

export type TabProps = {
    /** 탭 키 (TabPanel 의 value 와 짝) */
    value: string
    /** 탭 글자 */
    children: ReactNode
    /** 선택 불가 */
    disabled?: boolean
    /** 앞 아이콘 */
    icon?: ReactNode
    /** 글자 뒤 배지 (개수 등) */
    badge?: ReactNode
    /** 닫기 버튼 (enclosed 문서 탭) */
    closable?: boolean
    /** 닫기 버튼 · Delete 키로 닫을 때 */
    onClose?: () => void
} & Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'>

/** 탭 버튼 하나 */
export const Tab = ({ value, children, disabled, icon, badge, closable, onClose, ...rest }: TabProps) => {
    const ctx = useContext(Ctx)!
    const on = ctx.value === value
    return (
        <button
            type="button"
            role="tab"
            id={`${ctx.id}-tab-${value}`}
            aria-selected={on}
            aria-controls={`${ctx.id}-panel-${value}`}
            tabIndex={on ? 0 : -1}
            disabled={disabled}
            data-value={value}
            data-ds-tab=""
            onClick={() => ctx.select(value)}
            onKeyDown={(e) => {
                if (closable && (e.key === 'Delete' || e.key === 'Backspace')) {
                    e.preventDefault()
                    onClose?.()
                }
            }}
            {...rest}
        >
            {icon && <span data-slot="icon" aria-hidden>{icon}</span>}
            {children}
            {badge !== undefined && <span data-ds-badge="" data-appearance="soft" data-size="xs" data-tone={on ? 'accent' : 'neutral'}>{badge}</span>}
            {closable && (
                <span
                    role="button"
                    tabIndex={-1}
                    aria-label="탭 닫기"
                    data-slot="close"
                    onClick={(e) => {
                        e.stopPropagation()
                        onClose?.()
                    }}
                >
                    <IconClose size={12} />
                </span>
            )}
        </button>
    )
}

export type TabPanelProps = {
    /** 짝인 Tab 의 value */
    value: string
    /** 패널 내용 */
    children: ReactNode
} & HTMLAttributes<HTMLDivElement>

/** 선택된 탭일 때 보이는 내용 영역 */
export const TabPanel = ({ value, children, ...rest }: TabPanelProps) => {
    const ctx = useContext(Ctx)!
    const on = ctx.value === value
    if (!on && !(ctx.keepMounted && ctx.visited.has(value))) return null
    return (
        <div role="tabpanel" id={`${ctx.id}-panel-${value}`} aria-labelledby={`${ctx.id}-tab-${value}`} hidden={!on} tabIndex={0} data-ds-tabpanel="" {...rest}>
            {children}
        </div>
    )
}
