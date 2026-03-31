import { BellRing } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";
import { announcements } from "@/data/site";

export default function AnnouncementSection() {
  return (
    <AnimatedSection id="announcements" className="py-20 bg-[var(--color-cream)]/55 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Announcements"
          title="Latest Community Updates"
          subtitle="Important notices and upcoming opportunities to participate with the Samiti."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {announcements.map((item) => (
            <article
              key={item.title}
              className="premium-card p-6"
            >
              <div className="premium-chip mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl">
                <BellRing size={18} />
              </div>
              <h3 className="font-heading text-xl font-semibold text-[var(--color-charcoal)]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
