const AUTH_STORAGE_KEY = "lead-admin-auth";
const ADMIN_EMAIL = "admin@demo.com";
const ADMIN_PASSWORD = "admin123";

// aktifkan bypass auth di mode pengembangan
const DEV_BYPASS_AUTH = process.env.NODE_ENV === "development";

export function authenticate(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === ADMIN_EMAIL &&
    password === ADMIN_PASSWORD
  );
}

export function persistAuthStatus(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_STORAGE_KEY, "true");
}

export function clearAuthStatus(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getAuthStatus(): boolean {
  if (DEV_BYPASS_AUTH) return true; // ⬅️ bypass di mode dev

  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

export function getDemoCredentials() {
  return {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  };
}
