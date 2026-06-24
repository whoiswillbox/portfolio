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
  // input/disclaimer sit just above the nav, never under it. Pure-CSS value
  // (nav content height + bottom safe-area inset) — no JS measurement, so it's
  // correct even when arriving from the landing page (where MobileNav, and thus
  // any measured --mobile-nav-height, hasn't mounted yet).
  //
  // Installed PWA only (display-mode: standalone) on mobile: the app draws under
  // the status bar, so the box page sat higher than in the browser. Reserve the
  // top safe-area inset HERE (scoped to /who — not landing/loading/index pages)
  // so the box page matches the browser. The height cap also subtracts the inset
  // so the pinned input/nav stay aligned at the bottom.
  return (
    <div
      className={cn(
        "h-full max-sm:h-[calc(100svh-5rem-env(safe-area-inset-bottom))]",
        "max-sm:[@media(display-mode:standalone)]:mt-[env(safe-area-inset-top)]",
        "max-sm:[@media(display-mode:standalone)]:h-[calc(100svh-5rem-env(safe-area-inset-bottom)-env(safe-area-inset-top))]",
        entered.current && "animate-in fade-in duration-500",
      )}
    >
      <BoxAI />
    </div>
  );
}
