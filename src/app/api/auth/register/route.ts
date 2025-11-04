// src/app/api/auth/register/route.ts
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

  const beRes = await callBackend("/auth/register", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await beRes.json().catch(() => null);

  if (!beRes.ok) {
    return NextResponse.json(payload ?? { status: "error" }, { status: beRes.status });
  }

  return NextResponse.json(payload, { status: 200 });
}
