# Storefront Patterns (e-commerce specifics)

Domain and UX rules for this shop. Styling rules → `design-system.md`; general React/Next patterns → global skills.

## Domain model (final, phase 7)

`User`, `Product`, `Category`, `CartItem`, `Order`, `OrderItem`, `Review` (plus optional `Wishlist`).

Key fields to keep stable in the mock layer:
- `Product`: `id`, `slug`, `title`, `description`, `price` (Toman int), `compareAtPrice?`, `images[]`, `categoryId`, `stock`, `rating`, `reviewCount`, `createdAt`.
- `CartItem`: `productId`, `quantity`, never a price snapshot for display — price is re-resolved on read.
- `Order`: `id`, `userId`, `status`, `items[]`, `subtotal`, `discount`, `shipping`, `total`, `address`, `createdAt`.
- `OrderStatus`: `pending | paid | processing | shipped | delivered | cancelled | refunded`.

## Money rules

- Integers in Toman. No floats, no `toFixed`, no division before rounding.
- Percent discount: `Math.round(price * (1 - pct / 100))`, then optionally round to the nearest 1,000.
- Totals are computed **server-side** only. The client may preview, never decide.
- Display: `new Intl.NumberFormat("fa-IR").format(value)` + unit "تومان".
- Free-shipping threshold and shipping cost are constants in one module, not scattered.

## Product list & filters

- Filters/sort/page live in the **URL** (`searchParams`) so the state is shareable and prefetchable.
- Server prefetches page 1 with the same query key the client uses; filters then run client-side.
- Debounce/defer the search input (`useDeferredValue`) — don't fire a request per keystroke.
- Empty state: "محصولی با این فیلترها پیدا نشد" + reset filters.
- Skeleton grid with the same card dimensions to avoid layout shift.

## Product card

- Image (aspect ratio fixed) → title (2-line clamp) → rating + count → price row → discount badge.
- Add-to-cart and wishlist are **small client islands**; the card stays a server component.
- Out of stock: disable the button with a Persian reason; still allow visiting the product page.

## Product page (`/products/[slug]`)

- `generateStaticParams` for top products; ISR window via `cacheLife`/`revalidate`.
- `notFound()` for unknown slugs; `generateMetadata` per product (title, description, OG image).
- Gallery, price, stock, quantity stepper, add to cart, description, reviews (streamed via `Suspense`).
- JSON-LD `Product` with `offers.price`, `priceCurrency: "IRR"` (or the store's chosen unit), `availability`.
- Breadcrumbs in Persian, logical direction.
- Price/stock can change while the item sits in the cart — revalidate at cart read and surface a notice instead of silently charging a different amount.

## Cart

- Server Actions: `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`.
- Quantity: integer ≥ 1; remove uses an explicit action (no "0 = delete" magic).
- Optimistic UI with rollback; disable during pending; announce totals via `aria-live` (polite).
- Cart identity: cookie-based `cartId` for guests, merged into the user cart after login.
- Show: line total per item, subtotal, discount, shipping, grand total; recalculate server-side.
- Empty state + "ادامه خرید" link. Never render a cart with stale stock as purchasable.

## Checkout

- Requires a fresh, server-rendered cart (SSR dynamic). No client-trusted totals.
- Zod schema for address/contact; Persian field errors next to fields.
- Order creation is **one transaction**: validate stock → create order + items → decrement stock → clear cart.
- Idempotency: submit disabled while pending + a request key so double clicks can't create two orders.
- Failure: keep the cart intact, show a recoverable error, never a blank confirmation.
- Success page shows order id, total, and a link to `/account/orders`.

## Orders (`/account/orders`)

- SSR dynamic, authorized per user; never fetch by an ID from the URL without an ownership check.
- Status timeline: pending → paid → processing → shipped → delivered; cancelled/refunded as terminal states.
- Dates in Jalali via `Intl.DateTimeFormat("fa-IR")`.
- Order detail is read-only; repeat-purchase can prefill the cart.

## Wishlist

- Optimistic toggle, requires auth (or local storage for guests, documented choice).
- Heart icon needs `aria-pressed` and a Persian label.

## Admin

- `/admin/*` protected in `proxy.ts` **and** re-checked in every action/data call.
- Tables: server-paginated, sortable by URL state, bulk actions confirmed.
- Mutations: edit product/price/stock, change order status, moderate reviews.
- Destructive actions require explicit confirmation and show the affected entity name.
- Never expose cost price, internal notes, or user PII in shop-facing payloads.

## SEO

- One `h1` per page; semantic section headings.
- `metadata` per route; canonical URLs; Persian slugs.
- `sitemap.ts` + `robots.ts`; product images with Persian `alt`.
- Structured data: `Product`, `BreadcrumbList`, `Organization`; `Review`/`AggregateRating` only when real.

## Edge cases to handle

- Stock exhausted between add-to-cart and checkout.
- Price changed while in cart (re-resolve + notify).
- Expired/duplicate order submission.
- Guest cart merging after login.
- Product deleted or unpublished while linked in a cart/wishlist.
- Very long Persian titles (clamp) and mixed Latin model names (bidi).
