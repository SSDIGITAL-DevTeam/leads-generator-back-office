// src/app/admin/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import SearchInput from "@/_components/SearchInput";
import DataTable from "@/_components/DataTable";
import Pagination from "@/_components/Pagination";
import type { Lead } from "@/types/lead";
import { adminCompaniesService } from "@/service/adminCompanies";

const INITIAL_PAGE_SIZE = 10;
const SEARCH_KEYS: Array<keyof Lead> = [
  "name",
  "email",
  "company",
  "address",
  "location",
  "type_business",
  "type_bussiness",
];

function normalizeCompaniesToLeads(rows: any[]): Lead[] {
  return rows.map((item: any, index: number) => {
    const company = item.company ?? `Company ${index + 1}`;
    const phone = item.phone ?? "";
    const website = item.website ?? "";

    const rating =
      typeof item.rating === "number"
        ? item.rating
        : typeof item.raw?.rating === "number"
        ? item.raw.rating
        : undefined;

    const reviews =
      typeof item.reviews === "number"
        ? item.reviews
        : typeof item.user_ratings_total === "number"
        ? item.user_ratings_total
        : typeof item.raw?.user_ratings_total === "number"
        ? item.raw.user_ratings_total
        : undefined;

    const typeBiz =
      item.type_business ??
      item.type ??
      (Array.isArray(item.raw?.types) ? item.raw.types[0] : undefined) ??
      "—";

    const address = item.address ?? item.raw?.formatted_address ?? "—";
    const city = item.city ?? "";
    const country = item.country ?? "";
    const location =
      city && country ? `${city}, ${country}` : city || country || "";

    const positionParts: string[] = [];
    if (typeBiz && typeBiz !== "—") positionParts.push(typeBiz);
    if (typeof rating === "number") {
      positionParts.push(
        typeof reviews === "number"
          ? `⭐ ${rating} (${reviews})`
          : `⭐ ${rating}`
      );
    }
    const position = positionParts.join(" · ") || "—";

    return {
      id: item.id?.toString() ?? item.place_id?.toString() ?? `db-${index + 1}`,
      name: company,
      position,
      email: website,
      phone,
      company: address,
      address,
      city,
      country,
      location,
      rating,
      reviews,
      type_business: typeBiz,
      type_bussiness: typeBiz,
      typeBussiness: typeBiz,
      links: {
        website: website || undefined,
      },
    };
  });
}

export default function AdminDashboard() {
  // tidak ada data default
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await adminCompaniesService.list();
        const companies = Array.isArray((res as any).data)
          ? (res as any).data
          : Array.isArray(res)
          ? res
          : [];
        const normalized = normalizeCompaniesToLeads(companies);
        if (mounted) {
          setLeads(normalized);
        }
      } catch (err) {
        console.error("failed to fetch /api/admin/companies", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((lead) =>
      SEARCH_KEYS.some((key) => lead[key]?.toString().toLowerCase().includes(q))
    );
  }, [leads, search]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));

  const currentLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  const startEntry =
    filteredLeads.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(
    startEntry + pageSize - 1,
    filteredLeads.length || 0
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleDownload = () => {
    if (!filteredLeads.length) return;

    const DELIM = ";";

    const header = [
      "Company",
      "Phone",
      "Website",
      "Rating",
      "Reviews",
      "Type Business",
      "Address",
      "Location",
    ];

    const rows = filteredLeads
      .map((lead) =>
        [
          lead.name,
          lead.phone,
          lead.links?.website ?? lead.email,
          lead.rating,
          lead.reviews,
          lead.type_bussiness ?? lead.type_business ?? lead.typeBussiness,
          lead.address ?? lead.company,
          lead.location,
        ]
          .map((v) => (v ?? "").toString().replace(/\r?\n/g, " "))
          .join(DELIM)
      )
      .join("\n");

    const csv = header.join(DELIM) + "\n" + rows;

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "companies.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
      <div className="flex flex-col gap-8">
        <section className="rounded-3xl bg-white p-8 shadow-card">
            <div className="flex flex-col gap-4 pb-6">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  All Data Leads
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Search, filter, and enrich your pipeline insights.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="w-full md:max-w-md">
                  <SearchInput
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search company, website, address, or location..."
                  />
                </div>

                <button
                  onClick={handleDownload}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#2647D9] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2451CC]"
                  disabled={loading || !filteredLeads.length}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                  >
                    <path d="M12 3v12" strokeLinecap="round" />
                    <path d="m7 10 5 5 5-5" strokeLinecap="round" />
                    <path d="M5 21h14" strokeLinecap="round" />
                  </svg>
                  Download
                </button>
              </div>
            </div>

            {/* bagian tabel */}
            {loading ? (
              <div className="mb-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                Sedang memuat data...
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="mb-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                Belum ada data.
              </div>
            ) : (
              <DataTable leads={currentLeads} />
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredLeads.length}
              startEntry={filteredLeads.length ? startEntry : 0}
              endEntry={filteredLeads.length ? endEntry : 0}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[10, 25, 50, 100]}
            />
        </section>
      </div>
    </div>
  );
}
