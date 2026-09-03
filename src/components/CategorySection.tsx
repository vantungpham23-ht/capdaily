'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Palette, Scissors, UtensilsCrossed, Sparkles, User, Heart } from 'lucide-react';
import { CategoryConfig, Caption, Category } from '@/types';
import { CaptionCard } from './CaptionCard';
import { generateDailyCaptions, fetchTrending } from '@/lib/captionGenerator';

interface CategorySectionProps {
  category: CategoryConfig;
}

const iconMap: Record<string, React.ReactNode> = {
  palette: <Palette size={20} />,
  scissors: <Scissors size={20} />,
  utensils: <UtensilsCrossed size={20} />,
  sparkles: <Sparkles size={20} />,
  user: <User size={20} />,
  heart: <Heart size={20} />,
};

const colorMap: Record<string, { header: string; icon: string; badge: string }> = {
  nails: { header: 'bg-gradient-to-r from-pink-500 to-pink-400', icon: 'bg-white/20', badge: 'bg-pink-500' },
  'hair-men': { header: 'bg-gradient-to-r from-blue-600 to-blue-500', icon: 'bg-white/20', badge: 'bg-blue-600' },
  'hair-women': { header: 'bg-gradient-to-r from-purple-500 to-purple-400', icon: 'bg-white/20', badge: 'bg-purple-500' },
  restaurant: { header: 'bg-gradient-to-r from-orange-500 to-orange-400', icon: 'bg-white/20', badge: 'bg-orange-500' },
  eyelash: { header: 'bg-gradient-to-r from-blue-400 to-blue-300', icon: 'bg-white/20', badge: 'bg-blue-400' },
};

export function CategorySection({ category }: CategorySectionProps) {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    async function loadCaptions() {
      setIsLoading(true);
      try {
        const trending = await fetchTrending();
        const dailyCaptions = generateDailyCaptions(trending);
        setCaptions(dailyCaptions[category.id as Category]);
      } catch (error) {
        console.error('Error loading captions:', error);
        const dailyCaptions = generateDailyCaptions(null);
        setCaptions(dailyCaptions[category.id as Category]);
      } finally {
        setIsLoading(false);
      }
    }
    loadCaptions();
  }, [category.id]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCaptions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const colors = colorMap[category.id] || colorMap.nails;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className={`${colors.header} px-5 py-4 flex items-center gap-3`}>
        <div className={`${colors.icon} p-2 rounded-lg text-white`}>
          {iconMap[category.icon]}
        </div>
        <div>
          <h2 className="font-semibold text-white">{category.name}</h2>
          <p className="text-sm text-white/80">{category.nameSK}</p>
        </div>
        <div className={`${colors.badge} text-white text-xs font-medium px-2 py-0.5 rounded-full ml-auto`}>
          5 captionov
        </div>
      </div>

      {/* Caption list */}
      <div className="p-3 space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-gray-400">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm">Načítavam...</span>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={captions.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {captions.map((caption, index) => (
                <CaptionCard key={caption.id} caption={caption} index={index} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
