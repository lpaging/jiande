import { Reveal } from "@/components/Reveal";
import { InnerPageShell } from "@/components/site/InnerPageShell";
import { siteData } from "@/lib/data";

export default function AboutPage() {
  return (
    <InnerPageShell
      current="about"
      eyebrow="About"
      title="关于 / About"
      intro={siteData.about.intro}
    >
      <section className="page-shell space-y-20">
        <Reveal className="grid gap-8 md:grid-cols-[220px_minmax(0,1fr)]">
          <p className="eyebrow text-subtle">Biography / 简介</p>
          <div className="max-w-[42rem] space-y-5 text-base leading-8 text-subtle">
            {siteData.about.biography.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delayMs={80} className="grid gap-8 border-t border-line pt-8 md:grid-cols-[220px_minmax(0,1fr)]">
          <p className="eyebrow text-subtle">CV / 履历</p>
          <div className="space-y-10">
            {siteData.about.cvGroups.map((group) => (
              <div key={group.title}>
                <h2 className="font-serifDisplay text-[1.9rem] leading-none text-ink">{group.title}</h2>
                <div className="mt-5 space-y-4">
                  {group.items.map((item) => (
                    <div key={`${group.title}-${item.year}-${item.text}`} className="grid gap-2 border-b border-line/70 pb-4 md:grid-cols-[90px_minmax(0,1fr)]">
                      <p className="font-serifDisplay text-lg leading-7 text-ink">{item.year}</p>
                      <p className="text-base leading-8 text-subtle">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delayMs={140} className="grid gap-8 border-t border-line pt-8 md:grid-cols-[220px_minmax(0,1fr)]">
          <p className="eyebrow text-subtle">Contact / 联系方式</p>
          <div className="max-w-[28rem] space-y-3 text-base leading-8 text-subtle">
            <p>{siteData.about.contact.studio}</p>
            <p>{siteData.about.contact.email}</p>
            <p>{siteData.about.contact.instagram}</p>
          </div>
        </Reveal>
      </section>
    </InnerPageShell>
  );
}
