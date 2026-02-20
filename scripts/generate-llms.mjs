#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const CONFIG = {
  owner: process.env.SOURCE_OWNER ?? "TanStack",
  repo: process.env.SOURCE_REPO ?? "query",
  branch: process.env.SOURCE_BRANCH ?? "main",
  docsPrefix: normalizeDocsPrefix(process.env.DOCS_PREFIX ?? "docs/framework/react"),
  outputFile: process.env.OUTPUT_FILE ?? "llms.txt",
  concurrency: Math.max(1, Number.parseInt(process.env.FETCH_CONCURRENCY ?? "8", 10)),
};

const ghToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

const apiHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "tanstck-query-llms-txt-auto-update",
  ...(ghToken ? { Authorization: `Bearer ${ghToken}` } : {}),
};

const rawHeaders = {
  "User-Agent": "tanstck-query-llms-txt-auto-update",
  ...(ghToken ? { Authorization: `Bearer ${ghToken}` } : {}),
};

async function main() {
  console.log(
    `Collecting Markdown files from https://github.com/${CONFIG.owner}/${CONFIG.repo}/tree/${CONFIG.branch}/${CONFIG.docsPrefix}`
  );

  const docPaths = await fetchDocPaths();
  if (docPaths.length === 0) {
    throw new Error(`No Markdown files found under "${CONFIG.docsPrefix}".`);
  }

  console.log(`Found ${docPaths.length} files. Downloading content...`);
  const docs = await mapWithConcurrency(docPaths, CONFIG.concurrency, async (path) => {
    const rawUrl = buildRawUrl(path);
    const sourceUrl = buildSourceUrl(path);
    const content = await fetchText(rawUrl, rawHeaders);
    return {
      path,
      rawUrl,
      sourceUrl,
      content: normalizeNewlines(content).trimEnd(),
    };
  });

  const output = buildLlmsTxt(docs);
  await mkdir(dirname(CONFIG.outputFile), { recursive: true });
  await writeFile(CONFIG.outputFile, output, "utf8");
  console.log(`Wrote ${CONFIG.outputFile}`);
}

function normalizeDocsPrefix(value) {
  return value.replace(/^\/+|\/+$/g, "");
}

function normalizeNewlines(value) {
  return value.replace(/\r\n/g, "\n");
}

function buildRawUrl(path) {
  return `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${path}`;
}

function buildSourceUrl(path) {
  return `https://github.com/${CONFIG.owner}/${CONFIG.repo}/blob/${CONFIG.branch}/${path}`;
}

function buildTreeUrl() {
  return `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/git/trees/${encodeURIComponent(
    CONFIG.branch
  )}?recursive=1`;
}

function isMarkdownPath(path) {
  return path.startsWith(`${CONFIG.docsPrefix}/`) && /\.(md|mdx)$/i.test(path);
}

async function fetchDocPaths() {
  const tree = await fetchJson(buildTreeUrl(), apiHeaders);
  if (!Array.isArray(tree.tree)) {
    throw new Error("Unexpected GitHub API response: missing tree array.");
  }

  return tree.tree
    .filter((node) => node.type === "blob" && typeof node.path === "string" && isMarkdownPath(node.path))
    .map((node) => node.path)
    .sort((a, b) => a.localeCompare(b));
}

function buildLlmsTxt(docs) {
  const lines = [
    "# TanStack Query React Docs",
    "",
    "This file is auto-generated for LLM ingestion.",
    `Source: https://github.com/${CONFIG.owner}/${CONFIG.repo}/tree/${CONFIG.branch}/${CONFIG.docsPrefix}`,
    "",
    "## File Index",
    ...docs.map((doc) => `- ${doc.path} | ${doc.sourceUrl}`),
    "",
    "## Content",
    "",
  ];

  for (const doc of docs) {
    lines.push(`### ${doc.path}`);
    lines.push(`SOURCE_URL: ${doc.sourceUrl}`);
    lines.push(`RAW_URL: ${doc.rawUrl}`);
    lines.push("");
    lines.push(doc.content.length > 0 ? doc.content : "(empty file)");
    lines.push("");
  }

  return `${lines.join("\n").trim()}\n`;
}

async function fetchJson(url, headers) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}: ${await safeErrorBody(response)}`);
  }
  return response.json();
}

async function fetchText(url, headers) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}: ${await safeErrorBody(response)}`);
  }
  return response.text();
}

async function safeErrorBody(response) {
  try {
    const text = await response.text();
    return text.slice(0, 200).replace(/\s+/g, " ");
  } catch {
    return "unable to read response body";
  }
}

async function mapWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;

  async function consume() {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) {
        return;
      }
      results[index] = await worker(items[index], index);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => consume());
  await Promise.all(workers);
  return results;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
