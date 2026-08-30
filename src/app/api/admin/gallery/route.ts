import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrResponse, isResponse, zodFieldErrors } from "@/lib/api-helpers";
import { gallerySchema } from "@/lib/validation";
import { createGalleryItem, listGalleryItems } from "@/lib/repo";

export async function GET() {
  const auth = await requireAdminOrResponse(); if (isResponse(auth)) return auth;
  return NextResponse.json(await listGalleryItems());
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminOrResponse(); if (isResponse(auth)) return auth;
  const body = await req.json().catch(() => null);
  const parsed = gallerySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid gallery item.", fieldErrors: zodFieldErrors(parsed.error) }, { status: 400 });
  return NextResponse.json(await createGalleryItem(parsed.data), { status: 201 });
}
