"use client";

import type { ReactNode } from "react";
import Badge from "@/_components/Badge";
import type { Lead } from "@/types/lead";
import Image from "next/image";

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
            <HeaderCell>Links</HeaderCell>
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
                      className="inline-flex items-center justify-center"
                      aria-label={`Visit ${lead.company} website`}
                    >
                      <Image
                src="/assets/icons/link.svg"
                alt="Website"
                width={25}
                height={25}
                className="inline-block"
              />
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
