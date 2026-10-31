'use client';

import { Category, HistoryMap, Language } from '@/types';
import { toDateKey } from './date';

const STORAGE_KEY = 'capdaily.history.v2';
/** How many days of usage we remember (pruned beyond this). */
const RETENTION_DAYS = 45;
/** How many recent days must not repeat a caption. */
export const NO_REPEAT_WINDOW_DAYS = 30;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/** Load the persisted history map. Safe to call during SSR (returns empty). */
export function loadHistory(): HistoryMap {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as HistoryMap;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch {
    return {};
  }
}

function persist(history: HistoryMap): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // storage full or unavailable - silently ignore
  }
}

/** Remove entries older than the retention window. */
function prune(history: HistoryMap, today: Date): HistoryMap {
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
  const cutoffStr = toDateKey(cutoff);

  const next: HistoryMap = {};
  for (const [key, entry] of Object.entries(history)) {
    if (entry.date >= cutoffStr) next[key] = entry;
  }
  return next;
}

/**
 * Register the captions that were published on `today` so future days can
 * avoid them.
 *
 * The stored date is only advanced forward: browsing to a past date must not
 * downgrade the "last used" timestamp, otherwise the least-recently-used
 * fallback would pick captions that are already out of the window.
 */
export function recordUsage(
  fingerprints: { key: string; category: Category; language: Language }[],
  today: Date = new Date()
): void {
  if (!isBrowser() || fingerprints.length === 0) return;

  const dateStr = toDateKey(today);
  const history = prune(loadHistory(), today);

  for (const fp of fingerprints) {
    const existing = history[fp.key];
    if (!existing || existing.date <= dateStr) {
      history[fp.key] = { date: dateStr, category: fp.category, language: fp.language };
    }
  }

  persist(history);
}

/**
 * Returns the set of fingerprint keys used on the days BEFORE `today` within
 * the no-repeat window.
 *
 * Entries recorded for *today* are intentionally excluded, so reloading the
 * page on the same day regenerates exactly the same captions instead of
 * jumping to a different set.
 */
export function getUsedInWindow(
  history: HistoryMap,
  today: Date = new Date(),
  windowDays: number = NO_REPEAT_WINDOW_DAYS
): Set<string> {
  const todayStr = toDateKey(today);
  const start = new Date(today);
  start.setDate(start.getDate() - (windowDays - 1));
  const startStr = toDateKey(start);

  const used = new Set<string>();
  for (const [key, entry] of Object.entries(history)) {
    if (entry.date >= startStr && entry.date < todayStr) used.add(key);
  }
  return used;
}

/**
 * Map of fingerprint -> last used date, used as a "least recently used" fallback
 * when the pool is exhausted and we have to recycle something.
 */
export function getLastUsedDates(history: HistoryMap): Map<string, string> {
  const map = new Map<string, string>();
  for (const [key, entry] of Object.entries(history)) {
    map.set(key, entry.date);
  }
  return map;
}

/** Wipe the stored history (used by the "reset" action in the UI). */
export function clearHistory(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
