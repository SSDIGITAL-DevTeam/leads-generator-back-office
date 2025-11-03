"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthStatus } from "@/lib/auth";

export default function Protected({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const isAuthed = getAuthStatus();
    if (!isAuthed) {
      router.replace("/login");
      return;
    }
    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-slate-500">
        Checking authorization…
      </div>
    );
  }

  return <>{children}</>;
}
