import { eventItems, galleryItems } from "@/data/site";

export type ManagedEvent = {
  id: string;
  title: string;
  date: string;
  description: string;
};

export type ManagedGalleryItem = {
  id: string;
  title: string;
  image: string;
};

export const EVENTS_STORAGE_KEY = "ojrks-events";
export const GALLERY_STORAGE_KEY = "ojrks-gallery";

export const toIsoDate = (value: string) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  const year = parsed.getFullYear();
  const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
  const day = `${parsed.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const defaultManagedEvents: ManagedEvent[] = eventItems.map((item, index) => ({
  id: `seed-event-${index + 1}`,
  title: item.title,
  date: toIsoDate(item.date),
  description: item.description,
}));

export const defaultManagedGallery: ManagedGalleryItem[] = galleryItems.map((item, index) => ({
  id: `seed-gallery-${index + 1}`,
  title: item.title,
  image: item.image,
}));

export const readEventsFromStorage = () => {
  if (typeof window === "undefined") {
    return defaultManagedEvents;
  }

  try {
    const saved = window.localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!saved) {
      return defaultManagedEvents;
    }

    const parsed = JSON.parse(saved) as ManagedEvent[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    return defaultManagedEvents;
  }

  return defaultManagedEvents;
};

export const readGalleryFromStorage = () => {
  if (typeof window === "undefined") {
    return defaultManagedGallery;
  }

  try {
    const saved = window.localStorage.getItem(GALLERY_STORAGE_KEY);
    if (!saved) {
      return defaultManagedGallery;
    }

    const parsed = JSON.parse(saved) as ManagedGalleryItem[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    return defaultManagedGallery;
  }

  return defaultManagedGallery;
};
