"use client";

import { useEffect, useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";
import { defaultManagedAbout, readAboutFromStorage } from "@/lib/siteContent";

export default function AboutSection() {
  const [about, setAbout] = useState(defaultManagedAbout);

  useEffect(() => {
    setAbout(readAboutFromStorage());
  }, []);

  return (
    <AnimatedSection id="about" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="About Samiti"
          title="A Community Rooted in Values"
          subtitle="We preserve traditions while building a forward-looking platform for social service, cultural continuity, and shared spiritual growth."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="premium-panel p-7">
            <h3 className="font-heading text-2xl font-semibold text-[var(--color-charcoal)]">Our Mission</h3>
            <p className="mt-4 text-[15px] leading-7 text-[var(--color-muted)]">
              To unite families through devotional gatherings, educational efforts, and charitable initiatives that strengthen harmony and uplift our region.
            </p>
            <div className="premium-chip mt-5 w-fit px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
              Tradition • Service • Unity
            </div>
          </div>

          <div className="premium-panel overflow-hidden p-2">
            <div
              className="h-full min-h-[220px] rounded-[calc(var(--radius-panel)-0.35rem)] bg-cover bg-center sm:min-h-[280px]"
              style={{
                backgroundImage:
                  `linear-gradient(130deg, rgba(255, 248, 236, 0.12), rgba(186, 135, 76, 0.24)), url('${about.image}')`,
              }}
            />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}