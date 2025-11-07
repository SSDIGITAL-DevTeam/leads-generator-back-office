// src/app/api/admin/users/[id]/route.ts
import { NextResponse } from "next/server";
import { callBackend } from "../../../../utils/backend";

// PATCH /api/admin/users/[id]
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => null);

  const beRes = await callBackend(`/admin/users/${params.id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await beRes.json().catch(() => null);

  return NextResponse.json(
    payload ?? { status: "error", message: "failed to update user" },
    { status: beRes.status }
  );
}

// DELETE /api/admin/users/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const beRes = await callBackend(`/admin/users/${params.id}`, {
    method: "DELETE",
  });

  const payload = await beRes.json().catch(() => null);

  return NextResponse.json(
    payload ?? { status: "error", message: "failed to delete user" },
    { status: beRes.status }
  );
}
