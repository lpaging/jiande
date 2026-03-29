import Image from "next/image";
import { Reveal } from "@/components/Reveal";

type FormProps = {
  section: {
    title: string;
    statement: string;
    body: string;
    images: { src: string; alt: string }[];
  };
};

export function Form({ section }: FormProps) {
  return (
    <section className="section-space">
      <div className="page-shell">
        <Reveal className="mb-14 max-w-[34rem]">
          <p className="eyebrow text-subtle">Form</p>
          <h2 className="mt-4 balanced-text font-serifDisplay text-4xl leading-tight md:text-[3.25rem]">
            {section.title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-subtle">{section.statement}</p>
          <p className="mt-4 max-w-[30rem] text-base leading-8 text-subtle">{section.body}</p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {section.images.map((image, index) => (
            <Reveal
              key={image.src}
              delayMs={index * 120}
              className={`image-panel hover-drift ${index === 0 ? "md:translate-y-10" : ""} rounded-[34px] p-4`}
            >
              <div className="relative aspect-[5/6] overflow-hidden rounded-[24px] bg-paper">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
