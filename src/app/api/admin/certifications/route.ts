import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrResponse, isResponse, zodFieldErrors } from "@/lib/api-helpers";
import { certificationSchema } from "@/lib/validation";
import { listCertifications, createCertification } from "@/lib/repo";

export async function GET() {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;
  return NextResponse.json(await listCertifications());
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;

  const body = await req.json().catch(() => null);
  const parsed = certificationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data.", fieldErrors: zodFieldErrors(parsed.error) }, { status: 400 });
  }
  const data = { ...parsed.data, verificationUrl: parsed.data.verificationUrl || null };
  const created = await createCertification(data);
  return NextResponse.json(created, { status: 201 });
}
