import localFont from "next/font/local";

/* ─────────────────────────────────────────────────────────────────────────────
   Self-hosted licensed webfonts (Klim, Web licence — 5,000 monthly uniques).
   Söhne (grotesque sans) → UI + headline. Signifier (editorial serif) → reading
   body + eyebrow. Both register their two licensed weights (400 Buch/Regular,
   500 Kräftig/Medium) under one variable so `font-weight` selects the cut.
   These SHIP to production (unlike the earlier dev-only test fonts).
   ──────────────────────────────────────────────────────────────────────────── */

// Söhne — sans + display headline. Buch 400 · Kräftig 500.
export const sohne = localFont({
  variable: "--font-sohne",
  src: [
    { path: "../fonts/licensed/soehne-buch.woff2", weight: "400", style: "normal" },
    { path: "../fonts/licensed/soehne-kraftig.woff2", weight: "500", style: "normal" },
  ],
  display: "swap",
});

// Signifier — reading body + eyebrow. Regular 400 · Medium 500.
export const signifier = localFont({
  variable: "--font-signifier",
  src: [
    { path: "../fonts/licensed/signifier-regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/licensed/signifier-medium.woff2", weight: "500", style: "normal" },
  ],
  display: "swap",
});

/** Space-joined className exposing both licensed font variables. Apply to <html>. */
export const fontVars = [sohne.variable, signifier.variable].join(" ");
