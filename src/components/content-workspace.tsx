"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CubeIcon, XMarkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { BoxAI } from "@/components/box-ai";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { findCaseStudyByPath } from "@/lib/case-studies";
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
  // /who and /conversations own their own top bar (sidebar trigger + Back), so
  // ContentWorkspace doesn't overlay its controls there.
  const enabled = pathname !== "/who" && pathname !== "/conversations";
  // The Box AI launcher is also hidden in the admin area (the sidebar trigger
  // still shows via `enabled`).
  const launcherEnabled = enabled && !pathname.startsWith("/admin");
  // Expose the sidebar trigger inside the content card when the sidebar is
  // collapsed / on mobile (the sidebar's own header carries it when expanded).
  const { state, isMobile } = useSidebar();
  const showTrigger = state === "collapsed" || isMobile;
  // If this page is a project with a case study, seed the chat about it.
  const contextSlug = findCaseStudyByPath(pathname)?.slug;
  // Detail pages get a Back link in the top-left cluster (next to the box icon),
  // matching the convention across the site.
  const backTo = pathname.startsWith("/extracurriculars/music/")
    ? { href: "/extracurriculars/music", label: "Back" }
    : null;
  // Keep a stable BoxAI element across open/close toggles. Without this, every
  // setOpen() re-creates and reconciles the whole chat tree synchronously on
  // the click — that heavy reconcile is what stutters the start of the exit
  // animation. Memoizing pins its identity so React bails out of re-rendering
  // it when only `open` changes; it only rebuilds if the seeded study changes.
  const boxAI = React.useMemo(
    () => <BoxAI embedded seedSlug={contextSlug} />,
    [contextSlug]
  );

  // Close when navigating between pages.
  React.useEffect(() => setOpen(false), [pathname]);
  // Auto-open when arrived at via a conversation in the sidebar
  // (/<project>?box=<id>): Box AI docks beside the case study. Runs after the
  // pathname-close effect above, so it wins on a fresh navigation.
  const boxParam = useSearchParams().get("box");
  React.useEffect(() => {
    if (boxParam) setOpen(true);
  }, [boxParam]);
  // Closing Box AI drops the ?box=<id> param so the sidebar returns to the
  // project's own nav item (we've cancelled out of the conversation).
  const router = useRouter();
  const closeDrawer = () => {
    setOpen(false);
    if (boxParam) router.replace(pathname);
  };
  // Mount the panel when opening (it unmounts itself after the exit animation).
  React.useEffect(() => {
    if (open) setRendered(true);
  }, [open]);

  return (
    <div className="relative h-full min-h-0">
      {/* Page content — shrinks on desktop to make room for the panel. It
          animates in BOTH directions, in sync with the panel, so the exit is a
          true mirror of the entrance (page + panel move together). Easing is
          asymmetric on purpose — decelerate in (ease-out), accelerate out
          (ease-in) — the standard enter/exit pattern, which avoids the lingering
          tail a single ease-out leaves on the way out. */}
      <div
        className={cn(
          "h-full transition-[padding]",
          open
            ? "duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:pl-[452px]"
            : "duration-300 ease-in lg:pl-0"
        )}
      >
        {children}
      </div>

      {enabled && (
        <>
          {/* Top-left controls inside the content card: sidebar trigger first
              (when collapsed), then the Box AI launcher. */}
          <div className="absolute left-3 top-3 z-30 flex items-center gap-1">
            {showTrigger && <SidebarTrigger />}
            {!open && launcherEnabled && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
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
                onClick={() => {
                  // Prefer client history so we return to the already-rendered
                  // Music page instantly (data + scroll intact) instead of a
                  // fresh RSC navigation; fall back to a push on a cold deep link.
                  if (window.history.length > 1) router.back();
                  else router.push(backTo.href);
                }}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-body-xs uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ArrowLeftIcon className="size-4" />
                {backTo.label}
              </button>
            )}
          </div>

          {/* Slide-in Box AI content card — docks on the left. Mounted only
              while open / animating out; slides via transform (GPU). */}
          {rendered && (
            <div
              className={cn(
                "absolute bottom-0 left-0 top-0 z-20 w-[min(440px,90vw)]",
                open
                  ? // Enter: ease-out — decelerate gently into place, fading in.
                    "duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] animate-in slide-in-from-left fade-in"
                  : // Exit: ease-in — accelerate away cleanly while fading out,
                    // so the card dissolves rather than hard-cutting at the end.
                    // The previous ease-out left a long tail where the card's
                    // shadow edge crept off-screen for ~285ms, which read as exit
                    // "lag". fill-mode-forwards holds the off-screen + faded end
                    // state until React unmounts; without it the keyframe
                    // (fill-mode: none) snaps the card back to visible for one
                    // frame at the end — the end "glitch".
                    "pointer-events-none duration-300 ease-in animate-out slide-out-to-left fade-out fill-mode-forwards"
              )}
              onAnimationEnd={() => {
                if (!open) setRendered(false);
              }}
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
        </>
      )}
    </div>
  );
}
