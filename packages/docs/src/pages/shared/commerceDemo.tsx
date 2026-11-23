

/** 커머스 부품 문서. 데모용 그라디언트 이미지 (외부 요청 없이) */
export const img = (a: string, b: string, label = '') =>
    `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="800" height="800" fill="url(#g)"/><text x="40" y="760" font-family="sans-serif" font-size="40" fill="rgba(255,255,255,.6)">${label}</text></svg>`)}`

export const PICS = [img('#8a6f5a', '#2f2723', '울 블렌드 코트'), img('#c9b8a6', '#6f5d4e', '캐시미어 니트'), img('#4a5d78', '#1d2736', '와이드 데님'), img('#2b2b2b', '#6b5444', '레더 스니커즈'), img('#b9a089', '#5e4a3a', '미니 숄더백'), img('#6f7d6a', '#2d3529', '패딩 조끼')]

export const NAMES = ['울 블렌드 코트', '캐시미어 니트', '와이드 데님', '레더 스니커즈', '미니 숄더백', '패딩 조끼']

export const Frame = ({ children, h = 420, id }: { children: React.ReactNode; h?: number; id?: string }) => (
    <div id={id} style={{ width: '100%', position: 'relative', height: h, overflow: 'auto', border: '1px solid var(--ds-color-border-subtle)', borderRadius: 12, background: 'var(--ds-surface-page-background, var(--ds-surface-card-background))' }}>{children}</div>
)
