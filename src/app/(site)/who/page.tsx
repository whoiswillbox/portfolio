"use client";

import { useRef } from "react";
import { BoxAI } from "@/components/box-ai";
import { cn } from "@/lib/utils";

export default function Who() {
  // Read flag synchronously on first render — before any effects (including
  // content-workspace's pathname effect) can remove it from sessionStorage.
  const entered = useRef(
    typeof window !== "undefined" && sessionStorage.getItem("entered") === "1"
  );

  // Cap height to stop at the mobile nav's top edge so box-ai's pinned
  // input/disclaimer sit just above the nav, never under it.
  //
  // Installed PWA only: the nav drops lower (pb-0, no safe-area reserve), so
  // bring the box content down with it by reclaiming that clearance (drop the
  // safe-bottom term + a touch more). The card top is fixed, so the settings
  // toolbar (absolute) stays put — only the content below shifts down.
  return (
    <div
      className={cn(
        "h-full max-sm:h-[calc(100svh-5rem-env(safe-area-inset-bottom))]",
        "max-sm:[@media(display-mode:standalone)]:h-[calc(100svh-3.5rem)]",
        entered.current && "animate-in fade-in duration-500",
      )}
    >
      <BoxAI />
    </div>
  );
}
