import Link from "next/link";
import { getProfile } from "@/lib/repo";

export default async function SiteFooter() {
  const profile = await getProfile();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-teal-900 text-paper">
      <div className="section-shell flex flex-col gap-8 py-14 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-xl font-semibold">{profile.name || "Portfolio"}</p>
          <p className="mt-2 max-w-sm text-sm text-paper/65">{profile.title}</p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-paper/80">
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="hover:text-amber-300">
              {profile.email}
            </a>
          )}
          {profile.location && <span className="text-paper/60">{profile.location}</span>}
          <div className="mt-2 flex gap-4">
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
                LinkedIn
              </a>
            )}
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
                GitHub
              </a>
            )}
            {profile.otherLinkUrl && profile.otherLinkLabel && (
              <a href={profile.otherLinkUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
                {profile.otherLinkLabel}
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="section-shell flex flex-col gap-2 py-5 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} {profile.name || "Portfolio"}. All rights reserved.</span>
          <Link href="/admin" className="hover:text-paper/80">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
