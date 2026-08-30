import { getProfile } from "@/lib/repo";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";
import EmptyState from "../EmptyState";

const ICONS: Record<string, string> = {
  default: "M12 2v6M12 16v6M4.9 4.9l4.2 4.2M14.9 14.9l4.2 4.2M2 12h6M16 12h6M4.9 19.1l4.2-4.2M14.9 9.1l4.2-4.2",
};

export default async function ResearchSection() {
  const profile = await getProfile();
  const interests = profile.researchInterests.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <section id="research" className="border-t border-line bg-teal-900 py-20 text-paper sm:py-28">
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <p className="field-label !text-amber-300">Research</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Research & academic interests
          </h2>
          {profile.careerInterests && (
            <p className="mt-4 text-base leading-relaxed text-paper/70">{profile.careerInterests}</p>
          )}
        </Reveal>

        <div className="mt-12">
          {interests.length === 0 ? (
            <EmptyState label="Research interests will appear here once added from the admin dashboard." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {interests.map((topic, i) => (
                <Reveal key={topic} delay={0.05 * i}>
                  <div className="h-full rounded-2xl border border-paper/15 bg-paper/[0.04] p-6 transition-colors hover:border-amber-300/40 hover:bg-paper/[0.07]">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-300">
                      <path d={ICONS.default} strokeLinecap="round" />
                    </svg>
                    <p className="mt-4 font-display text-lg font-medium">{topic}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
