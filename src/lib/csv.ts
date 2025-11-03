import type { Lead, LeadCsvRow } from "@/types/lead";

const HEADER_MAP: Record<string, keyof LeadCsvRow> = {
  name: "name",
  fullname: "name",
  position: "position",
  title: "position",
  email: "email",
  mail: "email",
  phone: "phone",
  telephone: "phone",
  company: "company",
  organization: "company",
  industry: "industry",
  sector: "industry",
  size: "size",
  headcount: "size",
  location: "location",
  city: "location",
  linkedin: "linkedin",
  linkedinurl: "linkedin",
  website: "website",
  url: "website",
};

export function parseCsv(content: string): Lead[] {
  if (!content.trim()) {
    return [];
  }

  const lines = content
    .split("\n")
    .map((line) => line.replace(/\r$/, ""))
    .filter((line) => line.trim().length > 0);

  if (!lines.length) {
    return [];
  }

  const headerKeys = mapHeaders(lines[0]);
  const rows = lines.slice(1);

  const leads: Lead[] = [];

  rows.forEach((line, index) => {
    const cells = splitCsvLine(line);
    const rawRow: LeadCsvRow = {};

    cells.forEach((cell, cellIndex) => {
      const headerKey = headerKeys[cellIndex];
      if (!headerKey) {
        return;
      }
      rawRow[headerKey] = cell.trim();
    });

    const lead = normalizeRow(rawRow, index);
    leads.push(lead);
  });

  return leads;
}

function mapHeaders(headerLine: string): Array<keyof LeadCsvRow | null> {
  const headers = splitCsvLine(headerLine);
  return headers.map((raw) => {
    const normalized = raw.trim().toLowerCase().replace(/\s+/g, "");
    return HEADER_MAP[normalized] ?? null;
  });
}

function normalizeRow(row: LeadCsvRow, rowIndex: number): Lead {
  const fallbackName = row.name?.trim() || `Unknown Lead ${rowIndex + 1}`;
  const fallbackCompany = row.company?.trim() || "Unknown Company";
  const identifierSeed = row.email?.trim().toLowerCase() || fallbackName;

  return {
    id: createIdentifier(identifierSeed, rowIndex),
    name: fallbackName,
    position: row.position?.trim() || "Growth Manager",
    email: row.email?.trim() || `unknown${rowIndex + 1}@example.com`,
    phone: row.phone?.trim() || "+62 812-0000-0000",
    company: fallbackCompany,
    industry: row.industry?.trim() || "General",
    size: row.size?.trim() || "1-10",
    location: row.location?.trim() || "Jakarta, ID",
    links: {
      linkedin: cleanLink(row.linkedin),
      website: cleanLink(row.website),
    },
  };
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === "\"") {
      const nextChar = line[index + 1];
      if (insideQuotes && nextChar === "\"") {
        current += "\"";
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function cleanLink(value?: string): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "null") return undefined;
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function createIdentifier(seed: string, rowIndex: number): string {
  const base = seed.replace(/[^a-z0-9]/gi, "").slice(0, 12) || "lead";
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${base}-${crypto.randomUUID()}`;
  }
  return `${base}-${Date.now()}-${rowIndex}`;
}
