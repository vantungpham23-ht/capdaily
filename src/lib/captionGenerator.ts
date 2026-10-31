import { Caption, Category, HistoryMap, Language } from '@/types';
import {
  ALL_CATEGORIES,
  CAPTION_SLOTS,
  DECOR_EMOJIS,
  HASHTAGS_LIBRARY,
  ICON_BANK,
  SEASONAL_ACCENTS,
  TRENDING_BANK,
  WEEKLY_THEMES,
} from '@/data/captions';
import { getLastUsedDates, getUsedInWindow, recordUsage } from './history';
import { toDateKey } from './date';

/* ------------------------------------------------------------------ */
/* Deterministic pseudo-random helpers                                  */
/* ------------------------------------------------------------------ */

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/** Mulberry32 PRNG - small, fast, deterministic. */
function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(list: T[], rng: () => number): T {
  return list[Math.floor(rng() * list.length)];
}

function shuffle<T>(list: T[], rng: () => number): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export { toDateKey, parseDateKey, addDays } from './date';

/* ------------------------------------------------------------------ */
/* Trending topics                                                      */
/* ------------------------------------------------------------------ */

/**
 * Returns the trending topics for a given day. Topics rotate deterministically
 * so every day surfaces a different set, without needing a backend.
 */
export function getTrendingForDay(
  category: Category,
  date: Date,
  count = 3
): string[] {
  const bank = TRENDING_BANK[category];
  const rng = makeRng(hashString(`${toDateKey(date)}-${category}-trend`));
  return shuffle(bank, rng).slice(0, count);
}

/* ------------------------------------------------------------------ */
/* Hashtags                                                             */
/* ------------------------------------------------------------------ */

/**
 * Picks a hashtag set with an English-first mix:
 * roughly 3 English tags + 2 local-language tags (or 4+1 depending on seed).
 */
function pickHashtags(
  category: Category,
  language: Language,
  seed: number,
  count = 5
): string[] {
  const banks = HASHTAGS_LIBRARY[category];
  const rng = makeRng(seed);

  const english = shuffle(banks.en, rng);
  const local = shuffle(banks.sk, rng);

  // English tags always make up the majority for reach.
  const englishCount = Math.min(english.length, Math.ceil(count * 0.6));
  const localCount = Math.min(local.length, count - englishCount);

  const picked = new Set<string>();
  for (const tag of english.slice(0, englishCount)) picked.add(tag);

  // Local tags: for a Slovak caption prefer Slovak tags, for an English one
  // keep the local tags as reach boosters further down the list.
  const localFirst = language === 'sk' ? local : [...local, ...english.slice(englishCount)];
  for (const tag of localFirst.slice(0, localCount)) picked.add(tag);

  // Top up with anything left if we still need more.
  if (picked.size < count) {
    for (const tag of [...english, ...local]) {
      if (picked.size >= count) break;
      picked.add(tag);
    }
  }

  return [...picked];
}

/* ------------------------------------------------------------------ */
/* Caption assembly                                                     */
/* ------------------------------------------------------------------ */

interface Assembled {
  content: string;
  translation: string;
  fingerprint: string;
}

function assemble(
  category: Category,
  language: Language,
  openerIdx: number,
  bodyIdx: number,
  closerIdx: number,
  opts: {
    themePrefix?: { text: string; vi: string };
    themeSuffix?: { text: string; vi: string };
    trendSuffix?: { topic: string; lang: Language };
    decor?: string;
  }
): Assembled {
  const bank = CAPTION_SLOTS[category];
  const opener = bank.openers[openerIdx];
  const body = bank.bodies[bodyIdx];
  const closer = bank.closers[closerIdx];

  const parts: string[] = [];
  const viParts: string[] = [];

  if (opts.themePrefix) {
    parts.push(opts.themePrefix.text);
    viParts.push(opts.themePrefix.vi);
  }

  parts.push(opener[language].text, body[language].text);
  viParts.push(opener[language].vi, body[language].vi);

  if (opts.trendSuffix) {
    const topic = opts.trendSuffix.topic;
    if (opts.trendSuffix.lang === 'sk') {
      parts.push(`Trend: ${topic}`);
      viParts.push(`Xu hướng: ${topic}`);
    } else {
      parts.push(`Trending: ${topic}`);
      viParts.push(`Xu hướng: ${topic}`);
    }
  }

  if (opts.decor) {
    parts.push(opts.decor);
    viParts.push(opts.decor);
  }

  parts.push(closer[language].text);
  viParts.push(closer[language].vi);

  if (opts.themeSuffix) {
    parts.push(opts.themeSuffix.text);
    viParts.push(opts.themeSuffix.vi);
  }

  const content = parts.join(' ');
  const translation = viParts.join(' ');

  return {
    content,
    translation,
    fingerprint: `${category}|${language}|${openerIdx}-${bodyIdx}-${closerIdx}`,
  };
}

/* ------------------------------------------------------------------ */
/* Generation                                                           */
/* ------------------------------------------------------------------ */

export interface GenerateOptions {
  /** The day to generate for. Defaults to today. */
  date?: Date;
  /** Previously published captions, used to avoid repeats. */
  history?: HistoryMap;
  /** Persist the generated captions to localStorage. */
  persist?: boolean;
  /** How many Slovak captions per category. */
  skPerCategory?: number;
  /** How many English captions per category. */
  enPerCategory?: number;
  /** Receives the fingerprints of the generated captions (used for persistence / testing). */
  onFingerprints?: (fps: { key: string; category: Category; language: Language }[]) => void;
}

/**
 * Generates the caption set for a given day.
 *
 * Selection strategy:
 *  1. Build the full candidate space (opener x body x closer).
 *  2. Remove anything used within the last 30 days (from localStorage history).
 *  3. Pick deterministically-but-shuffled from what remains, so the result is
 *     stable for a given day but different every day.
 *  4. If the pool is exhausted, fall back to least-recently-used candidates.
 */
export function generateDailyCaptions(
  options: GenerateOptions = {}
): Record<Category, Caption[]> {
  const date = options.date ?? new Date();
  const dateKey = toDateKey(date);
  const history = options.history ?? {};
  const usedInWindow = getUsedInWindow(history, date);
  const lastUsed = getLastUsedDates(history);

  const skPerCategory = options.skPerCategory ?? 3;
  const enPerCategory = options.enPerCategory ?? 2;

  const dayOfWeek = date.getDay();
  const month = date.getMonth();

  const weeklyTheme = WEEKLY_THEMES[dayOfWeek];
  const seasonal = SEASONAL_ACCENTS[month];

  const result: Record<Category, Caption[]> = {} as Record<Category, Caption[]>;
  const toRecord: { key: string; category: Category; language: Language }[] = [];

  ALL_CATEGORIES.forEach((category) => {
    const bank = CAPTION_SLOTS[category];
    const captions: Caption[] = [];

    const buildFor = (language: Language, take: number) => {
      const keyOf = (c: { openerIdx: number; bodyIdx: number; closerIdx: number }) =>
        `${category}|${language}|${c.openerIdx}-${c.bodyIdx}-${c.closerIdx}`;

      // --- Layer 1: deterministic round-robin over a STABLE ordered list ---
      // The candidate space is shuffled ONCE with a fixed seed (so the order is
      // identical on every device and every day), then walked with a stride.
      // Day N consumes the slice [slotStart, slotStart + take) of the list.
      //
      //   slotStart = (daysSinceEpoch % cycleDays) * take
      //
      // Because the list is stable and `cycleDays * take <= list.length`, the
      // slices of a 30-day cycle never overlap -> zero repeats for 30 days,
      // completely independent of localStorage.
      const candidates: { openerIdx: number; bodyIdx: number; closerIdx: number }[] = [];
      bank.openers.forEach((_, oi) => {
        bank.bodies.forEach((_, bi) => {
          bank.closers.forEach((_, ci) => {
            candidates.push({ openerIdx: oi, bodyIdx: bi, closerIdx: ci });
          });
        });
      });

      const stableList = shuffle(candidates, makeRng(hashString(`${category}-${language}-stable`)));

      const daysSinceEpoch = Math.floor(
        (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) / 86400000
      );
      // The cycle can be as long as the pool allows: cycleDays * take must fit
      // inside the stable list so the daily slices never overlap.
      const cycleDays = Math.max(30, Math.min(365, Math.floor(stableList.length / take)));
      const slotStart = (daysSinceEpoch % cycleDays) * take;

      // Walk forward from the deterministic slot; skip anything the history
      // layer marks as recently used.
      const isFresh = (c: { openerIdx: number; bodyIdx: number; closerIdx: number }) =>
        !usedInWindow.has(keyOf(c));

      const chosen: typeof candidates = [];
      for (let step = 0; step < stableList.length && chosen.length < take; step++) {
        const candidate = stableList[(slotStart + step) % stableList.length];
        if (isFresh(candidate)) {
          chosen.push(candidate);
        }
      }
      // If the fresh pool is exhausted (very rare), fall back to the
      // least-recently-used candidates so we always return the full set.
      if (chosen.length < take) {
        const remaining = stableList
          .filter((c) => !chosen.some((x) => keyOf(x) === keyOf(c)))
          .sort((a, b) => {
            const da = lastUsed.get(keyOf(a)) ?? '0000-00-00';
            const db = lastUsed.get(keyOf(b)) ?? '0000-00-00';
            return da.localeCompare(db);
          });
        chosen.push(...remaining.slice(0, take - chosen.length));
      }

      chosen.forEach((c, index) => {
        const trendTopics = getTrendingForDay(category, date, 3);
        const trend = trendTopics[index % trendTopics.length];

        // Day-of-week theme on the first caption, seasonal accent on the second.
        const themePrefix =
          index === 0 && weeklyTheme
            ? { text: weeklyTheme[language].text, vi: weeklyTheme[language].vi }
            : undefined;

        // Seasonal accent is appended as a separate line on the second caption.
        const themeSuffix =
          index === 1 && seasonal
            ? { text: seasonal[language].text, vi: seasonal[language].vi }
            : undefined;

        const decorRng = makeRng(hashString(`${dateKey}-${category}-${language}-${index}-decor`));
        const decor = pick(DECOR_EMOJIS, decorRng);

        const assembled = assemble(category, language, c.openerIdx, c.bodyIdx, c.closerIdx, {
          themePrefix,
          themeSuffix,
          trendSuffix: { topic: trend, lang: language },
          decor,
        });

        const iconBank = ICON_BANK[category];
        const icons = language === 'sk' ? iconBank.sk : iconBank.en;
        const iconRng = makeRng(hashString(`${dateKey}-${category}-${language}-${index}-icon`));
        const icon = pick(icons, iconRng);

        const id = `${category}-${language}-${dateKey}-${index}`;
        const hashtagSeed = hashString(`${dateKey}-${category}-${language}-${index}-tags`);

        captions.push({
          id,
          category,
          language,
          content: assembled.content,
          translation: assembled.translation,
          icon,
          hashtags: pickHashtags(category, language, hashtagSeed, 5),
          trending: trend,
          createdAt: dateKey,
        });

        toRecord.push({
          key: `${category}|${language}|${c.openerIdx}-${c.bodyIdx}-${c.closerIdx}`,
          category,
          language,
        });
      });
    };

    buildFor('sk', skPerCategory);
    buildFor('en', enPerCategory);

    result[category] = captions;
  });

  if (options.persist) {
    recordUsage(toRecord, date);
  }

  if (options.onFingerprints) {
    options.onFingerprints(toRecord);
  }

  return result;
}

/* ------------------------------------------------------------------ */
/* Formatting / copying                                                 */
/* ------------------------------------------------------------------ */

/**
 * Formats a caption for the clipboard: caption + icon + hashtags.
 * The Vietnamese translation is display-only and is never copied.
 */
export function formatForCopy(caption: Caption): string {
  const hashtags = caption.hashtags.join(' ');
  return `${caption.content} ${caption.icon}\n\n${hashtags}`;
}

/** Formats every caption of a category as one copyable block. */
export function formatCategoryForCopy(captions: Caption[]): string {
  return captions.map((c) => formatForCopy(c)).join('\n\n');
}

/* ------------------------------------------------------------------ */
/* Live trending (optional, best effort)                               */
/* ------------------------------------------------------------------ */

/**
 * Attempts to fetch live trending topics from a public, CORS-friendly source.
 * Fails silently - the deterministic local bank is always used as the base.
 */
export async function fetchLiveTrending(): Promise<Partial<Record<Category, string[]>>> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(
      'https://trends.google.com/trending/rss?geo=SK',
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    if (!response.ok) return {};

    const xml = await response.text();
    const titles = Array.from(xml.matchAll(/<title>([^<]+)<\/title>/g))
      .map((m) => m[1])
      .filter((t) => t && t !== 'Trending Now' && t !== 'Google Trends')
      .slice(0, 10);

    if (titles.length === 0) return {};
    return { restaurant: titles };
  } catch {
    return {};
  }
}
