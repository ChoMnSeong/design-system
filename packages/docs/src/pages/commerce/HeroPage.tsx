import { Button, Hero } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'
import { PICS } from '../shared/commerceDemo'

export const HeroPage = () => (
    <>
        <PageHeader title="Hero" description="큰 배너. 글은 왼쪽 아래에 두고 아래쪽만 어둡게(scrim) 합니다. layout overlay · split · center." />
        <ComponentPreview title="overlay" code={`<Hero media={src} eyebrow="AUTUMN 2026" title="가을, 새로 입는 계절" actions={…} />`}>
            <Hero style={{ width: '100%' }} media={PICS[0]} radius={16} eyebrow="AUTUMN 2026" title="가을, 새로 입는 계절" description="올해 처음 선보이는 아우터 42종" actions={<><Button size="lg">지금 보기</Button><Button size="lg" appearance="outline" tone="neutral" style={{ color: '#fff', borderColor: 'rgb(255 255 255 / .6)' }}>영상 보기</Button></>} />
        </ComponentPreview>
    </>
)
