# NextCommerce — E-commerce Project Plan

A resume-ready e-commerce app, built **step by step while learning**.
Rule of the project: **learn first → small lab → write the code myself → checkpoint.**

---

## 1. What we build (brief)

A Persian online shop: product list, product page, cart, wishlist, checkout, orders, and a small admin area.
Dark theme by default, light theme available. Fast pages, instant UI feedback, clean code.

**Why e-commerce is a good resume project:** every company understands it, and it naturally needs every topic I want to learn (caching, SEO, optimistic UI, auth gate, database).

---

## 2. Stack

| Part | Choice |
| --- | --- |
| Language | TypeScript |
| Framework | Next.js 16 (App Router, `src/` folder) + React 19 |
| Styling | Tailwind CSS v4 |
| UI kit | shadcn/ui |
| Server state | TanStack Query v5 (with SSR hydration) |
| Theme | next-themes (`class` mode, default dark) |
| Validation | zod |
| Database (last phase) | PostgreSQL + Prisma |
| Font | Vazirmatn (Persian) |
| Deploy | Vercel |

> Next.js 16 notes (always double-check on nextjs.org/docs):
> - `middleware.ts` is now **`proxy.ts`** (runs on Node.js).
> - `params`, `searchParams`, `cookies()`, `headers()` are **async** (use `await`).
> - Turbopack is the default bundler. Node.js 20.9+ is required.

---

## 3. Pages map (which rendering mode, and why)

| Route | Mode | Why |
| --- | --- | --- |
| `/` (home) | SSG | Same for everyone, best SEO and speed |
| `/blog`, `/about` | SSG | Static content |
| `/products` | SSR prefetch + CSR (TanStack Query) | First page is in HTML (SEO), filters and infinite scroll run on the client |
| `/products/[slug]` | SSG + ISR | Top products pre-built, price/stock refresh every few minutes |
| `/cart` | CSR + Server Actions | Changes all the time, needs instant UI |
| `/checkout` | SSR (dynamic) | Needs cookies and fresh data |
| `/account/orders` | SSR (dynamic) | Private data per user |
| `/admin/*` | Protected by `proxy.ts` | Only for admin users |

---

## 4. Folder structure

```
src/
  app/
    layout.tsx            # html, fonts, providers
    globals.css           # theme colors (section 6)
    (shop)/               # public pages
    (account)/            # private pages
    admin/
    api/                  # route handlers (used by TanStack Query early on)
  components/
    ui/                   # shadcn components
    shared/               # header, footer, theme-toggle...
  features/
    products/ cart/ checkout/ orders/
  lib/
    query/get-query-client.ts
    utils.ts
  server/
    data/                 # data layer: mock first, Prisma later
    actions/              # server actions (*.actions.ts)
  proxy.ts                # runs before routes (src-based = inside src/)
```

**Golden rule:** all data access goes through functions like `getProducts()`, `getProduct(slug)`, `createOrder()` in `src/server/data`.
First they read mock JSON. In the last phase I replace the inside with Prisma, and **nothing else changes**.

---

## 5. Roadmap (in order)

Each phase = **Learn → Lab → Build → Checkpoint**.
Lab = a tiny throwaway project, so I do not mix ideas inside the real project.

### Phase 0 — Setup + the `onClick` question

**Question:** Everything runs on the server, so why does `onClick` need `"use client"`?

- Server Components send **no JavaScript** to the browser. `onClick` needs JavaScript in the browser. So it cannot live in a Server Component.
- `"use client"` does **not** mean "no SSR". A Client Component is **also rendered to HTML on the server**, then **hydrated** in the browser.
- Best pattern: keep pages as Server Components. Make only **small client islands** (for example `AddToCartButton`).
- A Server Component can be passed as `children` into a Client Component.
- For mutations, `<form action={serverAction}>` needs no `onClick` and even works without JS.

**Build:** create the project, install Tailwind v4, shadcn, set up the folder structure and git.
**Checkpoint:** explain the 5 points above in my own words, without notes.

### Phase 1 — Design system (theme + layout)

- **Learn:** shadcn CSS variables, `next-themes`, why `suppressHydrationWarning` is needed, how to avoid the theme flash.
- **Build:** `globals.css` colors (section 6), `ThemeProvider`, theme toggle, RTL layout, header, footer.
- **Checkpoint:** toggle theme with no flash and no hydration warning. Reload keeps the choice.

### Phase 2 — SSG / ISR / SSR / CSR

Use **mock data** only. Make one tiny lab page for each mode, show a timestamp, then run `next build && next start` and watch the behavior.

| Mode | What it is | Use it when | In Bazar |
| --- | --- | --- | --- |
| **SSG** | HTML built at build time | Same content for everyone | Home, blog, about |
| **ISR** | Built once, then refreshed in the background | Mostly static, sometimes changes | Product page (price, stock) |
| **SSR** | HTML built on every request | Fresh or private data | Checkout, orders |
| **CSR** | Rendered in the browser | Highly interactive, no SEO need | Cart, filters |

- **Learn:** `generateStaticParams`, `revalidate`, and dynamic APIs (`cookies()` makes a page dynamic).
- **Checkpoint:** for every page write one sentence "I chose X because Y". These sentences go into the final README.

### Phase 3 — TanStack Query (React Query)

**3.1 Write the important parts**
`QueryClientProvider`, `useQuery`, `useMutation`, query key factory, `invalidateQueries`, `useInfiniteQuery`, `select`, `enabled`.

**3.2 Learn 0 → 100 (in this order)**
install → provider → first query → loading/error states → mutation → invalidation → optimistic update → infinite scroll → prefetch → SSR hydration.

**3.3 Understand behavior fully**
- `staleTime` vs `gcTime` (the most asked question)
- When it refetches: window focus, mount, reconnect
- `status` vs `fetchStatus`
- Retry, request dedupe, cache by key

**3.4 SSR with hydration**
1. `getQueryClient()` (new client per request on the server, one singleton in the browser)
2. In a Server Component: `queryClient.prefetchQuery(...)`
3. Wrap the client part: `<HydrationBoundary state={dehydrate(queryClient)}>`
4. Set `staleTime > 0`, otherwise it refetches right away on the client
5. Result: no loading spinner on first paint, and good SEO

**Build:** `/products` with filters, sorting, infinite scroll, prefetched first page.
**Checkpoint:** explain why hydration removes the first spinner.

### Phase 4 — React Concurrent

Idea: React can **pause low-priority work** so urgent things (typing, clicking) stay smooth.

- `useTransition` — mark an update as non-urgent (switching category).
- `useDeferredValue` — delay a heavy value (search results).
- `Suspense` + streaming + `loading.tsx` — show the page in parts.

**Lab:** a 10,000-item list with and without `useTransition`. Feel the difference while typing.
**Build:** deferred search box, category switch with a pending state, product reviews streamed with `Suspense`.

### Phase 5 — Server Actions + `useOptimistic` + `useTransition`

- **Learn:** `"use server"`, `<form action>`, `useActionState`, zod validation, `revalidatePath` / `revalidateTag`.
- **Security rule:** a Server Action is a **public endpoint**. Always validate input and check the user inside it.
- **Learn:** `useOptimistic` shows the result instantly and rolls back if the action fails. `useTransition` gives a pending state for non-form actions.
- **Build:** add to cart, wishlist toggle, checkout form (with errors), reviews.
- **Checkpoint:** know when to use a **Server Action** and when a **TanStack mutation** (and be able to explain the difference).

### Phase 6 — `proxy.ts` vs `middleware.ts` vs `actions.ts`

| | What it does | When it runs |
| --- | --- | --- |
| `proxy.ts` | Redirect, rewrite, headers, quick auth check | **Before** a route is handled |
| `middleware.ts` | The old name of `proxy.ts` (deprecated in Next 16) | Same as above |
| `actions.ts` | Server functions for **mutations** (write data) | When the UI calls them |

Short version: **proxy = the gate. Actions = the work.** Do not put heavy logic or database work in `proxy.ts`.

**Build:** protect `/account/*` and `/admin/*` with a simple cookie session, redirect to `/login`. (Real auth comes after Prisma.)

### Phase 7 — SQL & Prisma (last)

**7.1 SQL first (separate from the project)**
Practice on Postgres: tables, primary/foreign keys, `JOIN`, `GROUP BY`, indexes, **transactions** (creating an order must be all-or-nothing).

**7.2 Prisma**
`schema.prisma`, migrations, relations, `select` vs `include`, seed, the N+1 problem, `$transaction`.
Check the current Prisma docs for setup, it changes between versions.

**Models:** `User`, `Product`, `Category`, `CartItem`, `Order`, `OrderItem`, `Review`.

> Tip: store prices as **integers** (Toman), never floats.
> Show them with `Intl.NumberFormat("fa-IR")`.

**Build:** replace the mock data layer with Prisma, add real auth (Auth.js), seed demo products.

### Phase 8 — Polish (resume phase)

- Deploy to Vercel, add a live link
- README with screenshots/GIF, the "I chose X because Y" table, and architecture notes
- Lighthouse 90+, a few tests (Vitest + Playwright), clean commits

---

## 6. Colors — "Turquoise & Saffron"

Persian feeling: **firouzeh (Persian turquoise)** as the main color, **saffron** as the warm highlight.
Dark is the default. Light is the same palette, just cleaner and brighter.

- Same shadcn variable names (nothing renamed).
- Two extra variables only: `--success` and `--highlight` (saffron: sale badges, stars, special CTAs).
- `:root` = light, `.dark` = dark. `next-themes` only adds or removes the `dark` class.

**Live values:** `src/app/globals.css`.
**Rules and token usage:** skill `next-commerce` → `references/design-system.md`.
No copy of the CSS lives in this file. One source of truth, no drift.

---

## 7. TanStack Query SSR setup (reference)

**Live code:** `src/lib/query/get-query-client.ts`.

The rule: one client per request on the server, one client in the browser,
`staleTime > 0` so the page does not refetch right after SSR, and the `queryKey`
on the server must be exactly the same as on the client. Full pattern:
skill `next-commerce` → `references/data-and-state.md`.
---

## 8. Definition of done (for the resume)

- [ ] All 9 phases (0–8) finished, every checkpoint passed
- [ ] Dark/light works with no flash, same palette everywhere
- [ ] Each page has a clear rendering mode and a one-line reason
- [ ] TanStack Query with SSR hydration on the product list
- [ ] Optimistic cart and wishlist with Server Actions
- [ ] `proxy.ts` protects private routes
- [ ] Real database with Prisma, seeded demo data
- [ ] Live link, strong README, Lighthouse 90+
