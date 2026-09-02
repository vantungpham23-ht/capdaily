import { Caption, Category, Language } from '@/types';
import { CAPTIONS_LIBRARY, HASHTAGS_LIBRARY } from '@/data/captions';

// Simple hash function để tạo deterministic random dựa trên ngày
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Shuffle array với seed để có deterministic result
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

// Lấy date string cho seeding
function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// Sinh hashtags cho một caption
function generateHashtags(category: Category, language: Language, seed: number): string[] {
  const hashtags = [...HASHTAGS_LIBRARY[category][language]];
  const shuffled = shuffleArray(hashtags, seed);
  return shuffled.slice(0, 5);
}

// Icon mapping cho mỗi category - nhiều icon ngẫu nhiên
function getCategoryIcon(category: Category, isSK: boolean, seed: number): string {
  const iconSets: Record<Category, { sk: string[]; en: string[] }> = {
    nails: {
      sk: ['💅', '✨', '💅🏻', '💅🏿', '💅🏾', '💖', '🌸', '💕', '💗', '💓', '🤍', '🩷', '💜', '🩵', '🤍'],
      en: ['💅', '✨', '💅🏻', '💅🏿', '💅🏾', '💖', '🌸', '💕', '💗', '💓', '🤍', '🩷', '💜', '🩵', '🤍', '💐', '🌷', '💐'],
    },
    hair: {
      sk: ['💇‍♀️', '💇', '✨', '😍', '💕', '🌸', '💖', '💗', '💓', '🩷', '💜', '🩵', '🤍', '💫', '✨'],
      en: ['💇‍♀️', '💇', '✨', '😍', '💕', '🌸', '💖', '💗', '💓', '🩷', '💜', '🩵', '🤍', '💫', '✨', '👩‍🦰', '👩‍🦱'],
    },
    restaurant: {
      sk: ['🍽️', '🍴', '😋', '🤤', '🍕', '🍔', '🍜', '🍝', '🍣', '🥗', '🍲', '🍛', '🥘', '🍱', '🫕'],
      en: ['🍽️', '🍴', '😋', '🤤', '🍕', '🍔', '🍜', '🍝', '🍣', '🥗', '🍲', '🍛', '🥘', '🍱', '🫕', '🍰', '🧁'],
    },
    eyelash: {
      sk: ['👁️', '✨', '💅', '😍', '💕', '🌸', '💖', '💗', '💓', '🩷', '💜', '🩵', '🤍', '💫', '✨'],
      en: ['👁️', '✨', '💅', '😍', '💕', '🌸', '💖', '💗', '💓', '🩷', '💜', '🩵', '🤍', '💫', '✨', '🦋', '🌟'],
    },
  };

  const icons = isSK ? iconSets[category].sk : iconSets[category].en;
  const index = seed % icons.length;
  return icons[index];
}

// Sinh tất cả captions cho một ngày với trending topics
export function generateDailyCaptions(trending: Record<Category, string[]> | null = null): Record<Category, Caption[]> {
  const today = getTodayString();
  const baseSeed = hashString(today);
  const result: Record<Category, Caption[]> = {} as Record<Category, Caption[]>;
  
  const categories: Category[] = ['nails', 'hair', 'restaurant', 'eyelash'];
  
  categories.forEach((category, catIndex) => {
    const captions: Caption[] = [];
    
    // Lấy captions từ library
    const skCaptions = [...CAPTIONS_LIBRARY[category].sk];
    const enCaptions = [...CAPTIONS_LIBRARY[category].en];
    
    // Shuffle với seed khác nhau cho mỗi category
    const skSeed = baseSeed + catIndex * 100;
    const enSeed = baseSeed + catIndex * 200;
    
    const shuffledSK = shuffleArray(skCaptions, skSeed);
    const shuffledEN = shuffleArray(enCaptions, enSeed);
    
    // Lấy 3 SK và 2 EN
    const selectedSK = shuffledSK.slice(0, 3);
    const selectedEN = shuffledEN.slice(0, 2);
    
    // Tạo caption objects cho SK
    selectedSK.forEach((content, index) => {
      const id = `${category}-sk-${today}-${index}`;
      const hashtagSeed = hashString(`${today}-${category}-sk-${index}`);
      
      // Nếu có trending, thay đổi một phần của caption
      let finalContent = content;
      if (trending && trending[category] && trending[category].length > 0) {
        finalContent = enhanceCaptionWithTrending(content, trending[category], index);
      }
      
      captions.push({
        id,
        category,
        language: 'sk',
        content: finalContent,
        icon: getCategoryIcon(category, true, hashString(`${id}-sk`)),
        hashtags: generateHashtags(category, 'sk', hashtagSeed),
        createdAt: today,
      });
    });
    
    // Tạo caption objects cho EN
    selectedEN.forEach((content, index) => {
      const id = `${category}-en-${today}-${index}`;
      const hashtagSeed = hashString(`${today}-${category}-en-${index}`);
      
      let finalContent = content;
      if (trending && trending[category] && trending[category].length > 0) {
        finalContent = enhanceCaptionWithTrending(content, trending[category], index + 3);
      }
      
      captions.push({
        id,
        category,
        language: 'en',
        content: finalContent,
        icon: getCategoryIcon(category, false, hashString(`${id}-en`)),
        hashtags: generateHashtags(category, 'en', hashtagSeed),
        createdAt: today,
      });
    });
    
    result[category] = captions;
  });
  
  return result;
}

// Tăng cường caption với trending topics
function enhanceCaptionWithTrending(content: string, trendingTopics: string[], index: number): string {
  // Chọn một trending topic dựa trên index
  const topicIndex = index % trendingTopics.length;
  const topic = trendingTopics[topicIndex];
  
  // Thêm emoji trending vào cuối caption
  const trendingEmojis = ['🔥', '✨', '💫', '⭐', '📈', '🎯'];
  const emoji = trendingEmojis[topicIndex % trendingEmojis.length];
  
  // Nếu caption ngắn, thêm trending topic vào
  if (content.length < 40) {
    return `${content} ${emoji}`;
  }
  
  return content;
}

// Format caption + hashtags để copy
export function formatForCopy(caption: Caption): string {
  const hashtags = caption.hashtags.join(' ');
  return `${caption.content} ${caption.icon}\n\n${hashtags}`;
}

// Fetch trending từ API
export async function fetchTrending(): Promise<Record<Category, string[]> | null> {
  try {
    const response = await fetch('/api/trending');
    if (!response.ok) throw new Error('Failed to fetch');
    
    const data = await response.json();
    
    if (data.error) {
      console.error('API Error:', data.error);
      return null;
    }
    
    // Extract trending topics
    return {
      nails: data.nails || [],
      hair: data.hair || [],
      restaurant: data.restaurant || [],
      eyelash: data.eyelash || [],
    };
  } catch (error) {
    console.error('Error fetching trending:', error);
    return null;
  }
}
