import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrResponse, isResponse } from "@/lib/api-helpers";
import { uploadFile, UploadError } from "@/lib/storage";

// Generic single-file upload used by the profile image picker. Document
// uploads go through /api/admin/documents instead, since those also need
// title/category/visibility metadata saved alongside the file.
export async function POST(req: NextRequest) {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  try {
    const result = await uploadFile(file);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof UploadError ? e.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
