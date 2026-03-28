import { aboutContent, eventItems, galleryItems, heroContent } from "@/data/site";

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

export type ManagedHeroContent = {
  image: string;
};

export type ManagedAboutContent = {
  image: string;
};

export const EVENTS_STORAGE_KEY = "ojrks-events";
export const GALLERY_STORAGE_KEY = "ojrks-gallery";
export const HERO_STORAGE_KEY = "ojrks-hero";
export const ABOUT_STORAGE_KEY = "ojrks-about";
const MAX_INLINE_IMAGE_LENGTH = 900_000;

const isUsableImage = (value: unknown): value is string => {
  if (typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  if (trimmed.startsWith("data:image/") && trimmed.length > MAX_INLINE_IMAGE_LENGTH) {
    return false;
  }

  return true;
};

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

export const defaultManagedHero: ManagedHeroContent = {
  image: heroContent.image,
};

export const defaultManagedAbout: ManagedAboutContent = {
  image: aboutContent.image,
};

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
      const sanitized = parsed.filter((item) => item?.title?.trim() && isUsableImage(item?.image));
      if (sanitized.length > 0) {
        return sanitized;
      }
    }
  } catch {
    return defaultManagedGallery;
  }

  return defaultManagedGallery;
};

export const readHeroFromStorage = () => {
  if (typeof window === "undefined") {
    return defaultManagedHero;
  }

  try {
    const saved = window.localStorage.getItem(HERO_STORAGE_KEY);
    if (!saved) {
      return defaultManagedHero;
    }

    const parsed = JSON.parse(saved) as Partial<ManagedHeroContent>;
    if (isUsableImage(parsed?.image)) {
      return { image: parsed.image.trim() };
    }
  } catch {
    return defaultManagedHero;
  }

  return defaultManagedHero;
};

export const readAboutFromStorage = () => {
  if (typeof window === "undefined") {
    return defaultManagedAbout;
  }

  try {
    const saved = window.localStorage.getItem(ABOUT_STORAGE_KEY);
    if (!saved) {
      return defaultManagedAbout;
    }

    const parsed = JSON.parse(saved) as Partial<ManagedAboutContent>;
    if (isUsableImage(parsed?.image)) {
      return { image: parsed.image.trim() };
    }
  } catch {
    return defaultManagedAbout;
  }

  return defaultManagedAbout;
};
