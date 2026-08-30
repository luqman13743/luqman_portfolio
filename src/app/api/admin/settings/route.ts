import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrResponse, isResponse, zodFieldErrors } from "@/lib/api-helpers";
import { settingsSchema } from "@/lib/validation";
import { getSettings, updateSettings } from "@/lib/repo";

export async function GET() {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;
  return NextResponse.json(await getSettings());
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;

  const body = await req.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the settings fields.", fieldErrors: zodFieldErrors(parsed.error) }, { status: 400 });
  }
  const updated = await updateSettings(parsed.data);
  return NextResponse.json(updated);
}
