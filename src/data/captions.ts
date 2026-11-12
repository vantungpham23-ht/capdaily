import { Category, LocalizedSlot } from '@/types';

import { SHORTS as nailsShorts, LONGS as nailsLongs } from './capbank/nails';
import { SHORTS as hairMenShorts, LONGS as hairMenLongs } from './capbank/hair-men';
import { SHORTS as hairWomenShorts, LONGS as hairWomenLongs } from './capbank/hair-women';
import { SHORTS as restaurantShorts, LONGS as restaurantLongs } from './capbank/restaurant';
import { SHORTS as eyelashShorts, LONGS as eyelashLongs } from './capbank/eyelash';

/**
 * New caption bank: 5 ultra-short (1-3 words) + 2 single-sentence longs
 * per category per day.
 *
 * - SHORTS: strictly 1-3 words, punchy, industry-specific, native grammar.
 * - LONGS: exactly ONE sentence each, native grammar, salon/restaurant specific.
 *
 * Each slot carries 3 languages:
 *   - sk.text : Slovak caption (published)
 *   - en.text : English caption (published)
 *   - *.vi    : Vietnamese translation (display only, never copied)
 *
 * Content is used VERBATIM - nothing is appended to the text, so the
 * 1-3 word limit and the single-sentence rule are never broken.
 * Trend words, icons and hashtags travel as separate fields.
 */
export interface SlotBank {
  shorts: LocalizedSlot[];
  longs: LocalizedSlot[];
}

/** Helper: build a fully trilingual slot. */
function t(sk: string, en: string, vi: string): LocalizedSlot {
  return { sk: { text: sk, vi }, en: { text: en, vi } };
}

export const CAPTION_SLOTS: Record<Category, SlotBank> = {
  nails: { shorts: nailsShorts, longs: nailsLongs },
  'hair-men': { shorts: hairMenShorts, longs: hairMenLongs },
  'hair-women': { shorts: hairWomenShorts, longs: hairWomenLongs },
  restaurant: { shorts: restaurantShorts, longs: restaurantLongs },
  eyelash: { shorts: eyelashShorts, longs: eyelashLongs },
};

/**
 * Hashtag pools, split by tag language so we can control the mix.
 * English tags reach a broader audience on Instagram/TikTok, so they are
 * always the majority; local-language tags add local reach.
 */
export const HASHTAGS_LIBRARY: Record<Category, { en: string[]; sk: string[] }> = {
  nails: {
    en: ['#nails', '#nailart', '#manicure', '#beauty', '#naildesign', '#nailsofinstagram', '#nailstagram', '#nailswag', '#nailpolish', '#nailpro', '#nailjunkie', '#naildaily', '#nailaddict', '#nailstyle', '#glam', '#frenchtips', '#gelnails', '#shortnails', '#nailinspo', '#selfcare'],
    sk: ['#nechty', '#manikura', '#lakovanie', '#krasa', '#salonkrasy', '#nechtyzmadrymi', '#krasanails', '#naildesignsk', '#slovaknails', '#slovenskakrasa', '#starostlivost'],
  },
  'hair-men': {
    en: ['#menshair', '#haircut', '#mensstyle', '#barber', '#fade', '#hairstyle', '#gentleman', '#barbershop', '#sharpcut', '#mensgrooming', '#beards', '#barberlife', '#undercut', '#buzzcut', '#malegrooming', '#menshaircut', '#fadehaircut', '#barberstyle', '#grooming', '#beardstyle'],
    sk: ['#vlasy', '#panskystrih', '#kader', '#barberstrih', '#modnystrih', '#muzkystyl', '#vlasytendencia', '#kvalitnystrih', '#stylmuza', '#krasavlasy'],
  },
  'hair-women': {
    en: ['#hair', '#hairstyle', '#hairgoals', '#haircut', '#balayage', '#haircolor', '#hairstylist', '#hairdo', '#hairlove', '#hairinspo', '#hairfashion', '#beautyhair', '#straighthair', '#curlyhair', '#longhair', '#hairtransformation', '#blowout', '#haircare', '#hairtrend', '#hairinspiration'],
    sk: ['#vlasy', '#uces', '#krasa', '#salon', '#vlasovystrih', '#farbenievlasov', '#balayagesk', '#trendyucesy', '#hairgoals', '#zenskeevlasy'],
  },
  restaurant: {
    en: ['#foodie', '#foodporn', '#restaurant', '#yummy', '#instafood', '#foodstagram', '#foodlover', '#delicious', '#foodblogger', '#foodphotography', '#tasty', '#eeeeeats', '#foodgasm', '#dinner', '#lunch', '#gastronomy', '#hometaste', '#chefskiss', '#foodgoals', '#goodfood'],
    sk: ['#jedlo', '#restauracia', '#chutna', '#varenie', '#domace', '#gastronomia', '#jedloupoluti', '#slovenskejedla', '#dobrijedlo', '#chefkuchar'],
  },
  eyelash: {
    en: ['#lashes', '#eyelash', '#lashextensions', '#lashgoals', '#beauty', '#makeup', '#lashlove', '#lashed', '#eyelashes', '#lashartist', '#volumelashes', '#naturallashes', '#dramaticlashes', '#dramatic', '#wispy', '#lashlift', '#lashesforall', '#eyelashartist', '#lashqueen', '#flutter'],
    sk: ['#mihalnice', '#nokie', '#krasa', '#makeupartist', '#mihalnicestudio', '#nastiekavanie', '#mihalnicetrendy', '#krasnokie', '#lashtrend', '#okrasnokie'],
  },
};

/**
 * Trending topic bank - short, punchy, currently popular styles.
 * Rotated deterministically per day so the site always feels "live".
 */
export const TRENDING_BANK: Record<Category, string[]> = {
  nails: ['soft glam', 'chrome nails', 'french tips', 'micro french', 'buttercream nails', 'blush nails', 'glazed donut', 'abstract art', 'mocha brown', 'short square', 'pearl detail', 'ombré', 'matte black', 'red theory'],
  'hair-men': ['fade', 'textured crop', 'undercut', 'slick back', 'pompadour', 'mullet', 'buzz cut', 'curtain fringe', 'taper fade', 'beard sculpting', 'shaggy layers', 'short crop', 'surfer cut', 'skin fade'],
  'hair-women': ['wolf cut', 'balayage', 'curtain bangs', 'sleek bun', 'bixie cut', 'honey blonde', 'shag cut', 'money piece', 'glass hair', 'beach waves', 'pixie cut', 'French bob', 'bubble cut', 'layers'],
  restaurant: ['comfort food', 'brunch', 'farm to table', 'seasonal menu', 'slow food', 'street food', 'chef special', 'homemade', 'family recipes', 'tasting menu', 'good food good mood', 'food worth sharing', 'daily menu', 'local ingredients'],
  eyelash: ['cat eye', 'doll eye', 'wispy lashes', 'hybrid set', 'mega volume', 'cluster lashes', 'lash lift', 'spiky lashes', 'natural look', 'dramatic lashes', 'half lash', 'anime lashes', 'magnetic lashes', 'soft glam'],
};

/**
 * Short weekly flavour. Shown in UI only (never glued into caption text,
 * so short captions stay 1-3 words and longs stay exactly 1 sentence).
 */
export const WEEKLY_THEMES: Record<number, LocalizedSlot> = {
  0: t('nový týžden', 'new week', 'tuần mới'),
  1: t('pondelková energia', 'monday mood', 'thứ hai rộn ràng'),
  2: t('utorok vibe', 'tuesday vibe', 'thứ ba nhẹ nhàng'),
  3: t('streda, pol týždňa', 'midweek', 'giữa tuần'),
  4: t('piatok, big plans', 'friday plans', 'thứ sáu, kế hoạch lớn'),
  5: t('víkendový režim', 'weekend mode', 'chế độ cuối tuần'),
  6: t('nedeľa pre seba', 'sunday for me', 'chủ nhật cho mình'),
};

/**
 * Short seasonal accents, UI only (never appended to caption text).
 */
export const SEASONAL_ACCENTS: Record<number, LocalizedSlot> = {
  0: t('nový rok vibe', 'new year vibe', 'vibe năm mới'),
  1: t('valentine mood', 'valentine mood', 'vibe Valentine'),
  2: t('jaro je tu', 'spring is here', 'mùa xuân đến rồi'),
  3: t('veľkonočná nálada', 'easter mood', 'không khí Phục Sinh'),
  4: t('májová energia', 'may energy', 'năng lượng tháng Năm'),
  5: t('letná pohoda', 'summer ease', 'không khí hè'),
  6: t('prázdninová svoboda', 'holiday freedom', 'tự do mùa hè'),
  7: t('slnečné leto', 'sunny summer', 'mùa hè nắng vàng'),
  8: t('zlatý jeseň', 'golden autumn', 'mùa thu vàng'),
  9: t('jesenná atmosféra', 'autumn mood', 'không khí mùa thu'),
  10: t('tekutý jeseň', 'liquid autumn', 'mùa thu se'),
  11: t('sviatky sú tu', 'festive season', 'mùa lễ hội'),
};

/** Icons per category, expanded for visual variety. */
export const ICON_BANK: Record<Category, { sk: string[]; en: string[] }> = {
  nails: {
    sk: ['💅', '✨', '💅🏻', '💅🏿', '💅🏾', '💖', '🌸', '💕', '💗', '💓', '🤍', '🩷', '💜', '🩵'],
    en: ['💅', '✨', '💅🏻', '💅🏿', '💅🏾', '💖', '🌸', '💕', '💗', '💓', '🤍', '🩷', '💜', '🩵', '💐', '🌷'],
  },
  'hair-men': {
    sk: ['💇', '✨', '😎', '🔥', '💪', '⭐', '💯', '👌', '🖤', '⚡', '🎯', '👑'],
    en: ['💇', '✨', '😎', '🔥', '💪', '⭐', '💯', '👌', '🖤', '⚡', '🎯', '👑'],
  },
  'hair-women': {
    sk: ['💇‍♀️', '✨', '😍', '💕', '🌸', '💖', '💗', '💓', '🩷', '💜', '🩵', '🤍', '💫', '🌷', '💐'],
    en: ['💇‍♀️', '✨', '😍', '💕', '🌸', '💖', '💗', '💓', '🩷', '💜', '🩵', '🤍', '💫', '👩‍🦰', '👩‍🦱', '💐'],
  },
  restaurant: {
    sk: ['🍽️', '🍴', '😋', '🤤', '🥂', '🍲', '🍰', '☕', '🍳', '🫕', '🥘', '🍱', '🧁', '🥗'],
    en: ['🍽️', '🍴', '😋', '🤤', '🥂', '🍲', '🍰', '☕', '🍳', '🫕', '🥘', '🍱', '🧁', '🥗'],
  },
  eyelash: {
    sk: ['👁️', '✨', '💅', '😍', '💕', '🌸', '💖', '💗', '💓', '🩷', '💜', '🩵', '🤍', '💫'],
    en: ['👁️', '✨', '💅', '😍', '💕', '🌸', '💖', '💗', '💓', '🩷', '💜', '🩵', '🤍', '💫', '🦋', '🌟'],
  },
};

/** Extra emoji used to decorate generated captions. */
export const DECOR_EMOJIS = ['✨', '🔥', '💫', '⭐', '💖', '🌸', '💕', '💯', '🎯', '😍', '🥰', '🤍', '🩷', '💜', '🩵', '💎', '👑', '🌟'];

export const ALL_CATEGORIES: Category[] = ['nails', 'hair-men', 'hair-women', 'restaurant', 'eyelash'];
