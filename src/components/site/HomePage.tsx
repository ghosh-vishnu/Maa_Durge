"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import AboutSection from "@/components/sections/AboutSection";
import AnnouncementSection from "@/components/sections/AnnouncementSection";
import EventsSection from "@/components/sections/EventsSection";
import Footer from "@/components/sections/Footer";
import GallerySection from "@/components/sections/GallerySection";
import HeroSection from "@/components/sections/HeroSection";
import Navbar from "@/components/sections/Navbar";
import Loader from "@/components/site/Loader";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{loading ? <Loader /> : null}</AnimatePresence>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative bg-[var(--color-bg)]"
      >
        <Navbar />
        <HeroSection />
        <AboutSection />
        <EventsSection />
        <GallerySection />
        <AnnouncementSection />
        <Footer />
      </motion.main>
    </>
  );
}