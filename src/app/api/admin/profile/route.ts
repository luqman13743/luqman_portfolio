import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrResponse, isResponse, zodFieldErrors } from "@/lib/api-helpers";
import { profileSchema } from "@/lib/validation";
import { getProfile, updateProfile } from "@/lib/repo";

export async function GET() {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;
  return NextResponse.json(await getProfile());
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;

  const body = await req.json().catch(() => null);
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the profile fields.", fieldErrors: zodFieldErrors(parsed.error) }, { status: 400 });
  }
  const data = {
    ...parsed.data,
    email: parsed.data.email || null,
    linkedin: parsed.data.linkedin || null,
    github: parsed.data.github || null,
    otherLinkUrl: parsed.data.otherLinkUrl || null,
  };
  const updated = await updateProfile(data);
  return NextResponse.json(updated);
}
