// src/app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8000"; // sesuaikan

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "User id is required" },
      { status: 400 }
    );
  }

  // kalau kamu perlu forward Authorization dari request Next.js ke backend
  const auth = req.headers.get("authorization") || "";

  try {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    return NextResponse.json(data ?? { success: res.ok }, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete user", error: (error as Error).message },
      { status: 500 }
    );
  }
}
