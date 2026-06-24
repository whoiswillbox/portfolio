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
  // Installed PWA only: reduce the bottom clearance so the content (cube/h1 +
  // chips/input/disclaimer) sits closer to the nav. The card top is fixed, so
  // the absolute settings icon stays put — only the content below moves down.
  return (
    <div
      className={cn(
        "h-full max-sm:h-[calc(100svh-5rem-env(safe-area-inset-bottom))]",
        "max-sm:[@media(display-mode:standalone)]:h-[calc(100svh-4rem)]",
        entered.current && "animate-in fade-in duration-500",
      )}
    >
      <BoxAI />
    </div>
  );
}
