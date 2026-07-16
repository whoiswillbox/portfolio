import type { Metadata } from "next";
import { Plus_Jakarta_Sans, EB_Garamond, Roboto_Mono } from "next/font/google";
// Self-hosted licensed Klim webfonts (Söhne + Signifier). Ship to production.
import { fontVars } from "./fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeColorMeta } from "@/components/theme-color-meta";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Will Box - Product Designer",
  description: "Personal portfolio",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Will Box",
    // Transparent status bar so the app draws fullscreen under it (pairs with
    // viewportFit: "cover" and our safe-area handling).
    statusBarStyle: "black-translucent",
  },
  icons: {
    // PNG favicons (Safari is unreliable with SVG favicons, and the previous
    // /icon.svg didn't even exist → blank favicon). Multiple sizes so each
    // browser picks the crisp one.
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-visual-viewport",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${ebGaramond.variable} ${robotoMono.variable} ${fontVars} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#fafaf9" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1c1917" media="(prefers-color-scheme: dark)" />
        {/* Older iOS Safari still keys fullscreen off the apple-prefixed tag. */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="h-dvh overflow-hidden flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme disableTransitionOnChange>
          <ThemeColorMeta />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
