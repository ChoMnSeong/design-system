import { FileUpload } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const fakeUpload = (_file: File, onProgress: (p: number) => void) =>
    new Promise<string>((resolve) => {
        let p = 0
        const t = setInterval(() => {
            p += 12
            onProgress(p)
            if (p >= 100) {
                clearInterval(t)
                resolve('https://example.com/file')
            }
        }, 200)
    })

export const FileUploadPage = () => (
    <>
        <PageHeader title="FileUpload" description="appearance dropzone · button · list. upload 로 진행률을 받고, 거부된 파일은 이유와 함께 목록에 남습니다." />
        <ComponentPreview
            title="dropzone · upload"
            code={`<FileUpload accept=".xlsx,.csv,.pdf,image/*" multiple maxSize={20 * 1024 * 1024} maxFiles={5} upload={uploadToServer} preview />`}
        >
            <div style={{ width: '100%' }}>
                <FileUpload accept=".xlsx,.csv,.pdf,image/*" multiple maxSize={20 * 1024 * 1024} maxFiles={5} upload={fakeUpload} preview />
            </div>
        </ComponentPreview>
        <ComponentPreview
            title="button · list"
            code={`<FileUpload appearance="button" multiple defaultValue={[…]} />`}
        >
            <div style={{ width: '100%' }}>
                <FileUpload
                    appearance="button"
                    multiple
                    defaultValue={[
                        { id: 'a', name: '11월_생산계획.xlsx', size: 1258291, type: '', status: 'done', progress: 100 },
                        { id: 'b', name: '검사성적서_L2611-118.pdf', size: 820000, type: '', status: 'uploading', progress: 64 },
                        { id: 'c', name: '설비영상.mov', size: 48000000, type: '', status: 'error', error: '20MB를 넘어 거부되었습니다' },
                    ]}
                />
            </div>
        </ComponentPreview>
    </>
)
