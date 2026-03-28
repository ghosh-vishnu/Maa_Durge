"use client";

import { motion } from "framer-motion";
import { CalendarDays, CalendarRange, Settings } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";
import { readEventsFromStorage } from "@/lib/siteContent";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function EventsSection() {
  const [events] = useState(readEventsFromStorage);
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => a.date.localeCompare(b.date)),
    [events],
  );

  const eventsByDate = useMemo(() => {
    const map = new Map<string, number>();
    sortedEvents.forEach((event) => {
      map.set(event.date, (map.get(event.date) ?? 0) + 1);
    });
    return map;
  }, [sortedEvents]);

  const monthKey = `${monthCursor.getFullYear()}-${`${monthCursor.getMonth() + 1}`.padStart(2, "0")}`;
  const firstWeekday = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1).getDay();
  const daysInMonth = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0).getDate();
  const calendarCells = Array.from({ length: firstWeekday + daysInMonth }, (_, idx) => {
    if (idx < firstWeekday) {
      return null;
    }
    return idx - firstWeekday + 1;
  });

  return (
    <AnimatedSection id="events" className="py-20 bg-[var(--color-cream)]/60 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Events & Calendar"
          title="Live Community Event Calendar"
          subtitle="All events are updated from our dedicated admin dashboard so members always see the latest schedule."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="premium-panel p-6 lg:col-span-3"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-heading text-2xl font-semibold text-[var(--color-charcoal)]">Event Calendar</h3>
              <div className="premium-chip px-3 py-1 text-xs font-semibold">
                <CalendarRange size={14} />
                {monthCursor.toLocaleString("en-US", { month: "long", year: "numeric" })}
              </div>
            </div>

            <div className="mb-5 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setMonthCursor(
                    (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
                  )
                }
                className="rounded-lg border border-black/10 bg-white/70 px-3 py-1.5 text-sm font-semibold text-[var(--color-muted)] transition hover:border-[var(--color-saffron)] hover:text-[var(--color-saffron)]"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() =>
                  setMonthCursor(
                    (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
                  )
                }
                className="rounded-lg border border-black/10 bg-white/70 px-3 py-1.5 text-sm font-semibold text-[var(--color-muted)] transition hover:border-[var(--color-saffron)] hover:text-[var(--color-saffron)]"
              >
                Next
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold text-[var(--color-muted)] sm:gap-2 sm:text-xs">
              {weekdayLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1.5 sm:gap-2">
              {calendarCells.map((day, idx) => {
                if (!day) {
                  return <div key={`empty-${idx}`} className="aspect-square rounded-lg bg-transparent sm:rounded-xl" />;
                }

                const date = `${monthKey}-${`${day}`.padStart(2, "0")}`;
                const eventCount = eventsByDate.get(date) ?? 0;

                return (
                  <div
                    key={date}
                    className={`aspect-square rounded-lg border p-1.5 text-left text-xs sm:rounded-xl sm:p-2 sm:text-sm ${
                      eventCount > 0
                        ? "border-[var(--color-saffron)]/40 bg-[var(--color-saffron)]/12"
                        : "border-black/10 bg-white/85"
                    }`}
                  >
                    <div className="font-semibold leading-none text-[var(--color-charcoal)]">{day}</div>
                    {eventCount > 0 ? (
                      <div className="mt-1 inline-flex rounded-full bg-[var(--color-saffron)] px-1.5 py-0.5 text-[9px] font-bold leading-none text-white sm:px-2 sm:text-[10px]">
                        {eventCount} evt
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="premium-panel p-6 lg:col-span-2"
          >
            <h3 className="font-heading text-2xl font-semibold text-[var(--color-charcoal)]">Upcoming Events</h3>
            <div className="mt-4 space-y-3">
              {sortedEvents.slice(0, 6).map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className="premium-card border border-black/8 bg-[var(--color-cream)]/55 p-4"
                >
                  <p className="premium-chip px-2.5 py-1 text-xs font-semibold">
                    <CalendarDays size={13} />
                    {new Date(event.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <h4 className="mt-3 font-heading text-lg font-semibold text-[var(--color-charcoal)]">{event.title}</h4>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{event.description}</p>
                </motion.div>
              ))}
            </div>

            <Link
              href="/admin"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[var(--color-gold)]/45 px-4 py-2 text-sm font-semibold text-[var(--color-charcoal)] transition hover:border-[var(--color-saffron)] hover:bg-[var(--color-saffron)] hover:text-white"
            >
              <Settings size={15} />
              Open Admin Dashboard
            </Link>
          </motion.article>
        </div>
      </div>
    </AnimatedSection>
  );
}
