"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { type ManagedEvent, readEventsFromStorage } from "@/lib/siteContent";

const POPUP_SEEN_KEY = "ojrks-upcoming-events-popup-seen-v2";
const POPUP_DELAY_MS = 1700;

export default function UpcomingEventsPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [event, setEvent] = useState<ManagedEvent | null>(null);

  const formattedDate = useMemo(() => {
    if (!event) {
      return "";
    }

    return new Date(event.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [event]);

  useEffect(() => {
    const now = new Date();
    const todayIso = `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, "0")}-${`${now.getDate()}`.padStart(2, "0")}`;
    const sortedEvents = [...readEventsFromStorage()].sort((a, b) => a.date.localeCompare(b.date));
    const nextEvent = sortedEvents.find((item) => item.date >= todayIso) ?? sortedEvents[0] ?? null;

    if (!nextEvent) {
      return;
    }

    const seenEventId = window.localStorage.getItem(POPUP_SEEN_KEY);
    if (seenEventId && seenEventId === nextEvent.id) {
      return;
    }

    setEvent(nextEvent);
    const timer = window.setTimeout(() => setIsOpen(true), POPUP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  const closePopup = () => {
    if (event?.id) {
      window.localStorage.setItem(POPUP_SEEN_KEY, event.id);
    }
    setIsOpen(false);
  };

  if (!event) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] grid place-items-center bg-black/45 px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-2xl border border-white/60 bg-[var(--color-bg)] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.28)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="upcoming-events-title"
          >
            <button
              type="button"
              onClick={closePopup}
              aria-label="Close popup"
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-[var(--color-muted)] transition hover:border-[var(--color-saffron)] hover:text-[var(--color-saffron)]"
            >
              <X size={15} />
            </button>

            <p className="inline-flex items-center gap-2 rounded-full bg-[var(--color-saffron)]/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-saffron)]">
              <CalendarDays size={14} />
              Upcoming Event
            </p>

            <h3 id="upcoming-events-title" className="mt-4 font-heading text-3xl font-semibold leading-tight text-[var(--color-charcoal)]">
              {event.title}
            </h3>

            <p className="mt-2 text-sm font-semibold text-[var(--color-muted)]">{formattedDate}</p>
            <p className="mt-4 text-[15px] leading-7 text-[var(--color-muted)]">{event.description}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#events"
                onClick={closePopup}
                className="btn-primary w-full justify-center sm:w-auto"
              >
                View Events
              </a>
              <button
                type="button"
                onClick={closePopup}
                className="w-full rounded-xl border border-black/12 px-4 py-2.5 text-sm font-semibold text-[var(--color-muted)] transition hover:border-[var(--color-saffron)] hover:text-[var(--color-saffron)] sm:w-auto"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
