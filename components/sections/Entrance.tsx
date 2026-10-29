"use client";

import { useEffect, useRef, useState } from "react";
import { HeroBowl } from "@/components/sections/HeroBowl";

type EntranceProps = {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    images?: readonly { src: string; alt: string }[];
  };
};

type ViewerStatus = "loading" | "ready" | "fallback";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function Entrance({ hero }: EntranceProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [viewerStatus, setViewerStatus] = useState<ViewerStatus>("loading");
  const fallbackImage = hero.images?.[0] ?? {
    src: "/images/hero-1.webp",
    alt: "玛瑙红山水纹薄胎瓷碗"
  };

  useEffect(() => {
    const updateProgress = () => {
      const node = trackRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const distance = Math.max(rect.height - viewportHeight, 1);
      setProgress(clamp(-rect.top / distance, 0, 1));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div ref={trackRef} className="relative h-[190vh]" style={{ background: "var(--hero-bg)" }}>
      <section
        className="sticky top-0 z-0 h-screen"
        style={{ background: "var(--hero-bg)" }}
        aria-label="薄胎瓷作品"
      >
        <div className="absolute left-1/2 top-1/2 h-[82vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 md:h-[84vh]">
          <HeroBowl progress={progress} image={fallbackImage} onStatusChange={setViewerStatus} />
        </div>

        <div className="pointer-events-none absolute inset-0 z-10">
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

            <div className="pb-[10vh] md:pb-[14vh]">
              <div className="flex justify-end pb-4 md:pb-6">
                <p className="max-w-[18rem] animate-rise whitespace-pre-line text-sm leading-7 text-subtle [animation-delay:420ms]">
                  {hero.description}
                </p>
              </div>

              <div className="mt-6 flex justify-center">
                {viewerStatus === "ready" ? (
                  <>
                    <p className="text-[0.72rem] tracking-[0.08em] text-subtle/90 md:hidden">上下滑动浏览 · 横向旋转 · 双指调整</p>
                    <p className="hidden text-[0.72rem] tracking-[0.08em] text-subtle/90 md:block">滚动观看 · 左键旋转 · 右键缩放</p>
                  </>
                ) : (
                  <p className="eyebrow text-[0.72rem] text-subtle/80">Scroll to explore</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
