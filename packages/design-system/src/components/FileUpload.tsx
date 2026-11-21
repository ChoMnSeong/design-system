import {
    useEffect,
    useId,
    useRef,
    useState,
    type CSSProperties,
    type DragEvent,
    type ReactNode,
    type Ref,
} from 'react'
import { IconArrowUp, IconClose } from './icons.js'
import { Button } from './Button.js'
import type { FieldSize } from './types.js'

export type UploadStatus = 'idle' | 'uploading' | 'done' | 'error'

export type UploadFile = {
    id: string
    name: string
    size: number
    type: string
    status: UploadStatus
    /** 0~100 */
    progress?: number
    error?: ReactNode
    /** 서버에 올라간 뒤의 주소 (upload 가 돌려준 값) */
    url?: string
    /** 브라우저에서 고른 원본 */
    file?: File
}

export type RejectReason = 'size' | 'type' | 'count'

export type FileUploadProps = {
    value?: UploadFile[]
    defaultValue?: UploadFile[]
    onValueChange?: (files: UploadFile[]) => void
    /** @deprecated onValueChange 를 쓴다. 받아들인 원본 File 만 넘어간다 */
    onChange?: (files: File[]) => void
    accept?: string
    multiple?: boolean
    /** 바이트 */
    maxSize?: number
    maxFiles?: number
    disabled?: boolean
    invalid?: boolean
    placeholder?: ReactNode
    description?: ReactNode
    /** dropzone: 끌어다 놓는 영역 · button: 첨부 버튼 · list: 버튼 없이 목록만 */
    appearance?: 'dropzone' | 'button' | 'list'
    /** 받아들이지 않은 파일. 목록에도 오류로 남는다 */
    onReject?: (file: File, reason: RejectReason) => void
    /** 파일 하나를 올린다. onProgress(0~100) 로 진행률을 알리고, 끝나면 url 을 돌려준다 */
    upload?: (file: File, onProgress: (percent: number) => void) => Promise<string | void>
    /** 이미지 파일은 썸네일을 보인다 */
    preview?: boolean
    onRemove?: (file: UploadFile) => void
    size?: FieldSize
    style?: CSSProperties
    ref?: Ref<HTMLInputElement>
}

export const formatBytes = (n: number): string => {
    if (n < 1024) return `${n} B`
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
    return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

const extOf = (name: string) => (name.split('.').pop() ?? '').slice(0, 4).toUpperCase()
const EXT_TONE: Record<string, string> = {
    XLSX: 'success', XLS: 'success', CSV: 'success',
    PDF: 'danger',
    DOC: 'info', DOCX: 'info', HWP: 'info',
    PNG: 'accent', JPG: 'accent', JPEG: 'accent', GIF: 'accent', WEBP: 'accent', SVG: 'accent',
}

const matchesAccept = (file: File, accept?: string) => {
    if (!accept) return true
    const name = file.name.toLowerCase()
    return accept
        .split(',')
        .map((a) => a.trim().toLowerCase())
        .some((a) =>
            a.startsWith('.')
                ? name.endsWith(a)
                : a.endsWith('/*')
                  ? file.type.startsWith(a.slice(0, -1))
                  : file.type === a,
        )
}

let seq = 0

export const FileUpload = ({
    value: valueProp,
    defaultValue = [],
    onValueChange,
    onChange,
    accept,
    multiple,
    maxSize,
    maxFiles,
    disabled,
    invalid,
    placeholder,
    description,
    appearance = 'dropzone',
    onReject,
    upload,
    preview,
    onRemove,
    size = 'md',
    style,
    ref,
}: FileUploadProps) => {
    const [inner, setInner] = useState<UploadFile[]>(defaultValue)
    const files = valueProp ?? inner
    const latest = useRef(files)
    latest.current = files
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [over, setOver] = useState(false)
    const descId = useId()
    const [thumbs, setThumbs] = useState<Record<string, string>>({})

    useEffect(() => () => Object.values(thumbs).forEach((u) => URL.revokeObjectURL(u)), [thumbs])

    const commit = (next: UploadFile[]) => {
        latest.current = next
        if (valueProp === undefined) setInner(next)
        onValueChange?.(next)
    }
    const patch = (id: string, p: Partial<UploadFile>) =>
        commit(latest.current.map((f) => (f.id === id ? { ...f, ...p } : f)))

    const reasonText = (r: RejectReason) =>
        r === 'size' && maxSize
            ? `${formatBytes(maxSize)}를 넘어 거부되었습니다`
            : r === 'type'
              ? '허용하지 않는 형식입니다'
              : `최대 ${maxFiles}개까지 올릴 수 있습니다`

    const add = (list: FileList | File[]) => {
        if (disabled) return
        const incoming = Array.from(list)
        const accepted: File[] = []
        const entries: UploadFile[] = []
        let count = multiple ? latest.current.filter((f) => f.status !== 'error').length : 0
        for (const file of incoming) {
            const reason: RejectReason | null =
                !matchesAccept(file, accept)
                    ? 'type'
                    : maxSize && file.size > maxSize
                      ? 'size'
                      : maxFiles && count >= maxFiles
                        ? 'count'
                        : null
            const id = `f${++seq}`
            if (reason) {
                onReject?.(file, reason)
                entries.push({ id, name: file.name, size: file.size, type: file.type, status: 'error', error: reasonText(reason), file })
                continue
            }
            count++
            accepted.push(file)
            entries.push({ id, name: file.name, size: file.size, type: file.type, status: upload ? 'uploading' : 'idle', progress: upload ? 0 : undefined, file })
            if (preview && file.type.startsWith('image/')) {
                setThumbs((t) => ({ ...t, [id]: URL.createObjectURL(file) }))
            }
        }
        commit(multiple ? [...latest.current, ...entries] : entries.slice(-1))
        if (accepted.length) onChange?.(accepted)
        if (upload) {
            for (const e of entries) {
                if (e.status !== 'uploading' || !e.file) continue
                upload(e.file, (p) => patch(e.id, { progress: Math.max(0, Math.min(100, p)) }))
                    .then((url) => patch(e.id, { status: 'done', progress: 100, url: url || undefined }))
                    .catch((err) => patch(e.id, { status: 'error', error: err instanceof Error ? err.message : '업로드에 실패했습니다' }))
            }
        }
    }

    const remove = (f: UploadFile) => {
        commit(latest.current.filter((x) => x.id !== f.id))
        onRemove?.(f)
    }

    const onDrop = (e: DragEvent) => {
        e.preventDefault()
        setOver(false)
        if (e.dataTransfer.files.length) add(e.dataTransfer.files)
    }

    const hint =
        description ??
        [accept?.replace(/\./g, '').replace(/,\s*/g, ', '), maxSize && `최대 ${formatBytes(maxSize)}`, maxFiles && `${maxFiles}개까지`]
            .filter(Boolean)
            .join(' · ')

    const input = (
        <input
            ref={(n) => {
                inputRef.current = n
                if (typeof ref === 'function') ref(n)
                else if (ref) (ref as { current: HTMLInputElement | null }).current = n
            }}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            aria-describedby={hint ? descId : undefined}
            data-ds-sr-only=""
            tabIndex={-1}
            onChange={(e) => {
                if (e.target.files) add(e.target.files)
                e.target.value = ''
            }}
        />
    )

    return (
        <div data-ds-upload="" data-size={size} style={style}>
            {input}
            {appearance === 'dropzone' && (
                <div
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    aria-disabled={disabled || undefined}
                    aria-describedby={hint ? descId : undefined}
                    data-slot="drop"
                    data-over={over ? '' : undefined}
                    data-invalid={invalid ? '' : undefined}
                    data-disabled={disabled ? '' : undefined}
                    onClick={() => inputRef.current?.click()}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            inputRef.current?.click()
                        }
                    }}
                    onDragOver={(e) => {
                        e.preventDefault()
                        if (!disabled) setOver(true)
                    }}
                    onDragLeave={() => setOver(false)}
                    onDrop={onDrop}
                >
                    <span data-slot="icon" aria-hidden>
                        <IconArrowUp size={20} />
                    </span>
                    <b>
                        {over
                            ? '여기에 놓으면 업로드'
                            : (placeholder ?? (
                                  <>
                                      파일을 끌어오거나 <u>선택</u>
                                  </>
                              ))}
                    </b>
                    {hint && (
                        <span id={descId} data-slot="hint">
                            {hint}
                        </span>
                    )}
                </div>
            )}
            {appearance === 'button' && (
                <div data-slot="button-row">
                    <Button
                        appearance="outline"
                        tone="neutral"
                        size={size}
                        disabled={disabled}
                        iconLeft={<IconArrowUp size={16} />}
                        onClick={() => inputRef.current?.click()}
                    >
                        {placeholder ?? '파일 첨부'}
                    </Button>
                    {hint && (
                        <span id={descId} data-slot="hint">
                            {hint}
                        </span>
                    )}
                </div>
            )}
            {files.length > 0 && (
                <ul data-slot="list" aria-label="첨부 파일">
                    {files.map((f) => {
                        const ext = extOf(f.name)
                        return (
                            <li key={f.id} data-slot="item" data-status={f.status}>
                                {thumbs[f.id] ? (
                                    <img data-slot="thumb" src={thumbs[f.id]} alt="" />
                                ) : (
                                    <span data-slot="ext" data-tone={f.status === 'error' ? 'neutral' : (EXT_TONE[ext] ?? 'neutral')} aria-hidden>
                                        {ext || 'FILE'}
                                    </span>
                                )}
                                <span data-slot="meta">
                                    <b title={f.name}>{f.name}</b>
                                    {f.status === 'uploading' ? (
                                        <span
                                            data-slot="bar"
                                            role="progressbar"
                                            aria-label={`${f.name} 업로드`}
                                            aria-valuenow={f.progress ?? 0}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        >
                                            <span style={{ width: `${f.progress ?? 0}%` }} />
                                        </span>
                                    ) : f.status === 'error' ? (
                                        <span data-slot="err" role="alert">{f.error ?? '실패'}</span>
                                    ) : (
                                        <span data-slot="sub">
                                            {formatBytes(f.size)}
                                            {f.status === 'done' ? ' · 완료' : ''}
                                        </span>
                                    )}
                                </span>
                                {f.status === 'uploading' && <span data-slot="pct">{Math.round(f.progress ?? 0)}%</span>}
                                {f.status === 'done' && <span data-slot="done">완료</span>}
                                {!disabled && (
                                    <button type="button" data-slot="remove" aria-label={`${f.name} 목록에서 제거`} onClick={() => remove(f)}>
                                        <IconClose size={16} />
                                    </button>
                                )}
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
