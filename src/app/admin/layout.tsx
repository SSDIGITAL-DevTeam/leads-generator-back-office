// src/app/admin/layout.tsx
"use client";

import { useState } from "react";
import Protected from "@/_components/Protected";
import Topbar from "@/_components/Topbar";
import type { Lead } from "@/types/lead";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // kalau mau disimpan di sini supaya bisa dipakai di page lain
  const [leads, setLeads] = useState<Lead[]>([]);

  const handleUpload = (uploaded: Lead[]) => {
    setLeads(uploaded);
    // di sini kamu bisa kirim ke context / console / dsb
    console.log("uploaded leads from topbar:", uploaded);
  };

  return (
    <Protected>
      <div className="flex min-h-screen flex-col bg-background">
        {/* Topbar di atas */}
        <Topbar onUpload={handleUpload} />
        {/* Konten utama */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </Protected>
  );
}
