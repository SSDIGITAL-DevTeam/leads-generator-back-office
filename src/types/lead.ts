export type LeadLinks = {
  linkedin?: string;
  website?: string;
};

export type Lead = {
  id: string;
  name: string;

  position?: string;
  email?: string;
  phone?: string;

  company?: string;
  address?: string;

  location?: string;
  city?: string;
  country?: string;

  rating?: number;
  reviews?: number;

  // dari API (asli)
  type_business?: string;
  // dari header tabelmu (ada double s)
  type_bussiness?: string;
  // kemungkinan key yang dipakai DataTable (camelCase)
  typeBussiness?: string;

  industry?: string;
  size?: string;

  links?: LeadLinks;
};

export type LeadCsvRow = {
  name?: string;
  position?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  location?: string;
  city?: string;
  country?: string;
  rating?: number;
  reviews?: number;
  type_business?: string;
  type_bussiness?: string;
  typeBussiness?: string;
  industry?: string;
  size?: string;
  linkedin?: string;
  website?: string;
};
