import { HStack, Image } from '@ensnif/design-system'
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
        <ComponentPreview
            title="preview · caption"
            description="누르거나 Enter 로 크게 봅니다. 열리면 포커스가 창으로 옮겨지고, Esc 로 닫으면 이미지로 돌아옵니다."
            code={`<Image src="..." alt="2라인 현장" width={240} aspectRatio={4 / 3} preview caption="2라인 · 14:00" />`}
        >
            <Image
                src={SITE_PHOTO}
                alt="2라인 현장"
                width={240}
                aspectRatio={4 / 3}
                radius="md"
                preview
                caption="2라인 · 14:00"
            />
        </ComponentPreview>
    </>
)

/** 외부 요청 없는 데모 이미지 */
const SITE_PHOTO =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6f7d6a"/><stop offset="1" stop-color="#2d3529"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/></svg>',
    )
