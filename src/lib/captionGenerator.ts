import { Caption, Category, Language } from '@/types';
import { CAPTIONS_LIBRARY, HASHTAGS_LIBRARY } from '@/data/captions';

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function shuffleArray<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let currentSeed = seed;
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    currentSeed = (currentSeed * 1103515245 + 12345) % (2 ** 31);
    const j = currentSeed % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function generateHashtags(category: Category, language: Language, seed: number): string[] {
  const hashtags = [...HASHTAGS_LIBRARY[category][language]];
  const shuffled = shuffleArray(hashtags, seed);
  return shuffled.slice(0, 5);
}

function getCategoryIcon(category: Category, isSK: boolean, seed: number): string {
  const iconSets: Record<Category, { sk: string[]; en: string[] }> = {
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
      sk: ['🍕', '🍔', '🥩', '🍝', '🦐', '🍖', '🍗', '🥗', '🍲', '🍰', '☕', '🍳', '🍨', '🎂'],
      en: ['🍕', '🍔', '🥩', '🍝', '🦐', '🍖', '🍗', '🥗', '🍲', '🍰', '☕', '🍳', '🍨', '🎂'],
    },
    eyelash: {
      sk: ['👁️', '✨', '💅', '😍', '💕', '🌸', '💖', '💗', '💓', '🩷', '💜', '🩵', '🤍', '💫'],
      en: ['👁️', '✨', '💅', '😍', '💕', '🌸', '💖', '💗', '💓', '🩷', '💜', '🩵', '🤍', '💫', '🦋', '🌟'],
    },
  };

  const icons = isSK ? iconSets[category].sk : iconSets[category].en;
  const index = seed % icons.length;
  return icons[index];
}

export function generateDailyCaptions(trending: Record<Category, string[]> | null = null): Record<Category, Caption[]> {
  const today = getTodayString();
  const baseSeed = hashString(today);
  const result: Record<Category, Caption[]> = {} as Record<Category, Caption[]>;
  
  const categories: Category[] = ['nails', 'hair-men', 'hair-women', 'restaurant', 'eyelash'];
  
  categories.forEach((category, catIndex) => {
    const captions: Caption[] = [];
    
    const skCaptions = [...CAPTIONS_LIBRARY[category].sk];
    const enCaptions = [...CAPTIONS_LIBRARY[category].en];
    
    const skSeed = baseSeed + catIndex * 100;
    const enSeed = baseSeed + catIndex * 200;
    
    const shuffledSK = shuffleArray(skCaptions, skSeed);
    const shuffledEN = shuffleArray(enCaptions, enSeed);
    
    const selectedSK = shuffledSK.slice(0, 3);
    const selectedEN = shuffledEN.slice(0, 2);
    
    selectedSK.forEach((item, index) => {
      const id = `${category}-sk-${today}-${index}`;
      const hashtagSeed = hashString(`${today}-${category}-sk-${index}`);
      
      let content = item.content;
      if (trending && trending[category] && trending[category].length > 0) {
        content = enhanceCaptionWithTrending(content, trending[category], index);
      }
      
      captions.push({
        id,
        category,
        language: 'sk',
        content,
        translation: item.translation,
        icon: getCategoryIcon(category, true, hashString(`${id}-sk`)),
        hashtags: generateHashtags(category, 'sk', hashtagSeed),
        createdAt: today,
      });
    });
    
    selectedEN.forEach((item, index) => {
      const id = `${category}-en-${today}-${index}`;
      const hashtagSeed = hashString(`${today}-${category}-en-${index}`);
      
      let content = item.content;
      if (trending && trending[category] && trending[category].length > 0) {
        content = enhanceCaptionWithTrending(content, trending[category], index + 3);
      }
      
      captions.push({
        id,
        category,
        language: 'en',
        content,
        translation: item.translation,
        icon: getCategoryIcon(category, false, hashString(`${id}-en`)),
        hashtags: generateHashtags(category, 'en', hashtagSeed),
        createdAt: today,
      });
    });
    
    result[category] = captions;
  });
  
  return result;
}

function enhanceCaptionWithTrending(content: string, trendingTopics: string[], index: number): string {
  const topicIndex = index % trendingTopics.length;
  const emoji = ['🔥', '✨', '💫', '⭐', '📈', '🎯'][topicIndex % 6];
  
  if (content.length < 40) {
    return `${content} ${emoji}`;
  }
  
  return content;
}

export function formatForCopy(caption: Caption): string {
  const hashtags = caption.hashtags.join(' ');
  return `${caption.content} ${caption.icon}\n\n${hashtags}`;
}

export async function fetchTrending(): Promise<Record<Category, string[]> | null> {
  try {
    const response = await fetch('/api/trending');
    if (!response.ok) throw new Error('Failed to fetch');
    
    const data = await response.json();
    
    if (data.error) {
      console.error('API Error:', data.error);
      return null;
    }
    
    return {
      nails: data.nails || [],
      'hair-men': data.hairMen || [],
      'hair-women': data.hairWomen || [],
      restaurant: data.restaurant || [],
      eyelash: data.eyelash || [],
    };
  } catch (error) {
    console.error('Error fetching trending:', error);
    return null;
  }
}
