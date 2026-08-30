```tsx
import { listProjects, getDocument } from "@/lib/repo";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";

export default async function ProjectsSection() {
  const items = await listProjects();

  if (items.length === 0) return null;

  // Fetch all related documents before rendering
  const docs = await Promise.all(
    items.map((p) =>
      p.documentId ? getDocument(p.documentId) : Promise.resolve(null)
    )
  );

  const itemsWithDocs = items.map((p, i) => ({
    p,
    doc: docs[i],
  }));

  return (
    <section id="projects" className="section-shell py-20 sm:py-28">
      <SectionHeading
        eyebrow="Projects & Research Work"
        title="Selected work"
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {itemsWithDocs.map(({ p, doc }, i) => {
          const methods = p.methods
            .split(",")
            .map((m) => m.trim())
            .filter(Boolean);

          return (
            <Reveal
              key={p.id}
              delay={0.05 * i}
              className="card flex h-full flex-col p-7"
            >
              <p className="field-label">{p.date}</p>

              <h3 className="mt-2 font-display text-xl font-semibold text-teal-900">
                {p.title}
              </h3>

              {p.role && (
                <p className="mt-1 text-sm font-medium text-ink/60">
                  {p.role}
                </p>
              )}

              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                {p.description}
              </p>

              {methods.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {methods.map((m) => (
                    <span key={m} className="tag-chip">
                      {m}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-5 flex gap-4 text-sm font-medium">
                {p.externalUrl && (
                  <a
                    href={p.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 hover:text-amber-500"
                  >
                    Visit link →
                  </a>
                )}

                {doc?.fileUrl && (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 hover:text-amber-500"
                  >
                    Related document →
                  </a>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
```
