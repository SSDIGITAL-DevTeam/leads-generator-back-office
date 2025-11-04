// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { callBackend } from "../../../utils/backend";

export async function GET() {
  const beRes = await callBackend("/admin/users", {
    method: "GET",
  });

  const payload = await beRes.json().catch(() => null);

  return NextResponse.json(
    payload ?? { status: "error", message: "failed to fetch users" },
    { status: beRes.status }
  );
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  // BE handler expect dto.CreateUserRequest (lihat be/api/internal/dto/users.go)
  const beRes = await callBackend("/admin/users", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await beRes.json().catch(() => null);

  return NextResponse.json(
    payload ?? { status: "error", message: "failed to create user" },
    { status: beRes.status }
  );
}
