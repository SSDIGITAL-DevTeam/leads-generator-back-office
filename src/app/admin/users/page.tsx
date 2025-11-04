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

const initialMock: User[] = [
  { id: "u_1", email: "andrew@demo.com", role: "admin" },
  { id: "u_2", email: "bianca@demo.com", role: "user" },
  { id: "u_3", email: "carlos@demo.com", role: "user" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialMock);
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
  const admins = useMemo(() => filtered.filter((u) => u.role === "admin"), [filtered]);
  const normals = useMemo(() => filtered.filter((u) => u.role === "user"), [filtered]);

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

  // ADD (email + password + confirm)
  function submitAdd() {
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
    const emailTaken = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (emailTaken) {
      alert("Email sudah digunakan.");
      return;
    }

    const id = `u_${Math.random().toString(36).slice(2, 8)}`;
    setUsers((prev) => [{ id, email, role: "user" }, ...prev]);
    setOpen(false);
    resetForms();
  }

  // EDIT (ubah role saja)
  function submitEdit() {
    if (!editForm.id) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === editForm.id ? { ...u, role: editForm.role } : u))
    );
    setOpen(false);
    resetForms();
  }

  function deleteUser(id: string) {
    if (!confirm("Hapus user ini?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
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
        <UsersTable title="Admins" items={admins} onEdit={openEdit} onDelete={deleteUser} />

        <div className="my-6" />

        {/* Tabel Users */}
        <UsersTable title="Users" items={normals} onEdit={openEdit} onDelete={deleteUser} />
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
