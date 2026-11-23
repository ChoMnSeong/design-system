import { Button, Media, Price, Rail } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { PICS, NAMES } from '../shared/commerceDemo'

export const RailPage = () => (
    <>
        <PageHeader title="Rail" description="가로로 넘기는 상품 줄. 다음 칸이 살짝 비쳐 넘길 수 있다는 걸 알려 줍니다." />
        <ComponentPreview title="title · action · peek" code={`<Rail style={{ width: '100%' }} title="지금 가장 많이 본" subtitle="오늘 09시 기준" action={<a>전체 보기</a>} peek={0.3}>…</Rail>`}>
            <Rail style={{ width: '100%' }} title="지금 가장 많이 본" subtitle="오늘 09시 기준" arrows action={<Button size="sm" appearance="link" tone="neutral">전체 보기</Button>}>
                {PICS.map((p, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Media src={p} alt={NAMES[i]!} ratio="3/4" />
                        <span style={{ fontSize: 13 }}>{NAMES[i]}</span>
                        <Price value={[62300, 129000, 59000, 89000, 45000, 79000][i]!} listPrice={i % 2 ? undefined : 89000 + i * 1000} size="sm" layout="inline" />
                    </div>
                ))}
            </Rail>
        </ComponentPreview>
    </>
)
