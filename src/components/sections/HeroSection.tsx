"use client";

import { motion } from "framer-motion";
import { HeartHandshake, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { defaultManagedHero, readHeroFromStorage } from "@/lib/siteContent";

export default function HeroSection() {
  const [hero, setHero] = useState(defaultManagedHero);

  useEffect(() => {
    setHero(readHeroFromStorage());
  }, []);

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div
        className="hero-media"
        style={{
          backgroundImage: `url('${hero.image}')`,
        }}
      />
      <div className="hero-vignette" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="hero-content-shell max-w-3xl"
        >
          <p className="hero-kicker mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em]">
            <Sparkles size={14} />
            Heritage • Seva • Bhakti
          </p>

          <h1 className="hero-title font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Orai Jankipur Radhi Kayasth Samiti
          </h1>

          <p className="hero-subtitle mt-6 max-w-2xl text-lg leading-8 text-white/90 sm:text-xl">
            Serving Culture, Community & Devotion
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#contact" className="hero-btn-primary">
              <HeartHandshake size={18} />
              Join Us
            </a>
            <a href="#donate" className="hero-btn-ghost">
              Donate
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}