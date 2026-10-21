# Design System — this repo

General styling rules live in the global `tailwindcss`, `shadcn-ui`, and `persian-rtl-ui` skills. This file covers only what is specific to NextCommerce.

## Palette: "Turquoise & Saffron"

- **Turquoise (فیروزه‌ای)** — `--primary`: brand, CTAs, links, focus.
- **Saffron (زعفرانی)** — `--highlight`: sale badges, rating stars, special offers. Not a second primary.
- Dark is the default experience; light must be equally finished.
- Live values: `src/app/globals.css`. Same shadcn variable names; extras are only `--success` and `--highlight` (+ `-foreground`).

| Token | Use |
| --- | --- |
| `--primary` | main action, active nav, links |
| `--secondary` | subtle buttons, chips |
| `--muted` / `--muted-foreground` | surfaces / secondary text |
| `--accent` | hover backgrounds |
| `--destructive` | delete, cancel, errors |
| `--success` | in stock, delivered, success toast |
| `--highlight` | discount badge, stars, promo CTA |

Never hardcode hex/oklch in components.

## Radius & typography

- `--radius: 0.75rem`; use `rounded-sm/md/lg/xl`, no arbitrary radii.
- Vazirmatn via `next/font`, `subsets: ["arabic", "latin"]`, `--font-vazirmatn` → `--font-sans`.
- Persian line-height 1.7–1.9 for body copy; no `tracking-*` on Persian.

## Theme wiring (already in place)

```
theme-provider.tsx  → next-themes: attribute="class", defaultTheme="dark",
                      enableSystem={false}, disableTransitionOnChange
layout.tsx          → <html lang="fa" dir="rtl" suppressHydrationWarning>
theme-toggle.tsx    → Sun/Moon chosen by CSS, no mounted hack
providers.tsx       → ThemeProvider + QueryProvider composition
```

`suppressHydrationWarning` covers only the pre-hydration class change by next-themes.

## RTL (project rules)

- Logical utilities only; physical `ml/mr/pl/pr/left/right` is a bug.
- Directional icons: `rtl:rotate-180`.
- Audit every new shadcn component:
  `grep -nE "\b(ml|mr|pl|pr|left|right)-|text-left|text-right" src/components/ui/<file>.tsx`
- Prices/dates: Persian digits via `Intl`; technical identifiers stay Latin with `dir="ltr"`.

## Commerce-specific visual rules

- **Price**: bold, `text-lg`/`text-xl`, tabular-nums; old price muted + `line-through`.
- **Discount badge**: `bg-highlight text-highlight-foreground`, positioned at the logical start of the image.
- **Stock**: `text-success` in stock, `text-destructive` out of stock, never color alone (add text/icon).
- **Product image**: fixed aspect ratio (`aspect-square` or `4/5`), `object-cover`, rounded-lg, subtle border.
- **Product card**: image → title (2 lines max) → price row → rating → actions; whole card is not a link when it contains buttons — use a stretched link on the title/image.
- **Empty cart / no results**: icon + Persian sentence + one clear action.
- **Admin**: denser spacing, table-first, destructive actions always confirmed.
