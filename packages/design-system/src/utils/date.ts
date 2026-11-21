/** 날짜 유틸. 'YYYY-MM-DD' 문자열을 로컬 날짜로 다룬다 (new Date('2026-11-20') 은 UTC 로 해석돼 하루가 밀린다). */

export const pad2 = (n: number) => String(n).padStart(2, '0')

export const toISODate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

export const parseISODate = (s: string | null | undefined): Date | null => {
    if (!s) return null
    const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(s)
    if (!m) return null
    const d = new Date(+m[1]!, +m[2]! - 1, m[3] ? +m[3] : 1, m[4] ? +m[4] : 0, m[5] ? +m[5] : 0, m[6] ? +m[6] : 0)
    return Number.isNaN(d.getTime()) ? null : d
}

export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
export const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)
export const sameDay = (a: Date | null, b: Date | null) => !!a && !!b && toISODate(a) === toISODate(b)
export const diffDays = (a: Date, b: Date) =>
    Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000)

export const startOfWeek = (d: Date, weekStartsOn: 0 | 1) =>
    addDays(d, -((d.getDay() - weekStartsOn + 7) % 7))

/** ISO 8601 주차 (월요일 시작, 1월 4일이 든 주가 1주) */
export const isoWeek = (d: Date): [number, number] => {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    const day = t.getUTCDay() || 7
    t.setUTCDate(t.getUTCDate() + 4 - day)
    const y = t.getUTCFullYear()
    const w = Math.ceil(((t.getTime() - Date.UTC(y, 0, 1)) / 86400000 + 1) / 7)
    return [y, w]
}

export const quarterOf = (d: Date) => Math.floor(d.getMonth() / 3) + 1

/**
 * 서식 토큰: YYYY MM M DD D HH H hh mm ss A(오전/오후) Q ww(ISO 주차) GGGG(ISO 주차의 연도)
 * 대괄호 안 글자는 그대로 둔다. 예) 'YYYY-[W]ww'
 */
export const formatDate = (d: Date, fmt: string): string => {
    const [gy, w] = isoWeek(d)
    const h12 = d.getHours() % 12 || 12
    const map: Record<string, string> = {
        YYYY: String(d.getFullYear()),
        GGGG: String(gy),
        MM: pad2(d.getMonth() + 1),
        M: String(d.getMonth() + 1),
        DD: pad2(d.getDate()),
        D: String(d.getDate()),
        HH: pad2(d.getHours()),
        H: String(d.getHours()),
        hh: pad2(h12),
        mm: pad2(d.getMinutes()),
        ss: pad2(d.getSeconds()),
        A: d.getHours() < 12 ? '오전' : '오후',
        Q: String(quarterOf(d)),
        ww: pad2(w),
    }
    return fmt.replace(/\[([^\]]*)\]|YYYY|GGGG|MM|M|DD|D|HH|H|hh|mm|ss|A|Q|ww/g, (t, lit) => lit ?? map[t] ?? t)
}

/** 달력 한 달 칸 (앞뒤 달 포함 6주 = 42칸) */
export const monthGrid = (year: number, month: number, weekStartsOn: 0 | 1): Date[] => {
    const start = startOfWeek(new Date(year, month, 1), weekStartsOn)
    return Array.from({ length: 42 }, (_, i) => addDays(start, i))
}
