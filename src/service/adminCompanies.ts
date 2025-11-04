// src/service/adminCompanies.ts
import { http } from "./http";

export type AdminCompanyRow = {
  id: string;
  place_id?: string;
  company?: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviews?: number;
  type_business?: string;
  address?: string;
  city?: string;
  country?: string;
  // ada field lain "raw", "longitude", "latitude" dsb tapi kita nggak butuh untuk tabel
};

export type ListCompaniesResponse = {
  status: string;
  data: AdminCompanyRow[];
};

export const adminCompaniesService = {
  list: () => http.get<ListCompaniesResponse>("/api/admin/companies"),
};