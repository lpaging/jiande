import { Reveal } from "@/components/Reveal";
import { InnerPageShell } from "@/components/site/InnerPageShell";
import { siteData } from "@/lib/data";

export default function NewsPage() {
  return (
    <InnerPageShell
      current="news"
      eyebrow="News"
      title="动态 / News"
      intro={siteData.news.intro}
    >
      <section className="page-shell">
        <div className="space-y-10">
          {siteData.news.items.map((item, index) => (
            <Reveal
              key={`${item.date}-${item.title}`}
              delayMs={index * 70}
              className="grid gap-4 border-t border-line pt-6 md:grid-cols-[180px_minmax(0,1fr)]"
            >
              <div>
                <p className="font-serifDisplay text-[1.55rem] leading-none text-ink">{item.date}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-subtle">{item.kind}</p>
              </div>

              <div>
                <h2 className="font-serifDisplay text-[2rem] leading-tight text-ink md:text-[2.3rem]">
                  {item.title}
                </h2>
                <p className="mt-3 max-w-[38rem] text-base leading-8 text-subtle">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </InnerPageShell>
  );
}
