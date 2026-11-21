import {
    Divider,
    HStack,
    Spacer,
    Stack,
    VStack,
    Tag,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const DividerPage = () => (
    <>
        <PageHeader
            title="Divider"
            description="섹션 구분선. horizontal/vertical, label 옵션."
        />

        <ComponentPreview
            title="기본"
            code={`<Divider inset />`}
        >
            <div style={{ width: '100%', maxWidth: '480px' }}>
                <p
                    style={{
                        margin: 0,
                        fontSize: '13px',
                        color: 'var(--ds-color-foreground-secondary)',
                    }}
                >
                    위쪽 컨텐츠
                </p>
                <Divider inset />
                <p
                    style={{
                        margin: 0,
                        fontSize: '13px',
                        color: 'var(--ds-color-foreground-secondary)',
                    }}
                >
                    아래쪽 컨텐츠
                </p>
            </div>
        </ComponentPreview>

        <ComponentPreview
            title="With label"
            code={`<Divider label="Or" />`}
        >
            <div style={{ width: '100%', maxWidth: '480px' }}>
                <Divider label="Or" />
            </div>
        </ComponentPreview>

        <ComponentPreview
            title="Vertical"
            code={`<Divider orientation="vertical" style={{ height: '20px' }} />`}
        >
            <HStack gap={16} align="center">
                <span style={{ fontSize: '13px' }}>Left</span>
                <Divider orientation="vertical" style={{ height: '20px' }} />
                <span style={{ fontSize: '13px' }}>Middle</span>
                <Divider orientation="vertical" style={{ height: '20px' }} />
                <span style={{ fontSize: '13px' }}>Right</span>
            </HStack>
        </ComponentPreview>
    </>
)

export const StackPage = () => (
    <>
        <PageHeader
            title="Stack / Spacer"
            description="VStack(세로) / HStack(가로) 레이아웃 도우미. Spacer로 빈 공간 채움."
        />

        <ComponentPreview
            title="VStack / HStack"
            code={`<HStack gap={12}><Tag>A</Tag><Tag>B</Tag></HStack>`}
        >
            <Stack gap={20} style={{ width: '100%' }}>
                <HStack gap={8}>
                    <Tag>Tag</Tag>
                    <Tag>Another</Tag>
                    <Tag>Item</Tag>
                </HStack>
                <VStack gap={4} align="flex-start">
                    <Tag>Top</Tag>
                    <Tag>Middle</Tag>
                    <Tag>Bottom</Tag>
                </VStack>
            </Stack>
        </ComponentPreview>

        <ComponentPreview
            title="Spacer (auto fill)"
            code={`<HStack>
    <Tag>Left</Tag>
    <Spacer />
    <Tag tone="accent">Right</Tag>
</HStack>`}
        >
            <HStack
                gap={8}
                align="center"
                style={{
                    width: '100%',
                    padding: '10px',
                    background: 'var(--ds-color-background-inset)',
                    borderRadius: 'var(--ds-radius-md)',
                }}
            >
                <Tag>Left</Tag>
                <Spacer />
                <Tag tone="accent">Right</Tag>
            </HStack>
        </ComponentPreview>
    </>
)

