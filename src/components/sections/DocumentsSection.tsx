import { listDocuments } from "@/lib/repo";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";
import EmptyState from "../EmptyState";

function fileBadge(fileType: string | null): string {
  if (!fileType) return "LINK";
  if (fileType.includes("pdf")) return "PDF";
  if (fileType.includes("image")) return "IMG";
  return "FILE";
}

export default async function DocumentsSection() {
  const docs = await listDocuments({ publicOnly: true });

  return (
    <section id="documents" className="border-t border-line bg-teal-50/40 py-20 sm:py-28">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Documents"
          title="CV, certificates & research documents"
          description="Publicly available documents. Everything opens in a new tab."
        />

        <div className="mt-14">
          {docs.length === 0 ? (
            <EmptyState label="Documents such as the CV, certificates, and research papers will appear here once uploaded from the admin dashboard." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {docs.map((d, i) => (
                <Reveal key={d.id} delay={0.04 * i}>
                  <a
                    href={d.fileUrl ?? d.externalUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card group flex h-full flex-col gap-3 p-5 transition-shadow hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span className="field-label !text-amber-700">{d.category}</span>
                      <span className="rounded-md bg-teal-900/5 px-2 py-0.5 font-mono text-[10px] font-medium text-teal-700">
                        {fileBadge(d.fileType)}
                      </span>
                    </div>
                    <p className="font-display text-base font-semibold text-teal-900 group-hover:text-amber-700">
                      {d.title}
                    </p>
                    {d.description && <p className="text-sm text-ink/60">{d.description}</p>}
                    <span className="mt-auto pt-1 text-sm font-medium text-amber-700">Open document →</span>
                  </a>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
