import { listCertifications, getDocument } from "@/lib/repo";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";
import EmptyState from "../EmptyState";
import { formatMonthYear } from "@/lib/format";

export default async function CertificationsSection() {
  const items = await listCertifications();
  const docs = await Promise.all(items.map((c) => c.documentId ? getDocument(c.documentId) : Promise.resolve(null)));
  const itemsWithDocs = items.map((c, i) => ({ c, doc: docs[i] }));

  return (
    <section id="certifications" className="border-t border-line bg-teal-50/40 py-20 sm:py-28">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Certifications & Training"
          title="Certificates, training & professional development"
        />

        <div className="mt-14">
          {items.length === 0 ? (
            <EmptyState label="Certificates, training and workshop records will appear here once added from the admin dashboard." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c, i) => {
                const doc = c.documentId ? await getDocument(c.documentId) : null;
                const link = doc?.fileUrl || doc?.externalUrl || c.verificationUrl;
                return (
                  <Reveal key={c.id} delay={0.05 * i} className="card flex h-full flex-col p-6">
                    <p className="field-label">{c.date ? formatMonthYear(c.date) : "Undated"}</p>
                    <h3 className="mt-2 font-display text-lg font-semibold text-teal-900">{c.title}</h3>
                    <p className="mt-1 text-sm text-ink/60">{c.issuer}</p>
                    {link && (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-500"
                      >
                        View certificate →
                      </a>
                    )}
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
