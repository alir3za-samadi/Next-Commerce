# Data & State — this repo

General query rules → global `tanstack-query` skill. This file is the contract for NextCommerce.

## Golden rule

```
src/server/data/*        → getProducts, getProduct, getCategories, getCart, getOrders, createOrder
src/server/actions/*     → thin mutations: validate → authorize → data layer → revalidate
```

- Phases ≤ 6: mock data inside the data functions.
- Phase 7: Prisma replaces the inside. Signatures and return shapes stay identical.
- Components never import Prisma or touch a DB directly.
- Return serializable data only (ISO strings for dates, no class instances).

## Function contracts (keep these stable)

```ts
getProducts(filters: ProductFilters): Promise<{ items: Product[]; total: number }>
getProduct(slug: string): Promise<Product | null>
getCategories(): Promise<Category[]>
getCart(cartId: string): Promise<CartView>
getOrders(userId: string): Promise<OrderSummary[]>
createOrder(input: CreateOrderInput): Promise<Result<{ orderId: string }>>
```

- List results always include `total` (and cursor/page when paginating) so `useInfiniteQuery` stays trivial.
- Shop-facing mappers strip cost price and internal fields explicitly.

## Query keys (one factory per feature)

```ts
// src/features/products/queries.ts
export const productKeys = {
  all: ["products"] as const,
  list: (filters: ProductFilters) => [...productKeys.all, "list", filters] as const,
  detail: (slug: string) => [...productKeys.all, "detail", slug] as const,
};

// src/features/cart/queries.ts
export const cartKeys = { all: ["cart"] as const };
```

- Server prefetch and client hook must use the same key call, not two hand-written arrays.
- Invalidate narrowly: `cartKeys.all` after cart mutations, `productKeys.detail(slug)` after a review.

## Server Action shape

```ts
"use server";

export async function addToCart(input: unknown): Promise<Result<void>> {
  const parsed = addToCartSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "INVALID_INPUT", fieldErrors: parsed.error.flatten().fieldErrors };

  const user = await getCurrentUser();          // authorize INSIDE the action
  if (!user) return { ok: false, error: "UNAUTHORIZED" };

  await data.addToCart({ userId: user.id, ...parsed.data });
  revalidateTag("cart");
  return { ok: true, data: undefined };
}
```

- No thrown raw errors across the boundary; return the discriminated result.
- Revalidate tags, not blanket `revalidatePath("/")`.
- One action = one intent; no multi-purpose `updateCart` with a `type` switch.

## Which mutation tool (Phase 5 checkpoint)

| Need | Use |
| --- | --- |
| Works without JS, server-owned data, form submit | Server Action + `<form action>` |
| Instant client feedback on cached lists | TanStack mutation with optimistic cache |
| Both | Server Action called from a TanStack mutation |

## Phase-7 migration checklist (Prisma)

- Keep `src/server/data` signatures; swap implementations only.
- Replace mock IDs with real IDs without changing UI code.
- `createOrder` becomes a `$transaction`: validate stock → order + items → decrement stock → clear cart.
- Select only what the UI needs; watch N+1 on order items and product categories.
- Seed demo products in Persian with realistic prices (integers).
- Run the UI test suite before/after to prove "only the inside changed".

## Repo conventions

- No `any`, no float money, no date mutation across boundaries.
- Every new data function gets a matching Zod schema when it accepts input.
- If a mock shape changes, update `storefront-patterns.md` field lists in the same commit.
