"use client";

import { useMemo, useState } from "react";
import SearchInput from "@/_components/SearchInput";
import DataTable from "@/_components/DataTable";
import Pagination from "@/_components/Pagination";
import type { Lead } from "@/types/lead";

const INITIAL_PAGE_SIZE = 10;
const SEARCH_KEYS: Array<keyof Lead> = [
  "name",
  "position",
  "email",
  "company",
  "location",
];

function generateMockLeads(total: number): Lead[] {
  const firstNames = ["Andrew", "Bianca", "Carlos", "Dewi", "Evelyn", "Farhan"];
  const lastNames = ["Anderson", "Brown", "Chandra", "Darmadi", "Edwards", "Fischer"];
  const industries = ["Logistics", "SaaS", "Finance", "Healthcare", "Retail", "Manufacturing"];
  const positions = ["Marketing Manager", "Sales Director", "Operations Manager"];
  const cities = ["Jakarta, ID", "Singapore, SG", "Berlin, DE", "Sydney, AU"];
  const companyPrefixes = ["Logi", "Data", "Market", "Insight", "Quantum"];
  const companySuffixes = ["Track", "Sphere", "Labs", "Analytics", "Solutions"];
  const employeeBands = ["1-10", "11-50", "51-200", "201-500", "1000+"];

  return Array.from({ length: total }, (_, i) => {
    const first = firstNames[i % firstNames.length];
    const last = lastNames[i % lastNames.length];
    const company =
      companyPrefixes[i % companyPrefixes.length] +
      companySuffixes[i % companySuffixes.length];
    const emailBase = `${first}.${last}`.toLowerCase();
    const email = `${emailBase}${i}@${company.toLowerCase()}.com`;

    return {
      id: `seed-${i + 1}`,
      name: `${first} ${last}`,
      position: positions[i % positions.length],
      email,
      phone: `+62 8${(310000000 + i * 357).toString().padStart(9, "0")}`,
      company,
      industry: industries[i % industries.length],
      size: employeeBands[i % employeeBands.length],
      location: cities[i % cities.length],
      links: {
        linkedin: `https://linkedin.com/in/${emailBase}${i}`,
        website: `https://www.${company.toLowerCase()}.com`,
      },
    };
  });
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>(() => generateMockLeads(250));
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredLeads = useMemo(() => {
    if (!normalizedSearch) return leads;
    return leads.filter((lead) =>
      SEARCH_KEYS.some((key) =>
        lead[key]?.toString().toLowerCase().includes(normalizedSearch)
      )
    );
  }, [leads, normalizedSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));

  const currentLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  const startEntry =
    filteredLeads.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(startEntry + pageSize - 1, filteredLeads.length || 0);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // fungsi download CSV
  const handleDownload = () => {
    if (!filteredLeads.length) return;

    const header = [
      "Name",
      "Position",
      "Email",
      "Phone",
      "Company",
      "Industry",
      "Size",
      "Location",
      "LinkedIn",
      "Website",
    ];

    const rows = filteredLeads
      .map((lead) =>
        [
          lead.name,
          lead.position,
          lead.email,
          lead.phone,
          lead.company,
          lead.industry,
          lead.size,
          lead.location,
          lead.links?.linkedin,
          lead.links?.website,
        ]
          .map((v) => `"${(v || "").toString().replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([header.join(",") + "\n" + rows], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-3xl bg-white p-8 shadow-card">
        {/* Header section */}
        <div className="flex flex-col gap-4 pb-6">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              All Data Leads
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Search, filter, and enrich your pipeline insights.
            </p>
          </div>

          {/* Search + Download in one row */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="w-full md:max-w-md">
              <SearchInput
                value={search}
                onChange={handleSearchChange}
                placeholder="Search name, position, email, company, or location..."
              />
            </div>

            <button
              onClick={handleDownload}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#2E65FF] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2451CC]"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
              >
                <path
                  d="M12 4v11m0 0 4-4m-4 4-4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Download Data
            </button>
          </div>
        </div>

        {/* Table */}
        <DataTable leads={currentLeads} />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredLeads.length}
          startEntry={filteredLeads.length ? startEntry : 0}
          endEntry={filteredLeads.length ? endEntry : 0}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </section>
    </div>
  );
}
