"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { BoxAI } from "@/components/box-ai";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { findCaseStudyByPath } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

/**
 * Wraps page content and lets Box AI slide into the content area as a docked
 * card (not an overlay) from any page. A magic button in the top-left toggles
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
  const enabled = pathname !== "/who";
  // Expose the sidebar trigger inside the content card when the sidebar is
  // collapsed / on mobile (the sidebar's own header carries it when expanded).
  const { state, isMobile } = useSidebar();
  const showTrigger = state === "collapsed" || isMobile;
  // If this page is a project with a case study, seed the chat about it.
  const contextSlug = findCaseStudyByPath(pathname)?.slug;

  // Close when navigating between pages.
  React.useEffect(() => setOpen(false), [pathname]);
  // Mount the panel when opening (it unmounts itself after the exit animation).
  React.useEffect(() => {
    if (open) setRendered(true);
  }, [open]);

  return (
    <div className="relative h-full min-h-0">
      {/* Page content — shrinks on desktop to make room for the panel. */}
      <div
        className={cn(
          "h-full transition-[padding] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          open && "lg:pl-[452px]"
        )}
      >
        {children}
      </div>

      {enabled && (
        <>
          {/* Top-left controls inside the content card: sidebar trigger first
              (when collapsed), then the magic launcher. */}
          <div className="absolute left-3 top-3 z-30 flex items-center gap-1">
            {showTrigger && <SidebarTrigger />}
            {!open && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Ask TopRat"
                className="inline-flex size-7 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted active:scale-95"
              >
                <SparklesIcon className="size-5" />
              </button>
            )}
          </div>

          {/* Slide-in Box AI content card — docks on the left. Mounted only
              while open / animating out; slides via transform (GPU). */}
          {rendered && (
            <div
              className={cn(
                "absolute bottom-0 left-0 top-0 z-20 w-[min(440px,90vw)] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                open
                  ? "animate-in slide-in-from-left"
                  : "pointer-events-none animate-out slide-out-to-left"
              )}
              onAnimationEnd={() => {
                if (!open) setRendered(false);
              }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close TopRat"
                className="absolute right-2 top-2 z-10 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
              >
                <XMarkIcon className="size-4" />
              </button>
              <BoxAI embedded seedSlug={contextSlug} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
