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
  const enabled = pathname !== "/who" && pathname !== "/conversations" && pathname !== "/settings" && pathname !== "/" && pathname !== "/extracurriculars" && pathname !== "/technergetics" && pathname !== "/school";
  const searchParams = useSearchParams();
  const boxParam = searchParams.get("box");
  const enteredParam = searchParams.get("entered");
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
    : pathname.startsWith("/extracurriculars/")
    ? { href: "/extracurriculars", label: "Back" }
    : pathname.startsWith("/technergetics/") || pathname.startsWith("/projects/")
    ? { href: "/technergetics", label: "Back" }
    : pathname.startsWith("/school/")
    ? { href: "/school", label: "Back" }
    : pathname === "/resume"
    ? { href: "/technergetics", label: "Back" }
    : null;
  const [isDesktop, setIsDesktop] = React.useState(true);
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const { setOpen: setSidebarOpen } = useSidebar();
  React.useEffect(() => {
    const entering = sessionStorage.getItem("entered") === "1";
    setOpen(false);
    setExiting(false);
    setRendered(false);
    setSplitPct(30);
    // Sidebar is collapsed by SSR default (see layout). Open it on the client
    // for any non-landing page (hard refresh + entering flow); the landing keeps
    // the collapsed default, so no toggle needed there.
    if (pathname !== "/") {
      requestAnimationFrame(() => setSidebarOpen(true));
    }
    if (entering) sessionStorage.removeItem("entered");
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (open) {
      setRendered(true);
    }
  }, [open]);

  // Measure the outer container height and set it explicitly on the column
  // so BoxAI's h-full resolves to a real pixel value, not scroll height.

  const controls = enabled && (
    <div className="contents">
      {/* Desktop: cube icon top-left */}
      <div className="absolute left-3 top-3 z-30 flex items-center gap-1 max-sm:hidden">
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
      </div>
      {/* Mobile: back button left */}
      {backTo && (
        <div className="sm:hidden absolute left-4 top-6 max-sm:[@media(display-mode:standalone)]:top-[4.5rem] z-30">
          <button
            type="button"
            onClick={() => router.push(backTo.href)}
            className="flex size-10 items-center justify-center rounded-lg bg-muted ring-1 ring-border shadow-sm text-foreground transition-colors active:scale-95"
          >
            <ArrowLeftIcon className="size-5" />
          </button>
        </div>
      )}
      {/* Mobile: cube icon right */}
      {!open && launcherEnabled && (
        <div className="sm:hidden absolute right-4 top-6 max-sm:[@media(display-mode:standalone)]:top-[4.5rem] z-30">
          <button
            type="button"
            onClick={() => { setRendered(true); setOpen(true); }}
            aria-label="Ask Box"
            className="flex size-10 items-center justify-center rounded-lg bg-muted ring-1 ring-border shadow-sm text-foreground transition-colors active:scale-95"
          >
            <CubeIcon className="size-5" />
          </button>
        </div>
      )}
    </div>
  );

  const desktopOpen = isDesktop && (open || exiting);
  const [splitPct, setSplitPct] = React.useState(30);
  const [isDragging, setIsDragging] = React.useState(false);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);

  const onHandleMouseDown = (e: React.MouseEvent) => {
    if (!desktopOpen) return;
    dragging.current = true;
    setIsDragging(true);
    e.preventDefault();
    const onMove = (ev: MouseEvent) => {
      if (!dragging.current || !gridRef.current) return;
      const rect = gridRef.current.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setSplitPct(Math.min(70, Math.max(30, pct)));
    };
    const onUp = () => { dragging.current = false; setIsDragging(false); window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      ref={gridRef}
      className={cn("h-full min-h-0", !isDragging && "transition-[grid-template-columns] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]")}
      style={{
        display: "grid",
        gridTemplateColumns: desktopOpen && rendered ? `${splitPct}% 16px 1fr` : "0px 0px 1fr",
        overflow: "visible",
      }}
    >
      {/* Box AI column — explicit pixel height so BoxAI's h-full resolves correctly */}
      <div
        className="relative min-w-0 flex flex-col"
        style={{ overflow: "visible", height: "calc(100dvh - 1rem)", maxHeight: "calc(100dvh - 1rem)" }}
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
            <div className="absolute left-2 top-2 z-10 flex items-center gap-1 max-sm:top-[calc(0.5rem+env(safe-area-inset-top))]">
              {showTrigger && <SidebarTrigger className="max-sm:hidden" />}
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

      {/* Drag handle */}
      <div
        className="group flex cursor-col-resize items-center justify-center"
        onMouseDown={onHandleMouseDown}
      >
        <div className="h-12 w-1 rounded-full bg-sidebar-border transition-colors group-hover:bg-muted-foreground/40" />
      </div>

      {/* Content column */}
      <div
        className={cn(
          "relative min-h-0 min-w-0",
          !isDesktop && open && "sm:transition-[padding] sm:duration-300 sm:ease-[cubic-bezier(0.32,0.72,0,1)] sm:pl-[min(440px,90vw)]",
        )}
        style={{ overflow: "visible", height: "100%" }}
      >
        {!isDesktop && enabled && rendered && (
          <div
            className={cn(
              "absolute bottom-0 left-0 top-0 z-20 max-sm:right-0 sm:w-[min(440px,90vw)]",
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
        <div className="h-full min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}
