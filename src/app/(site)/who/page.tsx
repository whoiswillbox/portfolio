"use client";

import { BoxAI } from "@/components/box-ai";

export default function Who() {
  // TRIAL (try/nav-bar-shell): no entrance fade. The landing scrub lands the
  // hero cube exactly on the Box AI header cube, so Box AI must appear instantly
  // — a fade-in here flashes the cube and breaks the seamless hand-off.
  //
  // Cap height to stop at the mobile nav's top edge so box-ai's pinned
  // input/disclaimer sit just above the nav, never under it.
  return (
    <div className="who-shell h-full max-sm:h-[calc(100svh-5rem-env(safe-area-inset-bottom))]">
      <BoxAI />
    </div>
  );
}
