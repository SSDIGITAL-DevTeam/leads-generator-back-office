"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import UploadCsvButton from "@/_components/UploadCsvButton";
import { clearAuthStatus } from "@/lib/auth";
import { useRouter } from "next/navigation";
import type { Lead } from "@/types/lead";

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
    clearAuthStatus();
    setOpen(false);
    router.push("/login");
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
            {/* Klik “Lead Generator” → /admin */}
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
              href={{ pathname: "/admin/users" }}
              className="rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-white/10 hover:text-white"
            >
              Users
            </Link>
          </nav>

          <UploadCsvButton onUpload={onUpload} />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-white/20 focus:outline-none"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4A90E2] text-sm font-semibold text-white shadow-md">
                A
              </span>
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 9l6 6 6-6"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {open && (
              <div className="absolute right-0 mt-2 w-44 origin-top-right rounded-lg border border-slate-700 bg-[#182235] shadow-xl ring-1 ring-black/5">
                <div className="border-b border-slate-700 px-4 py-3">
                  <p className="text-sm font-semibold text-white">Admin</p>
                  <p className="text-xs text-slate-400">admin@demo.com</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-[#22314F] hover:text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
