"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  startEntry: number;
  endEntry: number;
  onPageChange: (page: number) => void;
  // tambahan biar sama kayak di gambar
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
};

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  startEntry,
  endEntry,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}: PaginationProps) {
  const [requestedPage, setRequestedPage] = useState("");

  const pageIndicators = useMemo(
    () => createPaginationSequence(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = Number(requestedPage);
    if (!Number.isFinite(parsed)) return;
    if (parsed < 1 || parsed > totalPages) return;
    onPageChange(parsed);
    setRequestedPage("");
  };

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-4 py-4 md:flex-row md:items-center md:justify-between">
      {/* KIRI */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <span>Showing</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          disabled={!onPageSizeChange}
          className={
            "h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none" +
            (!onPageSizeChange ? " cursor-not-allowed opacity-60" : "")
          }
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span>
          from{" "}
          <span className="font-semibold text-slate-700">
            {totalItems}
          </span>{" "}
          data
        </span>
      </div>

      {/* KANAN */}
      <div className="flex flex-wrap items-center gap-1">
        {/* first */}
        <PageButton
          label="First page"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          «
        </PageButton>

        {/* prev */}
        <PageButton
          label="Previous page"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ‹
        </PageButton>

        {/* numbers */}
        {pageIndicators.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-8 min-w-8 items-center justify-center text-xs text-slate-400"
            >
              …
            </span>
          ) : (
            <PageButton
              key={item}
              label={`Go to page ${item}`}
              active={item === currentPage}
              onClick={() => onPageChange(item)}
            >
              {item}
            </PageButton>
          )
        )}

        {/* next */}
        <PageButton
          label="Next page"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          ›
        </PageButton>

        {/* last */}
        <PageButton
          label="Last page"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          »
        </PageButton>

        {/* input + Go >> */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 pl-2"
        >
          <input
            type="number"
            min={1}
            max={totalPages}
            value={requestedPage}
            onChange={(event) => setRequestedPage(event.target.value)}
            className="h-8 w-10 rounded-md border border-slate-200 bg-white px-2 text-center text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
            aria-label="Go to page"
          />
          <button
            type="submit"
            className="inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium text-[#2E65FF] hover:bg-blue-50"
          >
            Go &gt;&gt;
          </button>
        </form>
      </div>
    </div>
  );
}

type PageButtonProps = {
  children: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
};

function PageButton({
  children,
  label,
  onClick,
  disabled = false,
  active = false,
}: PageButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={
        "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-3 text-xs font-medium transition " +
        (active
          ? "bg-[#2E65FF] text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100") +
        (disabled ? " cursor-not-allowed text-slate-300 hover:bg-transparent" : "")
      }
    >
      {children}
    </button>
  );
}

function createPaginationSequence(
  currentPage: number,
  totalPages: number
): Array<number | "ellipsis"> {
  // sama kayak punyamu tadi
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const sequence: Array<number | "ellipsis"> = [1];
  const windowSize = 2;
  const left = Math.max(2, currentPage - windowSize);
  const right = Math.min(totalPages - 1, currentPage + windowSize);

  if (left > 2) {
    sequence.push("ellipsis");
  }

  for (let page = left; page <= right; page += 1) {
    sequence.push(page);
  }

  if (right < totalPages - 1) {
    sequence.push("ellipsis");
  }

  sequence.push(totalPages);

  return sequence;
}
