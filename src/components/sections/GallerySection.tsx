import Image from "next/image";
import { listGalleryItems } from "@/lib/repo";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";

export default async function GallerySection() {
  const items = await listGalleryItems({ publicOnly: true });
  return (
    <section id="gallery" className="border-t border-line py-20 sm:py-28">
      <div className="section-shell">
        <SectionHeading eyebrow="Gallery" title="A visual record" description="Selected photographs, lab moments, certificates, events, and other visual highlights." />
        {items.length === 0 ? (
          <div className="mt-12 card border-dashed p-10 text-center text-sm text-ink/50">Gallery images will appear here once added from the admin dashboard.</div>
        ) : (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={0.05 * i} className="group">
                <figure className="card overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
                    <Image src={item.imageUrl} alt={item.title || "Gallery image"} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  </div>
                  {(item.title || item.caption) && <figcaption className="p-5"><p className="font-display text-lg font-semibold text-teal-900">{item.title || "Untitled"}</p>{item.caption && <p className="mt-1 text-sm leading-relaxed text-ink/60">{item.caption}</p>}</figcaption>}
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
