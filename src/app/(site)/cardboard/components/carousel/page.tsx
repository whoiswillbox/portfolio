"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/cardboard/carousel";
import { ComponentPage, Demo } from "../_component-page";

export default function CarouselDocs() {
  return (
    <ComponentPage
      title="Carousel"
      description="A swipeable slide container built on Embla. The prev/next controls are Cardboard Buttons with Heroicons arrows; the track and slides carry no color of their own."
    >
      <Demo title="Basic" caption="Drag, arrow-key, or use the buttons to move.">
        <div className="mx-auto w-full max-w-xs px-12">
          <Carousel>
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, i) => (
                <CarouselItem key={i}>
                  <div className="flex aspect-square items-center justify-center rounded-xl border border-border bg-muted text-h2 text-foreground">
                    {i + 1}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </Demo>
    </ComponentPage>
  );
}
