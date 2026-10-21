---
name: NextCommerce
description: Project playbook for the NextCommerce Persian RTL shop — roadmap phases, rendering-mode map, e-commerce domain rules (products, cart, checkout, orders, wishlist, admin), data-layer contract, design tokens, and the docs/checkpoint protocol. Use for any work in this repo, when continuing a phase or lab, or when updating docs/LEARNING_PROGRESS.md.
---

# NextCommerce

Persian, right-to-left online shop. Resume project **and** learning project.
Rule: **learn first → small lab → write the code → checkpoint.**

## 0. Source of truth

1. `docs/LEARNING_PROGRESS.md` — live status. **Wins on any conflict.**
2. `docs/Next_Commerce_Plan.md` — roadmap. **Stable: edit only when asked.**
3. `docs/SESSION_PROMPT.md` — launcher: what to read and in which order.
4. Real code via `glob`/`grep` — never trust docs about code.
5. This skill — a cache. If it disagrees with the docs, the docs win; fix the skill.

Personal rules (Persian conversation, learn-first loop, simple English in files)
live in the global `~/.config/opencode/AGENTS.md`. Do not copy them here.

## 1. Related global skills (don't duplicate them here)

| Topic | Load |
| --- | --- |
| Next 16 routing, caching, proxy, async APIs | `nextjs` |
| Components, hooks, transitions, optimistic | `react` |
| Types, schemas, result unions | `typescript` |
| Tokens, logical utilities, variants | `tailwindcss` |
| Component library, RTL audit | `shadcn-ui` |
| Query keys, SSR hydration, mutations | `tanstack-query` |
| Persian text, digits, Jalali dates, bidi | `persian-rtl-ui` |
| Commits, branches, PRs | `git-workflow` |
| Pre-commit review | `code-review` |
| Failing build/test/runtime | `debugging` |
| Vitest / Playwright | `testing` |

## 2. Session start

1. Read `AGENTS.md`, then `docs/LEARNING_PROGRESS.md`.
2. From `docs/Next_Commerce_Plan.md` read only §3, §4, the current phase in §5, and §8. Never load the whole file.
3. Verify code state (`src/app`, `src/features`, `src/server/data`, `src/proxy.ts`, `next.config.ts`).
4. First message = 5–10 lines: phase, ready / missing, next step + one proposal + one question. **No code before confirmation.**

## 3. Project specifics

- **Routing map** (do not silently change a mode):

| Route | Mode | Reason |
| --- | --- | --- |
| `/` | SSG | same for everyone, SEO/speed |
| `/blog`, `/about` | SSG | static |
| `/products` | SSR prefetch + CSR | SEO first paint, client filters/infinite scroll |
| `/products/[slug]` | SSG + ISR | prebuilt top products, price/stock refresh |
| `/cart` | CSR + Server Actions | constant changes, instant UI |
| `/checkout` | SSR dynamic | cookies + fresh cart |
| `/account/orders` | SSR dynamic | private |
| `/admin/*` | `proxy.ts` gate | admin only |

- **Golden rule:** all data access through `src/server/data` (`getProducts`, `getProduct(slug)`, `getCart`, `createOrder`). Mock first, Prisma in phase 7 — only the inside changes.
- **Mutations:** `src/server/actions/*.actions.ts` — Zod validate + authorize inside, then call the data layer, then revalidate tags.
- **Money:** integers in Toman; format with `Intl.NumberFormat("fa-IR")`. Totals are always computed server-side.
- **Design:** turquoise + saffron tokens from `globals.css`; dark default; logical RTL utilities only. Details in `references/design-system.md`.
- **Storefront rules:** product cards, cart math, checkout, order status, SEO schema → `references/storefront-patterns.md`.
- **Data contracts + phase-7 migration path:** `references/data-and-state.md`.
- **Repo-specific Next 16 decisions:** `references/next16-rules.md`.

## 4. Screen checklist

1. Rendering mode chosen + one-sentence justification.
2. Loading skeleton, empty state, error state, pending mutation state.
3. RTL audit (logical spacing, flipped directional icons).
4. Both themes readable, tokens only.
5. Mobile-first, 44px touch targets.
6. a11y: semantics, `aria-label`, visible focus, keyboard path.
7. Server component by default; smallest possible client island.
8. SEO: `metadata`/`generateMetadata`, Persian content, product JSON-LD where relevant.
9. Data through `src/server/data`; Zod at the mutation boundary.

## 5. Learn-first loop

- Explain the concept (1–2 paragraphs) before the code.
- Labs outside `src/` (throwaway).
- After implementation: checkpoint — explain in your own words, no notes.
- "Implemented" ≠ "learned". Only the implementation column fills until the checkpoint passes.
- Say it directly when the architecture or approach is weak.

## 6. End of session (mandatory)

- `docs/LEARNING_PROGRESS.md` — continue it, never rewrite; update `Current status`, the phase table (both columns), the done list, the owed review, next steps, the not-done list, and the learning log (topic, real date, proof). English, simple sentences.
- `docs/Next_Commerce_Plan.md` — only if explicitly asked.
- Report changed files + `pnpm lint` / `pnpm build`.
- Package manager: **pnpm**. Don't touch `package-lock.json`.

## 7. References

- `references/design-system.md` — palette values, theme wiring, RTL specifics for this repo.
- `references/storefront-patterns.md` — e-commerce UI/domain rules (product, cart, checkout, orders, admin, SEO).
- `references/data-and-state.md` — data-layer contract, query keys, Server Action shape, Prisma migration path.
- `references/next16-rules.md` — this repo's Next 16 decisions (cacheComponents, proxy, async APIs).
- `references/session-protocol.md` — collaboration contract and doc-update format.
