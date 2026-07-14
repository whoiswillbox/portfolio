"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BoxAI } from "@/components/box-ai";

export default function Who() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shellRef = useRef<HTMLDivElement>(null);

  // Scroll-up-to-return: on the Box AI EMPTY state, an upward scroll / swipe at
  // the top navigates back to the landing splash — the reverse of "scroll to
  // enter". Works the SAME for every /who arrival (nav bar, Settings, direct,
  // or router.replace when a chat starts), so it always behaves predictably.
  //
  // A short SETTLE delay after mount prevents a stray scroll event that rides in
  // with the navigation from instantly teleporting you to the landing page.
  useEffect(() => {
    // Only the empty state (no ?c= conversation) supports scroll-back.
    if (searchParams.get("c")) return;

    let returning = false;
    let ready = false;
    const settle = window.setTimeout(() => { ready = true; }, 450);

    const atTop = () => {
      const el = shellRef.current?.querySelector<HTMLElement>("[data-scroll-container], .box-scroll");
      return !el || el.scrollTop <= 0;
    };
    // Box AI marks its root [data-box-empty] only when there's no active
    // conversation AND no open case study. Any project/thread open → no jump.
    const isEmpty = () => !!shellRef.current?.querySelector("[data-box-empty]");
    const goBack = () => {
      if (returning || !ready || !isEmpty() || !atTop()) return;
      returning = true;
      // Start the landing at full progress (Box AI shown) so the upward scroll
      // scrubs the splash back in smoothly instead of snapping.
      sessionStorage.setItem("return-to-landing", "1");
      router.push("/");
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < -8) goBack();
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      const dy = e.touches[0].clientY - touchY; // dragging DOWN = positive = scroll-up intent
      if (dy > 24) goBack();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [router, searchParams]);

  // Cap height to stop at the mobile nav's top edge so box-ai's pinned
  // input/disclaimer sit just above the nav, never under it.
  return (
    <div ref={shellRef} className="who-shell h-full max-sm:h-[calc(100svh-5rem-env(safe-area-inset-bottom))]">
      <BoxAI />
    </div>
  );
}
