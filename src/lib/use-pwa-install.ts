"use client";

import * as React from "react";

/** Chrome/Edge's non-standard install prompt event. */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * PWA install state + action, shared by the desktop settings page and the
 * mobile settings sheet.
 *
 * - Chrome/Edge fire `beforeinstallprompt`, captured to trigger native install.
 * - iOS Safari has no such event — it needs the manual Share → Add to Home
 *   Screen flow, so `install()` toggles a hint and `hint` describes the steps.
 * - `installed` is true when already running as the installed (standalone) app.
 */
export function usePwaInstall() {
  const [installPrompt, setInstallPrompt] =
    React.useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = React.useState(false);
  const [isIOS, setIsIOS] = React.useState(false);
  const [showHint, setShowHint] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(standalone);

    const ua = window.navigator.userAgent;
    setIsIOS(/iphone|ipad|ipod/i.test(ua) && !/crios|fxios/i.test(ua));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => { setInstalled(true); setInstallPrompt(null); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = React.useCallback(async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setInstallPrompt(null);
    } else {
      // No native prompt (iOS Safari, or Chrome hasn't fired it / dismissed).
      setShowHint((v) => !v);
    }
  }, [installPrompt]);

  const hint = isIOS
    ? "Tap the Share button in Safari, then Add to Home Screen."
    : "Open your browser menu (or the install icon in the address bar) and choose “Install”.";

  return {
    /** Whether to render the install row at all (not yet installed, hydrated). */
    canShow: mounted && !installed,
    installed,
    isIOS,
    showHint,
    hint,
    install,
  };
}
