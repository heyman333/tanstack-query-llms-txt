# tanstck-query-llms-txt-auto-update

TanStack Query React 문서(`docs/framework/react`)의 Markdown 파일을 읽어 `llms.txt`를 루트에 생성하고, GitHub Actions로 자동 갱신/배포합니다.

## 동작 방식

1. `scripts/generate-llms.mjs`가 GitHub에서 문서 트리를 조회합니다.
2. Markdown(`.md`, `.mdx`) 파일을 모아 `llms.txt`를 생성합니다.
3. `.github/workflows/generate-llms.yml`이 스케줄 또는 수동 실행으로 `llms.txt`를 업데이트하고 변경 시 커밋합니다.
4. `.github/workflows/deploy-pages.yml`이 `llms.txt`를 GitHub Pages 루트(`/llms.txt`)로 배포합니다.

## 로컬 실행

```bash
npm run generate:llms
```

생성 결과:

- `llms.txt` (저장소 루트)

## GitHub Pages

GitHub 저장소에서 `Settings > Pages > Source`를 `GitHub Actions`로 설정하면 배포 워크플로우가 동작합니다.
