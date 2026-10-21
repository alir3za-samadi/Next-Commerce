# NextCommerce — Project progress and learning log

This file is updated together with the [project roadmap](./Next_Commerce_Plan.md).
Shipping a feature does not mean I learned it. A checkpoint is complete only when
I can explain the topic in my own words or prove it with an exercise.

## Current status

**Now:** the project skeleton and most of the Phase 0 and Phase 1 infrastructure
are implemented. The next step is to review the Phase 0 and Phase 1 checkpoints.
Phase 2 labs have not started yet.

| Phase | Implementation | Learning / checkpoint |
| --- | --- | --- |
| 0 — Setup and the `onClick` question | Done: Next.js, TypeScript, Tailwind, shadcn/ui, the `src/` layout, and Git are set up. | Needs review: Server/Client Components, hydration, the `"use client"` boundary. Checkpoint not confirmed. |
| 1 — Design system | Mostly done: Persian font, RTL, colors, theme provider, theme toggle. Header and footer still live only on the home page. | Needs a manual check: theme switch, choice kept after reload, no flash, no hydration warning. Checkpoint not confirmed. |
| 2 — SSG / ISR / SSR / CSR | Not started. The home page is built as static today, but the learning lab for this phase has not run. | Compare the modes in Next.js 16 and prove them with labs. |
| 3 — TanStack Query | Dependency, provider, and `getQueryClient()` exist. No query, mutation, or hydration on products yet. | Concepts and checkpoint not done. |
| 4 — React Concurrent | Not started. | Not started. |
| 5 — Server Actions and optimistic UI | Not started. | Not started. |
| 6 — `proxy.ts` and route protection | Not started. | Not started. |
| 7 — SQL and Prisma | Not started; this step is on purpose at the end. | Not started. |
| 8 — Resume polish | Not started. | Not started. |

## Prior knowledge

As I declared before the project started, I know:

- HTML, CSS, and JavaScript
- TypeScript and React
- Next.js
- React Query / TanStack Query
- Tailwind CSS and shadcn/ui

This is my declared background. It does not mean the project checkpoints are passed.

## What has been done in the project

- Project created with Next.js App Router, React, TypeScript, and Tailwind CSS v4.
- shadcn/ui set up with RTL support.
- Git and the first `src/` folders created.
- Home page lives in `src/app/page.tsx`; the extra route group for home was removed.
- Vazirmatn font, `lang="fa"`, `dir="rtl"`, and the turquoise/saffron palette added.
- next-themes set up with dark as the default and a switch to light.
- TanStack Query provider and the first query client setup added; not used for data yet.
- Project checked with `pnpm lint` and `pnpm build`; `/` builds as a static page.
- pnpm build-script permission error for `unrs-resolver` fixed with workspace settings.
- Docs reorganized (2026-10-20): personal rules moved to the global `AGENTS.md`,
  every markdown file is now simple English, and long code samples left the roadmap.

## Learning review I still owe

### First: Phase 0 — Server and Client Components

Without looking at the plan, explain in my own words:

1. Why does `onClick` need code in the browser, and why can it not live in a Server Component?
2. Why does `"use client"` not mean "renders only in the browser"?
3. What do SSR and hydration do inside a Client Component?
4. Why should pages stay Server Components and only the interactive part become a Client Component?
5. How can a Server Component be passed into a Client provider through `children`?
6. What is the difference between `<form action={serverAction}>` and a handler like `onClick`?

**Done when:** I can explain each point with an example from this project,
not just repeat definitions.

### Second: Phase 1 — Theme, CSS variables, and RTL

Review and test:

- How do shadcn theme CSS variables connect to Tailwind utility classes?
- What does `next-themes` change in the DOM with `attribute="class"` and
  `defaultTheme="dark"`? What does `enableSystem={false}` do?
- Why does `<html>` use `suppressHydrationWarning`, and what does it *not* hide or fix?
- Change the theme, reload the page, and check that the choice is kept.
- Check in the browser that the theme change has no visible flash and no hydration warning.
- Know the RTL rules: `dir="rtl"`, logical Tailwind classes, icon direction.

**Done when:** I can explain why each setting exists and I have checked the theme
behavior in my own browser.

## Next steps after the review

1. Review and confirm the Phase 0 and Phase 1 checkpoints.
2. In Phase 2, build small labs with mock data for SSG, ISR, SSR, and CSR. Show a
   timestamp in each one and compare the output in build and production runs.
3. Check `generateStaticParams` and the async dynamic APIs of Next.js 16 in the
   docs of the current version. (`"use cache"` moved to the final stage below.)
4. Write one "I chose this rendering mode because…" sentence for every route.
5. Then start Phase 3 with a simple TanStack Query request and move on to prefetch
   and SSR hydration for the product list.
6. Run phases 4 to 8 in roadmap order. No real database before Phase 7.

## Things not done yet

- Phase 0 and Phase 1 checkpoints (spoken and practical)
- A real manual check of flash, theme persistence, and hydration warnings
- Phase 2 labs and rendering decisions for the pages
- Phase 3 product-list queries and hydration
- Phases 4 to 8: Server Actions, route protection, database, tests, deploy

## Final stage (For Later) — `use cache` (learned outside this project)

This topic left the plan. I learn it in a small throwaway Next.js app, after the
last phase, and not inside NextCommerce. The project keeps one model: `fetch`
cache + `revalidate`.

### Why the directive exists

`fetch` caching only saves network requests. It cannot save the result of a
database query, a heavy calculation, or a rendered Server Component. `"use cache"`
saves that result as a cache entry, and the next request reuses it.

### What happens in the background

- **Cache entry** — the return value (or the rendered output of a component) is serialized and stored.
- **Cache key** — build ID + function ID (a hash of the function's place and signature) + serializable arguments. Variables captured from the outer scope become part of the key too.
- **Nothing per user goes in the key.** Cookies, headers, and the session are read outside the cached scope and passed in as arguments. Read them inside, and one user's data reaches everyone.
- **`cacheLife(profile)`** — sets `stale` (the client router may still show the old copy), `revalidate` (when the server refreshes in the background), and `expire` (when the entry is dropped and the next request waits). Built-in profiles: `default` (5 min / 15 min / never), `seconds`, `minutes`, `hours`, `days`, `weeks`, `max`. No call means `default`.
- **`cacheTag('name')`** — puts labels on the entry.
- **`revalidateTag('name', 'max')`** — marks tagged entries stale. The next request serves stale data and refreshes in the background. The second argument is the window for stale content. The single-argument form is deprecated.
- **`revalidatePath('/path')`** — same idea, but for a page or layout path.
- **`updateTag('name')`** — only in Server Actions. It expires the entry right away, so the next request waits for fresh data (read-your-own-writes).
- **Where the cache lives** — on the server, never in the browser: `.next/cache` on disk when self-hosted, the platform Data Cache on Vercel. With several machines, the cache must be shared, or each machine keeps its own copy.

### What breaks without it

Nothing in this project, and nothing for a normal shop. `fetch` + `revalidate`
covers shared data, and dynamic APIs cover per-request pages. What I lose: no way
to cache a DB result or an expensive render, so every request pays the full cost.
Mixed pages (static shell plus per-user parts) are also harder to split without
`<Suspense>`.

### Labs (throwaway app, not this repo)

1. **Cache entry** — one page shows `Date.now()` from a `"use cache"` function and the same value from outside it. Reload for a minute. The cached one waits for `revalidate`; the other changes on every request. Write down what I saw.
2. **Cache key** — call the same cached function with `slug = "a"` and `slug = "b"`. Two entries appear. Then pass a function as an argument and read the error.
3. **Tag and invalidation** — cache a product list with `cacheTag("products")`. Add a Server Action that changes the data. Run it first without `revalidateTag` (old data stays), then with it.
4. **Profiles** — two pages, `cacheLife("seconds")` and `cacheLife("hours")`. Watch when each one refreshes, and what the build says about both.
5. **Where the cache lives** — `next build && next start`, load the page, stop the server, delete `.next/cache`, start again, compare. Explain why the first request after a fresh build may not touch the cache at all.

### Checkpoint (pass / reject)

Pass only if I can do all of these without notes:

1. Compare `fetch` caching, route `revalidate`, and a `"use cache"` entry.
2. Say what goes into the cache key, and why a function argument breaks it.
3. Say where the entry is stored locally and on Vercel, and what changes with several machines.
4. Explain `stale`, `revalidate`, and `expire` with numbers from my own lab.
5. Explain `revalidateTag` vs `revalidatePath` vs `updateTag`, and when each one is correct.
6. Show one case where reading cookies inside `"use cache"` would leak per-user data.

Reject if an answer is a definition I read, and not a result I saw. The stage
stays open until then.

## Learning log

When I say "I learned this topic", we add an entry here with the topic name, the
real date, and the explanation or exercise I was able to do. Then the phase table
and the not-done list are updated to match. Until the checkpoint passes, an item
is only "implemented", not "learned".

## For later

Topics that were removed from `docs/Next_Commerce_Plan.md` in this change. They
are not dropped, only parked here. They belong to the final stage above and are
learned outside this repo.

1. **Cache Components and the `"use cache"` directive** — removed from §2 (Next.js 16 notes). Includes the `cacheComponents` flag and the idea of opt-in caching.
2. **`"use cache"` + `cacheLife` for ISR-like pages** — removed from Phase 2 (Learn).
