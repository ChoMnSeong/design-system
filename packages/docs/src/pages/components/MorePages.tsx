import {
    HStack,
    Image,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const ImagePage = () => (
    <>
        <PageHeader
            title="Image"
            description="로딩 placeholder + 에러 fallback. width/height/aspectRatio 지원."
        />
        <ComponentPreview
            title="기본"
            code={`<Image src="..." alt="profile" width={120} height={120} />
<Image src="https://broken-url" alt="broken" width={120} height={120} />`}
        >
            <HStack gap={12}>
                <Image
                    src="https://i.pravatar.cc/200?img=12"
                    alt="profile"
                    width={120}
                    height={120}
                    radius="var(--ds-radius-md)"
                />
                <Image
                    src="https://broken-url"
                    alt="broken"
                    width={120}
                    height={120}
                    radius="var(--ds-radius-md)"
                />
            </HStack>
        </ComponentPreview>
        <ComponentPreview
            title="Aspect ratio"
            code={`<Image src="..." alt="banner" width="100%" aspectRatio={16 / 9} />`}
        >
            <Image
                src="https://picsum.photos/seed/lanime/640/360"
                alt="banner"
                width="100%"
                aspectRatio={16 / 9}
                radius="var(--ds-radius-lg)"
                style={{ maxWidth: '480px', display: 'block' }}
            />
        </ComponentPreview>
    </>
)

