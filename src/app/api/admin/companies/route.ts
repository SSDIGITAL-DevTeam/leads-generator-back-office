// src/app/api/admin/companies/route.ts
import { NextResponse } from "next/server";
import { callBackend } from "../../../utils/backend";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.search;

  const beRes = await callBackend(`/admin/companies?per_page=200`, {
    method: "GET",
  });

  const payload = await beRes.json().catch(() => null);

  return NextResponse.json(
    payload ?? { status: "error", message: "failed to fetch admin companies" },
    { status: beRes.status }
  );
}
