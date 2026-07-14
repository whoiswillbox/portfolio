"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { BoxLogo } from "@/components/box-logo";
import { ContentCard } from "@/components/content-card";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface Box {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  rotationSpeed: number;
}

function FallingBoxes({ progress }: { progress: number }) {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const initial: Box[] = Array.from({ length: 10 }, () => spawnBox(nextId.current++, true));
    setBoxes(initial);

    const interval = setInterval(() => {
      setBoxes(prev => {
        const filtered = prev.filter(b => b.id > nextId.current - 30);
        return [...filtered, spawnBox(nextId.current++, false)];
      });
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {boxes.map(box => (
        <FallingBox key={box.id} box={box} progress={progress} />
      ))}
    </div>
  );
}

function spawnBox(id: number, scattered: boolean): Box {
  return {
    id,
    x: Math.random() * 90 + 5,
    size: Math.random() * 28 + 16,
    duration: Math.random() * 12 + 14,
    delay: scattered ? Math.random() * -20 : 0,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 120,
  };
}

function FallingBox({ box, progress }: { box: Box; progress: number }) {
  // As the splash scrubs away, boxes scatter: accelerate downward + spin faster
  // + fade. Driven by scroll `progress` (0 = rest, 1 = fully scattered).
  return (
    <div
      className="absolute top-0"
      style={{
        left: `${box.x}%`,
        animation: `fall ${box.duration}s ${box.delay}s linear infinite`,
        transform: `translateY(${progress * 120}vh) scale(${1 - progress * 0.4})`,
        opacity: 1 - progress,
        transition: "transform 0.1s linear, opacity 0.1s linear",
      }}
    >
      <svg
        width={box.size}
        height={box.size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-foreground/10"
        style={{
          animation: `spin-box ${Math.abs(box.rotationSpeed / 3)}s linear infinite ${box.rotationSpeed < 0 ? "reverse" : "normal"}`,
        }}
      >
        {/* cube outline */}
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { setOpen } = useSidebar();
  // Returning from /who via scroll-up is a CLIENT navigation (no SSR), so a lazy
  // initializer can read the flag synchronously and start at full progress (Box
  // AI shown) on the very first paint — no splash flash / load jump before the
  // effect would have set it. Consume the flag here so it's one-shot.
  const returnedRef = useRef(false);
  // Scroll-scrub progress: 0 = splash at rest, 1 = fully scrubbed away (→ enter).
  const [progress, setProgress] = useState(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("return-to-landing") === "1") {
      sessionStorage.removeItem("return-to-landing");
      returnedRef.current = true;
      return 1;
    }
    return 0;
  });
  const progressRef = useRef(returnedRef.current ? 1 : 0);
  // Raw (unclamped) scrub, can exceed 1 into the commit buffer.
  const rawRef = useRef(returnedRef.current ? 1 : 0);
  const enteredRef = useRef(false);
  const reducedMotion = useRef(false);

  const cardRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("from-unlock") === "1") {
      sessionStorage.removeItem("from-unlock");
      const el = cardRef.current?.querySelector<HTMLElement>("[data-scroll-container]");
      el?.style.setProperty("--tw-enter-translate-y", "0");
    }
  }, []);

  useEffect(() => { setOpen(false); router.prefetch("/who"); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Publish scroll progress to a document-level CSS var so the app-shell nav bar
  // (which doesn't share this page's state) can fade in with the scrub. Cleared
  // on unmount so other routes aren't affected.
  useEffect(() => {
    document.documentElement.style.setProperty("--enter-progress", String(progress));
    return () => { document.documentElement.style.removeProperty("--enter-progress"); };
  }, [progress]);

  // The hero box has already scrubbed into the Box-logo position/size by the
  // time we enter, so route straight to Box AI — no loading interstitial; the
  // landed cube reads as the Box AI header logo.
  const enter = (path: string) => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    sessionStorage.setItem("entered", "1");
    router.push(path);
  };

  // Scroll-scrub: accumulate wheel / touch delta into a 0→1 progress that drives
  // the splash exit animation. At 1, trigger the route into Box. A downward
  // scroll gesture is the entry; keyboard / click affordance covers a11y and
  // reduced-motion.
  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Total wheel delta (px) needed to fully scrub the splash away.
    const SCRUB_DISTANCE = 700;
    // Extra scrub (as a fraction of full) required PAST the end to commit into
    // Box — the buffer that lets a normal scroll settle at fully-scrubbed
    // without navigating, so you can scroll back up.
    const OVERSCROLL_COMMIT = 0.35;

    const bump = (deltaY: number) => {
      if (enteredRef.current) return;
      // Reduced motion: any downward intent enters immediately (no scrub).
      if (reducedMotion.current) {
        if (deltaY > 0) enter("/who");
        return;
      }
      // Raw scrub is clamped to [0, 1 + OVERSCROLL_COMMIT] so there's no large
      // invisible overshoot to unwind — scrolling up immediately reverses the
      // visible splash. A settle at fully-scrubbed (shown = 1) doesn't commit;
      // entering Box requires continuing to scroll DOWN into the overscroll
      // buffer past the end. Visible progress is clamped to [0, 1].
      const raw = Math.min(
        1 + OVERSCROLL_COMMIT,
        Math.max(0, rawRef.current + deltaY / SCRUB_DISTANCE)
      );
      rawRef.current = raw;
      const shown = Math.min(1, raw);
      progressRef.current = shown;
      setProgress(shown);
      if (raw >= 1 + OVERSCROLL_COMMIT) enter("/who");
    };

    const onWheel = (e: WheelEvent) => {
      // Downward scrubs forward; upward reverses it (scroll back up to return).
      if (e.deltaY === 0) return;
      bump(e.deltaY);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      bump(touchY - y); // dragging up = positive delta = scrub forward
      touchY = y;
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        enter("/who");
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-60px); opacity: 0; }
          5% { opacity: 1; }
          90% { opacity: 0.6; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes spin-box {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes nudge {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(6px); opacity: 1; }
        }
      `}</style>
      <ContentCard
        ref={cardRef}
        className={cn(
          "relative h-full max-sm:min-h-dvh overflow-hidden flex flex-col items-center justify-center gap-8 px-12",
          "animate-in fade-in slide-in-from-bottom-4 duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        )}
      >
        {/* Landing content — parallax-lifts and fades as the splash scrubs away. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-12">

          <FallingBoxes progress={progress} />

          {/* Hero block — MIRRORS the Box AI empty-state layout (mx-auto max-w-2xl,
              vertically centered, cube at the top) so the hero box lands in the
              exact same position the product's header cube occupies. This makes
              the hand-off to /who continuous regardless of viewport. */}
          {/* translate-y nudge: the Box AI block is taller (heading + input +
              chips below the cube), so its vertically-centered cube sits a bit
              lower than ours — push the landing block down to match. */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-center translate-y-12">
            <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 p-6">
              {/* The hero box — scrubs from high/small/faint into the cube slot at
                  the top of this block (progress 1 = the Box AI logo, size-12). */}
              <div
                className="z-20"
                style={{
                  transform: (() => {
                    const p = progress;
                    const ease = 1 - Math.pow(1 - p, 3); // easeOutCubic
                    const y = -180 + ease * 180; // -180px (high) → 0 (in place)
                    const scale = 0.5 + ease * 0.5; // 0.5 → 1 (lands at size-12)
                    const rot = (1 - ease) * -35; // -35deg → 0
                    return `translateY(${y}px) scale(${scale}) rotate(${rot}deg)`;
                  })(),
                  opacity: 0.15 + progress * 0.85, // faint → solid
                  transition: "transform 0.1s linear, opacity 0.1s linear",
                }}
              >
                <BoxLogo className="size-12 text-foreground" />
              </div>

              {/* Below the cube, two layers share the same slot: the SPLASH
                  headline fades OUT and the Box AI empty-state (heading + input +
                  chips) fades IN. The two fades are STAGGERED so they don't
                  overlap: the splash is gone by ~45% scroll, and Box AI only
                  starts fading in at ~55% — leaving a clean middle beat where the
                  cube sits mostly alone. The cube is the fixed pivot. */}
              <div className="relative mt-4 w-full">
                {/* Splash headline — fades out over the FIRST part of the scroll
                    (opacity 1 → 0 across progress 0 → 0.45). */}
                <div
                  className="text-center"
                  style={{
                    transform: `translateY(${progress * -60}px)`,
                    opacity: Math.max(0, 1 - progress / 0.45),
                    transition: "transform 0.1s linear, opacity 0.1s linear",
                  }}
                >
                  <h1 className="font-display text-display text-secondary">
                    William Box is a product designer that pulls, branches, and merges.
                  </h1>
                </div>

                {/* Box AI empty-state (static replica) — fades IN over the LAST
                    part of the scroll (opacity 0 → 1 across progress 0.55 → 1),
                    after the splash has cleared. Non-interactive; real interaction
                    happens after committing into /who. */}
                <div
                  className="absolute inset-x-0 top-0 flex flex-col items-center gap-3"
                  style={{
                    opacity: Math.max(0, (progress - 0.55) / 0.45),
                    transition: "opacity 0.1s linear",
                  }}
                >
                  <h1 className="text-h1">Ask me what drives my craft</h1>
                  {/* Input box + docked privacy notice — mirrors the real Box AI
                      empty state (the notice adds height, so the block matches and
                      the cube lands at the same lower position). */}
                  <div className="mt-3 w-full rounded-2xl border border-border bg-surface text-left shadow-sm">
                    <div className="flex items-start gap-2 p-4 pb-0 text-body-sm text-info">
                      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-info text-[10px] text-white">i</span>
                      <span className="text-info/90">
                        Conversations are saved to help improve Box&apos;s answers over time. Please don&apos;t share anything sensitive.
                      </span>
                    </div>
                    <div className="p-4">
                      <span className="text-body-sm text-muted-foreground">Ask Box…</span>
                      <div className="mt-6 flex justify-end">
                        <span className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">›</span>
                      </div>
                    </div>
                  </div>
                  {/* Chips */}
                  <div className="mt-1 flex flex-wrap justify-center gap-2">
                    {["🌊 Do you surf?", "🚀 How'd you get into product design?", "💡 What are you proudest of?"].map((c) => (
                      <span key={c} className="rounded-lg border bg-muted/40 px-3 py-1.5 text-body-xs text-foreground">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll-to-enter affordance (replaces the buttons). Fades out as the
              scrub progresses. Clickable / keyboard-focusable for a11y. */}
          <button
            type="button"
            onClick={() => enter("/who")}
            aria-label="Enter — scroll or click to view William's work"
            className="group absolute bottom-10 z-10 flex flex-col items-center gap-2 rounded-lg px-4 py-2 text-secondary outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-border-focus"
            style={{ opacity: 1 - progress }}
          >
            <span className="text-body-sm text-muted-foreground transition-colors group-hover:text-foreground">
              Scroll to enter
            </span>
            <ChevronDownIcon
              className="size-5 text-muted-foreground transition-colors group-hover:text-foreground"
              style={{ animation: "nudge 1.8s ease-in-out infinite" }}
              aria-hidden="true"
            />
          </button>
        </div>
      </ContentCard>
    </>
  );
}
