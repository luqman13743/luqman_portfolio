import { getProfile } from "@/lib/repo";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";

export default async function About() {
  const profile = await getProfile();

  const facts = [
    { label: "Research interests", value: profile.researchInterests },
    { label: "Career interests", value: profile.careerInterests },
    { label: "Key strengths", value: profile.keyStrengths },
  ].filter((f) => f.value);

  return (
    <section id="about" className="section-shell py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <SectionHeading
          eyebrow="About"
          title="A closer look"
          description="Academic background, research interests, and the strengths I bring to a lab bench."
        />

        <div>
          <Reveal>
            <p className="text-base leading-relaxed text-ink/75 sm:text-lg">{profile.aboutBody}</p>
          </Reveal>

          {facts.length > 0 && (
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {facts.map((f, i) => (
                <Reveal key={f.label} delay={0.06 * (i + 1)} className="card p-5">
                  <p className="field-label">{f.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">{f.value}</p>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
