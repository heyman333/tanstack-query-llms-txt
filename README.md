# tanstack-query-llms-txt

TanStack Query React 문서(`docs/framework/react`)의 Markdown 파일을 읽어 `llms.txt`를 루트에 생성하고, GitHub Actions로 자동 갱신합니다.

## 동작 방식

1. `scripts/generate-llms.mjs`가 GitHub에서 문서 트리를 조회합니다.
2. Markdown(`.md`, `.mdx`) 파일을 모아 `llms.txt`를 생성합니다.
3. `.github/workflows/generate-llms.yml`이 스케줄 또는 수동 실행으로 `llms.txt`를 업데이트하고 변경 시 커밋합니다.

## 생성 파일 위치

- 레포지토리: `https://github.com/heyman333/tanstack-query-llms-txt`
- 브랜치: `main`
- 파일 경로: `llms.txt` (레포 루트)

즉, `Generate llms.txt` 액션이 성공하면 위 레포의 메인 경로에 `llms.txt`가 커밋됩니다.

## 로컬 실행

```bash
npm run generate:llms
```

생성 결과:

- `llms.txt` (저장소 루트)
