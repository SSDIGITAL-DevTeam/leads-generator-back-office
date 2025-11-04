"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAuthStatus } from "@/lib/auth";

export default function ProfileDropdown() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // klik di luar menutup dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuthStatus();
    localStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white hover:bg-slate-700"
      >
        <span className="inline-block h-8 w-8 rounded-full bg-slate-600 text-center leading-8">
          {userEmail ? userEmail.charAt(0).toUpperCase() : "A"}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-slate-300"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 origin-top-right rounded-lg border border-slate-700 bg-[#182235] shadow-xl ring-1 ring-black/5">

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-[#22314F] hover:text-white"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
