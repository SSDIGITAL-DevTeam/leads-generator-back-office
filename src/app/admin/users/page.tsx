// src/app/admin/users/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import UsersTable, { type User, type Role } from "@/_components/UsersTable";

type FormMode = "add" | "edit";

type AddForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

type EditForm = {
  id: string;
  role: Role;
};

export default function UsersPage() {
  // awalnya pakai mock, sekarang mulai dari []
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [addForm, setAddForm] = useState<AddForm>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [editForm, setEditForm] = useState<EditForm>({ id: "", role: "user" });
  const formRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  // ambil ke route Next yang sudah kamu siapkan
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users", {
        method: "GET",
      });
      const json = await res.json();

      // kalau backend balikin { data: [...] }
      const arr = Array.isArray(json.data) ? json.data : json;
      const normalized: User[] = arr.map((u: any) => ({
        id: String(u.id),
        email: u.email,
        role: (u.role as Role) ?? "user",
      }));

      setUsers(normalized);
    } catch (err) {
      console.error("gagal fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  // load pertama
  useEffect(() => {
    loadUsers();
  }, []);

  // Tutup modal jika klik di luar
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!formRef.current) return;
      if (open && !formRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  // Filter global (email/role)
  const filtered = useMemo(() => {
    if (!query.trim()) return users;
    const q = query.toLowerCase();
    return users.filter(
      (u) => u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)
    );
  }, [users, query]);

  // Pecah menjadi admins & users
  const admins = useMemo(
    () => filtered.filter((u) => u.role === "admin"),
    [filtered]
  );
  const normals = useMemo(
    () => filtered.filter((u) => u.role === "user"),
    [filtered]
  );

  function resetForms() {
    setAddForm({ email: "", password: "", confirmPassword: "" });
    setEditForm({ id: "", role: "user" });
  }

  function openAdd() {
    resetForms();
    setMode("add");
    setOpen(true);
  }

  function openEdit(u: User) {
    setMode("edit");
    setEditForm({ id: u.id, role: u.role });
    setOpen(true);
  }

  // ADD -> POST /api/admin/users
  async function submitAdd() {
    const email = addForm.email.trim();
    const password = addForm.password;
    const confirmPassword = addForm.confirmPassword;

    if (!email || !password || !confirmPassword) {
      alert("Email, password, dan konfirmasi password wajib diisi.");
      return;
    }
    if (password.length < 6) {
      alert("Password minimal 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Password dan konfirmasi password tidak sama.");
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: "user", // default user
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(json.message || "Gagal membuat user");
        return;
      }

      await loadUsers();
      setOpen(false);
      resetForms();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat membuat user");
    }
  }

  // EDIT (ubah role saja) -> PATCH /api/admin/users/:id
  async function submitEdit() {
    if (!editForm.id) return;
    try {
      const res = await fetch(`/api/admin/users/${editForm.id}`, {
        method: "PATCH", // sesuaikan kalau di BE kamu pakai PUT
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          role: editForm.role,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(json.message || "Gagal mengubah user");
        return;
      }
      await loadUsers();
      setOpen(false);
      resetForms();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengubah user");
    }
  }

  // DELETE -> DELETE /api/admin/users/:id
  async function deleteUser(id: string) {
    if (!confirm("Hapus user ini?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(json.message || "Gagal menghapus user");
        return;
      }
      await loadUsers();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus user");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        {/* Header + actions */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Manage Users</h2>
            <p className="text-sm text-slate-500">
              Add new users, change roles, or remove users.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search email or role…"
              className="h-10 w-64 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
            <button
              onClick={openAdd}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              Add User
            </button>
          </div>
        </div>

        {/* Tabel Admins */}
        {loading ? (
          <div className="rounded-2xl bg-white p-6 text-sm text-slate-500">
            Loading users...
          </div>
        ) : (
          <>
            <UsersTable
              title="Admins"
              items={admins}
              onEdit={openEdit}
              onDelete={deleteUser}
            />

            <div className="my-6" />

            {/* Tabel Users */}
            <UsersTable
              title="Users"
              items={normals}
              onEdit={openEdit}
              onDelete={deleteUser}
            />
          </>
        )}
      </div>

      {/* Modal Add / Edit */}
      {open && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/40 p-4">
          <div ref={formRef} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              {mode === "add" ? "Add User" : "Edit Role"}
            </h3>

            {mode === "add" ? (
              // ADD: email + password + confirmPassword
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Email
                  </label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={(e) =>
                      setAddForm((s) => ({ ...s, email: e.target.value }))
                    }
                    className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Password
                  </label>
                  <input
                    type="password"
                    value={addForm.password}
                    onChange={(e) =>
                      setAddForm((s) => ({ ...s, password: e.target.value }))
                    }
                    className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    placeholder="Masukkan password"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={addForm.confirmPassword}
                    onChange={(e) =>
                      setAddForm((s) => ({
                        ...s,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    placeholder="Ulangi password"
                  />
                </div>
              </div>
            ) : (
              // EDIT: role dropdown
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm((s) => ({ ...s, role: e.target.value as Role }))
                    }
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setOpen(false);
                  resetForms();
                }}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              {mode === "add" ? (
                <button
                  onClick={submitAdd}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Add User
                </button>
              ) : (
                <button
                  onClick={submitEdit}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
