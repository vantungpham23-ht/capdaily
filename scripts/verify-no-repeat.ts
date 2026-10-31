/**
 * Verification script: simulates consecutive days and asserts that no caption
 * fingerprint repeats inside the 30-day window.
 *
 * Run with:  npx tsx scripts/verify-no-repeat.ts
 */
import {
  generateDailyCaptions,
  toDateKey,
  addDays,
  getTrendingForDay,
} from '../src/lib/captionGenerator';
import { CAPTION_SLOTS, ALL_CATEGORIES } from '../src/data/captions';
import { Category, HistoryMap } from '../src/types';

console.log('=== Candidate space per category/language ===');
let smallest = Infinity;
for (const cat of ALL_CATEGORIES) {
  const bank = CAPTION_SLOTS[cat];
  const space = bank.openers.length * bank.bodies.length * bank.closers.length;
  smallest = Math.min(smallest, space);
  console.log(
    `  ${cat.padEnd(12)} openers=${bank.openers.length} bodies=${bank.bodies.length} closers=${bank.closers.length} -> ${space} combos/lang`
  );
}
console.log(`  => smallest pool: ${smallest} combos per language`);
console.log(
  `  => 30 days x 3 SK captions = 90 needed, ${smallest} available => ${smallest >= 90 ? 'ENOUGH' : 'NOT ENOUGH'}`
);

const start = new Date();
start.setHours(0, 0, 0, 0);

/**
 * Runs the simulation and reports repeats.
 * `useHistory` toggles whether the localStorage history layer is active.
 */
function simulate(label: string, days: number, useHistory: boolean) {
  const history: HistoryMap = {};
  const lastSeen = new Map<string, string>();
  let total = 0;
  let repeats = 0;
  const examples: string[] = [];

  for (let day = 0; day < days; day++) {
    const date = addDays(start, day);
    const dateKey = toDateKey(date);

    const fps: { key: string; category: Category; language: 'sk' | 'en' }[] = [];
    generateDailyCaptions({
      date,
      history: useHistory ? history : {},
      onFingerprints: (f) => fps.push(...f),
    });

    for (const fp of fps) {
      total++;
      const prev = lastSeen.get(fp.key);
      if (prev) {
        const gap = Math.round(
          (date.getTime() - new Date(prev).getTime()) / 86400000
        );
        if (gap < 30) {
          repeats++;
          if (examples.length < 5) examples.push(`${fp.key}: ${prev} -> ${dateKey} (gap ${gap}d)`);
        }
      }
      lastSeen.set(fp.key, dateKey);
    }

    for (const fp of fps) {
      history[fp.key] = { date: dateKey, category: fp.category, language: fp.language };
    }
  }

  console.log(`\n--- ${label} ---`);
  console.log(`  Captions generated: ${total}`);
  console.log(`  Unique fingerprints: ${lastSeen.size}`);
  if (repeats === 0) {
    console.log('  PASS: zero repeats inside any 30-day window');
  } else {
    console.log(`  FAIL: ${repeats} repeats`);
    examples.forEach((e) => console.log(`    ${e}`));
  }
  return repeats;
}

console.log('\n=== Simulation: WITH localStorage history ===');
const withHistory = simulate('60 days, history enabled', 60, true);

console.log('\n=== Simulation: WITHOUT localStorage history (cache cleared / new device) ===');
const withoutHistory = simulate('60 days, history disabled', 60, false);

console.log('\n=== Long run: 365 days, no history (worst case) ===');
const longRun = simulate('365 days, history disabled', 365, false);

console.log('\n=== Trending rotation check (nails, 5 days) ===');
for (let i = 0; i < 5; i++) {
  const d = addDays(start, i);
  console.log(`  ${toDateKey(d)}: ${getTrendingForDay('nails', d, 3).join(' | ')}`);
}

console.log('\n=== Sample output (day 1) ===');
const sample = generateDailyCaptions({ date: start, history: {} });
for (const cat of ALL_CATEGORIES) {
  console.log(`\n--- ${cat} ---`);
  for (const cap of sample[cat]) {
    console.log(`  [${cap.language.toUpperCase()}] ${cap.content} ${cap.icon}`);
    console.log(`      VI: ${cap.translation}`);
    console.log(`      ${cap.hashtags.join(' ')}`);
  }
}

if (withHistory === 0 && withoutHistory === 0 && longRun === 0) {
  console.log('\nALL CHECKS PASSED');
} else {
  console.log('\nSOME CHECKS FAILED');
  process.exitCode = 1;
}
