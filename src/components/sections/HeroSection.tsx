"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { defaultManagedHero, readHeroFromStorage } from "@/lib/siteContent";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const trustStats = [
  { icon: Users, label: "Community", value: "1200+" },
  { icon: CalendarDays, label: "Events Yearly", value: "24+" },
  { icon: ShieldCheck, label: "Years of Seva", value: "35+" },
];

export default function HeroSection() {
  const [hero, setHero] = useState(defaultManagedHero);

  useEffect(() => {
    setHero(readHeroFromStorage());
  }, []);

  return (
    <section id="home" className="relative isolate flex min-h-screen items-center overflow-hidden pt-24">
      <motion.div
        className="hero-media"
        style={{
          backgroundImage: `url('${hero.image}')`,
        }}
        initial={{ scale: 1 }}
        animate={{ scale: 1.035 }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <div className="hero-vignette" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_45%,rgba(208,126,36,0.3),transparent_44%),radial-gradient(circle_at_84%_78%,rgba(94,58,20,0.22),transparent_38%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-8 py-10 lg:grid-cols-12 lg:gap-10"
        >
          <div className="lg:col-span-7">
            <div className="hero-content-shell hero-content-shell-elevated max-w-3xl p-5 sm:p-8">
              <motion.p
                variants={itemVariants}
                className="hero-kicker mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em]"
              >
                <Sparkles size={14} />
                Heritage | Seva | Bhakti
              </motion.p>

              <motion.h1
                variants={itemVariants}
                className="hero-title font-heading text-[2.15rem] font-semibold leading-[1.08] text-white sm:text-5xl lg:text-[3.45rem]"
              >
                Orai Jankipur
                <span className="mt-1 block bg-[linear-gradient(110deg,#fff6df_0%,#f1c57a_48%,#cf7d2b_100%)] bg-clip-text text-transparent">
                  Radhi Kayasth Samiti
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="hero-subtitle mt-5 max-w-2xl text-base leading-7 text-white/88 sm:text-xl sm:leading-8"
              >
                Serving Culture, Community, and Devotion through spiritual gatherings, seva initiatives, and shared heritage.
              </motion.p>

              <motion.div variants={itemVariants} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a href="#contact" className="hero-btn-primary group">
                  <HeartHandshake size={18} />
                  Join Us
                  <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>

                <a href="#donate" className="hero-btn-ghost">
                  <Zap size={16} />
                  Donate
                </a>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {trustStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-[1px]"
                  >
                    <div className="mb-1 flex items-center gap-2 text-white/85">
                      <stat.icon size={14} />
                      <span className="text-[0.68rem] font-semibold uppercase tracking-wider">{stat.label}</span>
                    </div>
                    <p className="font-heading text-2xl text-[#f2cf93]">{stat.value}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          <div className="hidden lg:col-span-5 lg:block">
            <motion.div variants={itemVariants} className="rounded-[1.7rem] border border-white/18 bg-black/30 p-5 text-white backdrop-blur-[3px]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f2cf93]">Current Focus</p>
              <h3 className="mt-2 font-heading text-3xl leading-tight text-white">Maa Durga Mahotsav 2026</h3>
              <p className="mt-3 text-sm leading-7 text-white/82">
                Volunteer teams are active for festive preparation, community meals, devotional nights, and youth coordination.
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-white/84">
                    <span>Volunteer Readiness</span>
                    <span className="font-semibold text-[#f2cf93]">78%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/18">
                    <div className="h-2 w-[78%] rounded-full bg-[linear-gradient(90deg,#f2cf93_0%,#da8430_100%)]" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-white/84">
                    <span>Donation Goal</span>
                    <span className="font-semibold text-[#f2cf93]">64%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/18">
                    <div className="h-2 w-[64%] rounded-full bg-[linear-gradient(90deg,#f2cf93_0%,#da8430_100%)]" />
                  </div>
                </div>
              </div>

              <a
                href="#events"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#f2cf93] transition-colors hover:text-white"
              >
                Explore upcoming events
                <ArrowRight size={15} />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
