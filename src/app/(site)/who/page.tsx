"use client";

import { BoxAI } from "@/components/box-ai";

export default function Who() {
  // Scroll-up-to-return lives ONLY on "/" (the one-page model: the splash
  // overlays the live Box AI, and scrolling up scrubs the splash back in — the
  // reverse of "scroll to enter"). "/who" is never reached by that scroll
  // gesture; it's only entered by explicit navigation (nav bar, Settings, a
  // project link) or router.replace when a chat starts. So there is NO
  // scroll-back here — you leave Box via the logo / browser back. This keeps
  // /who's scroll behavior plain and predictable (no fresh-nav teleport).

  // Cap height to stop at the mobile nav's top edge so box-ai's pinned
  // input/disclaimer sit just above the nav, never under it.
  return (
    <div className="who-shell h-full max-sm:h-[calc(100svh-5rem-env(safe-area-inset-bottom))]">
      <BoxAI />
    </div>
  );
}
