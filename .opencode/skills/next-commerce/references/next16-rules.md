# Next 16 — this repo's decisions

General Next.js guide → global `nextjs` skill. Read `node_modules/next/dist/docs/` before using any Next API.

## Current configuration

- `next.config.ts` → `cacheComponents: true` (caching is **opt-in**).
- Turbopack is the default bundler; `pnpm dev` / `pnpm build`.
- `src/` layout → the route gate is `src/proxy.ts` (not `src/middleware.ts`).
- `params`, `searchParams`, `cookies()`, `headers()` are async → always `await`.

## What must be explicit in code

| Concern | Mechanism |
| --- | --- |
| Static page | no dynamic APIs, no `"use cache"` needed for the shell |
| Cached data | `"use cache"` + `cacheLife(...)`, tag with `cacheTag(...)` |
| Invalidation | `revalidateTag` / `revalidatePath` inside actions |
| Dynamic (private/fresh) | `cookies()` / `headers()` / `searchParams` read at request time |
| Route protection | `src/proxy.ts` + re-check inside actions/data |

- A page is only static if the build output says so — verify with `pnpm build`.
- Guard against accidental dynamic opt-in: reading `cookies()` in a layout makes its whole subtree dynamic.
- `proxy.ts` stays cheap: no DB, no heavy imports. Real authorization lives in the action/data layer.

## Server / client boundary rules here

- `src/app/**` files are Server Components unless marked.
- Client islands live next to their feature (`src/features/<feature>/components/*-client.tsx` or a specific component file).
- Providers already exist: `src/components/providers.tsx` composes `ThemeProvider` + `QueryProvider`.
- Never import `src/server/**` from a client component.

## Per-route expectations (build check)

| Route | Expected in `pnpm build` |
| --- | --- |
| `/` | static (○) |
| `/products` | dynamic (ƒ) with prefetched data, or static shell + dynamic data |
| `/products/[slug]` | prebuilt params (●) + ISR/cached |
| `/cart` | client shell |
| `/checkout`, `/account/orders` | dynamic (ƒ) |
| `/admin/*` | dynamic (ƒ), gated by proxy |

If a route lands in a different column than the plan, stop and report it before "fixing" the plan.

## Phase-6 protection sketch

```ts
// src/proxy.ts
export function proxy(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const isPrivate = request.nextUrl.pathname.startsWith("/account") ||
                    request.nextUrl.pathname.startsWith("/admin");
  if (isPrivate && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = { matcher: ["/account/:path*", "/admin/:path*"] };
```

- Cookie session is temporary until Auth.js in phase 7.
- Never trust the proxy alone: actions must resolve the user from the session themselves.
