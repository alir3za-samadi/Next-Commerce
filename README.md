# NextCommerce

A Persian, right-to-left online shop, built step by step with Next.js App Router,
React, TypeScript, and Tailwind CSS v4. The project is a learning project first
and a resume project second.

## Run it locally

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js App Router and React 19
- TypeScript and Tailwind CSS v4
- shadcn/ui with RTL support
- TanStack Query for server state
- next-themes, Zod, and Lucide

## Structure

- `src/app` — layout and routes
- `src/components` — shared components, providers, and UI
- `src/features` — domain features of the shop
- `src/lib` — helpers and the query client
- `src/server` — data layer and Server Actions

## Docs

- [Next_Commerce_Plan.md](./docs/Next_Commerce_Plan.md) — the roadmap
- [LEARNING_PROGRESS.md](./docs/LEARNING_PROGRESS.md) — live status and learning log
- [SESSION_PROMPT.md](./docs/SESSION_PROMPT.md) — read order for a new session

Personal working rules live in `~/.config/opencode/AGENTS.md`.
