"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CubeIcon, XMarkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { BoxAI } from "@/components/box-ai";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { findCaseStudyByPath } from "@/lib/case-studies";
import { useBoxSeed } from "@/components/box-seed";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

/**
 * Wraps page content and lets Box AI slide into the content area as a docked
 * card (not an overlay) from any page. A box button in the top-left toggles
 * it; the page content shrinks to make room so the two cards sit side by side,
 * mirroring the /who experience. Hidden on /who, which already is Box AI.
 *
 * The panel is mounted only while open (kept mounted through its exit animation),
 * so it can never linger/overflow on refresh.
 */
export function ContentWorkspace({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [rendered, setRendered] = React.useState(false);
  const [exiting, setExiting] = React.useState(false);
  // /who and /conversations own their own top bar (sidebar trigger + Back), so
  // ContentWorkspace doesn't overlay its controls there.
  const enabled = pathname !== "/who" && pathname !== "/conversations" && pathname !== "/";
  const boxParam = useSearchParams().get("box");
  // The Box AI launcher is also hidden in the admin area (the sidebar trigger
  // still shows via `enabled`).
  const inProgressPaths = [
    "/projects/next-gen-bar",
    "/projects/sqe2",
    "/projects/powerscore-ai-tutor",
    "/projects/onebarbri",
    "/projects/deborah",
  ];
  const launcherEnabled = enabled && !pathname.startsWith("/admin") && (!inProgressPaths.includes(pathname) || !!boxParam);
  // Expose the sidebar trigger inside the content card when the sidebar is
  // collapsed / on mobile (the sidebar's own header carries it when expanded).
  const { state, isMobile } = useSidebar();
  const showTrigger = state === "collapsed" || isMobile;
  // Seed the chat about this page: a dynamically-registered seed (e.g. a
  // specific playlist) wins, otherwise the project/case-study for this path.
  const dynamicSeed = useBoxSeed();
  const contextSeed = dynamicSeed ?? findCaseStudyByPath(pathname);
  // Detail pages get a Back link in the top-left cluster (next to the box icon),
  // matching the convention across the site.
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

  // Close when navigating between pages.
  React.useEffect(() => { setOpen(false); setExiting(false); setRendered(false); }, [pathname]);
  // Auto-open when arrived at via a conversation in the sidebar
  // (/<project>?box=<id>): Box AI docks beside the case study. Runs after the
  // pathname-close effect above, so it wins on a fresh navigation.
  // Keep a stable BoxAI element across open/close toggles. Without this, every
  // setOpen() re-creates and reconciles the whole chat tree synchronously on
  // the click — that heavy reconcile is what stutters the start of the exit
  // animation. Memoizing pins its identity so React bails out of re-rendering
  // it when only `open` changes; it only rebuilds if the seeded study changes.
  const boxAI = React.useMemo(
    () => <BoxAI key={boxParam ?? "default"} embedded seed={contextSeed} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contextSeed, boxParam]
  );
  React.useEffect(() => {
    if (boxParam && launcherEnabled) setOpen(true);
  }, [boxParam, launcherEnabled]);
  // Closing Box AI drops the ?box=<id> param so the sidebar returns to the
  // project's own nav item (we've cancelled out of the conversation).
  const router = useRouter();
  const closeDrawer = () => {
    if (isDesktop) {
      setExiting(true);
    } else {
      setOpen(false);
    }
    if (boxParam) router.replace(pathname);
  };
  // Mount the panel when opening (it unmounts itself after the exit animation).
  React.useEffect(() => {
    if (open) setRendered(true);
  }, [open]);

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

  // Single persistent grid — columns transition smoothly, no DOM swap ever.
  return (
    <div
      className="relative h-full min-h-0 transition-[grid-template-columns] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
      style={{
        display: "grid",
        gridTemplateColumns: desktopOpen && rendered ? "30% 8px 1fr" : "0px 0px 1fr",
        gridTemplateRows: "100%",
        alignItems: "stretch",
      }}
    >
      {/* Box AI column — same structure as /who page: h-full div wrapping BoxAI */}
      <div
        className="relative min-w-0 flex flex-col overflow-visible" style={{ height: "100%" }}
        onTransitionEnd={() => {
          if (exiting) { setExiting(false); setOpen(false); setRendered(false); }
        }}
      >
        {rendered && (
          <div className={cn("flex-1 min-h-0 transition-opacity duration-150", exiting ? "opacity-0" : "opacity-100")}>
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

      {/* Gap column (only visible on desktop open) */}
      <div />

      {/* Content column */}
      <div
        className={cn(
          "relative min-h-0 min-w-0",
          // Mobile: overlay push
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
