"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6V11h-6v9zm0-16v5h6V4h-6z" },
  { href: "/admin/profile", label: "Profile", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0" },
  { href: "/admin/education", label: "Education", icon: "M12 3l9 4.5-9 4.5-9-4.5L12 3zm-6 7v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" },
  { href: "/admin/experience", label: "Experience", icon: "M4 7h16v12H4V7zm4 0V5a2 2 0 012-2h4a2 2 0 012 2v2" },
  { href: "/admin/skills", label: "Skills", icon: "M12 2l2.6 6.6L21 9l-5 4.4L17.4 21 12 17.3 6.6 21 8 13.4 3 9l6.4-.4L12 2z" },
  { href: "/admin/projects", label: "Projects", icon: "M3 7h18M3 12h18M3 17h18" },
  { href: "/admin/certifications", label: "Certifications", icon: "M12 15a5 5 0 100-10 5 5 0 000 10zM8.5 14L7 21l5-2.5L17 21l-1.5-7" },
  { href: "/admin/documents", label: "Documents", icon: "M6 2h9l5 5v15H6V2zm9 0v5h5" },
  { href: "/admin/gallery", label: "Gallery", icon: "M4 5h16v14H4V5zm4 0l2-2h4l2 2M8 12l2.5 2.5L14 11l4 4" },
  { href: "/admin/navigation", label: "Navigation", icon: "M4 6h16M4 12h10M4 18h16" },
  { href: "/admin/messages", label: "Messages", icon: "M4 4h16v14H7l-3 3V4z" },
  { href: "/admin/settings", label: "Settings", icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM4 12h1M19 12h1M12 4v1M12 19v1M6 6l.7.7M17.3 17.3l.7.7M6 18l.7-.7M17.3 6.7l.7-.7" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-paper font-body text-ink">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface lg:flex">
          <div className="flex h-16 items-center border-b border-line px-6">
            <span className="font-display text-lg font-semibold text-teal-900">Admin</span>
          </div>
          <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active ? "bg-teal-900 text-paper" : "text-ink/65 hover:bg-teal-50 hover:text-teal-900"
                  }`}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-line p-3">
            <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink/65 hover:bg-teal-50 hover:text-teal-900">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
              View site
            </Link>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink/65 hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
              {loggingOut ? "Logging out…" : "Log out"}
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-line bg-surface px-4 lg:hidden">
            <span className="font-display text-lg font-semibold text-teal-900">Admin</span>
            <button onClick={() => setMobileOpen((o) => !o)} className="rounded-md border border-line p-2" aria-label="Toggle menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </header>
          {mobileOpen && (
            <nav className="border-b border-line bg-surface p-3 lg:hidden">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                    pathname === item.href ? "bg-teal-900 text-paper" : "text-ink/70 hover:bg-teal-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <button onClick={handleLogout} className="mt-1 block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-700 hover:bg-red-50">
                Log out
              </button>
            </nav>
          )}
          <main className="flex-1 p-5 sm:p-8 lg:p-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
