export type Category = 'nails' | 'hair-men' | 'hair-women' | 'restaurant' | 'eyelash';
export type Language = 'sk' | 'en';

export interface Caption {
  id: string;
  category: Category;
  language: Language;
  /** 'short' = 1-3 words, 'long' = exactly one sentence */
  kind: 'short' | 'long';
  content: string;
  translation: string; // Vietnamese translation
  icon: string;
  hashtags: string[];
  trending?: string; // trending topic attached to this caption
  createdAt: string;
}

export interface CategoryConfig {
  id: Category;
  name: string;
  nameSK: string;
  icon: string;
  color: string;
}

export interface Bilingual {
  text: string;
  vi: string;
}

export interface LocalizedSlot {
  sk: Bilingual;
  en: Bilingual;
}

/** History entry: fingerprint of a published caption -> date it was used */
export interface HistoryEntry {
  date: string; // YYYY-MM-DD
  category: Category;
  language: Language;
}

export type HistoryMap = Record<string, HistoryEntry>;
