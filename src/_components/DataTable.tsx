"use client";

import type { ReactNode } from "react";
import Badge from "@/_components/Badge";
import type { Lead } from "@/types/lead";

type DataTableProps = {
  leads: Lead[];
};

export default function DataTable({ leads }: DataTableProps) {
  if (!leads.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
        No leads match your filters. Upload a CSV or adjust your search query.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50">
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <HeaderCell>Company</HeaderCell>
            <HeaderCell>Phone</HeaderCell>
            <HeaderCell>Website</HeaderCell>
            <HeaderCell>Rating</HeaderCell>
            <HeaderCell>Reviews</HeaderCell>
            <HeaderCell>Type Bussiness</HeaderCell>
            <HeaderCell>Address</HeaderCell>
            <HeaderCell>Location</HeaderCell>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="bg-white text-sm text-slate-700 transition hover:bg-blue-50/40"
            >
              <Cell>
                <p className="font-semibold text-slate-900">{lead.name}</p>
              </Cell>
              <Cell>{lead.phone}</Cell>
              <Cell>
                {lead.links?.website && (
                    <a
                      href={lead.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                      aria-label={`Visit ${lead.company} website`}
                    >
                      <GlobeIcon />
                    </a>
                  )}
              </Cell>
              <Cell>{lead.rating}</Cell>
              <Cell>{lead.reviews}</Cell>
              <Cell>
                <Badge>{lead.type_business}</Badge>
              </Cell>
              <Cell>{lead.company}</Cell>
              <Cell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  {lead.location}
                  
                </div>
              </Cell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HeaderCell({ children, className = "" }: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th scope="col" className={`px-4 py-3 ${className}`.trim()}>
      {children}
    </th>
  );
}

function Cell({ children, className = "" }: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-4 py-4 align-middle ${className}`.trim()}>{children}</td>
  );
}

function LinkedInIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 10v7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 7v.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 10v1.5M13 17v-5.5c0-.795.716-1.5 1.6-1.5H15c.884 0 1.6.705 1.6 1.5V17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 9h17M3.5 15h17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3a12.65 12.65 0 0 1 3.3 9 12.65 12.65 0 0 1-3.3 9 12.65 12.65 0 0 1-3.3-9A12.65 12.65 0 0 1 12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
