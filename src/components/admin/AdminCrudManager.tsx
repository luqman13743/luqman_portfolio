"use client";

import { useEffect, useState } from "react";

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "textarea" | "date" | "url" | "number";
  required?: boolean;
  placeholder?: string;
  helpText?: string;
}

interface Props {
  apiPath: string;
  fields: FieldConfig[];
  emptyDefaults: Record<string, any>;
  titleField: string;
  subtitleFields?: string[];
  hasOrder?: boolean;
  entityLabel: string;
  entityLabelPlural: string;
}

type Item = Record<string, any> & { id: string };

export default function AdminCrudManager({
  apiPath,
  fields,
  emptyDefaults,
  titleField,
  subtitleFields = [],
  hasOrder = false,
  entityLabel,
  entityLabelPlural,
}: Props) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [editing, setEditing] = useState<Item | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>(emptyDefaults);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch(apiPath);
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openAdd() {
    setEditing(null);
    setFormData({ ...emptyDefaults, order: items?.length ?? 0 });
    setError("");
    setFormOpen(true);
  }

  function openEdit(item: Item) {
    setEditing(item);
    setFormData(item);
    setError("");
    setFormOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload: Record<string, any> = { ...formData };
    for (const f of fields) {
      if (f.type === "number") payload[f.name] = Number(payload[f.name] || 0);
    }

    const res = await fetch(editing ? `${apiPath}/${editing.id}` : apiPath, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Something went wrong. Please check the fields and try again.");
      setSaving(false);
      return;
    }

    await load();
    setSaving(false);
    setFormOpen(false);
  }

  async function handleDelete(id: string) {
    if (!confirm(`Delete this ${entityLabel}? This can't be undone.`)) return;
    const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  async function move(item: Item, direction: -1 | 1) {
    if (!items) return;
    const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const idx = sorted.findIndex((i) => i.id === item.id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const other = sorted[swapIdx];

    await Promise.all([
      fetch(`${apiPath}/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: other.order }),
      }),
      fetch(`${apiPath}/${other.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: item.order }),
      }),
    ]);
    load();
  }

  const sortedItems = items ? (hasOrder ? [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : items) : null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-teal-900 sm:text-3xl">{entityLabelPlural}</h1>
          <p className="mt-1 text-sm text-ink/55">
            {sortedItems ? `${sortedItems.length} ${sortedItems.length === 1 ? entityLabel : entityLabelPlural.toLowerCase()}` : "Loading…"}
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary !py-2.5 text-sm">
          + Add {entityLabel}
        </button>
      </div>

      {sortedItems === null ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : sortedItems.length === 0 ? (
        <div className="card border-dashed p-10 text-center text-sm text-ink/50">
          No {entityLabelPlural.toLowerCase()} yet. Click "Add {entityLabel}" to create the first one.
        </div>
      ) : (
        <div className="space-y-3">
          {sortedItems.map((item, idx) => (
            <div key={item.id} className="card flex items-start justify-between gap-4 p-5">
              <div className="min-w-0">
                <p className="truncate font-medium text-teal-900">{item[titleField]}</p>
                {subtitleFields.length > 0 && (
                  <p className="mt-1 truncate text-sm text-ink/55">
                    {subtitleFields.map((f) => item[f]).filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {hasOrder && (
                  <>
                    <button
                      onClick={() => move(item, -1)}
                      disabled={idx === 0}
                      className="rounded-md border border-line p-1.5 text-ink/50 hover:bg-teal-50 disabled:opacity-30"
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => move(item, 1)}
                      disabled={idx === sortedItems.length - 1}
                      className="rounded-md border border-line p-1.5 text-ink/50 hover:bg-teal-50 disabled:opacity-30"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                  </>
                )}
                <button onClick={() => openEdit(item)} className="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-teal-900 hover:bg-teal-50">
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)} className="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
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
              <h2 className="font-display text-xl font-semibold text-teal-900">
                {editing ? `Edit ${entityLabel}` : `Add ${entityLabel}`}
              </h2>
              <button onClick={() => setFormOpen(false)} className="text-ink/40 hover:text-ink" aria-label="Close">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {fields.map((f) => (
                <div key={f.name}>
                  <label htmlFor={f.name} className="field-label">
                    {f.label} {f.required && <span className="text-amber-600">*</span>}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      id={f.name}
                      required={f.required}
                      placeholder={f.placeholder}
                      rows={4}
                      value={formData[f.name] ?? ""}
                      onChange={(e) => setFormData((d) => ({ ...d, [f.name]: e.target.value }))}
                      className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                    />
                  ) : (
                    <input
                      id={f.name}
                      type={f.type === "date" ? "date" : f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
                      required={f.required}
                      placeholder={f.placeholder}
                      value={formData[f.name] ?? ""}
                      onChange={(e) => setFormData((d) => ({ ...d, [f.name]: e.target.value }))}
                      className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                    />
                  )}
                  {f.helpText && <p className="mt-1 text-xs text-ink/45">{f.helpText}</p>}
                </div>
              ))}

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
    </div>
  );
}
