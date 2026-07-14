"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BoxAI } from "@/components/box-ai";

export default function Who() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shellRef = useRef<HTMLDivElement>(null);

  // TRIAL (try/nav-bar-shell): scroll-up-to-return. On the Box AI EMPTY state
  // (no active conversation) and while the chat is scrolled to the top, an
  // upward scroll / swipe navigates back to the landing splash — the reverse of
  // the landing "scroll to enter". Disabled once a conversation is open (there,
  // scrolling up reads message history).
  useEffect(() => {
    // Only the empty state (no ?c= conversation) supports scroll-back.
    if (searchParams.get("c")) return;

    let returning = false;
    const atTop = () => {
      const el = shellRef.current?.querySelector<HTMLElement>("[data-scroll-container], .box-scroll");
      return !el || el.scrollTop <= 0;
    };
    const goBack = () => {
      if (returning) return;
      returning = true;
      // Tell the landing to start at full progress (Box AI shown) so scrolling
      // up reverses smoothly back to the splash instead of snapping.
      sessionStorage.setItem("return-to-landing", "1");
      router.push("/");
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < -8 && atTop()) goBack();
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      const dy = e.touches[0].clientY - touchY; // dragging DOWN = positive = scroll up intent
      if (dy > 24 && atTop()) goBack();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
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
