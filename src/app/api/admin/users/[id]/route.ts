// src/app/api/admin/users/[id]/route.ts
import { NextResponse } from "next/server";
import { callBackend } from "../../../../utils/backend";

type Params = {
  params: {
    id: string;
  };
};

export async function PATCH(req: Request, { params }: Params) {
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

export async function DELETE(_req: Request, { params }: Params) {
  const beRes = await callBackend(`/admin/users/${params.id}`, {
    method: "DELETE",
  });

  const payload = await beRes.json().catch(() => null);

  return NextResponse.json(
    payload ?? { status: "error", message: "failed to delete user" },
    { status: beRes.status }
  );
}
