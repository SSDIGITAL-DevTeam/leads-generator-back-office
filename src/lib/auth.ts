// src/lib/auth.ts
const AUTH_COOKIE = "auth_token";
const AUTH_LOCAL_KEY = "auth:logged-in";

// cek cookie di browser
export function hasAuthCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .map((c) => c.trim())
    .some((c) => c.startsWith(`${AUTH_COOKIE}=`));
}

// ini yang dipakai komponen client
export function getAuthStatus(): boolean {
  if (typeof window === "undefined") return false;

  // kalau cookie ada, anggap login
  if (hasAuthCookie()) return true;

  // fallback ke localStorage
  return window.localStorage.getItem(AUTH_LOCAL_KEY) === "true";
}

export function persistAuthStatus() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_LOCAL_KEY, "true");
}

export function clearAuthStatus() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_LOCAL_KEY);
  // hapus cookie juga
  document.cookie = `${AUTH_COOKIE}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
