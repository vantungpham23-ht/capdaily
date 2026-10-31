/**
 * Date helpers shared across the app.
 *
 * IMPORTANT: all date keys are computed from LOCAL time components, never from
 * `toISOString()` (which is UTC). Mixing the two produces off-by-one errors
 * around midnight and breaks the "no repeat" window logic.
 */

/** YYYY-MM-DD in local time. */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parse a YYYY-MM-DD key into a local Date at midnight. */
export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/** Add (or subtract) days, returning a new Date. */
export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** Whole days between two date keys (b - a). */
export function daysBetween(aKey: string, bKey: string): number {
  const a = parseDateKey(aKey);
  const b = parseDateKey(bKey);
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}
