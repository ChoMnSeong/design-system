import { Fragment } from 'react'
import { Button, IconSearch, Input, Kbd } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const VARIANTS = ['outlined', 'filled', 'underline', 'ghost'] as const

export const InputPage = () => (
    <>
        <PageHeader title="Input" description="size xs 24 · sm 28 · md 36 · lg 44. variant 4종 × default · invalid · readOnly · disabled." />
        <ComponentPreview title="variant × 상태" code={`<Input variant="filled" invalid defaultValue="BR-A0?" />`}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(4, 160px)', gap: 10, alignItems: 'center' }}>
                <span />
                {['default', 'invalid', 'readOnly', 'disabled'].map((s) => (
                    <span key={s} style={{ fontSize: 12, fontWeight: 600, color: 'var(--ds-color-foreground-tertiary)' }}>{s}</span>
                ))}
                {VARIANTS.map((v) => (
                    <Fragment key={v}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ds-color-foreground-tertiary)' }}>{v}</span>
                        <Input variant={v} placeholder="품목코드" aria-label={`${v} 기본`} />
                        <Input variant={v} invalid defaultValue="BR-A0?" aria-label={`${v} 오류`} />
                        <Input variant={v} readOnly defaultValue="BR-A01" aria-label={`${v} 읽기 전용`} />
                        <Input variant={v} disabled placeholder="품목코드" aria-label={`${v} 비활성`} />
                    </Fragment>
                ))}
            </div>
        </ComponentPreview>
        <ComponentPreview title="size" code={`<Input size="xs" /> <Input size="sm" /> <Input /> <Input size="lg" />`}>
            <Input size="xs" defaultValue="xs 24" style={{ width: 110 }} aria-label="xs" />
            <Input size="sm" defaultValue="sm 28" style={{ width: 120 }} aria-label="sm" />
            <Input defaultValue="md 36" style={{ width: 130 }} aria-label="md" />
            <Input size="lg" defaultValue="lg 44" style={{ width: 140 }} aria-label="lg" />
        </ComponentPreview>
        <ComponentPreview
            title="prefix · suffix · clearable · revealable · loading"
            code={`<Input prefix={<IconSearch />} suffix={<Kbd size="xs">/</Kbd>} placeholder="작업지시 검색" />
<Input clearable defaultValue="sales@example.com" />
<Input type="password" defaultValue="secret" />
<Input loading defaultValue="거래처 확인 중" />`}
        >
            <Input prefix={<IconSearch size={16} />} suffix={<Kbd size="xs">/</Kbd>} placeholder="작업지시 검색" aria-label="검색" style={{ width: 200 }} />
            <Input clearable defaultValue="sales@example.com" aria-label="이메일" style={{ width: 200 }} />
            <Input type="password" defaultValue="secret12" aria-label="비밀번호" style={{ width: 150 }} />
            <Input loading defaultValue="거래처 확인 중" aria-label="거래처" style={{ width: 170 }} />
        </ComponentPreview>
        <ComponentPreview
            title="addonBefore · addonAfter"
            description="테두리 밖에 붙는 고정 문구나 버튼."
            code={`<Input addonBefore="https://" defaultValue="erp.local" />
<Input addonAfter="kg" align="right" defaultValue="1,250" />
<Input placeholder="거래처 코드" addonAfter={<Button appearance="outline" tone="neutral">찾기</Button>} />`}
        >
            <Input addonBefore="https://" defaultValue="erp.local" aria-label="주소" style={{ width: 150 }} />
            <Input addonAfter="kg" align="right" defaultValue="1,250" aria-label="중량" style={{ width: 110 }} />
            <Input placeholder="거래처 코드" aria-label="거래처 코드" style={{ width: 150 }} addonAfter={<Button appearance="outline" tone="neutral">찾기</Button>} />
        </ComponentPreview>
        <ComponentPreview
            title="mask · showCount · align"
            code={`<Input mask="bizNo" />
<Input mask="phone" />
<Input maxLength={40} showCount defaultValue="LOT 메모" />
<Input align="right" defaultValue="1,200,000" />`}
        >
            <Input mask="bizNo" aria-label="사업자등록번호" style={{ width: 170 }} />
            <Input mask="phone" aria-label="전화번호" style={{ width: 170 }} />
            <Input maxLength={40} showCount defaultValue="LOT 메모" aria-label="메모" style={{ width: 220 }} />
            <Input align="right" defaultValue="1,200,000" aria-label="금액" style={{ width: 130 }} />
        </ComponentPreview>
    </>
)
