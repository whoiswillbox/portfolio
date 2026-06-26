"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  MoonIcon,
  SunIcon,
  ShieldCheckIcon,
  WindowIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePwaInstall } from "@/lib/use-pwa-install";

export function SettingsList({ isAdmin = false }: { isAdmin?: boolean }) {
  const { state, isMobile } = useSidebar();
  const showTrigger = state === "collapsed" || isMobile;
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  const {
    canShow: showInstall,
    installed,
    showHint,
    hint: installHint,
    install: handleInstall,
  } = usePwaInstall();

  return (
    <ContentCard className="flex h-full flex-col">
      {/* Top bar — sidebar trigger only (Settings is a top-level item, no Back). */}
      {showTrigger && (
        <div className="flex items-center gap-1 p-2 max-sm:hidden">
          <SidebarTrigger />
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-4xl px-6 pb-10 pt-16 max-sm:pt-28 max-sm:[@media(display-mode:standalone)]:pt-36">
          <header className="flex flex-col gap-3 mb-10">
            <h1 className="text-h1 font-semibold">Settings</h1>
            <p className="text-body-lg text-muted-foreground">
              Preferences and shortcuts.
            </p>
          </header>

          <div className="flex flex-col divide-y divide-border/50">
            {/* Dark mode toggle */}
            <div className="flex items-center gap-4 px-3 py-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border">
                {isDark ? (
                  <MoonIcon className="size-5 text-foreground" />
                ) : (
                  <SunIcon className="size-5 text-foreground" />
                )}
              </div>
              <div className="flex flex-1 min-w-0 flex-col gap-1">
                <div className="text-sm font-medium">Dark mode</div>
                <div className="text-xs text-muted-foreground">
                  Switch between light and dark themes.
                </div>
              </div>
              <Switch
                checked={isDark}
                onCheckedChange={(checked) => {
                  setTheme(checked ? "dark" : "light");
                  // Update theme-color immediately so the browser/Safari chrome
                  // responds without waiting for the MutationObserver.
                  const color = checked ? "#1c1917" : "#fafaf9";
                  const tag = document.querySelector<HTMLMetaElement>(
                    'meta[name="theme-color"]'
                  );
                  if (tag) tag.content = color;
                }}
                aria-label="Toggle dark mode"
              />
            </div>

            {/* Install app (PWA) */}
            {(showInstall || installed) && (
              <div className="flex flex-col">
                {installed ? (
                  <div className="flex items-center gap-4 px-3 py-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border">
                      <CheckCircleIcon className="size-5 text-foreground" />
                    </div>
                    <div className="flex flex-1 min-w-0 flex-col gap-1">
                      <div className="text-sm font-medium">App installed</div>
                      <div className="text-xs text-muted-foreground">
                        You&apos;re running the installed app.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 px-3 py-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border">
                      <ArrowDownTrayIcon className="size-5 text-foreground" />
                    </div>
                    <div className="flex flex-1 min-w-0 flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium">Download app</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              aria-label="About installing the app"
                              className="text-muted-foreground transition-colors hover:text-foreground"
                            >
                              <InformationCircleIcon className="size-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            Adds this site to your phone or computer like a regular
                            app. You get a tidy icon to tap, a clean full-screen
                            view, quicker opening, and it still works without internet.
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Install this portfolio as an app.
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="default"
                      onClick={handleInstall}
                      className="shrink-0"
                    >
                      <ArrowDownTrayIcon className="size-4" />
                      Download
                    </Button>
                  </div>
                )}
                {/* Manual instructions when no native install prompt is available. */}
                {showHint && !installed && (
                  <div className="mb-2 ml-14 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                    {installHint}
                  </div>
                )}
              </div>
            )}

            {/* Admin (only when authenticated) */}
            {isAdmin && (
              <Link
                href="/admin/chat"
                className="flex items-center gap-4 px-3 py-4 transition-colors hover:bg-muted active:bg-muted rounded-lg"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border">
                  <ShieldCheckIcon className="size-5 text-foreground" />
                </div>
                <div className="flex flex-1 min-w-0 flex-col gap-1">
                  <div className="text-sm font-medium">Admin</div>
                  <div className="text-xs text-muted-foreground">
                    Manage conversations and feedback.
                  </div>
                </div>
                <ChevronRightIcon className="size-4 text-muted-foreground shrink-0" />
              </Link>
            )}

            {/* Landing page — admin-only (visible to the authenticated owner in
                production and dev; hidden from everyone else). */}
            {isAdmin && (
              <Link
                href="/"
                className="flex items-center gap-4 px-3 py-4 transition-colors hover:bg-muted active:bg-muted rounded-lg"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border">
                  <WindowIcon className="size-5 text-foreground" />
                </div>
                <div className="flex flex-1 min-w-0 flex-col gap-1">
                  <div className="text-sm font-medium">Landing page</div>
                  <div className="text-xs text-muted-foreground">
                    View the marketing landing page.
                  </div>
                </div>
                <ChevronRightIcon className="size-4 text-muted-foreground shrink-0" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </ContentCard>
  );
}
