export type LeadLinks = {
  linkedin?: string;
  website?: string;
};

export type Lead = {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  size: string;
  location: string;
  links: LeadLinks;
};

export type LeadCsvRow = Partial<Omit<Lead, "id" | "links">> & {
  linkedin?: string;
  website?: string;
};
