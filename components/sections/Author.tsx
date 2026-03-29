import Image from "next/image";
import { Reveal } from "@/components/Reveal";

type AuthorProps = {
  section: {
    title: string;
    body: string[];
    image: { src: string; alt: string };
  };
};

export function Author({ section }: AuthorProps) {
  return (
    <section className="section-space">
      <div className="page-shell grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-center">
        <Reveal className="image-panel hover-drift rounded-[34px] p-4">
          <div className="relative aspect-[5/6] overflow-hidden rounded-[26px] bg-paper">
            <Image
              src={section.image.src}
              alt={section.image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 520px"
            />
          </div>
        </Reveal>

        <Reveal delayMs={120} className="max-w-[34rem]">
          <p className="eyebrow text-subtle">Author</p>
          <h2 className="mt-4 balanced-text font-serifDisplay text-4xl leading-tight md:text-[3rem]">
            {section.title}
          </h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-subtle">
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
