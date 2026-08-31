import { NextResponse } from 'next/server';
import { fetchAllTrending, getCachedTrending, getLastFetchTime } from '@/lib/trendsService';

export async function GET() {
  try {
    // Auto fetch vào 9h sáng (hoặc dùng cache)
    const trending = await fetchAllTrending();
    const lastFetch = getLastFetchTime();

    return NextResponse.json({
      ...trending,
      lastFetch,
      fetchedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in trending API:', error);
    
    // Fallback về cache nếu có
    const cached = getCachedTrending();
    if (cached) {
      return NextResponse.json({
        ...cached,
        lastFetch: getLastFetchTime(),
        cached: true,
        error: 'Using cached data due to fetch error',
      });
    }
    
    // Default fallback
    return NextResponse.json({
      nails: ['soft glam', 'chrome nails', 'french tips'],
      hair: ['wolf cut', 'balayage', 'curtain bangs'],
      restaurant: ['comfort food', 'brunch', 'local ingredients'],
      eyelash: ['cat eye', 'wispy lashes', 'mega volume'],
      cached: false,
      error: 'Using default data',
    });
  }
}
