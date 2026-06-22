import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono, EB_Garamond } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeColorMeta } from "@/components/theme-color-meta";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Will Box - Product Designer",
  description: "Personal portfolio",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "oklch(0.985 0.003 75)",
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
      className={`${plusJakartaSans.variable} ${geistMono.variable} ${ebGaramond.variable} h-full antialiased`}
    >
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
