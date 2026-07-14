"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  return (
    <Suspense fallback={null}>
      <LandingInner />
    </Suspense>
  );
}

function LandingInner() {
  const { setOpen } = useSidebar();
  const searchParams = useSearchParams();

  // ONE-PAGE MODEL (try/nav-bar-shell): the real <BoxAI/> is mounted right here,
  // in its final layout, from the start. The splash OVERLAYS it and scrubs away
  // as you scroll (progress 0→1), revealing the live Box AI beneath. There is NO
  // navigation to /who and no remount — so there's no reflow/jump.
  //
  // Skip the splash entirely (start revealed) when navigating to the Box HOME:
  //  - via the nav logo / switcher / New chat (?box-home=1) — the logo must land
  //    on the live Box AI, NOT re-show the splash, or
  //  - deep-linking into a conversation (?c=<id>) — the splash must not cover it.
  // useSearchParams (not a mount-only read) so this also fires when the param
  // changes on the SAME route (clicking the logo while already on "/").
  const skipSplash = searchParams.has("box-home") || searchParams.has("c");

  const [progress, setProgress] = useState(skipSplash ? 1 : 0);
  const progressRef = useRef(progress);
  const reducedMotion = useRef(false);
  const revealed = progress >= 1;

  // The splash cube must SETTLE exactly onto Box AI's (hidden) empty-state cube
  // slot so it reads as one continuous cube. Measure that slot's viewport
  // center and steer the settled cube there (relative to true screen center,
  // where the splash cube's own container centers it).
  const [cubeTarget, setCubeTarget] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      const slot = document.querySelector<HTMLElement>(".landing-box .box-cube");
      if (slot) {
        const r = slot.getBoundingClientRect();
        // Only trust a real, laid-out slot (Box AI's empty state renders async;
        // a 0-size box means it isn't ready yet).
        if (r.width > 0 && r.height > 0) {
          setCubeTarget((prev) => {
            const x = r.left + r.width / 2 - window.innerWidth / 2;
            const y = r.top + r.height / 2 - window.innerHeight / 2;
            return prev.x === x && prev.y === y ? prev : { x, y };
          });
        }
      }
      raf = requestAnimationFrame(measure);
    };
    // The splash cube is the SOLE cube and must always sit exactly on Box AI's
    // (hidden) empty-state slot — including on a direct ?box-home entry that
    // never scrubs. So keep measuring every frame (cheap: no-op when unchanged)
    // rather than stopping when revealed, else direct entry keeps the initial
    // {0,0} target and the cube mis-places.
    raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, []);

  // React to the box-home / c param: force full progress (splash cleared) and
  // strip the transient ?box-home marker from the URL (keep ?c=).
  useEffect(() => {
    if (!skipSplash) return;
    progressRef.current = 1;
    setProgress(1);
    if (searchParams.has("box-home")) {
      const url = new URL(window.location.href);
      url.searchParams.delete("box-home");
      window.history.replaceState(null, "", url.pathname + url.search);
    }
  }, [skipSplash, searchParams]);

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
      `}</style>

      {/* Everything lives inside ONE content card (same chrome as every other
          page's ContentCard), inset by the SidebarInset m-2. The Box AI and the
          splash overlay are both contained within it — the splash no longer
          covers the full viewport / nav bar, it sits in the card. */}
      <div className="relative h-full overflow-hidden sm:bg-sidebar sm:shadow-lg sm:ring-1 sm:ring-border-divider">
      {/* Live Box AI — in normal flow, same layout as /who. Fades in as the
          splash scrubs away; interactive only once fully revealed. */}
      <div
        className="who-shell landing-box h-full"
        style={{
          opacity: Math.max(0, (progress - 0.4) / 0.6),
          transition: "opacity 0.12s linear",
          pointerEvents: revealed ? "auto" : "none",
        }}
      >
        <BoxAI />
      </div>

      {/* Splash overlay — ABSOLUTE within the card (not fixed), so it reads as a
          card-contained splash; scrubs away as progress rises to reveal Box AI
          beneath. Ignores pointer events once revealed.
          Two independent layers so the cube can OUTLIVE the background: the
          background (bg + falling boxes) fades over 0.6→0.85, but the hero cube
          on the layer above stays crisp until its own fade (0.85→1). */}
      <div
        className="absolute inset-0 z-40 px-12"
        style={{ pointerEvents: revealed ? "none" : "auto" }}
      >
          {/* Background layer — matches the card surface + falling boxes;
              clears over 0.6→0.85. */}
          <div
            className="absolute inset-0 bg-background sm:bg-sidebar"
            style={{
              opacity: Math.max(0, 1 - Math.max(0, progress - 0.6) / 0.25),
              transition: "opacity 0.12s linear",
            }}
          >
            <FallingBoxes progress={progress} />
          </div>

          {/* Hero cube — on its OWN full-screen centered layer so its natural
              origin is EXACTLY screen center. cubeTarget is measured relative to
              screen center, so translate(cubeTarget) lands it precisely on Box
              AI's (hidden) empty-state cube slot — reading as one continuous
              cube. (Keeping the heading on a separate layer below avoids the
              flex-column offset that was pushing the cube up off the slot.) */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div
              style={{
                transform: (() => {
                  const p = progress;
                  const ease = 1 - Math.pow(1 - p, 3);
                  // Start high/small/tilted; settle onto the empty-state cube
                  // slot (cubeTarget) at full progress.
                  const x = ease * cubeTarget.x;
                  const y = -80 + ease * (80 + cubeTarget.y);
                  const scale = 0.6 + ease * 0.4;
                  const rot = (1 - ease) * -35;
                  return `translate(${x}px, ${y}px) scale(${scale}) rotate(${rot}deg)`;
                })(),
                // The SOLE cube: fades in across the scrub (opacity == progress)
                // and STAYS at full opacity once landed. Box AI's own cube is
                // always hidden on landing, so this cube alone represents it —
                // no handoff, no position jump. Settles onto the measured slot.
                opacity: progress,
                transition: "transform 0.12s linear, opacity 0.12s linear",
              }}
            >
              {/* Identical to the Box AI empty-state cube so the handoff is
                  seamless — same size, same paths. */}
              <svg viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-12 text-foreground">
                <path d="M2 9 L12 15 L12 25 L2 19 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" />
                <path d="M22 9 L12 15 L12 25 L22 19 Z" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" />
                <path d="M2 9 L12 3 L22 9 L12 15 Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Splash heading — its own centered layer, sitting below the cube.
              Fades out early in the scrub. */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-12">
            <h1
              className="mt-40 max-w-4xl text-center font-display text-display text-secondary"
              style={{
                transform: `translateY(${progress * -40}px)`,
                opacity: Math.max(0, 1 - progress / 0.4),
              }}
            >
              William Box is a product designer that pulls, branches, and merges.
            </h1>
          </div>

        </div>
      </div>
    </>
  );
}
