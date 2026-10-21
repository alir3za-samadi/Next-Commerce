import { ArrowUpLeft, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const startingPoints = [
  {
    number: "۰۱",
    title: "طراحی سیستم",
    description: "تم روشن و تیره، رنگ‌های فیروزه‌ای و زعفرانی و چیدمان راست‌چین.",
  },
  {
    number: "۰۲",
    title: "فهرست محصولات",
    description: "دادهٔ آزمایشی، فیلترها و بارگذاری صفحه‌ای برای کاتالوگ فروشگاه.",
  },
  {
    number: "۰۳",
    title: "سبد خرید",
    description: "تعامل سریع و به‌روزرسانی خوش‌بینانه با Server Actions.",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-6 sm:px-8 lg:px-10">
      <header className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShoppingBag aria-hidden="true" className="size-5" />
          </span>
          <span>NextCommerce</span>
        </Link>
        <ThemeToggle />
      </header>

      <section className="grid flex-1 items-center gap-12 py-20 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-7">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            <Sparkles aria-hidden="true" className="size-4 text-highlight" />
            فروشگاه اینترنتی فارسی
          </p>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              خریدی ساده،
              <span className="text-primary"> تجربه‌ای بهتر.</span>
            </h1>
            <p className="max-w-xl text-lg leading-9 text-muted-foreground">
              زیرساخت فروشگاه آماده است. قدم‌به‌قدم کاتالوگ، سبد خرید و تجربهٔ
              خرید را می‌سازیم.
            </p>
          </div>
          <Link
            href="#starting-points"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            شروع ساخت فروشگاه
            <ArrowUpLeft aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div id="starting-points" className="grid gap-3">
          {startingPoints.map((point) => (
            <article
              key={point.number}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-highlight">
                  {point.number}
                </span>
                <span className="size-2 rounded-full bg-primary" />
              </div>
              <h2 className="mb-1 font-semibold">{point.title}</h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {point.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-5 text-sm text-muted-foreground">
        ساخته‌شده برای یادگیری و رشد؛ از یک قدم کوچک شروع می‌کنیم.
      </footer>
    </main>
  );
}
