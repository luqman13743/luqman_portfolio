"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

interface Settings {
  siteTitle: string;
  metaDescription: string;
  ogImageUrl: string | null;
  primaryColorNote: string;
}

export default function SettingsAdminPage() {
  const [form, setForm] = useState<Settings>({ siteTitle: "", metaDescription: "", ogImageUrl: "", primaryColorNote: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setForm(data);
        setLoading(false);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    const res = await fetch("/api/admin/settings", {
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
      <h1 className="font-display text-2xl font-semibold text-teal-900 sm:text-3xl">Site settings</h1>
      <p className="mt-1 text-sm text-ink/55">Controls the browser tab title and search-engine/social preview text.</p>

      <form onSubmit={handleSave} className="mt-8 max-w-2xl space-y-5">
        <div className="card space-y-4 p-6">
          <div>
            <label className="field-label">Site title</label>
            <input
              required
              value={form.siteTitle}
              onChange={(e) => setForm((f) => ({ ...f, siteTitle: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="field-label">Meta description</label>
            <textarea
              rows={3}
              value={form.metaDescription}
              onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500"
            />
            <p className="mt-1 text-xs text-ink/45">Shown in search results and link previews. Aim for 1–2 sentences.</p>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && <p className="text-sm text-teal-700">Saved.</p>}

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </AdminShell>
  );
}
