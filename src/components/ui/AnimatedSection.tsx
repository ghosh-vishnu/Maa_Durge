"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type AnimatedSectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

export default function AnimatedSection({ id, className, children }: AnimatedSectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}