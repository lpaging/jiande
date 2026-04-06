import Link from "next/link";
import { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/works", label: "Works", key: "works" },
  { href: "/collections", label: "Collections", key: "collections" },
  { href: "/news", label: "News", key: "news" },
  { href: "/about", label: "About", key: "about" }
] as const;

type InnerPageShellProps = {
  current: (typeof NAV_ITEMS)[number]["key"];
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
};

export function InnerPageShell({ current, eyebrow, title, intro, children }: InnerPageShellProps) {
  return (
    <main className="relative overflow-hidden bg-canvas text-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[24rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.82),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[26rem] h-[22rem] bg-[radial-gradient(circle_at_center,rgba(233,231,227,0.36),transparent_68%)]" />

      <header className="relative z-10">
        <div className="page-shell flex flex-col gap-6 py-6 md:flex-row md:items-start md:justify-between md:py-8">
          <div>
            <Link
              href="/"
              className="eyebrow text-subtle transition-colors duration-300 hover:text-ink"
            >
              Lu Jiande
            </Link>
            <p className="mt-2 text-xs uppercase tracking-[0.24em] text-subtle/80">Ceramic Works</p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm tracking-[0.12em] text-subtle">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors duration-300 hover:text-ink ${
                  item.key === current ? "text-ink" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="section-space relative z-10 pb-16">
        <div className="page-shell">
          <div className="max-w-[42rem] border-t border-line/60 pt-8">
            <p className="eyebrow text-subtle">{eyebrow}</p>
            <h1 className="mt-5 balanced-text font-serifDisplay text-[2.9rem] leading-none tracking-[0.01em] md:text-[4.5rem]">
              {title}
            </h1>
            <p className="mt-6 max-w-[32rem] text-base leading-8 text-subtle md:text-lg md:leading-9">
              {intro}
            </p>
          </div>
        </div>
      </section>

      <div className="relative z-10 pb-24 md:pb-28">{children}</div>
    </main>
  );
}
