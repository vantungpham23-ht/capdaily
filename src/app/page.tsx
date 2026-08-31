'use client';

import { Calendar, Zap, Clock } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { CategorySection } from '@/components/CategorySection';
import { useState, useEffect } from 'react';

export default function Home() {
  const [lastFetch, setLastFetch] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInfo() {
      try {
        const res = await fetch('/api/trending');
        const data = await res.json();
        if (data.lastFetch) {
          setLastFetch(data.lastFetch);
        }
      } catch (e) {
        console.error('Error fetching info:', e);
      }
    }
    fetchInfo();
  }, []);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('sk-SK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                C
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Každodenné Captiony
                </h1>
                <p className="text-sm text-gray-500">
                  5 SK + 5 EN captionov denne
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {lastFetch && (
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock size={12} />
                  <span>Auto 9:00</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                <Calendar size={16} />
                <span className="hidden sm:inline">{formattedDate}</span>
                <span className="sm:hidden">{today.getDate()}. {today.toLocaleDateString('sk-SK', { month: 'short' })}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CATEGORIES.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-400">
        <div className="flex items-center justify-center gap-1.5">
          <Zap size={12} className="text-pink-500" />
          <span>Automatické obnovenie každý deň o 9:00</span>
        </div>
      </footer>
    </div>
  );
}
