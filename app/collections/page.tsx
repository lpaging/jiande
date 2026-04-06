import { Reveal } from "@/components/Reveal";
import { InnerPageShell } from "@/components/site/InnerPageShell";
import { siteData } from "@/lib/data";

export default function CollectionsPage() {
  return (
    <InnerPageShell
      current="collections"
      eyebrow="Collections"
      title="收藏 / Collections"
      intro={siteData.collections.intro}
    >
      <section className="page-shell space-y-20">
        {siteData.collections.sections.map((section, sectionIndex) => (
          <Reveal key={section.title} delayMs={sectionIndex * 80}>
            <div className="grid gap-8 border-t border-line pt-8 md:grid-cols-[220px_minmax(0,1fr)]">
              <div>
                <p className="eyebrow text-subtle">{section.title}</p>
              </div>

              <div className="space-y-5">
                {section.items.map((item) => (
                  <div key={item.title} className="grid gap-2 border-b border-line/70 pb-5 md:grid-cols-[160px_minmax(0,1fr)]">
                    <p className="font-serifDisplay text-lg leading-7 text-ink">{item.period}</p>
                    <div>
                      <p className="text-base leading-8 text-ink">{item.title}</p>
                      <p className="text-sm leading-7 text-subtle">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </section>
    </InnerPageShell>
  );
}
