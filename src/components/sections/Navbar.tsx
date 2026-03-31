"use client";

import { Menu, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { navItems } from "@/data/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <nav className="nav-premium nav-shell flex items-center justify-between gap-3 px-3 py-2 sm:px-4">
          <span className="nav-top-glow" aria-hidden="true" />

          <a href="#home" className="nav-brand-wrap">
            <span className="nav-brand-mark" aria-hidden="true">
              <Sparkles size={13} strokeWidth={2.4} />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="nav-brand font-heading text-base font-semibold tracking-[0.05em] text-white sm:text-lg">
                OJRK Samiti
              </span>
              <span className="hidden text-[10px] font-semibold tracking-[0.2em] text-amber-100/80 sm:block">
                TRUST - SEVA - SANSKAR
              </span>
            </span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="nav-toggle inline-flex h-10 w-10 items-center justify-center rounded-xl text-white md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>

          <ul className="nav-links-shell hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="nav-link nav-link-pill text-sm font-semibold text-white/88 transition-colors duration-200 hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/admin"
                className="nav-admin-btn px-3.5 py-2 text-sm font-semibold text-amber-50"
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
              className="nav-mobile mt-2 px-3 py-3 md:hidden"
            >
              <ul className="space-y-1.5">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="nav-mobile-link block rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 transition-colors hover:text-white"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="nav-admin-btn w-full px-3 py-2.5 text-sm font-semibold text-amber-50"
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
