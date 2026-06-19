"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CubeIcon, XMarkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { BoxAI } from "@/components/box-ai";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { findCaseStudyByPath } from "@/lib/case-studies";
import { useBoxSeed } from "@/components/box-seed";
import { cn } from "@/lib/utils";

export function ContentWorkspace({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [rendered, setRendered] = React.useState(false);
  const [exiting, setExiting] = React.useState(false);
  const enabled = pathname !== "/who" && pathname !== "/conversations" && pathname !== "/";
  const boxParam = useSearchParams().get("box");
  const inProgressPaths = [
    "/projects/next-gen-bar",
    "/projects/sqe2",
    "/projects/powerscore-ai-tutor",
    "/projects/onebarbri",
    "/projects/deborah",
  ];
  const launcherEnabled = enabled && !pathname.startsWith("/admin") && (!inProgressPaths.includes(pathname) || !!boxParam);
  const { state, isMobile } = useSidebar();
  const showTrigger = state === "collapsed" || isMobile;
  const dynamicSeed = useBoxSeed();
  const contextSeed = dynamicSeed ?? findCaseStudyByPath(pathname);
  const backTo = pathname.startsWith("/extracurriculars/music/")
    ? { href: "/extracurriculars/music", label: "Back" }
    : null;
  const [isDesktop, setIsDesktop] = React.useState(true);
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  React.useEffect(() => { setOpen(false); setExiting(false); setRendered(false); }, [pathname]);

  const boxAI = React.useMemo(
    () => <BoxAI key={boxParam ?? "default"} embedded seed={contextSeed} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contextSeed, boxParam]
  );
  React.useEffect(() => {
    if (boxParam && launcherEnabled) setOpen(true);
  }, [boxParam, launcherEnabled]);

  const router = useRouter();
  const closeDrawer = () => {
    if (isDesktop) setExiting(true);
    else setOpen(false);
    if (boxParam) router.replace(pathname);
  };
  React.useEffect(() => {
    if (open) setRendered(true);
  }, [open]);

  // Measure the outer container height and set it explicitly on the column
  // so BoxAI's h-full resolves to a real pixel value, not scroll height.
  const outerRef = React.useRef<HTMLDivElement>(null);
  const [colHeight, setColHeight] = React.useState<number | undefined>(undefined);
  React.useEffect(() => {
    // Measure the nearest bounded ancestor (main) not the grid itself
    const el = outerRef.current?.closest("main") as HTMLElement | null;
    if (!el) return;
    const ro = new ResizeObserver(() => setColHeight(el.clientHeight));
    ro.observe(el);
    setColHeight(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  const controls = enabled && (
    <div className="absolute left-3 top-3 z-30 flex items-center gap-1">
      {!open && showTrigger && <SidebarTrigger />}
      {!open && launcherEnabled && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => { setRendered(true); setOpen(true); }}
              aria-label="Ask Box"
              className="inline-flex size-7 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted active:scale-95"
            >
              <CubeIcon className="size-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Ask Box</TooltipContent>
        </Tooltip>
      )}
      {backTo && (
        <button
          type="button"
          onClick={() => router.push(backTo.href)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-body-xs uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          {backTo.label}
        </button>
      )}
    </div>
  );

  const desktopOpen = isDesktop && (open || exiting);

  return (
    <div
      ref={outerRef}
      className="h-full min-h-0 transition-[grid-template-columns] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
      style={{
        display: "grid",
        gridTemplateColumns: desktopOpen && rendered ? "30% 8px 1fr" : "0px 0px 1fr",
        overflow: "visible",
      }}
    >
      {/* Box AI column — explicit pixel height so BoxAI's h-full resolves correctly */}
      <div
        className="relative min-w-0 flex flex-col"
        style={{ overflow: "visible", height: colHeight, maxHeight: colHeight }}
        onTransitionEnd={() => {
          if (exiting) { setExiting(false); setOpen(false); setRendered(false); }
        }}
      >
        {rendered && (
          <div
            className={cn(
              "relative flex flex-col flex-1 min-h-0 transition-opacity duration-150",
              exiting ? "opacity-0" : "opacity-100",
            )}
            style={{ overflow: "visible" }}
          >
            <div className="absolute left-2 top-2 z-10 flex items-center gap-1">
              {showTrigger && <SidebarTrigger />}
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close Box"
              className="absolute right-2 top-2 z-10 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
            >
              <XMarkIcon className="size-4" />
            </button>
            {boxAI}
          </div>
        )}
      </div>

      {/* Gap column */}
      <div />

      {/* Content column */}
      <div
        className={cn(
          "relative min-h-0 min-w-0",
          !isDesktop && open && "transition-[padding] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] pl-[min(440px,90vw)]",
        )}
        style={{ overflow: "visible" }}
      >
        {!isDesktop && enabled && rendered && (
          <div
            className={cn(
              "absolute bottom-0 left-0 top-0 z-20 w-[min(440px,90vw)]",
              open
                ? "animate-in slide-in-from-left duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                : "pointer-events-none animate-out slide-out-to-left duration-300 ease-in fill-mode-forwards",
            )}
            onAnimationEnd={() => { if (!open && !exiting) setRendered(false); }}
          >
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close Box"
              className="absolute right-2 top-2 z-10 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
            >
              <XMarkIcon className="size-4" />
            </button>
            {boxAI}
          </div>
        )}
        {controls}
        {children}
      </div>
    </div>
  );
}
