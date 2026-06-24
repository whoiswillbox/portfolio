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
  // Installed PWA only: the nav sits lower (pb-3, no full safe-area reserve), so
  // the box clearance matches the nav's actual height (~4.75rem) instead of the
  // browser's 5rem + safe-bottom — keeping the disclaimer just above the nav.
  // The card top is fixed, so the settings toolbar (absolute) stays put.
  return (
    <div
      className={cn(
        "h-full max-sm:h-[calc(100svh-5rem-env(safe-area-inset-bottom))]",
        "max-sm:[@media(display-mode:standalone)]:h-[calc(100svh-4.75rem)]",
        entered.current && "animate-in fade-in duration-500",
      )}
    >
      <BoxAI />
    </div>
  );
}
