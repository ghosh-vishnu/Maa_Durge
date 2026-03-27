"use client";

import { motion } from "framer-motion";
import { HeartHandshake, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(37, 32, 27, 0.75), rgba(37, 32, 27, 0.28)), url('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="hero-glow" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
            <Sparkles size={14} />
            Heritage • Seva • Bhakti
          </p>

          <h1 className="font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Orai Jankipur Radhi Kayasth Samiti
          </h1>

          <p className="mt-5 text-lg leading-8 text-white/85 sm:text-xl">
            Serving Culture, Community & Devotion
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a href="#contact" className="btn-primary">
              <HeartHandshake size={18} />
              Join Us
            </a>
            <a href="#donate" className="btn-ghost">
              Donate
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}