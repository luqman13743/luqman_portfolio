import Image from "next/image";
import Link from "next/link";
import { getProfile, listDocuments } from "@/lib/repo";
import PetriHero from "../PetriHero";
import Reveal from "../Reveal";

export default async function Hero() {
  const profile = await getProfile();
  const docs = await listDocuments({ publicOnly: true });
  const cv = docs.find((d) => d.category === "CV") ?? null;

  return (
    <section id="top" className="relative overflow-hidden border-b border-line">
      <div className="slide-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl" />

      <div className="section-shell relative grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
        <div>
          <Reveal>
            <p className="field-label">Portfolio / Microbiology</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-teal-900 sm:text-5xl lg:text-6xl">
              {profile.name || "Your Name"}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-3 font-display text-xl text-amber-500 sm:text-2xl">{profile.title}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
              {profile.summary}
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              {cv ? (
                <a href={cv.fileUrl ?? cv.externalUrl ?? "#"} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  View My CV
                </a>
              ) : (
                <Link href="/#documents" className="btn-primary">
                  View My CV
                </Link>
              )}
              <Link href="/#contact" className="btn-secondary">
                Contact Me
              </Link>
            </div>
          </Reveal>

          {profile.location && (
            <Reveal delay={0.28}>
              <p className="field-label mt-10">Based in {profile.location}</p>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.1} y={26} className="relative">
          {profile.profileImageUrl ? (
            <div className="relative mx-auto aspect-square w-full max-w-[380px] overflow-hidden rounded-[2rem] border border-line shadow-xl">
              <Image src={profile.profileImageUrl} alt={profile.name} fill className="object-cover" sizes="380px" priority />
            </div>
          ) : (
            <PetriHero />
          )}
        </Reveal>
      </div>
    </section>
  );
}
