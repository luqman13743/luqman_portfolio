import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrResponse, isResponse } from "@/lib/api-helpers";
import { markMessageRead, deleteMessage } from "@/lib/repo";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;

  const body = await req.json().catch(() => ({}));
  const ok = await markMessageRead(params.id, !!body.isRead);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;

  const ok = await deleteMessage(params.id);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
