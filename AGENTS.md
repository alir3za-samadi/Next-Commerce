<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## This project

- Stack: Next.js 16.4.2 (App Router, Turbopack), React 19.3, strict TypeScript, Tailwind CSS v4, shadcn/ui, TanStack Query v5, next-themes, Zod, pnpm.
- Persian RTL storefront, dark theme by default, turquoise + saffron palette.
- Personal rules (language, learning loop, answer style) live in the global `~/.config/opencode/AGENTS.md`. This file is only about this repo.
- Playbook: load the `next-commerce` skill before touching routes, data, or docs.
- Live status: `docs/LEARNING_PROGRESS.md`. Stable roadmap: `docs/Next_Commerce_Plan.md`.

## Session start

- `docs/SESSION_PROMPT.md` is injected automatically by `opencode.json` → `instructions`. Follow its order, report before writing code; do not read it again.

## Context budget (always on)

- Window is ~200k. Treat every tool output as a cost: cap at ~250 lines / 2k tokens.
- `grep` before `read`; read with `offset`/`limit`. Never dump lockfiles, build logs, minified files, or whole docs pages.
- Constrain commands: `git diff --stat` first, `... | Select-String "error|failed"`, `... | Select-Object -Last 40`.
- Broad exploration → subagent (returns a summary only). Prefer local `node_modules/*/docs` over web fetches.
- Do not re-read files after editing. One task per session; compact before starting a new large task.
- Truncate noise (duplicates, raw dumps), never requirements or reasoning.
