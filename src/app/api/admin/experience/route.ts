import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrResponse, isResponse, zodFieldErrors } from "@/lib/api-helpers";
import { experienceSchema } from "@/lib/validation";
import { listExperience, createExperience } from "@/lib/repo";

export async function GET() {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;
  return NextResponse.json(await listExperience());
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;

  const body = await req.json().catch(() => null);
  const parsed = experienceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data.", fieldErrors: zodFieldErrors(parsed.error) }, { status: 400 });
  }
  const created = await createExperience(parsed.data);
  return NextResponse.json(created, { status: 201 });
}
