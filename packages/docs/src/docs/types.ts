import type { RouteId } from '../router/routes'

/** 컴포넌트 문서 한 페이지에 붙는 설명 (사용법 · 구성 · 접근성 · API) */
export type DocMeta = {
    /** API 표를 만들 컴포넌트 이름 (api.json 키). 순서대로 표가 나온다 */
    components: string[]
    /** 사용법 예시 파일의 소스 (`./usage/XxxUsage.tsx?raw`) */
    usage?: string
    /** 하위 컴포넌트가 어떻게 끼워지는지 나무 그림 (├── └──) */
    composition?: string
    /** 구성 아래 짧은 설명 */
    compositionNote?: string
    /** 키보드 · 스크린 리더 동작 */
    a11y?: string[]
    /** 훅 · 함수 (useToast, confirm …) 설명 */
    functions?: Array<{ name: string; signature: string; description: string }>
}

export type DocMetaMap = Partial<Record<RouteId, DocMeta>>
