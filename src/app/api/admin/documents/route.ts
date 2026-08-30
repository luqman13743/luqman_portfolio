import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrResponse, isResponse } from "@/lib/api-helpers";
import { documentMetaSchema } from "@/lib/validation";
import { listDocuments, createDocument } from "@/lib/repo";
import { uploadFile, UploadError } from "@/lib/storage";

export async function GET() {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;
  return NextResponse.json(await listDocuments());
}

// Documents are created via multipart/form-data since they may include a
// file upload alongside metadata (or an external link instead of a file).
export async function POST(req: NextRequest) {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });

  const raw = {
    title: String(form.get("title") || ""),
    description: String(form.get("description") || "") || null,
    category: String(form.get("category") || "Other"),
    externalUrl: String(form.get("externalUrl") || "") || null,
    isPublic: form.get("isPublic") === "true",
  };
  const parsed = documentMetaSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the document details." }, { status: 400 });
  }

  const file = form.get("file");
  let fileUrl: string | null = null;
  let fileName: string | null = null;
  let fileType: string | null = null;
  let fileSize: number | null = null;

  if (file instanceof File && file.size > 0) {
    try {
      const result = await uploadFile(file);
      fileUrl = result.url;
      fileName = result.fileName;
      fileType = result.fileType;
      fileSize = result.fileSize;
    } catch (e) {
      const message = e instanceof UploadError ? e.message : "Upload failed.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  if (!fileUrl && !parsed.data.externalUrl) {
    return NextResponse.json({ error: "Attach a file or provide an external link." }, { status: 400 });
  }

  const created = await createDocument({
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    category: parsed.data.category,
    fileUrl,
    externalUrl: parsed.data.externalUrl || null,
    fileName,
    fileType,
    fileSize,
    isPublic: parsed.data.isPublic,
  });

  return NextResponse.json(created, { status: 201 });
}
