import { listEducation } from "@/lib/repo";
import { formatDateRange } from "@/lib/format";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";
import EmptyState from "../EmptyState";

export default async function EducationSection() {
  const items = await listEducation();

  return (
    <section id="education" className="border-t border-line bg-teal-50/40 py-20 sm:py-28">
      <div className="section-shell">
        <SectionHeading eyebrow="Education" title="Academic record" />

        <div className="mt-14">
          {items.length === 0 ? (
            <EmptyState label="Education history will appear here once it's added from the admin dashboard." />
          ) : (
            <ol className="relative space-y-10 border-l border-teal-900/15 pl-8 sm:pl-10">
              {items.map((e, i) => (
                <Reveal key={e.id} delay={0.05 * i}>
                  <li className="relative">
                    <span className="absolute -left-[38px] top-1.5 h-3 w-3 rounded-full border-2 border-teal-900 bg-paper sm:-left-[46px]" />
                    <p className="field-label">{formatDateRange(e.startDate, e.endDate)}</p>
                    <h3 className="mt-1.5 font-display text-xl font-semibold text-teal-900 sm:text-2xl">
                      {e.degree}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-ink/70">
                      {e.institution}
                      {(e.city || e.country) && (
                        <span className="text-ink/45"> · {[e.city, e.country].filter(Boolean).join(", ")}</span>
                      )}
                    </p>
                    {e.fieldOfStudy && <p className="mt-2 text-sm text-ink/60">{e.fieldOfStudy}</p>}
                    {e.details && <p className="mt-2 text-sm leading-relaxed text-ink/60">{e.details}</p>}
                  </li>
                </Reveal>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
