import { useState } from 'react'
import { FileUpload, type UploadFile } from '@ensnif/design-system'

export default function Example() {
    const [files, setFiles] = useState<UploadFile[]>([])
    return (
        <FileUpload
            value={files}
            onValueChange={setFiles}
            accept=".pdf,.xlsx,image/*"
            multiple
            maxSize={10 * 1024 * 1024}
            maxFiles={5}
            preview
        />
    )
}
