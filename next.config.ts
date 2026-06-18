import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Allow higher-quality optimization for detailed UI/diagram imagery
  // (Next 16 defaults to only [75]).
  images: { qualities: [75, 90, 100] },
};

export default nextConfig;
