"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminShell from "@/components/admin/AdminShell";

interface Profile {
  name: string;
  title: string;
  summary: string;
  aboutBody: string;
  researchInterests: string;
  careerInterests: string;
  keyStrengths: string;
  profileImageUrl: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  github: string | null;
  otherLinkLabel: string | null;
  otherLinkUrl: string | null;
}

const empty: Profile = {
  name: "",
  title: "",
  summary: "",
  aboutBody: "",
  researchInterests: "",
  careerInterests: "",
  keyStrengths: "",
  profileImageUrl: null,
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  otherLinkLabel: "",
  otherLinkUrl: "",
};

export default function ProfileAdminPage() {
  const [form, setForm] = useState<Profile>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((data) => {
        setForm({ ...empty, ...data });
        setLoading(false);
      });
  }, []);

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.set("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(json.error || "Upload failed.");
      return;
    }
    set("profileImageUrl", json.url);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Something went wrong.");
      return;
    }
    setSaved(true);
  }

  if (loading) {
    return (
      <AdminShell>
        <p className="text-sm text-ink/50">Loading…</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-semibold text-teal-900 sm:text-3xl">Profile</h1>
      <p className="mt-1 text-sm text-ink/55">This information powers the hero, about, and contact sections.</p>

      <form onSubmit={handleSave} className="mt-8 max-w-2xl space-y-8">
        <section className="card space-y-4 p-6">
          <p className="field-label">Photo</p>
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 overflow-hidden rounded-full border border-line bg-teal-50">
              {form.profileImageUrl && (
                <Image src={form.profileImageUrl} alt="Profile" width={80} height={80} className="h-full w-full object-cover" />
              )}
            </div>
            <div>
              <input type="file" accept="image/*" onChange={handleImageChange} disabled={uploading} className="text-sm" />
              {uploading && <p className="mt-1 text-xs text-ink/45">Uploading…</p>}
              <p className="mt-1 text-xs text-ink/45">Leave empty to show the default illustration instead.</p>
            </div>
          </div>
        </section>

        <section className="card space-y-4 p-6">
          <p className="field-label">Basics</p>
          <div>
            <label className="field-label">Full name</label>
            <input required value={form.name} onChange={(e) => set("name", e.target.value)} className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
          </div>
          <div>
            <label className="field-label">Professional title</label>
            <input required value={form.title} onChange={(e) => set("title", e.target.value)} className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
          </div>
          <div>
            <label className="field-label">Short summary (used in the hero)</label>
            <textarea required rows={3} value={form.summary} onChange={(e) => set("summary", e.target.value)} className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
          </div>
        </section>

        <section className="card space-y-4 p-6">
          <p className="field-label">About</p>
          <div>
            <label className="field-label">About body</label>
            <textarea required rows={5} value={form.aboutBody} onChange={(e) => set("aboutBody", e.target.value)} className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
          </div>
          <div>
            <label className="field-label">Research interests</label>
            <input value={form.researchInterests} onChange={(e) => set("researchInterests", e.target.value)} placeholder="Comma-separated" className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
          </div>
          <div>
            <label className="field-label">Career interests</label>
            <textarea rows={2} value={form.careerInterests} onChange={(e) => set("careerInterests", e.target.value)} className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
          </div>
          <div>
            <label className="field-label">Key strengths</label>
            <textarea rows={2} value={form.keyStrengths} onChange={(e) => set("keyStrengths", e.target.value)} className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
          </div>
        </section>

        <section className="card space-y-4 p-6">
          <p className="field-label">Contact & links</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Email</label>
              <input type="email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="field-label">Phone</label>
              <input value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
            </div>
          </div>
          <div>
            <label className="field-label">Location</label>
            <input value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
          </div>
          <div>
            <label className="field-label">LinkedIn URL</label>
            <input type="url" value={form.linkedin ?? ""} onChange={(e) => set("linkedin", e.target.value)} placeholder="https://linkedin.com/in/…" className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
          </div>
          <div>
            <label className="field-label">GitHub URL</label>
            <input type="url" value={form.github ?? ""} onChange={(e) => set("github", e.target.value)} className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Other link label</label>
              <input value={form.otherLinkLabel ?? ""} onChange={(e) => set("otherLinkLabel", e.target.value)} placeholder="e.g. ResearchGate" className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="field-label">Other link URL</label>
              <input type="url" value={form.otherLinkUrl ?? ""} onChange={(e) => set("otherLinkUrl", e.target.value)} className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
            </div>
          </div>
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && <p className="text-sm text-teal-700">Saved.</p>}

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </AdminShell>
  );
}
