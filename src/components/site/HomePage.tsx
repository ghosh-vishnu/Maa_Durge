"use client";

import { motion } from "framer-motion";
import AboutSection from "@/components/sections/AboutSection";
import AnnouncementSection from "@/components/sections/AnnouncementSection";
import EventsSection from "@/components/sections/EventsSection";
import Footer from "@/components/sections/Footer";
import GallerySection from "@/components/sections/GallerySection";
import HeroSection from "../sections/HeroSection";
import Navbar from "@/components/sections/Navbar";
import UpcomingEventsPopup from "@/components/site/UpcomingEventsPopup";

export default function HomePage() {
  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="site-shell relative bg-[var(--color-bg)]"
      >
        <div className="site-ambient" aria-hidden="true">
          <div className="ambient-orb ambient-orb-1" />
          <div className="ambient-orb ambient-orb-2" />
          <div className="ambient-orb ambient-orb-3" />
        </div>

        <Navbar />
        <UpcomingEventsPopup />
        <div className="relative z-10">
          <HeroSection />
          <AboutSection />
          <EventsSection />
          <GallerySection />
          <AnnouncementSection />
          <div id="contact" className="contact-anchor" aria-hidden="true" />
          <Footer />
        </div>
      </motion.main>
    </>
  );
}
