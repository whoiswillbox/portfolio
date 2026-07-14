"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useLayoutEffect, useRef, Suspense, lazy } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const Lottie = lazy(() => import("lottie-react"));

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
  const [loading, setLoading] = useState(false);
  const [animData, setAnimData] = useState<object | null>(null);
  // Scroll-scrub progress: 0 = splash at rest, 1 = fully scrubbed away (→ enter).
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  // Raw (unclamped) scrub, can exceed 1 into the commit buffer.
  const rawRef = useRef(0);
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
  useEffect(() => {
    fetch("/animations/box.json").then(r => r.json()).then(setAnimData).catch(() => null);
  }, []);

  const enter = (path: string) => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    setLoading(true);
    setTimeout(() => { sessionStorage.setItem("entered", "1"); router.push(path); }, 800);
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
        {/* Landing content — parallax-lifts and fades as the splash scrubs away,
            then fully fades when the enter (loading) sequence fires. */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-8 px-12 transition-opacity duration-500",
            loading ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          <FallingBoxes progress={progress} />
          <div
            className="relative z-10 flex w-full max-w-4xl flex-col gap-8"
            style={{
              transform: `translateY(${progress * -140}px)`,
              opacity: 1 - progress,
              transition: "transform 0.1s linear, opacity 0.1s linear",
            }}
          >
            <h1 className="font-display text-display text-secondary">
              William Box is a product designer that pulls, branches, and merges.
            </h1>
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

        {/* Lottie loading state — fades in when loading */}
        <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-500", loading ? "opacity-100" : "opacity-0 pointer-events-none")}>
          <Suspense fallback={null}>
            {animData && <Lottie animationData={animData} loop style={{ width: 120, height: 120, filter: "grayscale(1) opacity(0.5)" }} />}
          </Suspense>
        </div>
      </ContentCard>
    </>
  );
}
