import { listSkills } from "@/lib/repo";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";
import EmptyState from "../EmptyState";

export default async function SkillsSection() {
  const skills = await listSkills();
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section id="skills" className="section-shell py-20 sm:py-28">
      <SectionHeading
        eyebrow="Skills"
        title="Capabilities"
        description="Grouped by area. Since exact proficiency levels aren't self-rated on the CV, skills are shown as verified capabilities rather than arbitrary percentages."
      />

      <div className="mt-14">
        {categories.length === 0 ? (
          <EmptyState label="Skills will appear here once added from the admin dashboard." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {categories.map((cat, i) => (
              <Reveal key={cat} delay={0.05 * i} className="card p-6 sm:p-7">
                <p className="field-label">{cat}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills
                    .filter((s) => s.category === cat)
                    .map((s) => (
                      <span key={s.id} className="tag-chip">
                        {s.name}
                      </span>
                    ))}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
