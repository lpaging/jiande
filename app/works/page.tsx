import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { InnerPageShell } from "@/components/site/InnerPageShell";
import { siteData } from "@/lib/data";

export default function WorksPage() {
  return (
    <InnerPageShell
      current="works"
      eyebrow="Works"
      title="作品 / Works"
      intro={siteData.works.intro}
    >
      <section className="page-shell-wide">
        <div className="columns-1 gap-5 md:columns-2 xl:columns-3">
          {siteData.works.items.map((work, index) => (
            <Reveal
              key={work.title}
              delayMs={index * 70}
              className="image-panel group mb-5 break-inside-avoid rounded-[28px] p-3"
            >
              <div
                className="relative overflow-hidden rounded-[20px] bg-paper"
                style={{ aspectRatio: work.ratio }}
              >
                <Image
                  src={work.image.src}
                  alt={work.image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.015]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(34,34,34,0.66))] p-5 text-white">
                  <p className="font-serifDisplay text-2xl leading-none">{work.title}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.24em] text-white/70">
                    {work.meta}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </InnerPageShell>
  );
}
