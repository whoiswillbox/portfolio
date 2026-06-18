import Image from "next/image";
import { ContentCard } from "@/components/content-card";

const HERO = { src: "/projects/surfing/0F5A4554.jpeg", alt: "Surfing a wave in Nicaragua" };
const GIF = { src: "/projects/surfing/nica.gif", alt: "Surfing Nicaragua" };


export default function Surfing() {
  return (
    <ContentCard className="h-full overflow-auto">
      <article className="mx-auto w-full max-w-4xl px-6 pb-32 pt-28">
        <header className="flex flex-col gap-3">
          <h1 className="text-h1 font-bold tracking-tight">Surfing</h1>
          <p className="max-w-xl text-body-lg text-muted-foreground">
            Chasing waves wherever the swell takes me.
          </p>
        </header>

        <div className="mt-12 flex flex-col gap-12">
          {/* Hero shot */}
          <section className="flex flex-col gap-4">
            <h2 className="font-mono text-body-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Nicaragua · Playa Escondido · 2023
            </h2>
            <div className="relative aspect-[16/7] w-full overflow-hidden rounded-xl">
              <Image
                src={HERO.src}
                alt={HERO.alt}
                fill
                priority
                sizes="(min-width: 1024px) 56rem, 100vw"
                className="object-cover"
              />
            </div>
          </section>

          {/* GIF */}
          <section className="flex flex-col gap-4">
            <h2 className="font-mono text-body-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Nicaragua · Manzanillo · 2023
            </h2>
            <div className="overflow-hidden rounded-xl" style={{ maxWidth: "320px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={GIF.src} alt={GIF.alt} className="h-auto w-full object-cover object-top" />
            </div>
          </section>

        </div>
      </article>
    </ContentCard>
  );
}
