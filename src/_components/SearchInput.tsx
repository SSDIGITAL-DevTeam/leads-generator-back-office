"use client";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
}: SearchInputProps) {
  return (
    <label className="relative flex w-full max-w-md items-center">
      <span className="pointer-events-none absolute left-4 text-slate-400">
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 5a6 6 0 1 0 3.472 10.948l4.19 4.19a1 1 0 0 0 1.414-1.415l-4.19-4.19A6 6 0 0 0 11 5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm transition focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        type="search"
        aria-label="Search leads"
      />
    </label>
  );
}
