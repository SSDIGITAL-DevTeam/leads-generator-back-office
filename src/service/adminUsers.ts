// src/services/adminUsers.ts
import { http } from "./http";

export type Role = "admin" | "user";

export type AdminUser = {
  id: string;
  email: string;
  role: Role;
};

type ListUsersResponse = {
  status: string;
  data: AdminUser[];
};

type CreateUserPayload = {
  email: string;
  password: string;
  role?: Role;
};

type UpdateUserPayload = {
  role: Role;
};

export const adminUsersService = {
  list: () => http.get<ListUsersResponse>("/api/admin/users"),
  create: (payload: CreateUserPayload) =>
    http.post<ListUsersResponse>("/api/admin/users", payload),
  update: (id: string, payload: UpdateUserPayload) =>
    http.patch<ListUsersResponse>(`/api/admin/users/${id}`, payload),
  remove: (id: string) =>
    http.delete<ListUsersResponse>(`/api/admin/users/${id}`),
};
