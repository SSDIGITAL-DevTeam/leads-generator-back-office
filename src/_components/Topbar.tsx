// src/_components/Topbar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import UploadCsvButton from "@/_components/UploadCsvButton";
import { clearAuthStatus } from "@/lib/auth";
import { useRouter } from "next/navigation";
import type { Lead } from "@/types/lead";
import ProfileDropdown from "./ProfileDropdown";

type TopbarProps = {
  onUpload: (leads: Lead[]) => void;
};

export default function Topbar({ onUpload }: TopbarProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // versi logika sederhana yang kamu tulis:
    // clear cookie token (dan sekalian auth_token biar cocok sama middleware)
    document.cookie =
      "token=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "auth_token=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // kalau kamu masih pakai localStorage auth lama
    clearAuthStatus?.();

    setOpen(false);
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-[#0C1627] text-white shadow-lg">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3 md:px-10">
        {/* LEFT: Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1D2B45] text-lg font-bold text-[#4A90E2] shadow-inner">
            LG
          </div>
          <div className="flex flex-col leading-tight">
            <Link
              href="/admin"
              className="text-sm font-semibold tracking-wide text-white hover:underline underline-offset-4"
            >
              Lead Generator
            </Link>
            <span className="text-xs text-slate-400">
              Powerful B2B Lead Filtering Tool
            </span>
          </div>
        </div>

        {/* RIGHT: Nav + Upload CSV + Admin Avatar */}
        <div className="flex items-center gap-3">
          <nav className="mr-1 hidden items-center gap-1 md:flex">
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            >
              Users
            </Link>
          </nav>

          <UploadCsvButton onUpload={onUpload} />

          <div className="relative" ref={dropdownRef}>
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
