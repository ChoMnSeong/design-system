# ensnif design-system

`@ensnif/design-system` 라이브러리와 문서 사이트를 담은 저장소입니다. ensnif 모노레포(`packages/design-system`, `packages/design-system-docs`)에서 커밋 기록을 유지한 채 분리했습니다.

| 경로 | 패키지 | 설명 |
| --- | --- | --- |
| `packages/design-system` | `@ensnif/design-system` | 토큰·테마·Provider·React 컴포넌트 (npm 배포) |
| `packages/docs` | `design-system-docs` | 문서 사이트 (Vite SPA, Vercel 배포) |

```sh
pnpm install
pnpm dev          # 문서 사이트 (http://localhost:5180)
pnpm build        # 라이브러리 빌드 → packages/design-system/dist
pnpm build:docs   # 문서 사이트 빌드 → packages/docs/dist
```

문서 사이트는 Vite alias로 `packages/design-system/src`를 직접 불러오므로 라이브러리를 따로 빌드하지 않아도 됩니다.

다른 저장소(ensnif 등)는 npm에 배포된 `@ensnif/design-system`을 버전으로 받아 씁니다. 라이브러리를 고친 뒤 `version`을 올리고 `pnpm publish:ds`로 배포하세요.
