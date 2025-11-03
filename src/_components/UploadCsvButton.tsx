"use client";

import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import { parseCsv } from "@/lib/csv";
import type { Lead } from "@/types/lead";

type UploadCsvButtonProps = {
  onUpload: (leads: Lead[]) => void;
};

export default function UploadCsvButton({ onUpload }: UploadCsvButtonProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [label, setLabel] = useState("Upload File");

  const triggerFileChooser = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || !files.length) {
      return;
    }

    const file = files[0];

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setLabel("Please select a .csv file");
      resetInput(event.target);
      setTimeout(() => setLabel("Upload CSV"), 1800);
      return;
    }

    try {
      const text = await readFile(file);
      const leads = parseCsv(text);
      onUpload(leads);
      setLabel(`Uploaded ${leads.length} leads`);
      setTimeout(() => setLabel("Upload CSV"), 1800);
    } catch (error) {
      console.error("CSV parsing failed:", error);
      setLabel("Parsing failed");
      setTimeout(() => setLabel("Upload CSV"), 1800);
    } finally {
      resetInput(event.target);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={triggerFileChooser}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
      >
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
        >
          <path
            d="M12 3v12m0-12 4 4m-4-4-4 4m12 6v4.2a1.8 1.8 0 0 1-1.8 1.8H6.8A1.8 1.8 0 0 1 5 19.2V15"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {label}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="sr-only"
      />
    </>
  );
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Invalid file content"));
      }
    };
    reader.onerror = () => {
      reject(new Error("Unable to read file"));
    };
    reader.readAsText(file);
  });
}

function resetInput(input: HTMLInputElement) {
  input.value = "";
}
