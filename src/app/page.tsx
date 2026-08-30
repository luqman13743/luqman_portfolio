// The whole page is driven by database content editable from /admin, so it
// must be rendered per-request rather than cached as static HTML at build
// time — otherwise CMS edits wouldn't show up on the live site.
export const dynamic = "force-dynamic";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import EducationSection from "@/components/sections/EducationSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ResearchSection from "@/components/sections/ResearchSection";
import SkillsSection from "@/components/sections/SkillsSection";
import CertificationsSection from "@/components/sections/CertificationsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import DocumentsSection from "@/components/sections/DocumentsSection";
import GallerySection from "@/components/sections/GallerySection";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <EducationSection />
      <ExperienceSection />
      <ResearchSection />
      <SkillsSection />
      <CertificationsSection />
      <ProjectsSection />
      <GallerySection />
      <DocumentsSection />
      <ContactSection />
    </>
  );
}
