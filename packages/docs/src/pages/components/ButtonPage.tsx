import { Fragment, useState } from 'react'
import {
    Button,
    IconArrowDown,
    IconChevronDown,
    IconMoreHorizontal,
    IconPlus,
    type ButtonAppearance,
    type Tone,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const APPEARANCES: ButtonAppearance[] = ['solid', 'soft', 'outline', 'ghost']
const TONES: Array<[Tone, string]> = [
    ['accent', '저장'],
    ['neutral', '조회'],
    ['success', '승인'],
    ['warning', '보류'],
    ['danger', '삭제'],
    ['info', '상세'],
]

const grid = {
    display: 'grid',
    gridTemplateColumns: '72px repeat(6, max-content)',
    gap: '10px 12px',
    alignItems: 'center',
} as const

const label = {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--ds-color-foreground-tertiary)',
} as const

export const ButtonPage = () => {
    const [bold, setBold] = useState(true)
    return (
        <>
            <PageHeader
                title="Button"
                description="appearance(solid · soft · outline · ghost · link) × tone(6) 조합. size 4단계, pill·square 모양, 로딩·선택·배지·단축키·확인·툴팁을 prop 으로 지원합니다."
            />

            <ComponentPreview
                title="Appearance × Tone"
                description="강조색 채움(solid accent)은 화면의 주 동작 하나에만 씁니다. 나머지 톤은 의미가 있을 때만 고릅니다."
                code={`<Button>저장</Button>
<Button appearance="soft" tone="neutral">조회</Button>
<Button appearance="outline" tone="danger">삭제</Button>
<Button appearance="ghost" tone="info">상세</Button>
<Button appearance="link" tone="accent">이력</Button>`}
            >
                <div style={grid}>
                    <span />
                    {TONES.map(([t]) => (
                        <span key={t} style={label}>
                            {t}
                        </span>
                    ))}
                    {APPEARANCES.map((a) => (
                        <Fragment key={a}>
                            <span style={label}>
                                {a}
                            </span>
                            {TONES.map(([t, text]) => (
                                <Button key={`${a}-${t}`} appearance={a} tone={t}>
                                    {text}
                                </Button>
                            ))}
                        </Fragment>
                    ))}
                    <span style={label}>link</span>
                    {TONES.map(([t]) => (
                        <Button key={`link-${t}`} appearance="link" tone={t}>
                            이력
                        </Button>
                    ))}
                </div>
            </ComponentPreview>

            <ComponentPreview
                title="linkStyle"
                code={`<Button appearance="link">밑줄</Button>
<Button appearance="link" linkStyle="hover">hover 밑줄</Button>
<Button appearance="link" linkStyle="arrow">전체 보기</Button>
<Button appearance="link" linkStyle="external">도움말</Button>`}
            >
                <Button appearance="link">밑줄</Button>
                <Button appearance="link" linkStyle="hover">
                    hover 밑줄
                </Button>
                <Button appearance="link" linkStyle="arrow">
                    전체 보기
                </Button>
                <Button appearance="link" linkStyle="external">
                    도움말
                </Button>
            </ComponentPreview>

            <ComponentPreview
                title="Size"
                description="xs 24 · sm 28 · md 36 · lg 44"
                code={`<Button size="xs">xs</Button>
<Button size="sm">sm</Button>
<Button size="md">md</Button>
<Button size="lg">lg</Button>`}
            >
                <Button size="xs">xs 24</Button>
                <Button size="sm">sm 28</Button>
                <Button size="md">md 36</Button>
                <Button size="lg">lg 44</Button>
            </ComponentPreview>

            <ComponentPreview
                title="Shape · Icon"
                code={`<Button appearance="soft" shape="pill">pill</Button>
<Button iconOnly aria-label="추가" iconLeft={<IconPlus />} />
<Button iconLeft={<IconArrowDown />}>내려받기</Button>
<Button appearance="outline" tone="neutral" iconRight={<IconChevronDown />}>더보기</Button>`}
            >
                <Button appearance="soft" shape="pill">
                    pill
                </Button>
                <Button
                    appearance="soft"
                    shape="pill"
                    size="sm"
                    iconOnly
                    aria-label="추가"
                    iconLeft={<IconPlus size={16} />}
                />
                <Button iconOnly aria-label="추가" iconLeft={<IconPlus size={18} />} />
                <Button
                    appearance="outline"
                    tone="neutral"
                    iconOnly
                    aria-label="더보기"
                    iconLeft={<IconMoreHorizontal size={18} />}
                />
                <Button iconLeft={<IconArrowDown size={16} />}>내려받기</Button>
                <Button
                    appearance="outline"
                    tone="neutral"
                    iconRight={<IconChevronDown size={16} />}
                >
                    더보기
                </Button>
            </ComponentPreview>

            <ComponentPreview
                title="State"
                description="loading 은 색을 유지하고 문구만 바꿉니다. selected 는 aria-pressed 로 나갑니다."
                code={`<Button loading loadingText="저장 중…">저장</Button>
<Button disabled>저장</Button>
<Button appearance="outline" tone="neutral" selected={bold} onClick={() => setBold(!bold)}>굵게</Button>
<Button appearance="outline" tone="neutral" badge={3}>알림</Button>
<Button appearance="outline" tone="neutral" shortcut="Ctrl S">저장</Button>`}
            >
                <Button loading loadingText="저장 중…">
                    저장
                </Button>
                <Button disabled>저장</Button>
                <Button appearance="outline" tone="danger" disabled>
                    삭제
                </Button>
                <Button
                    appearance="outline"
                    tone="neutral"
                    selected={bold}
                    onClick={() => setBold(!bold)}
                >
                    굵게
                </Button>
                <Button appearance="outline" tone="neutral" badge={3}>
                    알림
                </Button>
                <Button appearance="outline" tone="neutral" shortcut="Ctrl S">
                    저장
                </Button>
            </ComponentPreview>

            <ComponentPreview
                title="fullWidth"
                code={`<Button fullWidth>전체 너비</Button>`}
            >
                <div style={{ width: '100%' }}>
                    <Button fullWidth>전체 너비</Button>
                </div>
            </ComponentPreview>

            <ComponentPreview
                title="confirm · tooltip"
                description="confirm 이 있으면 누를 때 확인 대화상자를 먼저 띄우고, 확인해야 onClick 이 실행됩니다."
                code={`<Button
    appearance="soft"
    tone="danger"
    confirm={{ title: '작업지시 3건을 삭제할까요?', description: '투입 자재 이력도 삭제됩니다.' }}
    onClick={remove}
>
    삭제
</Button>
<Button appearance="outline" tone="neutral" iconOnly tooltip="엑셀로 내보내기" iconLeft={<IconArrowDown />} />`}
            >
                <Button
                    appearance="soft"
                    tone="danger"
                    confirm={{
                        title: '작업지시 3건을 삭제할까요?',
                        description: '투입 자재 이력도 삭제됩니다.',
                    }}
                >
                    삭제
                </Button>
                <Button
                    appearance="outline"
                    tone="neutral"
                    iconOnly
                    tooltip="엑셀로 내보내기"
                    iconLeft={<IconArrowDown size={18} />}
                />
            </ComponentPreview>

            <ComponentPreview
                title="variant (제거 예정)"
                description="기존 variant 는 계속 동작하지만 appearance + tone 으로 옮겨 주세요. primary → solid·accent, secondary → outline·neutral, ghost → ghost·neutral, success/warning/danger → solid·해당 톤."
                code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>`}
            >
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
            </ComponentPreview>
        </>
    )
}
