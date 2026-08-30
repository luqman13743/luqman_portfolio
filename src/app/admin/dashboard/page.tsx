"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";

interface Stats {
  education: number;
  experience: number;
  skills: number;
  projects: number;
  certifications: number;
  documents: number;
  messages: number;
  unreadMessages: number;
}

const CARDS: { key: keyof Stats; label: string; href: string }[] = [
  { key: "education", label: "Education entries", href: "/admin/education" },
  { key: "experience", label: "Experience entries", href: "/admin/experience" },
  { key: "skills", label: "Skills", href: "/admin/skills" },
  { key: "projects", label: "Projects", href: "/admin/projects" },
  { key: "certifications", label: "Certifications", href: "/admin/certifications" },
  { key: "documents", label: "Documents", href: "/admin/documents" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-teal-900 sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-ink/55">Overview of your portfolio content.</p>
      </div>

      {stats?.unreadMessages ? (
        <Link
          href="/admin/messages"
          className="mb-8 flex items-center justify-between rounded-xl border border-amber-300 bg-amber-100/40 px-5 py-4 text-sm font-medium text-amber-700 hover:bg-amber-100/70"
        >
          <span>
            You have {stats.unreadMessages} unread contact {stats.unreadMessages === 1 ? "message" : "messages"}.
          </span>
          <span>View →</span>
        </Link>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => (
          <Link key={c.key} href={c.href} className="card p-6 transition-shadow hover:shadow-lg">
            <p className="field-label">{c.label}</p>
            <p className="mt-3 font-display text-3xl font-semibold text-teal-900">
              {stats ? stats[c.key] : "—"}
            </p>
          </Link>
        ))}
        <Link href="/admin/messages" className="card p-6 transition-shadow hover:shadow-lg">
          <p className="field-label">Contact messages</p>
          <p className="mt-3 font-display text-3xl font-semibold text-teal-900">
            {stats ? stats.messages : "—"}
          </p>
          {!!stats?.unreadMessages && <p className="mt-1 text-xs font-medium text-amber-700">{stats.unreadMessages} unread</p>}
        </Link>
      </div>

      <div className="mt-10 card p-6">
        <p className="field-label">Quick links</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/profile" className="btn-secondary !py-2 text-sm">Edit profile</Link>
          <Link href="/admin/documents" className="btn-secondary !py-2 text-sm">Upload a document</Link>
          <Link href="/admin/settings" className="btn-secondary !py-2 text-sm">Site settings</Link>
          <Link href="/" target="_blank" className="btn-secondary !py-2 text-sm">View public site</Link>
        </div>
      </div>
    </AdminShell>
  );
}
