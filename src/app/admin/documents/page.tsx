"use client";

import { useEffect, useRef, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

interface Doc {
  id: string;
  title: string;
  description: string | null;
  category: string;
  fileUrl: string | null;
  externalUrl: string | null;
  fileName: string | null;
  fileType: string | null;
  fileSize: number | null;
  isPublic: boolean;
  uploadedAt: string;
}

const CATEGORIES = ["CV", "Certificate", "Training", "Academic Document", "Research Document", "Other"];

const emptyForm = {
  title: "",
  description: "",
  category: "CV",
  externalUrl: "",
  isPublic: true,
};

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsAdminPage() {
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [editing, setEditing] = useState<Doc | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch("/api/admin/documents");
    if (res.ok) setDocs(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setFile(null);
    setError("");
    setFormOpen(true);
  }

  function openEdit(doc: Doc) {
    setEditing(doc);
    setForm({
      title: doc.title,
      description: doc.description ?? "",
      category: doc.category,
      externalUrl: doc.externalUrl ?? "",
      isPublic: doc.isPublic,
    });
    setFile(null);
    setError("");
    setFormOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const fd = new FormData();
    fd.set("title", form.title);
    fd.set("description", form.description);
    fd.set("category", form.category);
    fd.set("externalUrl", form.externalUrl);
    fd.set("isPublic", String(form.isPublic));
    if (file) fd.set("file", file);

    const res = await fetch(editing ? `/api/admin/documents/${editing.id}` : "/api/admin/documents", {
      method: editing ? "PUT" : "POST",
      body: fd,
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Something went wrong.");
      setSaving(false);
      return;
    }

    await load();
    setSaving(false);
    setFormOpen(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this document? This can't be undone.")) return;
    const res = await fetch(`/api/admin/documents/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  async function toggleVisibility(doc: Doc) {
    const fd = new FormData();
    fd.set("title", doc.title);
    fd.set("description", doc.description ?? "");
    fd.set("category", doc.category);
    fd.set("externalUrl", doc.externalUrl ?? "");
    fd.set("isPublic", String(!doc.isPublic));
    const res = await fetch(`/api/admin/documents/${doc.id}`, { method: "PUT", body: fd });
    if (res.ok) load();
  }

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-teal-900 sm:text-3xl">Documents</h1>
          <p className="mt-1 text-sm text-ink/55">{docs ? `${docs.length} document${docs.length === 1 ? "" : "s"}` : "Loading…"}</p>
        </div>
        <button onClick={openAdd} className="btn-primary !py-2.5 text-sm">
          + Upload document
        </button>
      </div>

      {docs === null ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : docs.length === 0 ? (
        <div className="card border-dashed p-10 text-center text-sm text-ink/50">
          No documents yet. Upload your CV, certificates, or research documents.
        </div>
      ) : (
        <div className="space-y-3">
          {docs.map((doc) => (
            <div key={doc.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="tag-chip">{doc.category}</span>
                  {!doc.isPublic && <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-medium text-ink/50">Private</span>}
                </div>
                <p className="mt-1.5 truncate font-medium text-teal-900">{doc.title}</p>
                <p className="mt-0.5 truncate text-xs text-ink/45">
                  {doc.fileName ? `${doc.fileName}${doc.fileSize ? ` · ${formatSize(doc.fileSize)}` : ""}` : doc.externalUrl}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {(doc.fileUrl || doc.externalUrl) && (
                  <a
                    href={doc.fileUrl ?? doc.externalUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-teal-900 hover:bg-teal-50"
                  >
                    Open
                  </a>
                )}
                <button onClick={() => toggleVisibility(doc)} className="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-ink/70 hover:bg-teal-50">
                  {doc.isPublic ? "Make private" : "Make public"}
                </button>
                <button onClick={() => openEdit(doc)} className="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-teal-900 hover:bg-teal-50">
                  Edit
                </button>
                <button onClick={() => handleDelete(doc.id)} className="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 pt-10 backdrop-blur-sm sm:pt-16">
          <div className="card w-full max-w-lg p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-teal-900">{editing ? "Edit document" : "Upload document"}</h2>
              <button onClick={() => setFormOpen(false)} className="text-ink/40 hover:text-ink" aria-label="Close">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="field-label">Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="field-label">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="field-label">File {editing?.fileName ? "(replace)" : ""}</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.gif"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-teal-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-paper"
                />
                <p className="mt-1 text-xs text-ink/45">PDF, JPG, PNG, WEBP or GIF — max 15 MB.</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-ink/50">
                <div className="h-px flex-1 bg-line" />
                or
                <div className="h-px flex-1 bg-line" />
              </div>

              <div>
                <label className="field-label">External link</label>
                <input
                  type="url"
                  placeholder="https://…"
                  value={form.externalUrl}
                  onChange={(e) => setForm((f) => ({ ...f, externalUrl: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-ink/70">
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(e) => setForm((f) => ({ ...f, isPublic: e.target.checked }))}
                  className="h-4 w-4 rounded border-line"
                />
                Visible on the public site
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                  {saving ? "Saving…" : "Save"}
                </button>
                <button type="button" onClick={() => setFormOpen(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
