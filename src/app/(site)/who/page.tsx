"use client";

import { BoxAI } from "@/components/box-ai";

export default function Who() {
  // Note: the "scroll up to return to the landing splash" gesture lives entirely
  // on "/" (the one-page model, where the splash overlays the live Box AI). "/who"
  // is only reached by navigating in (nav bar, or router.replace when a chat
  // starts), never by scrolling down from the splash — so scrolling up here must
  // NOT teleport to the landing page. It's a plain Box AI home.

  // Cap height to stop at the mobile nav's top edge so box-ai's pinned
  // input/disclaimer sit just above the nav, never under it.
  return (
    <div className="who-shell h-full max-sm:h-[calc(100svh-5rem-env(safe-area-inset-bottom))]">
      <BoxAI />
    </div>
  );
}
