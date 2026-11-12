import { Caption, Category, HistoryMap, Language } from '@/types';
import {
  ALL_CATEGORIES,
  CAPTION_SLOTS,
  HASHTAGS_LIBRARY,
  ICON_BANK,
  TRENDING_BANK,
  WEEKLY_THEMES,
  SEASONAL_ACCENTS,
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
/* Generation                                                           */
/* ------------------------------------------------------------------ */

export interface GenerateOptions {
  /** The day to generate for. Defaults to today. */
  date?: Date;
  /** Previously published captions, used to avoid repeats. */
  history?: HistoryMap;
  /** Persist the generated captions to localStorage. */
  persist?: boolean;
  /** How many SHORT Slovak captions per category (default 3). */
  shortsSk?: number;
  /** How many SHORT English captions per category (default 2). */
  shortsEn?: number;
  /** How many LONG Slovak captions per category (default 1). */
  longsSk?: number;
  /** How many LONG English captions per category (default 1). */
  longsEn?: number;
  /** @deprecated use shortsSk/shortsEn instead */
  skPerCategory?: number;
  /** @deprecated use shortsEn instead */
  enPerCategory?: number;
  /** Receives the fingerprints of the generated captions (used for persistence / testing). */
  onFingerprints?: (fps: { key: string; category: Category; language: Language }[]) => void;
  /**
   * Alternative set for the same day. 0 = the daily set, 1..n = extra
   * variants (used by the "shuffle" button so the user can pick another
   * combination without changing the date).
   */
  variant?: number;
}

/**
 * Generates the caption set for a given day.
 *
 * New format per category per day: 5 SHORT (1-3 words) + 2 LONG (exactly
 * 1 sentence). Default language split:
 *   - shorts: 3 SK + 2 EN
 *   - longs:  1 SK + 1 EN
 *   => 4 SK + 3 EN = 7 captions per category.
 *
 * Content is used VERBATIM from the bank - nothing is appended to the text,
 * so shorts stay 1-3 words and longs stay exactly 1 sentence. Trend words,
 * icons and hashtags travel as separate fields.
 *
 * Selection strategy per (category, kind, language):
 *  1. Stable-shuffle the index list once with a fixed seed.
 *  2. Day N consumes the slice [slotStart, slotStart + take).
 *  3. Skip anything used within the last 30 days (history layer).
 *  4. Fall back to least-recently-used if the fresh pool is exhausted.
 */
export function generateDailyCaptions(
  options: GenerateOptions = {}
): Record<Category, Caption[]> {
  const date = options.date ?? new Date();
  const dateKey = toDateKey(date);
  const history = options.history ?? {};
  const usedInWindow = getUsedInWindow(history, date);
  const lastUsed = getLastUsedDates(history);
  const variant = options.variant ?? 0;

  // Default: 5 shorts (3 SK + 2 EN) + 2 longs (1 SK + 1 EN)
  const shortsSk = options.shortsSk ?? options.skPerCategory ?? 3;
  const shortsEn = options.shortsEn ?? options.enPerCategory ?? 2;
  const longsSk = options.longsSk ?? 1;
  const longsEn = options.longsEn ?? 1;

  const result: Record<Category, Caption[]> = {} as Record<Category, Caption[]>;
  const toRecord: { key: string; category: Category; language: Language }[] = [];

  ALL_CATEGORIES.forEach((category) => {
    const bank = CAPTION_SLOTS[category];
    const captions: Caption[] = [];

    const buildKind = (
      kind: 'short' | 'long',
      language: Language,
      take: number
    ) => {
      const pool = kind === 'short' ? bank.shorts : bank.longs;
      if (pool.length === 0 || take <= 0) return;

      const keyOf = (idx: number) => `${category}|${language}|${kind}|${idx}`;

      // Stable order: shuffled once with a fixed seed.
      const stableList = shuffle(
        pool.map((_, idx) => idx),
        makeRng(hashString(`${category}-${language}-${kind}-stable`))
      );

      const daysSinceEpoch = Math.floor(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000
      );
      // Cycle as long as the pool allows so daily slices never overlap.
      // IMPORTANT: truncate to exactly cycleDays * take so slices partition
      // the list with no wrap-around overlap (which happens when
      // len % take != 0). Leftover items stay as fallback-only.
      const cycleDays = Math.max(
        30,
        Math.min(365, Math.floor(stableList.length / Math.max(1, take)))
      );
      const effectiveLen = cycleDays * take;
      const truncated = stableList.slice(0, effectiveLen);
      const slotStart =
        ((daysSinceEpoch + variant * 997) % cycleDays) * take;

      const isFresh = (idx: number) => !usedInWindow.has(keyOf(idx));

      const chosen: number[] = [];
      // Deterministic slice first (no history gaps inside the window).
      for (let k = 0; k < take; k++) {
        const idx = truncated[(slotStart + k) % effectiveLen];
        if (isFresh(idx)) chosen.push(idx);
      }
      // Fill any history-skipped slots by walking forward in the full list.
      for (
        let step = 0;
        step < stableList.length && chosen.length < take;
        step++
      ) {
        const idx = stableList[(slotStart + step) % stableList.length];
        if (!chosen.includes(idx) && isFresh(idx)) chosen.push(idx);
      }
      if (chosen.length < take) {
        const remaining = stableList
          .filter((idx) => !chosen.includes(idx))
          .sort((a, b) => {
            const da = lastUsed.get(keyOf(a)) ?? '0000-00-00';
            const db = lastUsed.get(keyOf(b)) ?? '0000-00-00';
            return da.localeCompare(db);
          });
        chosen.push(...remaining.slice(0, take - chosen.length));
      }

      chosen.forEach((slotIdx, i) => {
        const slot = pool[slotIdx % pool.length];
        const trendTopics = getTrendingForDay(category, date, 3);
        const trend = trendTopics[(captions.length + i) % trendTopics.length];

        const iconBank = ICON_BANK[category];
        const icons = language === 'sk' ? iconBank.sk : iconBank.en;
        const iconRng = makeRng(
          hashString(`${dateKey}-${category}-${language}-${kind}-${i}-icon`)
        );
        const icon = pick(icons, iconRng);

        const id = `${category}-${language}-${kind}-${dateKey}-${captions.length}`;
        const hashtagSeed = hashString(
          `${dateKey}-${category}-${language}-${kind}-${i}-tags`
        );

        captions.push({
          id,
          category,
          language,
          kind,
          content: slot[language].text,
          translation: slot[language].vi,
          icon,
          hashtags: pickHashtags(category, language, hashtagSeed, 5),
          trending: trend,
          createdAt: dateKey,
        });

        toRecord.push({
          key: keyOf(slotIdx),
          category,
          language,
        });
      });
    };

    // Order: shorts first (SK then EN), then longs (SK then EN).
    buildKind('short', 'sk', shortsSk);
    buildKind('short', 'en', shortsEn);
    buildKind('long', 'sk', longsSk);
    buildKind('long', 'en', longsEn);

    result[category] = captions;
  });

  if (options.persist) {
    recordUsage(toRecord, date);
  }

  if (options.onFingerprints) {
    options.onFingerprints(toRecord);
  }

  // Re-exported so UI can show them without extra imports.
  void WEEKLY_THEMES;
  void SEASONAL_ACCENTS;

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

/**
 * Same as `formatForCopy` but appends the trending topic as a trailing tag,
 * e.g. "  · chrome nails". Useful when the user wants the trend word in the
 * published post.
 */
export function formatForCopyWithTrend(caption: Caption): string {
  const hashtags = caption.hashtags.join(' ');
  const trend = caption.trending ? `  · ${caption.trending}` : '';
  return `${caption.content}${trend} ${caption.icon}\n\n${hashtags}`;
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
