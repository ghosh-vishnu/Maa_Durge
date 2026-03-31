"use client";

import { HeartHandshake, Sparkles, Zap } from "lucide-react";
import { useSyncExternalStore } from "react";
import { defaultManagedHero, readHeroFromStorage } from "@/lib/siteContent";

let cachedHeroSnapshot = defaultManagedHero;

const subscribeToHeroChanges = () => () => {};

const getClientHeroSnapshot = () => {
  const next = readHeroFromStorage();
  if (next.image === cachedHeroSnapshot.image) {
    return cachedHeroSnapshot;
  }
  cachedHeroSnapshot = next;
  return cachedHeroSnapshot;
};

const getServerHeroSnapshot = () => defaultManagedHero;

export default function HeroSection() {
  const hero = useSyncExternalStore(
    subscribeToHeroChanges,
    getClientHeroSnapshot,
    getServerHeroSnapshot,
  );

  return (
    <section id="home" className="hero-premium relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      <div
        className="hero-media"
        style={{ backgroundImage: `url('${hero.image}')` }}
      />

      <div className="hero-vignette" />
      <div className="hero-premium-grid" aria-hidden="true" />
      <div className="hero-premium-aura" aria-hidden="true" />
      <div className="hero-premium-noise" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-100/90 sm:text-sm">
            <Sparkles size={14} />
            Heritage - Seva - Bhakti
          </p>

          <h1 className="hero-title font-heading text-[clamp(2.4rem,7vw,6rem)] font-semibold leading-[0.95] text-white">
            Orai Jankipur
          </h1>

          <h2 className="saffron-gradient-text font-heading text-[clamp(2rem,6.2vw,5rem)] font-semibold leading-[1.02]">
            Radhi Kayasth Samiti
          </h2>

          <p className="hero-subtitle mt-6 max-w-2xl text-[clamp(1rem,2.4vw,1.35rem)] leading-relaxed text-white/88">
            A vibrant spiritual and cultural community rooted in tradition, collective seva, and modern unity.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#contact" className="btn-hero-primary group">
              <HeartHandshake size={20} className="transition-transform group-hover:scale-110" />
              <span>Join Us</span>
            </a>

            <a href="#donate" className="btn-hero-glass group">
              <Zap size={20} className="transition-transform group-hover:scale-110" />
              <span>Donate</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
