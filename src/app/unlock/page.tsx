"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Lottie = lazy(() => import("lottie-react"));

/* Falling-cube background — same decorative motif as the landing page so the
   gate feels like part of the site. */
interface Box {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotationSpeed: number;
}

function FallingBoxes() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const initial: Box[] = Array.from({ length: 10 }, () => spawnBox(nextId.current++, true));
    setBoxes(initial);
    const interval = setInterval(() => {
      setBoxes((prev) => {
        const filtered = prev.filter((b) => b.id > nextId.current - 30);
        return [...filtered, spawnBox(nextId.current++, false)];
      });
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {boxes.map((box) => (
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
    rotationSpeed: (Math.random() - 0.5) * 120,
  };
}

function FallingBox({ box }: { box: Box }) {
  return (
    <div
      className="absolute top-0"
      style={{ left: `${box.x}%`, animation: `fall ${box.duration}s ${box.delay}s linear infinite` }}
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

export default function UnlockPage() {
  return (
    <Suspense fallback={null}>
      <UnlockForm />
    </Suspense>
  );
}

function UnlockForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [animData, setAnimData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/animations/box.json").then((r) => r.json()).then(setAnimData).catch(() => null);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || submitting) return;
    setSubmitting(true);
    setError(false);
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError(true);
        setSubmitting(false);
        return;
      }
      const next = params.get("next") || "/";
      router.replace(next);
      router.refresh();
    } catch {
      setError(true);
      setSubmitting(false);
    }
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
      <div
        className={cn(
          "relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-sidebar px-12",
          "animate-in fade-in slide-in-from-bottom-4 duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        )}
      >
        <FallingBoxes />

        <div className="relative z-10 flex w-full max-w-4xl flex-col gap-8">
          <h1 className="text-[clamp(2.25rem,6vw,5.5rem)] font-medium leading-[1.05] tracking-tighter">
            <span className="text-muted-foreground">I&apos;m currently working on this — </span>
            <span className="font-mono" style={{ fontFamily: "inherit" }}>check back later</span>
            <span className="text-muted-foreground">… unless you know the password.</span>
          </h1>

          <div className="flex flex-col gap-2">
            <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Password"
                aria-label="Password"
                autoFocus
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                className="!h-14 min-h-14 flex-1 bg-background px-4 text-base"
              />
              <Button
                type="submit"
                size="lg"
                disabled={!password.trim() || submitting}
                className="!h-14 min-h-14 text-base sm:w-40"
              >
                {submitting ? "Unlocking…" : "Enter"}
              </Button>
            </form>
            {error && (
              <p className="px-1 text-body-sm text-critical">Incorrect password. Try again.</p>
            )}
          </div>
        </div>

        {/* Loading state — fades in while unlocking */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-sidebar transition-opacity duration-500",
            submitting ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <Suspense fallback={null}>
            {animData && (
              <Lottie animationData={animData} loop style={{ width: 120, height: 120, filter: "grayscale(1) opacity(0.5)" }} />
            )}
          </Suspense>
        </div>
      </div>
    </>
  );
}
