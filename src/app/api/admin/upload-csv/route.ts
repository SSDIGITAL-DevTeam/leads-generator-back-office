// src/app/api/admin/upload-csv/route.ts
import { NextResponse } from "next/server";
import { callBackend } from "../../../utils/backend";

export async function POST(req: Request) {
  const formData = await req.formData();

  // kirim ke BE, jangan set content-type -> biarkan fetch yg bikin boundary
  const beRes = await callBackend("/admin/upload-csv", {
    method: "POST",
    body: formData,
  });

  const payload = await beRes.json().catch(() => null);

  return NextResponse.json(
    payload ?? { status: "error", message: "failed to upload csv" },
    { status: beRes.status }
  );
}
