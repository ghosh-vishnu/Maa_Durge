"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navItems } from "@/data/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const theme = pathname === "/" ? "dark" : "light";

  return (
    <header className={`z-50 ${theme === "light" ? "nav-theme-light" : "nav-theme-dark"}`}>
      <Link
        href="/"
        className="fixed left-2 top-1 z-[70] rounded-xl border border-white/35 bg-black/35 p-1.5 backdrop-blur-md sm:left-4 sm:top-2"
        aria-label="Go to home"
      >
        <Image
          src="/images/mandir-logo.jpg"
          alt="OJRK Mandir Logo"
          width={120}
          height={120}
          priority
          className="h-12 w-auto rounded-lg object-contain sm:h-14"
        />
      </Link>

      <div className="fixed right-2 top-2 z-[65] w-[min(calc(100vw-5rem),56rem)] sm:right-4 sm:top-3 sm:w-[min(calc(100vw-8rem),56rem)] lg:w-auto">
        <nav className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="nav-toggle inline-flex h-10 w-10 items-center justify-center rounded-xl xl:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>

          <ul className="nav-links-shell hidden items-center gap-1 xl:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`nav-link nav-link-pill text-sm font-semibold transition-colors duration-200 ${
                    pathname === item.href ? "nav-link-active" : ""
                  }`}
                >
                  {item.label}
                </Link>
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
              className="nav-mobile mt-2 ml-auto w-[min(calc(100vw-1rem),22rem)] px-3 py-3 xl:hidden"
            >
              <ul className="space-y-1.5">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`nav-mobile-link block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        pathname === item.href ? "nav-mobile-link-active" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
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
