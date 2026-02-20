<p align="center">
  <img src="assets/llm-logo.png" alt="LLM logo" width="220" />
</p>

<h1 align="center">tanstack-query-llms-txt</h1>

<p align="center">
  Generate <code>llms.txt</code> from TanStack Query React docs and keep it updated automatically.
</p>

<p align="center">
  <a href="README.ko.md"><strong>한국어 문서</strong></a>
</p>

<p align="center">
  <img src="https://github.com/heyman333/tanstack-query-llms-txt/actions/workflows/generate-llms.yml/badge.svg" alt="Generate llms.txt workflow status" />
</p>

## Overview

This project reads TanStack Query React docs (`docs/framework/react`) and generates `llms.txt` at the repository root.  
The file is automatically updated by GitHub Actions.

| Item | Value |
| --- | --- |
| Source docs | `TanStack/query/docs/framework/react` |
| Output file | `llms.txt` (repository root) |
| Schedule | Daily at **09:00 KST** (`00:00 UTC`) |

## Agent Guide

Give this URL to your agent:

- `https://raw.githubusercontent.com/heyman333/tanstack-query-llms-txt/refs/heads/main/llms.txt`

Example instruction:

```text
Use this llms.txt as the TanStack Query React reference:
https://raw.githubusercontent.com/heyman333/tanstack-query-llms-txt/refs/heads/main/llms.txt
```

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
