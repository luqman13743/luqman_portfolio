"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type NavItem = { id: string; label: string; href: string; order: number; isVisible: boolean };
const THEMES = [
  { id: "black", label: "Pure black", icon: "●" },
  { id: "white", label: "Clean white", icon: "○" },
  { id: "glow", label: "Black + blue glow", icon: "✦" },
];
const DEFAULT_NAV: NavItem[] = [
  { id: "nav-about", label: "About", href: "/#about", order: 0, isVisible: true },
  { id: "nav-education", label: "Education", href: "/#education", order: 1, isVisible: true },
  { id: "nav-experience", label: "Experience", href: "/#experience", order: 2, isVisible: true },
  { id: "nav-research", label: "Research", href: "/#research", order: 3, isVisible: true },
  { id: "nav-skills", label: "Skills", href: "/#skills", order: 4, isVisible: true },
  { id: "nav-certifications", label: "Certifications", href: "/#certifications", order: 5, isVisible: true },
  { id: "nav-projects", label: "Projects", href: "/#projects", order: 6, isVisible: true },
  { id: "nav-gallery", label: "Gallery", href: "/#gallery", order: 7, isVisible: true },
  { id: "nav-documents", label: "Documents", href: "/#documents", order: 8, isVisible: true },
  { id: "nav-contact", label: "Contact", href: "/#contact", order: 9, isVisible: true },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [theme, setTheme] = useState("glow");
  const [navItems, setNavItems] = useState<NavItem[]>(DEFAULT_NAV);

  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-theme") || "glow";
    setTheme(saved);
    document.documentElement.dataset.theme = saved;
    fetch("/api/navigation")
      .then((r) => (r.ok ? r.json() : []))
      .then((items) => Array.isArray(items) && items.length ? setNavItems(items) : undefined)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function chooseTheme(id: string) {
    setTheme(id);
    window.localStorage.setItem("portfolio-theme", id);
    document.documentElement.dataset.theme = id;
    setThemeOpen(false);
  }

  return (
    <header className="site-header sticky top-0 z-40">
      {/* Identity + theme row */}
      <div className="header-top border-b border-line">
        <div className="section-shell flex min-h-16 items-center justify-between gap-4 sm:min-h-[68px]">
          <Link href="/#top" className="group min-w-0 flex items-baseline gap-2">
            <span className="font-display text-lg font-semibold tracking-tight text-teal-900 sm:text-xl">M. Luqman</span>
            <span className="field-label hidden sm:inline">/ microbiology</span>
          </Link>

          <div className="relative shrink-0">
            <button type="button" onClick={() => setThemeOpen((v) => !v)} className="theme-button" aria-label="Choose color theme" aria-expanded={themeOpen}>
              <span aria-hidden="true">{THEMES.find((x) => x.id === theme)?.icon ?? "✦"}</span>
            </button>
            <AnimatePresence>
              {themeOpen && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.16 }} className="theme-menu">
                  <p className="field-label px-3 pb-2">Theme</p>
                  {THEMES.map((item) => (
                    <button key={item.id} type="button" onClick={() => chooseTheme(item.id)} className={`theme-option ${theme === item.id ? "is-active" : ""}`}>
                      <span>{item.icon}</span><span>{item.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation is deliberately kept on its own row */}
      <div className="header-nav border-b border-line">
        <div className="section-shell flex min-h-14 items-center justify-end">
          <nav className="hidden w-full items-center justify-center gap-x-5 gap-y-2 lg:flex xl:gap-x-7" aria-label="Main navigation">
            {navItems.filter((item) => item.isVisible).map((item) => (
              <Link key={item.id} href={item.href} className="nav-link">{item.label}</Link>
            ))}
            <Link href="/#contact" className="btn-primary !px-5 !py-2.5 text-sm">Contact Me</Link>
          </nav>

          <button type="button" onClick={() => setOpen((o) => !o)} className="mobile-menu-button lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            <div className="relative h-3.5 w-4">
              <span className={`absolute left-0 top-0 h-[1.5px] w-4 bg-current transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 bg-current transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute bottom-0 left-0 h-[1.5px] w-4 bg-current transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }} className="mobile-nav lg:hidden" aria-label="Mobile navigation">
            <div className="section-shell grid grid-cols-2 gap-1 py-3 sm:grid-cols-3">
              {navItems.filter((item) => item.isVisible).map((item) => (
                <Link key={item.id} href={item.href} onClick={() => setOpen(false)} className="nav-link-mobile">{item.label}</Link>
              ))}
              <Link href="/#contact" onClick={() => setOpen(false)} className="btn-primary col-span-2 mt-1 sm:col-span-1">Contact Me</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
