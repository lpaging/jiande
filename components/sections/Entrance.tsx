import Image from "next/image";

type EntranceProps = {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
  };
};

export function Entrance({ hero }: EntranceProps) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-x-[5vw] bottom-[8vh] top-[9vh] animate-rise [animation-delay:160ms]">
          <div className="image-panel h-full w-full rounded-[44px] p-4 md:rounded-[56px] md:p-5">
            <div className="relative h-full overflow-hidden rounded-[34px] bg-paper md:rounded-[46px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.98),rgba(255,255,255,0.34)_24%,transparent_54%)]" />
              <Image
                src={hero.image}
                alt="Translucent porcelain bowl in soft light"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="page-shell relative z-10 flex min-h-screen flex-col justify-between py-8 md:py-10">
        <div className="max-w-[16rem] self-start pt-3 md:max-w-[18rem] md:pt-6">
          <p className="eyebrow animate-rise text-subtle [animation-delay:120ms]">Thin Porcelain</p>
          <h1 className="mt-5 animate-rise font-serifDisplay text-[2.8rem] leading-none tracking-[0.02em] text-ink [animation-delay:220ms] md:text-[4.4rem]">
            {hero.title}
          </h1>
          <p className="mt-3 animate-rise text-sm uppercase tracking-[0.28em] text-subtle [animation-delay:320ms]">
            {hero.subtitle}
          </p>
        </div>

        <div className="flex justify-end pb-4 md:pb-6">
          <p className="max-w-[18rem] animate-rise text-sm leading-7 text-subtle [animation-delay:420ms]">
            {hero.description}
          </p>
        </div>
      </div>
    </section>
  );
}
