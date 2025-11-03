"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  authenticate,
  getAuthStatus,
  persistAuthStatus,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getAuthStatus()) {
      router.replace("/admin");
    }
  }, [router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const success = authenticate(email, password);

    if (success) {
      persistAuthStatus();
      router.push("/admin");
    } else {
      setError("Invalid credentials. Try admin@demo.com / admin123.");
    }

    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-white px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-card">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            LG
          </span>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Lead Generator Admin
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Sign in with the demo credentials to continue.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
              placeholder="admin@demo.com"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
              placeholder="admin123"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 shadow-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
