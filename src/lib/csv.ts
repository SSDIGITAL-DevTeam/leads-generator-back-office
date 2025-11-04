import type { Lead, LeadCsvRow } from "@/types/lead";

// mapping header ke field kita
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

  // kolom baru dari export admin/companies
  rating: "rating",
  reviews: "reviews",
  typebusiness: "type_business",
  typebussiness: "type_business",
  type_business: "type_business",
  type_bussiness: "type_business",

  address: "address",

  linkedin: "linkedin",
  linkedinurl: "linkedin",

  website: "website",
  url: "website",
};

export function parseCsv(content: string): Lead[] {
  if (!content.trim()) return [];

  const lines = content
    .split("\n")
    .map((line) => line.replace(/\r$/, ""))
    .filter((line) => line.trim().length > 0);

  if (!lines.length) return [];

  // deteksi delimiter dari header
  const delimiter = detectDelimiter(lines[0]);

  const headerKeys = mapHeaders(lines[0], delimiter);
  const rows = lines.slice(1);

  const leads: Lead[] = [];

  rows.forEach((line, index) => {
    const cells = splitCsvLine(line, delimiter);

    // ⬇️ pakai penampung yang boleh di-index
    const rawRow: Partial<Record<keyof LeadCsvRow, string>> = {};

    cells.forEach((cell, cellIndex) => {
      const headerKey = headerKeys[cellIndex];
      if (headerKey === null) return;
      rawRow[headerKey] = cell.trim();
    });

    const lead = normalizeRow(rawRow as LeadCsvRow, index);
    leads.push(lead);
  });

  return leads;
}

/**
 * Coba tebak delimiter: kalau ; lebih banyak dari , pakai ;, kalau tidak pakai ,
 */
function detectDelimiter(headerLine: string): "," | ";" {
  const commaCount = (headerLine.match(/,/g) || []).length;
  const semicolonCount = (headerLine.match(/;/g) || []).length;
  if (semicolonCount > commaCount) return ";";
  return ",";
}

/**
 * Mencocokkan header CSV dengan field di LeadCsvRow
 */
function mapHeaders(
  headerLine: string,
  delimiter: "," | ";"
): Array<keyof LeadCsvRow | null> {
  const headers = splitCsvLine(headerLine, delimiter);
  return headers.map((raw) => {
    const normalized = raw.trim().toLowerCase().replace(/\s+/g, "");
    return HEADER_MAP[normalized] ?? null;
  });
}

/**
 * Mengubah satu row CSV mentah menjadi Lead siap pakai
 */
function normalizeRow(row: LeadCsvRow, rowIndex: number): Lead {
  const fallbackName = row.name?.trim() || `Unknown Lead ${rowIndex + 1}`;
  const fallbackCompany = row.company?.trim() || "Unknown Company";
  const identifierSeed = row.email?.trim().toLowerCase() || fallbackName;

  const cityCountry = row.location?.trim() || "";
  const address = row.address?.trim() || row.company?.trim() || "-";

  const location = cityCountry || "-";

  return {
    id: createIdentifier(identifierSeed, rowIndex),
    name: fallbackName,
    position: row.position?.trim() || "Business Owner",
    email: row.email?.trim() || `unknown${rowIndex + 1}@example.com`,
    phone: row.phone?.trim() || "+62 812-0000-0000",
    company: fallbackCompany,
    address,
    industry: row.industry?.trim() || "-",
    size: row.size?.trim() || "-",
    location,
    rating: row.rating ? Number(row.rating) : undefined,
    reviews: row.reviews ? Number(row.reviews) : undefined,
    // isi semua variasi supaya DataTable bisa baca
    type_business: row.type_business?.trim() || "-",
    type_bussiness: row.type_business?.trim() || "-",
    typeBussiness: row.type_business?.trim() || "-",
    links: {
      linkedin: cleanLink(row.linkedin),
      website: cleanLink(row.website),
    },
  };
}

/**
 * Utility untuk memecah satu baris CSV jadi array string,
 * sekarang pakai delimiter dinamis (, atau ;)
 */
function splitCsvLine(line: string, delimiter: "," | ";"): string[] {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index++) {
    const char = line[index];

    if (char === '"') {
      const nextChar = line[index + 1];
      if (insideQuotes && nextChar === '"') {
        current += '"';
        index++;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === delimiter && !insideQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result;
}

/**
 * Membersihkan link (hapus "null", tambahkan https:// jika hilang)
 */
function cleanLink(value?: string): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "null") return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/**
 * Membuat ID unik berbasis email/nama
 */
function createIdentifier(seed: string, rowIndex: number): string {
  const base = seed.replace(/[^a-z0-9]/gi, "").slice(0, 12) || "lead";
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${base}-${crypto.randomUUID()}`;
  }
  return `${base}-${Date.now()}-${rowIndex}`;
}
