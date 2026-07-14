"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { BoxLogo } from "@/components/box-logo";
import { BoxAI } from "@/components/box-ai";
import { useSidebar } from "@/components/ui/sidebar";

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
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    </div>
  );
}

export default function LandingPage() {
  const { setOpen } = useSidebar();

  // ONE-PAGE MODEL (try/nav-bar-shell): the real <BoxAI/> is mounted right here,
  // in its final layout, from the start. The splash OVERLAYS it and scrubs away
  // as you scroll (progress 0→1), revealing the live Box AI beneath. There is NO
  // navigation to /who and no remount — so there's no reflow/jump. /who still
  // exists as the direct-access Box home (conversations, switcher, logo).
  // When arriving via /who's scroll-back, start at full progress (Box AI already
  // revealed, splash out of the way) and consume the flag — so the incoming
  // upward scroll SCRUBS the splash back in smoothly instead of the splash
  // snapping to fully-shown on mount.
  const [progress, setProgress] = useState(() => {
    if (typeof window === "undefined") return 0;
    if (sessionStorage.getItem("return-to-landing") === "1") {
      sessionStorage.removeItem("return-to-landing");
      return 1;
    }
    return 0;
  });
  const progressRef = useRef(progress);
  const reducedMotion = useRef(false);
  const revealed = progress >= 1;

  useEffect(() => { setOpen(false); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll-scrub: wheel / touch delta drives progress 0↔1. Down reveals Box AI;
  // up (while Box AI is scrolled to its top) returns to the splash. Once fully
  // revealed, the wheel is NOT intercepted so Box AI scrolls itself.
  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const SCRUB_DISTANCE = 700;

    // True when the Box AI scroll area is at its very top (so an upward scroll
    // should scrub the splash back rather than scroll Box AI content).
    const boxAtTop = () => {
      const el = document.querySelector<HTMLElement>(".box-scroll, [data-scroll-container]");
      return !el || el.scrollTop <= 0;
    };
    // Box AI is "empty" (safe to scrub back to the splash) only when no
    // conversation or project is open — it marks its root [data-box-empty].
    const boxEmpty = () => !!document.querySelector("[data-box-empty]");

    const bump = (deltaY: number) => {
      if (reducedMotion.current) {
        setProgress(deltaY > 0 ? 1 : 0);
        progressRef.current = deltaY > 0 ? 1 : 0;
        return;
      }
      // Down while not fully revealed → scrub forward. Up while revealed only
      // scrubs back if Box AI is already at its top (otherwise let it scroll).
      if (deltaY > 0 && progressRef.current >= 1) return; // in Box AI, let it scroll
      // Once revealed, only scrub back if Box AI is empty AND at its top —
      // an open conversation/project keeps you in Box AI (scroll up reads history).
      if (deltaY < 0 && progressRef.current >= 1 && (!boxEmpty() || !boxAtTop())) return;

      const next = Math.min(1, Math.max(0, progressRef.current + deltaY / SCRUB_DISTANCE));
      progressRef.current = next;
      setProgress(next);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      bump(e.deltaY);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      bump(touchY - y); // dragging up = positive = scrub forward
      touchY = y;
    };

    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "ArrowDown" || e.key === "PageDown") && progressRef.current < 1) {
        e.preventDefault();
        progressRef.current = 1;
        setProgress(1);
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

  // Publish progress so the app-shell nav bar fades in with the scrub.
  useEffect(() => {
    document.documentElement.style.setProperty("--enter-progress", String(progress));
    return () => { document.documentElement.style.removeProperty("--enter-progress"); };
  }, [progress]);

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

      {/* Live Box AI — in normal flow, same layout as /who. Fades in as the
          splash scrubs away; interactive only once fully revealed. */}
      <div
        className="who-shell h-full"
        style={{
          opacity: Math.max(0, (progress - 0.4) / 0.6),
          transition: "opacity 0.12s linear",
          pointerEvents: revealed ? "auto" : "none",
        }}
      >
        <BoxAI />
      </div>

      {/* Splash overlay — FIXED full-viewport (above the nav bar) so it reads as
          a full-bleed splash; scrubs away as progress rises to reveal Box AI +
          nav bar beneath. Ignores pointer events once revealed. */}
      <div
        className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background px-12"
        style={{
          opacity: Math.max(0, 1 - progress / 0.6),
          transition: "opacity 0.12s linear",
          pointerEvents: revealed ? "none" : "auto",
        }}
      >
          <FallingBoxes progress={progress} />

          {/* Hero cube — the pivot; scrubs from high/small/faint toward the Box AI
              logo position as the splash clears. */}
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-6">
            <div
              style={{
                transform: (() => {
                  const p = progress;
                  const ease = 1 - Math.pow(1 - p, 3);
                  const y = -80 + ease * 80;
                  const scale = 0.6 + ease * 0.4;
                  const rot = (1 - ease) * -35;
                  return `translateY(${y}px) scale(${scale}) rotate(${rot}deg)`;
                })(),
                opacity: 0.2 + Math.min(1, progress) * 0.8,
                transition: "transform 0.12s linear, opacity 0.12s linear",
              }}
            >
              <BoxLogo className="size-14 text-foreground" />
            </div>
            <h1
              className="max-w-4xl text-center font-display text-display text-secondary"
              style={{
                transform: `translateY(${progress * -40}px)`,
                opacity: Math.max(0, 1 - progress / 0.4),
              }}
            >
              William Box is a product designer that pulls, branches, and merges.
            </h1>
          </div>

          {/* Scroll-to-enter affordance. */}
          <button
            type="button"
            onClick={() => { progressRef.current = 1; setProgress(1); }}
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
    </>
  );
}
