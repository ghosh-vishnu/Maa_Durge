"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import DonateSection from "@/components/sections/DonateSection";
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
              className="group relative overflow-hidden rounded-3xl"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <figcaption className="absolute inset-x-4 bottom-4 rounded-xl bg-black/45 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm">
                {item.title}
              </figcaption>
            </motion.figure>
          ))}
        </div>

      </div>

      <DonateSection className="pt-14" />
    </AnimatedSection>
  );
}
