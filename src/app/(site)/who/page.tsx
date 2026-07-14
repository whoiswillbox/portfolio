"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * /who is now an ALIAS for "/" (the one-page Box AI home). In the one-page model
 * the live Box AI is mounted on "/", so routing the Box home there means it's
 * never remounted on navigation (which caused first-scroll lag). Anything still
 * linking to /who (older deep links, ?c=<id> conversation links) redirects to
 * "/", preserving the conversation param.
 */
export default function Who() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const c = searchParams.get("c");
    router.replace(c ? `/?c=${c}` : "/?box-home=1");
  }, [router, searchParams]);

  return null;
}
