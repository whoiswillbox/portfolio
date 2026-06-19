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

  React.useEffect(() => { setOpen(false); setRendered(false); }, [pathname]);

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
    setOpen(false);
    if (boxParam) router.replace(pathname);
  };

  React.useEffect(() => {
    if (open) setRendered(true);
  }, [open]);

  // After close transition finishes, unmount BoxAI
  const onBoxTransitionEnd = () => {
    if (!open) setRendered(false);
  };

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

  const desktopOpen = isDesktop && open;

  return (
    <div className="flex h-full min-h-0 gap-2" style={{ overflow: "visible" }}>
      {/* Box AI panel: width transitions 0 → 30%. ResizablePanel-style containment via flex+min-h-0 */}
      {enabled && (
        <div
          className="flex shrink-0 flex-col transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{
            width: desktopOpen && rendered ? "30%" : "0%",
            overflow: "hidden",
            // Only show on desktop; mobile uses absolute overlay below
            display: isDesktop ? "flex" : "none",
          }}
          onTransitionEnd={onBoxTransitionEnd}
        >
          {rendered && (
            <div
              className={cn(
                "relative flex min-h-0 flex-1 flex-col transition-opacity duration-200",
                open ? "opacity-100" : "opacity-0",
              )}
              style={{ width: "100%", minWidth: "30vw" }}
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
      )}

      {/* Content panel */}
      <div
        className={cn(
          "relative min-h-0 min-w-0 flex-1",
          // Mobile overlay push
          !isDesktop && open && "transition-[padding] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] pl-[min(440px,90vw)]",
        )}
        style={{ overflow: "visible" }}
      >
        {/* Mobile overlay */}
        {!isDesktop && enabled && rendered && (
          <div
            className={cn(
              "absolute bottom-0 left-0 top-0 z-20 w-[min(440px,90vw)]",
              open
                ? "animate-in slide-in-from-left duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                : "pointer-events-none animate-out slide-out-to-left duration-300 ease-in fill-mode-forwards",
            )}
            onAnimationEnd={() => { if (!open) setRendered(false); }}
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
