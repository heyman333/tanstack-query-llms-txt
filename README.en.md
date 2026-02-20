<p align="center">
  <img src="assets/llm-logo.png" alt="LLM logo" width="220" />
</p>

# tanstack-query-llms-txt

Korean version: [README.ko.md](README.ko.md)

This project reads TanStack Query React docs (`docs/framework/react`) and generates `llms.txt` at the repository root.  
The file is automatically updated by GitHub Actions.

## Overview

| Item | Value |
| --- | --- |
| Source docs | `TanStack/query/docs/framework/react` |
| Output file | `llms.txt` (repository root) |
| Schedule | Daily at **09:00 KST** (`00:00 UTC`) |

## Schedule

- Runs every day at **09:00 KST** (`00:00 UTC`).

## How it works

1. `scripts/generate-llms.mjs` fetches the docs tree from GitHub.
2. It collects Markdown files (`.md`, `.mdx`) and builds `llms.txt`.
3. `.github/workflows/generate-llms.yml` runs on schedule or manually, then commits `llms.txt` if changed.

## Output location

- Repository: `https://github.com/heyman333/tanstack-query-llms-txt`
- Branch: `main`
- File: `llms.txt` (repository root)

When the `Generate llms.txt` action succeeds, `llms.txt` is committed to the root of `main`.

## Run locally

```bash
npm run generate:llms
```

Generated file:

- `llms.txt` (repository root)
