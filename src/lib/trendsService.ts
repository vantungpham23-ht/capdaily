import axios from 'axios';
import { Category } from '@/types';
import * as fs from 'fs';
import * as path from 'path';

const SERP_API_KEY = process.env.SERP_API_KEY;
const BASE_URL = 'https://serpapi.com';
const CACHE_FILE = path.join(process.cwd(), '.trending-cache.json');

// Search queries cho mỗi ngành
const TRENDING_QUERIES: Record<Category, string[]> = {
  nails: ['nail art', 'manicure', 'gel nails'],
  'hair-men': ['men haircut', 'barber style', 'men hairstyle'],
  'hair-women': ['women hairstyle', 'haircut', 'balayage'],
  restaurant: ['food recipe', 'cooking', 'delicious meal'],
  eyelash: ['eyelash extensions', 'lash extensions', 'eye makeup'],
};

interface CacheData {
  data: Record<Category, string[]>;
  lastFetch: string;
}

interface SerpApiResponse {
  related_topics?: Array<{
    topic: {
      title?: string;
      mid?: string;
    };
  }>;
  trending_searches?: Array<{
    title: string;
    query: string;
  }>;
}

// Kiểm tra nếu đã fetch hôm nay (sau 9h sáng)
function shouldFetch(): boolean {
  const now = new Date();
  const hour = now.getHours();
  
  if (hour < 9) {
    console.log('⏰ Before 9 AM, using cached data');
    return false;
  }
  
  const cache = loadCache();
  if (!cache) {
    console.log('📦 No cache, need to fetch');
    return true;
  }
  
  const lastFetchDate = new Date(cache.lastFetch);
  const today = new Date();
  
  if (
    lastFetchDate.getFullYear() === today.getFullYear() &&
    lastFetchDate.getMonth() === today.getMonth() &&
    lastFetchDate.getDate() === today.getDate()
  ) {
    console.log('📦 Already fetched today at', lastFetchDate.toLocaleTimeString());
    return false;
  }
  
  console.log('🔄 New day, need to fetch at 9 AM');
  return true;
}

function loadCache(): CacheData | null {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const content = fs.readFileSync(CACHE_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error loading cache:', error);
  }
  return null;
}

function saveCache(data: Record<Category, string[]>): void {
  try {
    const cache: CacheData = {
      data,
      lastFetch: new Date().toISOString(),
    };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    console.log('💾 Cache saved');
  } catch (error) {
    console.error('Error saving cache:', error);
  }
}

async function fetchTrendingForCategory(category: Category): Promise<string[]> {
  try {
    const queries = TRENDING_QUERIES[category];
    const allTopics: string[] = [];

    for (const query of queries) {
      try {
        const response = await axios.get<SerpApiResponse>(`${BASE_URL}/search`, {
          params: {
            engine: 'google_trends',
            q: query,
            data_type: 'RELATED_TOPICS',
            geo: 'SK',
            timeframe: 'today 1-m',
            api_key: SERP_API_KEY,
          },
          timeout: 15000,
        });

        const data = response.data;

        if (data.related_topics && Array.isArray(data.related_topics)) {
          const topics = data.related_topics
            .slice(0, 5)
            .map((t) => t.topic?.title || t.topic?.mid || '')
            .filter(Boolean);
          allTopics.push(...topics);
        } else if (data.trending_searches && Array.isArray(data.trending_searches)) {
          const searches = data.trending_searches
            .slice(0, 5)
            .map((t) => t.query || t.title)
            .filter(Boolean);
          allTopics.push(...searches);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error fetching trends for ${query}:`, error);
      }
    }

    const uniqueTopics = [...new Set(allTopics)].slice(0, 10);
    return uniqueTopics.length > 0 ? uniqueTopics : getDefaultTopics(category);

  } catch (error) {
    console.error(`Error fetching trends for ${category}:`, error);
    return getDefaultTopics(category);
  }
}

export async function fetchAllTrending(): Promise<Record<Category, string[]>> {
  if (!shouldFetch()) {
    const cache = loadCache();
    if (cache) {
      return cache.data;
    }
  }
  
  console.log('🔄 Fetching trending from SerpAPI...');
  
  const categories: Category[] = ['nails', 'hair-men', 'hair-women', 'restaurant', 'eyelash'];

  const results = await Promise.all(
    categories.map(async (cat) => {
      const topics = await fetchTrendingForCategory(cat);
      return { category: cat, topics };
    })
  );

  const trending: Record<Category, string[]> = {} as Record<Category, string[]>;
  results.forEach((r) => {
    trending[r.category] = r.topics;
  });

  saveCache(trending);
  
  console.log('✅ Trending fetched and cached');
  return trending;
}

function getDefaultTopics(category: Category): string[] {
  const defaults: Record<Category, string[]> = {
    nails: ['soft glam', 'chrome nails', 'french tips', 'minimalist', 'blush'],
    'hair-men': ['fade', 'textured crop', 'undercut', 'slick back', 'modern cut'],
    'hair-women': ['wolf cut', 'balayage', 'curtain bangs', 'sleek bun', 'layers'],
    restaurant: ['pizza', 'burger', 'pasta', 'steak', 'seafood'],
    eyelash: ['cat eye', 'wispy lashes', 'mega volume', 'natural look', 'doll eye'],
  };
  return defaults[category];
}

export function getCachedTrending(): Record<Category, string[]> | null {
  const cache = loadCache();
  return cache?.data || null;
}

export function getLastFetchTime(): string | null {
  const cache = loadCache();
  if (!cache) return null;
  
  const date = new Date(cache.lastFetch);
  return date.toLocaleString('sk-SK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
