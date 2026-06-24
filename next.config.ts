import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Allow higher-quality optimization for detailed UI/diagram imagery
  // (Next 16 defaults to only [75]).
  images: { qualities: [75, 90, 100] },
  // In dev only, tell browsers (incl. the iOS Simulator) never to cache
  // responses. The dev CSS/JS bundles reuse the same filename across edits,
  // so cached copies otherwise mask hot-reloaded style changes. No effect on
  // the production build.
  ...(process.env.NODE_ENV === "development"
    ? {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "Cache-Control", value: "no-store, must-revalidate" },
                { key: "Pragma", value: "no-cache" },
                { key: "Expires", value: "0" },
              ],
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
