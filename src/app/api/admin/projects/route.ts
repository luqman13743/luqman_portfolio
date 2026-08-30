import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrResponse, isResponse, zodFieldErrors } from "@/lib/api-helpers";
import { projectSchema } from "@/lib/validation";
import { listProjects, createProject } from "@/lib/repo";

export async function GET() {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;
  return NextResponse.json(await listProjects());
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;

  const body = await req.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data.", fieldErrors: zodFieldErrors(parsed.error) }, { status: 400 });
  }
  const data = { ...parsed.data, externalUrl: parsed.data.externalUrl || null };
  const created = await createProject(data);
  return NextResponse.json(created, { status: 201 });
}
