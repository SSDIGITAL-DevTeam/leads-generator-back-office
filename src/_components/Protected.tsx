// src/_components/Protected.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuthStatus, hasAuthCookie } from "@/lib/auth";

export default function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loggedIn = hasAuthCookie() || getAuthStatus();

    if (!loggedIn) {
      const redirectTo = pathname || "/";
      router.replace(`/login?from=${encodeURIComponent(redirectTo)}`);
    }
  }, [router, pathname]);

  return <>{children}</>;
}
