"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[var(--color-charcoal)]"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="mx-auto h-10 w-10 rounded-full border-2 border-[var(--color-gold)] border-t-transparent"
        />
        <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/80">Preparing Divine Experience</p>
      </div>
    </motion.div>
  );
}