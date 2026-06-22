"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ContentCard } from "@/components/content-card";
import { cn } from "@/lib/utils";

type MediaItem = {
  type: "image" | "gif" | "video" | "sequence";
  src: string;
  /** For sequence: additional srcs after the first */
  srcs?: string[];
  alt?: string;
  label: string;
  year: 2026 | 2023 | 2020 | 2019 | 2018;
  /** Use natural image dimensions instead of the default 16/7 crop */
  natural?: boolean;
  width?: number;
  height?: number;
  fullWidth?: boolean;
  aspect?: string;
};

const MEDIA: MediaItem[] = [
  { type: "video", src: "/projects/surfing/el-salvador-compressed.mp4",                         label: "El Salvador · El Palmarcito", year: 2026 },
  { type: "video", src: "/projects/surfing/nicaragua-santana-compressed.mp4",                   label: "Nicaragua · Playa Santana",  year: 2023 },
  { type: "image", src: "/projects/surfing/0F5A4554.jpeg", alt: "Surfing a wave in Nicaragua", label: "Nicaragua · Playa Colorado", year: 2023 },
  { type: "gif",   src: "/projects/surfing/nica.gif",      alt: "Surfing Nicaragua",           label: "Nicaragua · Manzanillo",   year: 2023, width: 887, height: 1858 },
  { type: "video", src: "/projects/surfing/C0126-compressed.mp4",                               label: "Carlsbad · Tamarack Jetty", year: 2023 },
  { type: "video", src: "/projects/surfing/trimmed-downcarve-compressed.mp4",                   label: "Carlsbad · Tamarack Jetty", year: 2023 },
  { type: "video", src: "/projects/surfing/will-water-compressed.mp4",                          label: "La Jolla · Scripps",        year: 2020 },
  { type: "video", src: "/projects/surfing/will-backside-compressed.mp4",                       label: "La Jolla · Scripps",        year: 2020 },
  { type: "video", src: "/projects/surfing/will-3-turn-compressed.mp4",                         label: "La Jolla · Scripps",        year: 2020 },
  { type: "video", src: "/projects/surfing/mvi-0038-compressed.mp4",                            label: "La Jolla · Scripps",        year: 2020 },
  { type: "video", src: "/projects/surfing/mvi-0032-compressed.mp4",                            label: "La Jolla · Scripps",        year: 2020 },
  { type: "image", src: "/projects/surfing/delmar-15th.png", alt: "Surfing Del Mar 15th Street", label: "Del Mar · 15th Street",     year: 2019, natural: true, width: 1439, height: 810 },

  { type: "image", src: "/projects/surfing/DSCF3790.jpg", alt: "Cardiff Seaside Contest, UCSD Surf Team", label: "Cardiff · Seaside Contest · UCSD Surf Team", year: 2018, natural: true, width: 2400, height: 1600 },
  { type: "image", src: "/projects/surfing/DSCF3770.jpg", alt: "Cardiff Seaside Contest, UCSD Surf Team", label: "Cardiff · Seaside Contest · UCSD Surf Team", year: 2018, natural: true, width: 2400, height: 1600 },
  { type: "video", src: "/projects/surfing/blacks-beach-2018-compressed.mp4",       label: "Blacks Beach · Surf Team Practice · UCSD Surf Team", year: 2018, aspect: "aspect-[4/3]" },
  { type: "video", src: "/projects/surfing/DSC_7987-1920-compressed.mp4",           label: "Blacks Beach · Surf Team Practice · UCSD Surf Team", year: 2018 },
  { type: "video", src: "/projects/surfing/DSC_7989-1920-compressed.mp4",           label: "Blacks Beach · Surf Team Practice · UCSD Surf Team", year: 2018 },
  { type: "video", src: "/projects/surfing/DSC_9378-1920-compressed.mp4",           label: "Blacks Beach · Surf Team Practice · UCSD Surf Team", year: 2018 },
  { type: "video", src: "/projects/surfing/DSC_9379-1920-compressed.mp4",           label: "Blacks Beach · Surf Team Practice · UCSD Surf Team", year: 2018 },
  { type: "video", src: "/projects/surfing/air revo almost-compressed.mp4",         label: "Blacks Beach · Surf Team Practice · UCSD Surf Team", year: 2018 },
  { type: "video", src: "/projects/surfing/A01A4857-compressed.mp4",               label: "La Jolla · Scripps",        year: 2018 },
  { type: "video", src: "/projects/surfing/revo-trimmed-slo-compressed.mp4",                    label: "Pacific Beach · PB Drive",  year: 2019 },
  { type: "video", src: "/projects/surfing/will-snap-compressed.mp4",                           label: "Leucadia · Grandview",      year: 2019 },
  { type: "video", src: "/projects/surfing/will-almost-combo-compressed.mp4",                   label: "Leucadia · Grandview",      year: 2019 },
  { type: "video", src: "/projects/surfing/will-wrap-compressed.mp4",                           label: "Leucadia · Grandview",      year: 2019 },
];

const YEARS = [2026, 2023, 2020, 2019, 2018] as const;

function AutoplayVideo({ src, aspect }: { src: string; aspect?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.5 }
    );
    observer.observe(video);
    // If already in viewport when mounted, play immediately
    const rect = video.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      const tryPlay = () => video.play().catch(() => {});
      if (video.readyState >= 3) tryPlay();
      else video.addEventListener("canplay", tryPlay, { once: true });
    }
    return () => observer.disconnect();
  }, [src]);

  return <video ref={ref} src={src} loop muted playsInline preload="auto" className={cn("w-full rounded-xl bg-muted", aspect ?? "aspect-video")} />;
}

function MediaBlock({ item }: { item: MediaItem }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-mono text-body-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {item.label} · {item.year}
      </h2>
      {item.type === "image" && (
        item.natural && item.width && item.height ? (
          <Image src={item.src} alt={item.alt!} width={item.width} height={item.height} sizes="(min-width: 1024px) 56rem, 100vw" className="w-full rounded-xl" />
        ) : (
          <div className="relative aspect-[16/7] w-full overflow-hidden rounded-xl">
            <Image src={item.src} alt={item.alt!} fill priority sizes="(min-width: 1024px) 56rem, 100vw" className="object-cover" />
          </div>
        )
      )}
      {item.type === "gif" && (
        <div className="overflow-hidden rounded-xl" style={item.fullWidth ? undefined : { maxWidth: "320px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt={item.alt!}
            width={item.width}
            height={item.height}
            className="h-auto w-full object-cover object-top"
          />
        </div>
      )}
      {item.type === "video" && <AutoplayVideo src={item.src} aspect={item.aspect} />}
      {item.type === "sequence" && (
        <div className="flex flex-col gap-4">
          {[item.src, ...(item.srcs ?? [])].map((s, i) => (
            <Image key={i} src={s} alt={item.alt ?? ""} width={item.width ?? 2400} height={item.height ?? 1600} sizes="(min-width: 1024px) 56rem, 100vw" className="w-full rounded-xl" />
          ))}
        </div>
      )}
    </section>
  );
}

export default function Surfing() {
  const [year, setYear] = useState<2026 | 2023 | 2020 | 2019 | 2018 | null>(null);

  const filtered = (year ? MEDIA.filter((m) => m.year === year) : [...MEDIA].sort((a, b) => b.year - a.year));

  return (
    <ContentCard className="h-full overflow-auto">
      <article className="mx-auto w-full max-w-4xl px-6 pb-32 pt-28">
        <header className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-col gap-3">
            <h1 className="text-h1 font-bold tracking-tight">Surfing</h1>
            <p className="max-w-xl text-body-lg text-muted-foreground">
              Repository of sessions over the years.
            </p>
          </div>
          <div
            role="tablist"
            aria-label="Year"
            className="shrink-0"
          >
          <div className="inline-flex w-fit flex-wrap items-center gap-0.5 rounded-lg border bg-background p-1">
            <button
              type="button"
              role="tab"
              aria-selected={year === null}
              onClick={() => setYear(null)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-body-xs uppercase tracking-wide transition-colors",
                year === null ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              All
            </button>
            {YEARS.map((y) => (
              <button
                key={y}
                type="button"
                role="tab"
                aria-selected={year === y}
                onClick={() => setYear(y)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-body-xs uppercase tracking-wide transition-colors",
                  year === y ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {y}
              </button>
            ))}
          </div>
          </div>
        </header>

        <div className="mt-12 flex flex-col gap-12">
          {filtered.map((item) => (
            <MediaBlock key={item.src} item={item} />
          ))}
        </div>
      </article>
    </ContentCard>
  );
}
