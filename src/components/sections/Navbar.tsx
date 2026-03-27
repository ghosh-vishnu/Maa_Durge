"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { navItems } from "@/data/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <nav className="glass-card flex items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
          <a href="#home" className="font-heading text-lg font-semibold tracking-wide text-[var(--color-charcoal)]">
            OJRK Samiti
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 text-[var(--color-charcoal)] md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>

          <ul className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm font-medium text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-saffron)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/admin"
                className="rounded-xl border border-[var(--color-gold)]/40 px-3 py-1.5 text-sm font-semibold text-[var(--color-charcoal)] transition hover:border-[var(--color-saffron)] hover:text-[var(--color-saffron)]"
              >
                Admin
              </Link>
            </li>
          </ul>
        </nav>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="glass-card mt-2 rounded-2xl px-4 py-3 md:hidden"
            >
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-muted)] transition-colors hover:bg-white/70 hover:text-[var(--color-saffron)]"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-[var(--color-charcoal)] transition-colors hover:bg-white/70 hover:text-[var(--color-saffron)]"
                  >
                    Admin Dashboard
                  </Link>
                </li>
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}