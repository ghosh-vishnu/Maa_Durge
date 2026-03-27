"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  defaultManagedEvents,
  defaultManagedGallery,
  EVENTS_STORAGE_KEY,
  GALLERY_STORAGE_KEY,
  ManagedEvent,
  ManagedGalleryItem,
  readEventsFromStorage,
  readGalleryFromStorage,
} from "@/lib/siteContent";

type AdminTab = "events" | "gallery";

const emptyEventForm = {
  title: "",
  date: new Date().toISOString().slice(0, 10),
  description: "",
};

const emptyGalleryForm = {
  title: "",
  image: "",
};

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>("events");
  const [events, setEvents] = useState<ManagedEvent[]>(readEventsFromStorage);
  const [gallery, setGallery] = useState<ManagedGalleryItem[]>(readGalleryFromStorage);

  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState(emptyEventForm);

  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [galleryForm, setGalleryForm] = useState(emptyGalleryForm);

  useEffect(() => {
    window.localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    window.localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(gallery));
  }, [gallery]);

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => a.date.localeCompare(b.date)),
    [events],
  );

  const handleEventSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: ManagedEvent = {
      id: editingEventId ?? `event-${Date.now()}`,
      title: eventForm.title.trim(),
      date: eventForm.date,
      description: eventForm.description.trim(),
    };

    if (!payload.title || !payload.date || !payload.description) {
      return;
    }

    setEvents((current) => {
      if (editingEventId) {
        return current.map((item) => (item.id === editingEventId ? payload : item));
      }
      return [...current, payload];
    });

    setEditingEventId(null);
    setEventForm(emptyEventForm);
  };

  const handleGallerySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: ManagedGalleryItem = {
      id: editingGalleryId ?? `gallery-${Date.now()}`,
      title: galleryForm.title.trim(),
      image: galleryForm.image.trim(),
    };

    if (!payload.title || !payload.image) {
      return;
    }

    setGallery((current) => {
      if (editingGalleryId) {
        return current.map((item) => (item.id === editingGalleryId ? payload : item));
      }
      return [payload, ...current];
    });

    setEditingGalleryId(null);
    setGalleryForm(emptyGalleryForm);
  };

  const onGalleryFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setGalleryForm((prev) => ({ ...prev, image: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pb-12">
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(37,32,27,0.09)] ring-1 ring-black/5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-saffron)]">Admin Dashboard</p>
              <h1 className="font-heading text-4xl font-semibold text-[var(--color-charcoal)]">Manage Website Content</h1>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Frontend-only panel for now. Events and gallery changes are saved in browser local storage.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--color-charcoal)] transition hover:border-[var(--color-saffron)] hover:text-[var(--color-saffron)]"
            >
              <ArrowLeft size={16} />
              Back to Website
            </Link>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => setTab("events")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === "events"
                  ? "bg-[var(--color-saffron)] text-white"
                  : "border border-black/10 text-[var(--color-muted)] hover:border-[var(--color-saffron)]"
              }`}
            >
              Events
            </button>
            <button
              type="button"
              onClick={() => setTab("gallery")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === "gallery"
                  ? "bg-[var(--color-saffron)] text-white"
                  : "border border-black/10 text-[var(--color-muted)] hover:border-[var(--color-saffron)]"
              }`}
            >
              Gallery
            </button>
          </div>
        </div>

        {tab === "events" ? (
          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <form
              onSubmit={handleEventSubmit}
              className="space-y-4 rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(37,32,27,0.07)] ring-1 ring-black/5"
            >
              <h2 className="font-heading text-2xl font-semibold text-[var(--color-charcoal)]">
                {editingEventId ? "Update Event" : "Add Event"}
              </h2>

              <div>
                <label htmlFor="admin-event-title" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                  Title
                </label>
                <input
                  id="admin-event-title"
                  value={eventForm.title}
                  onChange={(event) => setEventForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-[var(--color-saffron)] transition focus:ring-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="admin-event-date" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                  Date
                </label>
                <input
                  id="admin-event-date"
                  type="date"
                  value={eventForm.date}
                  onChange={(event) => setEventForm((prev) => ({ ...prev, date: event.target.value }))}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-[var(--color-saffron)] transition focus:ring-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="admin-event-description"
                  className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]"
                >
                  Description
                </label>
                <textarea
                  id="admin-event-description"
                  value={eventForm.description}
                  onChange={(event) => setEventForm((prev) => ({ ...prev, description: event.target.value }))}
                  className="h-28 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-[var(--color-saffron)] transition focus:ring-2"
                  required
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button type="submit" className="btn-primary">
                  <Plus size={16} />
                  {editingEventId ? "Update Event" : "Create Event"}
                </button>
                {editingEventId ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEventId(null);
                      setEventForm(emptyEventForm);
                    }}
                    className="inline-flex items-center rounded-xl border border-black/15 px-4 py-2 text-sm font-semibold text-[var(--color-muted)] transition hover:border-[var(--color-saffron)] hover:text-[var(--color-saffron)]"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>

            <div className="rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(37,32,27,0.07)] ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-semibold text-[var(--color-charcoal)]">All Events</h2>
                <button
                  type="button"
                  onClick={() => setEvents(defaultManagedEvents)}
                  className="rounded-lg border border-black/10 px-3 py-1 text-xs font-semibold text-[var(--color-muted)] transition hover:border-[var(--color-saffron)] hover:text-[var(--color-saffron)]"
                >
                  Reset Default
                </button>
              </div>

              <div className="mt-4 max-h-[30rem] space-y-2 overflow-auto pr-1">
                {sortedEvents.map((item) => (
                  <div key={item.id} className="rounded-xl bg-[var(--color-cream)]/40 p-3 ring-1 ring-black/5">
                    <p className="text-xs font-semibold text-[var(--color-saffron)]">{item.date}</p>
                    <p className="mt-1 text-sm font-semibold text-[var(--color-charcoal)]">{item.title}</p>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">{item.description}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEventId(item.id);
                          setEventForm({
                            title: item.title,
                            date: item.date,
                            description: item.description,
                          });
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-black/10 px-2.5 py-1 text-xs font-semibold text-[var(--color-muted)] transition hover:border-[var(--color-saffron)] hover:text-[var(--color-saffron)]"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setEvents((current) => current.filter((event) => event.id !== item.id))}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {tab === "gallery" ? (
          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <form
              onSubmit={handleGallerySubmit}
              className="space-y-4 rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(37,32,27,0.07)] ring-1 ring-black/5"
            >
              <h2 className="font-heading text-2xl font-semibold text-[var(--color-charcoal)]">
                {editingGalleryId ? "Update Image" : "Upload Image"}
              </h2>

              <div>
                <label htmlFor="admin-gallery-title" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                  Image Title
                </label>
                <input
                  id="admin-gallery-title"
                  value={galleryForm.title}
                  onChange={(event) => setGalleryForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-[var(--color-saffron)] transition focus:ring-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="admin-gallery-url" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                  Image URL
                </label>
                <input
                  id="admin-gallery-url"
                  value={galleryForm.image}
                  onChange={(event) => setGalleryForm((prev) => ({ ...prev, image: event.target.value }))}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-[var(--color-saffron)] transition focus:ring-2"
                  placeholder="https://..."
                  required
                />
              </div>

              <div>
                <label htmlFor="admin-gallery-file" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                  Or Upload File
                </label>
                <input
                  id="admin-gallery-file"
                  type="file"
                  accept="image/*"
                  onChange={onGalleryFileChange}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                />
              </div>

              {galleryForm.image ? (
                <div className="overflow-hidden rounded-2xl ring-1 ring-black/10">
                  <img src={galleryForm.image} alt="Preview" className="h-44 w-full object-cover" />
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <button type="submit" className="btn-primary">
                  <ImagePlus size={16} />
                  {editingGalleryId ? "Update Image" : "Add Image"}
                </button>
                {editingGalleryId ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingGalleryId(null);
                      setGalleryForm(emptyGalleryForm);
                    }}
                    className="inline-flex items-center rounded-xl border border-black/15 px-4 py-2 text-sm font-semibold text-[var(--color-muted)] transition hover:border-[var(--color-saffron)] hover:text-[var(--color-saffron)]"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>

            <div className="rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(37,32,27,0.07)] ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-semibold text-[var(--color-charcoal)]">Gallery Items</h2>
                <button
                  type="button"
                  onClick={() => setGallery(defaultManagedGallery)}
                  className="rounded-lg border border-black/10 px-3 py-1 text-xs font-semibold text-[var(--color-muted)] transition hover:border-[var(--color-saffron)] hover:text-[var(--color-saffron)]"
                >
                  Reset Default
                </button>
              </div>

              <div className="mt-4 max-h-[30rem] space-y-2 overflow-auto pr-1">
                {gallery.map((item) => (
                  <div key={item.id} className="rounded-xl bg-[var(--color-cream)]/40 p-3 ring-1 ring-black/5">
                    <div className="overflow-hidden rounded-lg">
                      <img src={item.image} alt={item.title} className="h-24 w-full object-cover" />
                    </div>
                    <p className="mt-2 text-sm font-semibold text-[var(--color-charcoal)]">{item.title}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingGalleryId(item.id);
                          setGalleryForm({ title: item.title, image: item.image });
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-black/10 px-2.5 py-1 text-xs font-semibold text-[var(--color-muted)] transition hover:border-[var(--color-saffron)] hover:text-[var(--color-saffron)]"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setGallery((current) => current.filter((image) => image.id !== item.id))}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
