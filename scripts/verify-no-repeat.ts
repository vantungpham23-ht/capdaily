/**
 * Verification script: simulates consecutive days and asserts that no caption
 * fingerprint repeats inside the 30-day window.
 *
 * Run with:  npx tsx scripts/verify-no-repeat.ts
 * (or bundled with esbuild for sandboxed envs)
 */
import {
  generateDailyCaptions,
  toDateKey,
  addDays,
  getTrendingForDay,
} from '../src/lib/captionGenerator';
import { CAPTION_SLOTS, ALL_CATEGORIES } from '../src/data/captions';
import { Category, HistoryMap } from '../src/types';

console.log('=== Candidate space per category/kind/language ===');
let smallestShort = Infinity;
let smallestLong = Infinity;
for (const cat of ALL_CATEGORIES) {
  const bank = CAPTION_SLOTS[cat];
  console.log(
    `  ${cat.padEnd(12)} shorts=${bank.shorts.length} longs=${bank.longs.length}`
  );
  smallestShort = Math.min(smallestShort, bank.shorts.length);
  smallestLong = Math.min(smallestLong, bank.longs.length);
}
// Per day per language-kind: shorts SK take=3, shorts EN take=2, longs take=1 each.
// Worst case per pool: shorts SK 3/day shared across one pool with EN?
// Fingerprints are namespaced per language+kind, so each language-kind stream
// only consumes its own take. Check the tightest: SK shorts 3/day.
console.log(`  => smallest shorts pool: ${smallestShort} (need 3/day SK + 2/day EN)`);
console.log(`  => smallest longs pool: ${smallestLong} (need 1/day per language)`);
console.log(
  `  => 30 days x 3 SK shorts = 90 needed, ${smallestShort} available => ${smallestShort >= 90 ? 'ENOUGH' : 'NOT ENOUGH'}`
);
console.log(
  `  => 30 days x 1 long = 30 needed, ${smallestLong} available => ${smallestLong >= 30 ? 'ENOUGH' : 'NOT ENOUGH'}`
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

/** Validates the 1-3 word shorts and single-sentence longs rules. */
function validateFormat() {
  console.log('\n=== Format check: shorts 1-3 words, longs 1 sentence ===');
  let bad = 0;
  for (const cat of ALL_CATEGORIES) {
    const bank = CAPTION_SLOTS[cat];
    for (const s of bank.shorts) {
      for (const lang of ['sk', 'en'] as const) {
        const w = s[lang].text.trim().split(/\s+/).filter(Boolean).length;
        if (w < 1 || w > 3) {
          bad++;
          if (bad <= 10) console.log(`  SHORT VIOLATION [${cat}/${lang}]: "${s[lang].text}" (${w} words)`);
        }
      }
    }
    for (const s of bank.longs) {
      for (const lang of ['sk', 'en'] as const) {
        const sentences = s[lang].text.split(/[.!?]+/).filter((x) => x.trim().length > 0).length;
        if (sentences !== 1) {
          bad++;
          if (bad <= 10) console.log(`  LONG VIOLATION [${cat}/${lang}]: "${s[lang].text}" (${sentences} sentences)`);
        }
      }
    }
  }
  if (bad === 0) console.log('  PASS: all shorts 1-3 words, all longs exactly 1 sentence');
  else console.log(`  FAIL: ${bad} violations`);
  return bad;
}

const formatBad = validateFormat();

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
    console.log(`  [${cap.language.toUpperCase()}/${cap.kind}] ${cap.content} ${cap.icon}`);
    console.log(`      VI: ${cap.translation}`);
    console.log(`      ${cap.hashtags.join(' ')}`);
  }
}

if (withHistory === 0 && withoutHistory === 0 && longRun === 0 && formatBad === 0) {
  console.log('\nALL CHECKS PASSED');
} else {
  console.log('\nSOME CHECKS FAILED');
  process.exitCode = 1;
}
