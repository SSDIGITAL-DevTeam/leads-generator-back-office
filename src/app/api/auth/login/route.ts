// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { callBackend } from "../../../utils/backend";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body || !body.email || !body.password) {
    return NextResponse.json(
      { status: "error", message: "email and password are required" },
      { status: 400 }
    );
  }

  // kirim ke BE
  const beRes = await callBackend("/auth/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
    }),
  });

  const payload = await beRes.json().catch(() => null);

  if (!beRes.ok) {
    return NextResponse.json(payload ?? { status: "error" }, { status: beRes.status });
  }

  // BE: {status:"success", data:{access_token:"..."}}
  const accessToken = payload?.data?.access_token;

  const res = NextResponse.json(payload, { status: 200 });

  if (accessToken) {
    res.cookies.set("auth_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // bisa ditambah maxAge, misal 1 jam:
      maxAge: 60 * 60,
    });
  }

  return res;
}
