"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BoxAI } from "@/components/box-ai";

export default function Who() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shellRef = useRef<HTMLDivElement>(null);

  // Scroll-up-to-return: on the Box AI EMPTY state, an upward scroll / swipe
  // navigates back to the landing splash — the reverse of "scroll to enter".
  //
  // IMPORTANT: it must NOT fire the instant you navigate INTO /who from
  // elsewhere (nav bar, a project link). On a fresh mount the chat is trivially
  // "at top", so a first upward flick would teleport to the landing page — jarring.
  // So the gesture is ARMED only after the user has scrolled DOWN at least once
  // (or moved away from the very top). That way it only triggers as a deliberate
  // reverse of a scroll you already made, never on arrival.
  useEffect(() => {
    // Only the empty state (no ?c= conversation) supports scroll-back.
    if (searchParams.get("c")) return;

    let returning = false;
    let armed = false; // becomes true once the user scrolls down / off the top
    const scroller = () =>
      shellRef.current?.querySelector<HTMLElement>("[data-scroll-container], .box-scroll");
    const atTop = () => {
      const el = scroller();
      return !el || el.scrollTop <= 0;
    };
    // Box AI marks its root [data-box-empty] only when there's no active
    // conversation AND no open case study. Any project/thread open → no jump.
    const isEmpty = () => !!shellRef.current?.querySelector("[data-box-empty]");
    const goBack = () => {
      if (returning || !armed || !isEmpty()) return;
      returning = true;
      // Tell the landing to start at full progress (Box AI shown) so scrolling
      // up reverses smoothly back to the splash instead of snapping.
      sessionStorage.setItem("return-to-landing", "1");
      router.push("/");
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) { armed = true; return; } // scrolled down → arm
      if (e.deltaY < -8 && atTop()) goBack();
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      const dy = e.touches[0].clientY - touchY; // dragging DOWN = positive = scroll-up intent
      if (dy < 0) { armed = true; return; }      // dragging up = content down → arm
      if (dy > 24 && atTop()) goBack();
    };
    // Also arm once the chat has any real scroll position (e.g. content taller
    // than the viewport and the user scrolled the inner container directly).
    const onScroll = () => { if ((scroller()?.scrollTop ?? 0) > 0) armed = true; };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", onScroll, { capture: true } as EventListenerOptions);
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
