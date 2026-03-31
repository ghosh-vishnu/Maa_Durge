"use client";

import { ChevronLeft, ChevronRight, HeartHandshake, Sparkles, Zap } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { defaultManagedHero, readHeroFromStorage } from "@/lib/siteContent";

let cachedHeroSnapshot = defaultManagedHero;

const subscribeToHeroChanges = () => () => {};

const getClientHeroSnapshot = () => {
  const next = readHeroFromStorage();
  if (next.images.join("|") === cachedHeroSnapshot.images.join("|")) {
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
  const [slideIndex, setSlideIndex] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const slides = hero.images.length > 0 ? [...hero.images, hero.images[0]] : [];
  const activeSlide = hero.images.length > 0 ? slideIndex % hero.images.length : 0;

  useEffect(() => {
    if (hero.images.length <= 1) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsTransitionEnabled(true);
      setSlideIndex((current) => current + 1);
    }, 2050);

    return () => window.clearTimeout(timer);
  }, [slideIndex, hero.images.length]);
  const effectiveSlideIndex =
    hero.images.length > 0 ? Math.min(slideIndex, hero.images.length) : 0;

  const handleTrackTransitionEnd = () => {
    if (slideIndex !== hero.images.length) {
      return;
    }

    setIsTransitionEnabled(false);
    setSlideIndex(0);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIsTransitionEnabled(true);
      });
    });
  };

  const showPreviousSlide = () => {
    if (hero.images.length <= 1) {
      return;
    }

    if (slideIndex === 0) {
      setIsTransitionEnabled(false);
      setSlideIndex(hero.images.length);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setIsTransitionEnabled(true);
          setSlideIndex(hero.images.length - 1);
        });
      });
      return;
    }

    setIsTransitionEnabled(true);
    setSlideIndex((current) => current - 1);
  };

  const showNextSlide = () => {
    if (hero.images.length <= 1) {
      return;
    }

    setIsTransitionEnabled(true);
    setSlideIndex((current) => current + 1);
  };

  return (
    <section id="home" className="hero-premium relative flex min-h-[100svh] items-end overflow-hidden">
      <div className="hero-slider" aria-hidden="true">
        <div
          className="hero-slider-track"
          style={{
            transform: `translateX(-${effectiveSlideIndex * (100 / Math.max(1, slides.length))}%)`,
            transition: isTransitionEnabled ? undefined : "none",
          }}
          onTransitionEnd={handleTrackTransitionEnd}
        >
          {slides.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="hero-slide"
              style={{ backgroundImage: `url('${image}')` }}
            />
          ))}
        </div>
      </div>

      <div className="hero-vignette" />
      <div className="hero-premium-grid" aria-hidden="true" />
      <div className="hero-premium-aura" aria-hidden="true" />
      <div className="hero-premium-noise" aria-hidden="true" />

      <button
        type="button"
        onClick={showPreviousSlide}
        className="hero-arrow hero-arrow-left"
        aria-label="Previous hero image"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        onClick={showNextSlide}
        className="hero-arrow hero-arrow-right"
        aria-label="Next hero image"
      >
        <ChevronRight size={22} />
      </button>

      <div className="relative z-10 w-full px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8 lg:pb-14">
        <div className="w-[min(92vw,620px)]">
          <p className="hero-kicker mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] sm:text-xs">
            <Sparkles size={14} />
            Heritage - Seva - Bhakti
          </p>

          <h1 className="hero-title font-heading text-[clamp(1.9rem,5.2vw,3.6rem)] font-semibold leading-[0.98] text-white">
            Orai Jankipur
          </h1>

          <h2 className="saffron-gradient-text font-heading text-[clamp(1.6rem,4.8vw,3rem)] font-semibold leading-[1.04]">
            Radhi Kayasth Samiti
          </h2>

          <p className="hero-subtitle mt-4 max-w-[560px] text-[clamp(0.9rem,2.1vw,1.05rem)] leading-relaxed text-white/92">
            A vibrant spiritual and cultural community rooted in tradition, collective seva, and modern unity.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
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

      <div className="hero-dots" aria-label="Hero slides">
        {hero.images.map((_, index) => (
          <span
            key={`hero-dot-${index}`}
            className={`hero-dot ${index === activeSlide ? "is-active" : ""}`}
          />
        ))}
      </div>
    </section>
  );
}
