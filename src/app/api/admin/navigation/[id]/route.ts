import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrResponse, isResponse, zodFieldErrors } from "@/lib/api-helpers";
import { navigationSchema } from "@/lib/validation";
import { deleteNavigationItem, updateNavigationItem } from "@/lib/repo";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdminOrResponse(); if (isResponse(auth)) return auth;
  const body = await req.json().catch(() => null);
  const parsed = navigationSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid navigation item.", fieldErrors: zodFieldErrors(parsed.error) }, { status: 400 });
  const updated = await updateNavigationItem(params.id, parsed.data);
  if (!updated) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdminOrResponse(); if (isResponse(auth)) return auth;
  if (!await deleteNavigationItem(params.id)) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
