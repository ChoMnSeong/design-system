import { Calendar } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const PROD: Record<number, string> = { 2: '11.8k', 3: '12.1k', 4: '12.4k', 5: '9.2k', 6: '12.6k', 9: '12.0k', 10: '12.3k', 11: '11.1k', 12: '12.5k', 13: '12.7k', 16: '12.2k', 17: '12.6k', 18: '12.9k', 19: '12.4k', 20: '9.2k' }

export const CalendarPage = () => (
    <>
        <PageHeader title="Calendar" description="mode single · range · multiple, renderDay, holidays, numberOfMonths. 방향키 · PageUp/Down · Home/End 로 이동합니다." />
        <ComponentPreview
            title="renderDay · holidays · showToday"
            code={`<Calendar defaultValue="2026-11-20" showToday cellHeight={46}
    holidays={['2026-11-11']}
    renderDay={(d, st) => d.getMonth() === 10 && PROD[d.getDate()] && <span data-slot="sub">{PROD[d.getDate()]}</span>} />`}
        >
            <div style={{ width: 420 }}>
                <Calendar
                    defaultValue="2026-11-20"
                    showToday
                    cellHeight={46}
                    holidays={['2026-11-11']}
                    renderDay={(d, st) =>
                        d.getMonth() === 10 && PROD[d.getDate()] ? (
                            <span data-slot="sub" style={{ fontSize: 11, color: st.selected ? 'inherit' : d.getDate() === 5 ? 'var(--ds-tone-danger-text)' : 'var(--ds-color-foreground-tertiary)' }}>
                                {PROD[d.getDate()]}
                            </span>
                        ) : null
                    }
                />
            </div>
        </ComponentPreview>
        <ComponentPreview title="range · 2개월" code={`<Calendar mode="range" numberOfMonths={2} defaultValue={['2026-11-16', '2026-11-20']} />`}>
            <Calendar mode="range" numberOfMonths={2} defaultValue={['2026-11-16', '2026-11-20']} />
        </ComponentPreview>
        <ComponentPreview title="multiple" code={`<Calendar mode="multiple" defaultValue={['2026-11-03', '2026-11-10']} />`}>
            <div style={{ width: 300 }}>
                <Calendar mode="multiple" defaultValue={['2026-11-03', '2026-11-10', '2026-11-17']} />
            </div>
        </ComponentPreview>
    </>
)
