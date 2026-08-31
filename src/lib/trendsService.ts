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
  hair: ['hairstyle', 'haircut', 'balayage'],
  restaurant: ['food', 'restaurant', 'gourmet'],
  eyelash: ['eyelash extensions', 'lash', 'eye makeup'],
};

interface CacheData {
  data: Record<Category, string[]>;
  lastFetch: string; // ISO date string
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
  
  // Chưa đến 9h sáng thì không fetch
  if (hour < 9) {
    console.log('⏰ Before 9 AM, using cached data');
    return false;
  }
  
  // Load cache
  const cache = loadCache();
  if (!cache) {
    console.log('📦 No cache, need to fetch');
    return true;
  }
  
  // Kiểm tra nếu đã fetch hôm nay
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

// Load cache từ file
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

// Save cache vào file
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

// Fetch trending cho 1 category
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

        // Delay để tránh rate limit
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

// Fetch all trending
export async function fetchAllTrending(): Promise<Record<Category, string[]>> {
  // Check if we should fetch
  if (!shouldFetch()) {
    const cache = loadCache();
    if (cache) {
      return cache.data;
    }
  }
  
  console.log('🔄 Fetching trending from SerpAPI...');
  
  const categories: Category[] = ['nails', 'hair', 'restaurant', 'eyelash'];

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

  // Save to cache
  saveCache(trending);
  
  console.log('✅ Trending fetched and cached');
  return trending;
}

// Get default topics
function getDefaultTopics(category: Category): string[] {
  const defaults: Record<Category, string[]> = {
    nails: ['soft glam', 'chrome nails', 'french tips', 'minimalist', 'blush'],
    hair: ['wolf cut', 'balayage', 'curtain bangs', 'sleek bun', 'layers'],
    restaurant: ['comfort food', 'brunch', 'local ingredients', 'seasonal', 'fusion'],
    eyelash: ['cat eye', 'wispy lashes', 'mega volume', 'natural look', 'doll eye'],
  };
  return defaults[category];
}

// Get cached data (không fetch)
export function getCachedTrending(): Record<Category, string[]> | null {
  const cache = loadCache();
  return cache?.data || null;
}

// Get last fetch time
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
