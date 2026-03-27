import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";

export default function AboutSection() {
  return (
    <AnimatedSection id="about" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="About Samiti"
          title="A Community Rooted in Values"
          subtitle="We preserve traditions while building a forward-looking platform for social service, cultural continuity, and shared spiritual growth."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-7 shadow-[0_20px_60px_rgba(217,112,24,0.08)] ring-1 ring-black/5">
            <h3 className="font-heading text-2xl font-semibold text-[var(--color-charcoal)]">Our Mission</h3>
            <p className="mt-4 text-[15px] leading-7 text-[var(--color-muted)]">
              To unite families through devotional gatherings, educational efforts, and charitable initiatives that strengthen harmony and uplift our region.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(37,32,27,0.1)] ring-1 ring-black/5">
            <div
              className="h-full min-h-[280px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(130deg, rgba(255, 248, 236, 0.12), rgba(186, 135, 76, 0.24)), url('https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80')",
              }}
            />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}