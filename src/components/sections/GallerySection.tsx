"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";
import { readGalleryFromStorage } from "@/lib/siteContent";

export default function GallerySection() {
  const [galleryItems] = useState(readGalleryFromStorage);

  return (
    <AnimatedSection id="gallery" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Gallery"
          title="Moments of Devotion & Togetherness"
          subtitle="A visual journey through our celebrations, seva initiatives, and cultural gatherings."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <motion.figure
              key={item.title}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="group relative overflow-hidden rounded-2xl sm:rounded-3xl"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110 sm:h-72"
              />
              <figcaption className="absolute inset-x-3 bottom-3 rounded-xl bg-black/55 px-3 py-2 text-xs font-semibold leading-tight text-white backdrop-blur-sm sm:inset-x-4 sm:bottom-4 sm:px-4 sm:py-3 sm:text-sm">
                {item.title}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div id="donate" className="mt-14 rounded-3xl bg-[var(--color-charcoal)] px-8 py-10 text-center text-white">
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-gold)]">Support the Mission</p>
          <h3 className="mt-3 font-heading text-3xl font-semibold">Contribute to Community Seva</h3>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Your donation helps us organize spiritual events, youth programs, and social support initiatives for families across the region.
          </p>
          <a href="#contact" className="btn-primary mt-7 inline-flex">
            Donate Now
          </a>
        </div>
      </div>
    </AnimatedSection>
  );
}