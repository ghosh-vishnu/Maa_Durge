"use client";

import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";

type DonateSectionProps = {
  className?: string;
  withTopSpacing?: boolean;
};

export default function DonateSection({ className = "", withTopSpacing = false }: DonateSectionProps) {
  return (
    <AnimatedSection
      id="donate"
      className={`py-20 sm:py-24 ${withTopSpacing ? "pt-28 sm:pt-32" : ""} ${className}`.trim()}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[var(--color-charcoal)] px-8 py-10 text-center text-white">
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-gold)]">Support the Mission</p>
          <h3 className="mt-3 font-heading text-3xl font-semibold">Contribute to Community Seva</h3>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Your donation helps us organize spiritual events, youth programs, and social support initiatives for families across the region.
          </p>
          <Link href="/contact" className="btn-primary mt-7 inline-flex">
            Donate Now
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}
