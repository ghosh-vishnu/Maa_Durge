"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  ABOUT_STORAGE_KEY,
  defaultManagedAbout,
  defaultManagedHero,
  defaultManagedEvents,
  defaultManagedGallery,
  EVENTS_STORAGE_KEY,
  GALLERY_STORAGE_KEY,
  HERO_STORAGE_KEY,
  ManagedAboutContent,
  ManagedEvent,
  ManagedGalleryItem,
  ManagedHeroContent,
  readAboutFromStorage,
  readEventsFromStorage,
  readGalleryFromStorage,
  readHeroFromStorage,
} from "@/lib/siteContent";

type AdminTab = "events" | "gallery" | "hero" | "about";

const emptyEventForm = {
  title: "",
  date: new Date().toISOString().slice(0, 10),
  description: "",
};

const emptyGalleryForm = {
  title: "",
  image: "",
};

const GALLERY_MAX_IMAGE_EDGE = 1400;
const GALLERY_IMAGE_QUALITY = 0.82;
const HERO_MAX_IMAGE_EDGE = 2400;
const HERO_IMAGE_QUALITY = 0.9;
const ABOUT_MAX_IMAGE_EDGE = 2000;
const ABOUT_IMAGE_QUALITY = 0.88;
const GALLERY_MAX_INLINE_LENGTH = 500_000;
const HERO_MAX_INLINE_LENGTH = 900_000;
const ABOUT_MAX_INLINE_LENGTH = 750_000;

const isInlineDataImage = (value: string) => value.startsWith("data:image/");

const getImageSourceLabel = (value: string) => {
  if (isInlineDataImage(value)) {
    const kb = Math.round(value.length / 1024);
    return `Uploaded file (optimized data URL, ~${kb} KB)`;
  }

  return value;
};

const optimizeImageFile = (
  file: File,
  maxEdge: number,
  quality: number,
  maxInlineLength?: number,
) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.onload = () => {
      const src = reader.result;
      if (typeof src !== "string") {
        reject(new Error("Invalid file data"));
        return;
      }

      const image = new Image();
      image.onerror = () => reject(new Error("Unable to process image"));
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Canvas is not available"));
          return;
        }
        let bestData = src;
        for (let attempt = 0; attempt < 7; attempt += 1) {
          const shrinkFactor = Math.max(0.45, 1 - attempt * 0.11);
          const edgeLimit = Math.max(600, Math.round(maxEdge * shrinkFactor));
          const qualityLevel = Math.max(0.5, quality - attempt * 0.08);

          const largestEdge = Math.max(image.width, image.height);
          const scale = largestEdge > edgeLimit ? edgeLimit / largestEdge : 1;
          const width = Math.max(1, Math.round(image.width * scale));
          const height = Math.max(1, Math.round(image.height * scale));

          canvas.width = width;
          canvas.height = height;
          context.clearRect(0, 0, width, height);
          context.drawImage(image, 0, 0, width, height);

          const webpData = canvas.toDataURL("image/webp", qualityLevel);
          if (webpData.length > 0) {
            bestData = webpData;
          }

          if (!maxInlineLength || bestData.length <= maxInlineLength) {
            resolve(bestData);
            return;
          }
        }

        resolve(bestData);
      };
      image.src = src;
    };
    reader.readAsDataURL(file);
  });

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>("events");
  const [events, setEvents] = useState<ManagedEvent[]>(readEventsFromStorage);
  const [gallery, setGallery] = useState<ManagedGalleryItem[]>(readGalleryFromStorage);
  const [hero, setHero] = useState<ManagedHeroContent>(readHeroFromStorage);
  const [about, setAbout] = useState<ManagedAboutContent>(readAboutFromStorage);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);

  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState(emptyEventForm);

  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [galleryForm, setGalleryForm] = useState(emptyGalleryForm);
  const [heroForm, setHeroForm] = useState(() => ({ image: readHeroFromStorage().image }));
  const [aboutForm, setAboutForm] = useState(() => ({ image: readAboutFromStorage().image }));

  const persistToStorage = (key: string, payload: unknown) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(payload));
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const persisted = persistToStorage(EVENTS_STORAGE_KEY, events);
    if (!persisted) {
      setStorageWarning(
        "Storage full ho gaya hai. Kuch uploaded images ko remove karke phir save karein.",
      );
    }
  }, [events]);

  useEffect(() => {
    const persisted = persistToStorage(GALLERY_STORAGE_KEY, gallery);
    if (persisted) {
      setStorageWarning(null);
      return;
    }

    // Quota fallback: keep only URL/public-path images and drop inline base64 blobs.
    const compactGallery = gallery.filter((item) => !isInlineDataImage(item.image));
    const compactPersisted = persistToStorage(GALLERY_STORAGE_KEY, compactGallery);
    if (compactPersisted) {
      if (compactGallery.length !== gallery.length) {
        setGallery(compactGallery);
      }
      setStorageWarning(
        "Storage quota exceed hone par base64 gallery images remove kar diye gaye. URL/public-path images hi persist hue hain.",
      );
      return;
    }

    setStorageWarning(
      "Storage full ho gaya hai. Gallery me bade uploaded images hain; unhe URL ya public path se replace karein.",
    );
  }, [gallery]);

  useEffect(() => {
    const persisted = persistToStorage(HERO_STORAGE_KEY, hero);
    if (!persisted) {
      setStorageWarning(
        "Hero image save nahi ho payi (storage quota full). Chhoti image ya public path use karein.",
      );
    }
  }, [hero]);

  useEffect(() => {
    const persisted = persistToStorage(ABOUT_STORAGE_KEY, about);
    if (!persisted) {
      setStorageWarning(
        "About image save nahi ho payi (storage quota full). Chhoti image ya public path use karein.",
      );
    }
  }, [about]);

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

    if (isInlineDataImage(payload.image) && payload.image.length > GALLERY_MAX_INLINE_LENGTH) {
      setStorageWarning(
        "Gallery image bahut badi hai. Chhoti image upload karein ya URL/public path use karein.",
      );
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

  const onGalleryFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const optimizedImage = await optimizeImageFile(
        file,
        GALLERY_MAX_IMAGE_EDGE,
        GALLERY_IMAGE_QUALITY,
        GALLERY_MAX_INLINE_LENGTH,
      );
      if (optimizedImage.length > GALLERY_MAX_INLINE_LENGTH) {
        setStorageWarning("Image abhi bhi badi hai. Please smaller image file upload karein.");
        return;
      }
      setGalleryForm((prev) => ({ ...prev, image: optimizedImage }));
      setStorageWarning(null);
    } catch {
      setStorageWarning("Image process nahi ho payi. Please another file try karein.");
    }
  };

  const onHeroFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const optimizedImage = await optimizeImageFile(
        file,
        HERO_MAX_IMAGE_EDGE,
        HERO_IMAGE_QUALITY,
        HERO_MAX_INLINE_LENGTH,
      );
      if (optimizedImage.length > HERO_MAX_INLINE_LENGTH) {
        setStorageWarning("Hero image abhi bhi badi hai. Please smaller image file upload karein.");
        return;
      }
      setHeroForm({ image: optimizedImage });
      setStorageWarning(null);
    } catch {
      setStorageWarning("Image process nahi ho payi. Please another file try karein.");
    }
  };

  const handleHeroSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const image = heroForm.image.trim();
    if (!image) {
      return;
    }

    if (isInlineDataImage(image) && image.length > HERO_MAX_INLINE_LENGTH) {
      setStorageWarning(
        "Hero image bahut badi hai. Chhoti image upload karein ya /images/... public path use karein.",
      );
      return;
    }

    setHero({ image });
    setStorageWarning(null);
  };

  const onAboutFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const optimizedImage = await optimizeImageFile(
        file,
        ABOUT_MAX_IMAGE_EDGE,
        ABOUT_IMAGE_QUALITY,
        ABOUT_MAX_INLINE_LENGTH,
      );
      if (optimizedImage.length > ABOUT_MAX_INLINE_LENGTH) {
        setStorageWarning("About image abhi bhi badi hai. Please smaller image file upload karein.");
        return;
      }
      setAboutForm({ image: optimizedImage });
      setStorageWarning(null);
    } catch {
      setStorageWarning("Image process nahi ho payi. Please another file try karein.");
    }
  };

  const handleAboutSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const image = aboutForm.image.trim();
    if (!image) {
      return;
    }

    if (isInlineDataImage(image) && image.length > ABOUT_MAX_INLINE_LENGTH) {
      setStorageWarning(
        "About image bahut badi hai. Chhoti image upload karein ya /images/... public path use karein.",
      );
      return;
    }

    setAbout({ image });
    setStorageWarning(null);
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
            <button
              type="button"
              onClick={() => setTab("hero")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === "hero"
                  ? "bg-[var(--color-saffron)] text-white"
                  : "border border-black/10 text-[var(--color-muted)] hover:border-[var(--color-saffron)]"
              }`}
            >
              Hero Image
            </button>
            <button
              type="button"
              onClick={() => setTab("about")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === "about"
                  ? "bg-[var(--color-saffron)] text-white"
                  : "border border-black/10 text-[var(--color-muted)] hover:border-[var(--color-saffron)]"
              }`}
            >
              About Image
            </button>
          </div>

          {storageWarning ? (
            <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {storageWarning}
            </div>
          ) : null}
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

        {tab === "hero" ? (
          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <form
              onSubmit={handleHeroSubmit}
              className="space-y-4 rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(37,32,27,0.07)] ring-1 ring-black/5"
            >
              <h2 className="font-heading text-2xl font-semibold text-[var(--color-charcoal)]">Update Hero Background</h2>

              <div>
                <label htmlFor="admin-hero-url" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                  Image URL or Public Path
                </label>
                <input
                  id="admin-hero-url"
                  value={heroForm.image}
                  onChange={(event) => setHeroForm({ image: event.target.value })}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-[var(--color-saffron)] transition focus:ring-2"
                  placeholder="/images/hero-tajmahal.jpg"
                  required
                />
              </div>

              <div>
                <label htmlFor="admin-hero-file" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                  Or Upload File
                </label>
                <input
                  id="admin-hero-file"
                  type="file"
                  accept="image/*"
                  onChange={onHeroFileChange}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                />
              </div>

              {heroForm.image ? (
                <div className="overflow-hidden rounded-2xl ring-1 ring-black/10">
                  <img src={heroForm.image} alt="Hero Preview" className="h-44 w-full object-cover" />
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <button type="submit" className="btn-primary">
                  <ImagePlus size={16} />
                  Save Hero Image
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHero(defaultManagedHero);
                    setHeroForm({ image: defaultManagedHero.image });
                  }}
                  className="inline-flex items-center rounded-xl border border-black/15 px-4 py-2 text-sm font-semibold text-[var(--color-muted)] transition hover:border-[var(--color-saffron)] hover:text-[var(--color-saffron)]"
                >
                  Reset Default
                </button>
              </div>
            </form>

            <div className="rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(37,32,27,0.07)] ring-1 ring-black/5">
              <h2 className="font-heading text-2xl font-semibold text-[var(--color-charcoal)]">Current Hero Image</h2>
              <p className="mt-2 text-xs text-[var(--color-muted)] break-all">{getImageSourceLabel(hero.image)}</p>
              <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-black/10">
                <img src={hero.image} alt="Current Hero" className="h-64 w-full object-cover" />
              </div>
            </div>
          </section>
        ) : null}

        {tab === "about" ? (
          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <form
              onSubmit={handleAboutSubmit}
              className="space-y-4 rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(37,32,27,0.07)] ring-1 ring-black/5"
            >
              <h2 className="font-heading text-2xl font-semibold text-[var(--color-charcoal)]">Update About Section Image</h2>

              <div>
                <label htmlFor="admin-about-url" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                  Image URL or Public Path
                </label>
                <input
                  id="admin-about-url"
                  value={aboutForm.image}
                  onChange={(event) => setAboutForm({ image: event.target.value })}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-[var(--color-saffron)] transition focus:ring-2"
                  placeholder="/images/about-samiti.jpg"
                  required
                />
              </div>

              <div>
                <label htmlFor="admin-about-file" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                  Or Upload File
                </label>
                <input
                  id="admin-about-file"
                  type="file"
                  accept="image/*"
                  onChange={onAboutFileChange}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                />
              </div>

              {aboutForm.image ? (
                <div className="overflow-hidden rounded-2xl ring-1 ring-black/10">
                  <img src={aboutForm.image} alt="About Preview" className="h-44 w-full object-cover" />
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <button type="submit" className="btn-primary">
                  <ImagePlus size={16} />
                  Save About Image
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAbout(defaultManagedAbout);
                    setAboutForm({ image: defaultManagedAbout.image });
                  }}
                  className="inline-flex items-center rounded-xl border border-black/15 px-4 py-2 text-sm font-semibold text-[var(--color-muted)] transition hover:border-[var(--color-saffron)] hover:text-[var(--color-saffron)]"
                >
                  Reset Default
                </button>
              </div>
            </form>

            <div className="rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(37,32,27,0.07)] ring-1 ring-black/5">
              <h2 className="font-heading text-2xl font-semibold text-[var(--color-charcoal)]">Current About Image</h2>
              <p className="mt-2 text-xs text-[var(--color-muted)] break-all">{getImageSourceLabel(about.image)}</p>
              <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-black/10">
                <img src={about.image} alt="Current About" className="h-64 w-full object-cover" />
              </div>
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
