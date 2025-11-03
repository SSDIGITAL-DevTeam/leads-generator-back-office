"use client";

import React from "react";

export type Role = "user" | "admin";

export type User = {
  id: string;
  email: string;
  role: Role;
};

type UsersTableProps = {
  title: string;
  items: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  emptyText?: string;
  className?: string;
};

export default function UsersTable({
  title,
  items,
  onEdit,
  onDelete,
  emptyText = "No users found.",
  className,
}: UsersTableProps) {
  return (
    <section className={className}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {title} <span className="text-slate-400">({items.length})</span>
        </h3>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/70">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-5 py-8 text-center text-sm text-slate-500">
                    {emptyText}
                  </td>
                </tr>
              ) : (
                items.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-4 text-sm text-slate-800">{u.email}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(u)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.6}
                          >
                            <path d="M4 20h4l10-10-4-4L4 16v4Z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(u.id)}
                          className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.6}
                          >
                            <path d="M6 7h12M9 7V5h6v2M7 7l1 12h8l1-12" strokeLinecap="round" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
