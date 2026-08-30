import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrResponse, isResponse, zodFieldErrors } from "@/lib/api-helpers";
import { projectSchema } from "@/lib/validation";
import { updateProject, deleteProject } from "@/lib/repo";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;

  const body = await req.json().catch(() => null);
  const parsed = projectSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data.", fieldErrors: zodFieldErrors(parsed.error) }, { status: 400 });
  }
  const data = { ...parsed.data, externalUrl: parsed.data.externalUrl || null };
  const updated = await updateProject(params.id, data);
  if (!updated) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;

  const ok = await deleteProject(params.id);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
