"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type LightboxImage = { src: string; alt: string; width: number; height: number };

export function ImageLightbox({ src, alt, width, height, fill, sizes, className }: LightboxImage & {
  fill?: boolean;
  sizes?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[min(90vw,72rem)] gap-3 p-4">
          <DialogTitle className="text-sm font-medium">{alt}</DialogTitle>
          <div className="relative w-full">
            <Image src={src} alt={alt} width={width} height={height} quality={95} className="h-auto w-full rounded-lg" />
          </div>
        </DialogContent>
      </Dialog>
      <button
        type="button"
        className="group relative block h-full w-full cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          {...(fill ? { fill: true } : { width, height })}
          sizes={sizes}
          className={className}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl backdrop-blur-[0px] transition-[backdrop-filter] duration-200 group-hover:backdrop-blur-sm">
          <Badge variant="outline" className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-background/80 font-mono uppercase tracking-wide shadow-sm gap-1.5">
            Take a closer look <ArrowUpRightIcon className="size-3" />
          </Badge>
        </div>
      </button>
    </>
  );
}
