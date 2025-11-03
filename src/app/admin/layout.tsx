"use client";

import type { ReactNode } from "react";
import Protected from "@/_components/Protected";
import Topbar from "@/_components/Topbar"; // ⬅️ import topbar kamu
import { useState } from "react";
import type { Lead } from "@/types/lead";

export default function AdminLayout({ children }: { children: ReactNode }) {
  // contoh handler upload (biar bisa dipakai di Topbar)
  const [leads, setLeads] = useState<Lead[]>([]);

  const handleUpload = (uploaded: Lead[]) => {
    setLeads(uploaded);
    console.log("Uploaded leads:", uploaded);
  };

  return (
    <Protected>
      <div className="flex min-h-screen flex-col bg-background">
        {/* Topbar tetap di atas penuh */}
        <Topbar onUpload={handleUpload} />

        {/* Konten utama */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-6 pb-16 pt-8 md:px-10">
          {children}
        </main>
      </div>
    </Protected>
  );
}
