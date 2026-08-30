import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrResponse, isResponse } from "@/lib/api-helpers";
import { documentMetaSchema } from "@/lib/validation";
import { getDocument, updateDocument, deleteDocument } from "@/lib/repo";
import { uploadFile, deleteFile, UploadError } from "@/lib/storage";

// Replacing a document's file, or editing its metadata, or toggling visibility.
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;

  const existing = await getDocument(params.id);
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });

  const raw = {
    title: String(form.get("title") || existing.title),
    description: String(form.get("description") || "") || null,
    category: String(form.get("category") || existing.category),
    externalUrl: String(form.get("externalUrl") || "") || null,
    isPublic: form.get("isPublic") === "true",
  };
  const parsed = documentMetaSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the document details." }, { status: 400 });
  }

  let fileUrl = existing.fileUrl;
  let fileName = existing.fileName;
  let fileType = existing.fileType;
  let fileSize = existing.fileSize;

  const file = form.get("file");
  if (file instanceof File && file.size > 0) {
    try {
      const result = await uploadFile(file);
      await deleteFile(existing.fileUrl); // replace: remove the old file
      fileUrl = result.url;
      fileName = result.fileName;
      fileType = result.fileType;
      fileSize = result.fileSize;
    } catch (e) {
      const message = e instanceof UploadError ? e.message : "Upload failed.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  const updated = await updateDocument(params.id, {
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

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdminOrResponse();
  if (isResponse(auth)) return auth;

  const existing = await getDocument(params.id);
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await deleteFile(existing.fileUrl);
  await deleteDocument(params.id);
  return NextResponse.json({ ok: true });
}
