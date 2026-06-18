"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
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

function FallingBoxes() {
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
        <FallingBox key={box.id} box={box} />
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

function FallingBox({ box }: { box: Box }) {
  return (
    <div
      className="absolute top-0"
      style={{
        left: `${box.x}%`,
        animation: `fall ${box.duration}s ${box.delay}s linear infinite`,
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
  const [exiting, setExiting] = useState(false);

  useEffect(() => { setOpen(false); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const enter = (path: string) => {
    // Mark entry time so middleware lets the user skip the landing on refresh
    // for the next 4 hours (matches ENTERED_TTL_MS in middleware.ts).
    document.cookie = `entered_at=${Date.now()}; path=/; max-age=${4 * 60 * 60}`;
    setExiting(true);
    setOpen(true);
    router.push(path);
  };

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
      <ContentCard
        className={cn(
          "relative h-full overflow-hidden flex flex-col items-center justify-center gap-8 px-12",
          "duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] animate-in fade-in slide-in-from-bottom-4",
          exiting && "duration-200 animate-out fade-out fill-mode-forwards"
        )}
      >
        <FallingBoxes />

        <div className="relative z-10 flex w-full max-w-4xl flex-col gap-8">
          <h1 className="text-[clamp(3rem,7vw,7rem)] font-medium leading-[1.05] tracking-tighter" >
            <span className="text-muted-foreground">William Box is a </span><span className="font-mono" style={{ fontFamily: "inherit" }}>product designer</span><span className="text-muted-foreground"> that pulls, branches, and merges.</span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="flex-1 py-6 text-base" disabled={exiting} onClick={() => enter("/who")}>
              I&apos;m a recruiter / hiring manager
            </Button>
            <Button size="lg" variant="outline" className="flex-1 py-6 text-base" disabled={exiting} onClick={() => enter("/who")}>
              I&apos;m a friend
            </Button>
          </div>
        </div>
      </ContentCard>
    </>
  );
}
