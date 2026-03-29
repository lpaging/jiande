import Image from "next/image";
import { Reveal } from "@/components/Reveal";

type LightProps = {
  section: {
    title: string;
    statement: string;
    body: string;
    images: {
      main: { src: string; alt: string };
      details: readonly { src: string; alt: string }[];
    };
  };
};

export function Light({ section }: LightProps) {
  return (
    <section className="section-space relative">
      <div className="page-shell">
        <Reveal className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[32rem]">
            <p className="eyebrow text-subtle">Light</p>
            <h2 className="mt-4 balanced-text font-serifDisplay text-4xl leading-tight md:text-[3.4rem]">
              {section.title}
            </h2>
          </div>
          <div className="max-w-[28rem]">
            <p className="text-xl leading-9 text-subtle">{section.statement}</p>
            <p className="mt-4 text-base leading-8 text-subtle">{section.body}</p>
          </div>
        </Reveal>
      </div>

      <div className="page-shell-wide">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(300px,0.72fr)]">
          <Reveal className="image-panel light-frame hover-drift rounded-[44px] p-3 md:p-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[30px] bg-paper">
              <Image
                src={section.images.main.src}
                alt={section.images.main.alt}
                fill
                className="object-cover brightness-105 transition duration-700 hover:brightness-110"
                sizes="(max-width: 1024px) 100vw, 980px"
              />
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {section.images.details.map((image, index) => (
              <Reveal
                key={image.src}
                delayMs={index * 130}
                className={`image-panel hover-drift rounded-[30px] p-3 ${index === 1 ? "lg:translate-x-4" : ""}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-paper">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover brightness-[1.02] transition duration-700 hover:brightness-110"
                    sizes="(max-width: 1024px) 50vw, 360px"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
