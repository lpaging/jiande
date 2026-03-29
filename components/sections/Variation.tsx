import Image from "next/image";
import { Reveal } from "@/components/Reveal";

type VariationProps = {
  section: {
    statement: string;
    body: string;
    images: { src: string; alt: string }[];
  };
};

export function Variation({ section }: VariationProps) {
  return (
    <section className="section-space">
      <div className="page-shell">
        <Reveal className="mb-14 max-w-[34rem]">
          <p className="eyebrow text-subtle">Variation</p>
          <p className="mt-4 balanced-text font-serifDisplay text-3xl leading-tight md:text-[2.8rem]">
            {section.statement}
          </p>
          <p className="mt-5 text-base leading-8 text-subtle">{section.body}</p>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {section.images.map((image, index) => (
            <Reveal
              key={image.src}
              delayMs={index * 110}
              className={`image-panel hover-drift rounded-[28px] p-3 ${index === 1 ? "md:translate-y-12" : ""}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-paper">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
