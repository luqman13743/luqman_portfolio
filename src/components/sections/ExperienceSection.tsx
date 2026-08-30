import { listExperience } from "@/lib/repo";
import { formatDateRange } from "@/lib/format";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";
import EmptyState from "../EmptyState";

export default async function ExperienceSection() {
  const items = await listExperience();

  return (
    <section id="experience" className="section-shell py-20 sm:py-28">
      <SectionHeading eyebrow="Experience" title="Laboratory & clinical experience" />

      <div className="mt-14">
        {items.length === 0 ? (
          <EmptyState label="Work experience will appear here once it's added from the admin dashboard." />
        ) : (
          <div className="grid gap-6">
            {items.map((x, i) => {
              const skills = x.skillsUsed.split(",").map((s) => s.trim()).filter(Boolean);
              const bullets = x.responsibilities.split("\n").map((s) => s.trim()).filter(Boolean);
              return (
                <Reveal key={x.id} delay={0.05 * i}>
                  <article className="card grid gap-6 p-7 sm:grid-cols-[220px_1fr] sm:p-9">
                    <div>
                      <p className="field-label">{formatDateRange(x.startDate, x.endDate)}</p>
                      <h3 className="mt-2 font-display text-xl font-semibold text-teal-900">{x.position}</h3>
                      <p className="mt-1 text-sm font-medium text-ink/70">{x.organization}</p>
                      {x.location && <p className="mt-1 text-sm text-ink/45">{x.location}</p>}
                    </div>
                    <div>
                      <ul className="space-y-2.5">
                        {bullets.map((b, bi) => (
                          <li key={bi} className="flex gap-3 text-sm leading-relaxed text-ink/75">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                      {skills.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {skills.map((s) => (
                            <span key={s} className="tag-chip">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
