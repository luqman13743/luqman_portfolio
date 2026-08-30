"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/messages");
    if (res.ok) setMessages(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleOpen(m: Message) {
    setOpenId(openId === m.id ? null : m.id);
    if (!m.isRead) {
      await fetch(`/api/admin/messages/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      load();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-semibold text-teal-900 sm:text-3xl">Messages</h1>
      <p className="mt-1 text-sm text-ink/55">{messages ? `${messages.length} message${messages.length === 1 ? "" : "s"}` : "Loading…"}</p>

      <div className="mt-6 space-y-3">
        {messages === null ? (
          <p className="text-sm text-ink/50">Loading…</p>
        ) : messages.length === 0 ? (
          <div className="card border-dashed p-10 text-center text-sm text-ink/50">
            No messages yet. Submissions from the contact form will appear here.
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="card overflow-hidden">
              <button onClick={() => toggleOpen(m)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                <div className="flex min-w-0 items-center gap-3">
                  {!m.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />}
                  <div className="min-w-0">
                    <p className={`truncate font-medium ${m.isRead ? "text-ink/70" : "text-teal-900"}`}>{m.subject}</p>
                    <p className="truncate text-sm text-ink/50">
                      {m.name} · {m.email}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-ink/40">{new Date(m.createdAt).toLocaleDateString()}</span>
              </button>
              {openId === m.id && (
                <div className="border-t border-line bg-teal-50/30 p-5">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink/80">{m.message}</p>
                  <div className="mt-4 flex gap-3">
                    <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`} className="btn-secondary !py-2 text-sm">
                      Reply by email
                    </a>
                    <button onClick={() => handleDelete(m.id)} className="rounded-md border border-line px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </AdminShell>
  );
}
