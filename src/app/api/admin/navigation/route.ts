import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrResponse, isResponse, zodFieldErrors } from "@/lib/api-helpers";
import { navigationSchema } from "@/lib/validation";
import { createNavigationItem, listNavigationItems } from "@/lib/repo";

export async function GET() {
  const auth = await requireAdminOrResponse(); if (isResponse(auth)) return auth;
  return NextResponse.json(await listNavigationItems());
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminOrResponse(); if (isResponse(auth)) return auth;
  const body = await req.json().catch(() => null);
  const parsed = navigationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid navigation item.", fieldErrors: zodFieldErrors(parsed.error) }, { status: 400 });
  return NextResponse.json(await createNavigationItem(parsed.data), { status: 201 });
}
