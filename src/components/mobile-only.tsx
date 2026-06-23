"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export function MobileOnly({ children, fallback }: { children: React.ReactNode; fallback: string }) {
  const router = useRouter();

  React.useEffect(() => {
    if (window.innerWidth >= 640) router.replace(fallback);
  }, [router, fallback]);

  return <>{children}</>;
}
