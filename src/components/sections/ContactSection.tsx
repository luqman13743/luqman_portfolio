import { getProfile } from "@/lib/repo";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";
import ContactForm from "../ContactForm";

export default async function ContactSection() {
  const profile = await getProfile();

  const links = [
    profile.email && { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    profile.phone && { label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, "")}` },
    profile.location && { label: "Location", value: profile.location, href: undefined },
    profile.linkedin && { label: "LinkedIn", value: "View profile", href: profile.linkedin },
    profile.github && { label: "GitHub", value: "View profile", href: profile.github },
    profile.otherLinkUrl && profile.otherLinkLabel && { label: profile.otherLinkLabel, value: "View link", href: profile.otherLinkUrl },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <section id="contact" className="section-shell py-20 sm:py-28">
      <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Get in touch"
            description="Reach out directly, or send a message using the form."
          />
          <div className="mt-10 space-y-5">
            {links.map((l) => (
              <Reveal key={l.label}>
                <div>
                  <p className="field-label">{l.label}</p>
                  {l.href ? (
                    <a
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="mt-1 inline-block text-base font-medium text-teal-900 hover:text-amber-700"
                    >
                      {l.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-base font-medium text-teal-900">{l.value}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
