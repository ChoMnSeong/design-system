import { Button, Media, Price, Rail } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { PICS, NAMES } from '../shared/commerceDemo'

export const RailPage = () => (
    <>
        <PageHeader title="Rail" description="가로로 넘기는 상품 줄. 다음 칸이 살짝 비쳐 넘길 수 있다는 걸 알려 줍니다." />
        <ComponentPreview title="title · action · peek" description="상품명은 2줄로 자르고, 정가가 없어도 그 줄을 비워 두어(reserveListRow) 모든 카드의 가격 위치와 높이를 맞춥니다." code={`<Rail style={{ width: '100%' }} title="지금 가장 많이 본" subtitle="오늘 09시 기준" action={<a>전체 보기</a>} peek={0.3}>…</Rail>`}>
            <Rail style={{ width: '100%' }} title="지금 가장 많이 본" subtitle="오늘 09시 기준" arrows action={<Button size="sm" appearance="link" tone="neutral">전체 보기</Button>}>
                {PICS.map((p, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <Media src={p} alt={NAMES[i]!} ratio="3/4" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 2px' }}>
                            <span style={{ fontSize: 13, lineHeight: 1.4, height: '2.8em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', color: 'var(--ds-color-foreground-secondary)' }}>{i === 2 ? '와이드 데님 팬츠 · 원턱 세미 와이드 핏 (인디고 블루)' : NAMES[i]}</span>
                            <Price value={[62300, 129000, 59000, 89000, 45000, 79000][i]!} listPrice={i % 2 ? undefined : 89000 + i * 1000} size="sm" reserveListRow />
                        </div>
                    </div>
                ))}
            </Rail>
        </ComponentPreview>
    </>
)
