// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "auth_token"; // ⬅️ samakan dengan yang diset /api/auth/login

// route yang boleh diakses tanpa login
const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/_next",
  "/api/auth", // misal api auth
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) =>
      pathname === p ||
      pathname.startsWith(p + "/") ||
      pathname.startsWith(p)
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // kalau public, lolos
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // cek cookie auth_token
  const token = req.cookies.get(AUTH_COOKIE)?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
