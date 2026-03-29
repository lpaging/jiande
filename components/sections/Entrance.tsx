"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type EntranceProps = {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    images?: readonly {
      src: string;
      alt: string;
    }[];
    image?: string;
  };
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function smoothStep(edge0: number, edge1: number, value: number) {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}

export function Entrance({ hero }: EntranceProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const [frameOffsetTop, setFrameOffsetTop] = useState(0);

  const heroImages = useMemo(() => {
    if (hero.images && hero.images.length > 0) {
      return hero.images;
    }

    if (hero.image) {
      return [
        { src: hero.image, alt: "Porcelain bowl, first viewing angle" },
        { src: hero.image, alt: "Porcelain bowl, second viewing angle" },
        { src: hero.image, alt: "Porcelain bowl, third viewing angle" }
      ];
    }

    return [];
  }, [hero.image, hero.images]);

  useEffect(() => {
    const updateProgress = () => {
      const node = sectionRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const total = Math.max(rect.height - viewportHeight, 1);
      const next = clamp(-rect.top / total, 0, 1);
      setProgress(next);
      setIsPinned(rect.top <= 0 && rect.bottom >= viewportHeight);
      setFrameOffsetTop(Math.max(rect.height - viewportHeight, 0));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const layeredImages = useMemo(() => {
    const firstOpacity = 1 - smoothStep(0.22, 0.46, progress);
    const secondOpacity =
      smoothStep(0.18, 0.4, progress) * (1 - smoothStep(0.58, 0.8, progress));
    const thirdOpacity = smoothStep(0.54, 0.82, progress);

    const opacities = [firstOpacity, secondOpacity, thirdOpacity];
    const hiddenOffsets = [-10, 10, 16];

    return heroImages.map((image, index) => {
      const opacity = opacities[index] ?? 0;
      const scale = 1.028 - opacity * 0.028;
      const xOffset = hiddenOffsets[index] * (1 - opacity);

      return {
        ...image,
        opacity,
        scale,
        xOffset,
        zIndex: index + 1
      };
    });
  }, [heroImages, progress]);

  return (
    <section ref={sectionRef} className="relative min-h-[170vh]">
      <div
        className="absolute inset-x-0 top-0 z-0"
        style={{ height: "170vh", background: "var(--hero-bg)" }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0"
        style={{ height: "170vh" }}
        aria-hidden="true"
      >
        <div
          className={`left-1/2 h-[82vh] w-[90vw] -translate-x-1/2 md:h-[84vh] ${isPinned ? "fixed top-1/2 -translate-y-1/2" : "absolute top-1/2 -translate-y-1/2"}`}
          style={isPinned ? undefined : { top: `calc(50vh + ${frameOffsetTop}px)` }}
        >
          <div className="relative h-full w-full animate-rise [animation-delay:160ms]">
            {layeredImages.map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className="absolute inset-0 transition-[opacity,transform] duration-700 ease-out"
                style={{
                  opacity: image.opacity,
                  transform: `translateX(${image.xOffset}px) scale(${image.scale})`,
                  zIndex: image.zIndex
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  className="object-contain object-center"
                  sizes="100vw"
                />
              </div>
            ))}

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(237,237,237,0.16),rgba(237,237,237,0.04)_24%,rgba(237,237,237,0.04)_76%,rgba(237,237,237,0.14))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(255,255,255,0.34),rgba(255,255,255,0.1)_22%,transparent_54%)]" />
            <div className="absolute inset-x-[18%] bottom-[18%] h-[18%] rounded-[50%] bg-[radial-gradient(circle,rgba(34,34,34,0.09),rgba(34,34,34,0.035)_38%,transparent_72%)] blur-3xl" />
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10"
        style={{ height: "170vh" }}
        aria-hidden="true"
      >
        <div
          className={`h-screen ${isPinned ? "fixed inset-x-0 top-0" : "absolute inset-x-0 top-0"}`}
          style={isPinned ? undefined : { top: `${frameOffsetTop}px` }}
        >
          <div className="page-shell flex h-full flex-col justify-between py-8 md:py-10">
            <div className="max-w-[16rem] self-start pt-3 md:max-w-[18rem] md:pt-6">
              <p className="eyebrow animate-rise text-subtle [animation-delay:120ms]">egg-shell porcelain</p>
              <h1 className="mt-5 animate-rise font-serifDisplay text-[2.8rem] leading-none tracking-[0.02em] text-ink [animation-delay:220ms] md:text-[4.4rem]">
                {hero.title}
              </h1>
              <p className="mt-3 animate-rise text-sm uppercase tracking-[0.28em] text-subtle [animation-delay:320ms]">
                {hero.subtitle}
              </p>
            </div>

            <div className="pb-[14vh]">
              <div className="flex justify-end pb-4 md:pb-6">
                <p className="max-w-[18rem] animate-rise text-sm leading-7 text-subtle [animation-delay:420ms]">
                  {hero.description}
                </p>
              </div>

              <div className="mt-6 flex justify-center">
                <p className="eyebrow text-[0.72rem] text-subtle/80">Scroll to shift the view</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[70vh]" aria-hidden="true" />
    </section>
  );
}
