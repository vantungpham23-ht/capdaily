'use client';

import { useState, useMemo, useCallback } from 'react';
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
import {
  Palette,
  Scissors,
  UtensilsCrossed,
  Sparkles,
  User,
  Heart,
  Copy,
  Check,
} from 'lucide-react';
import { CategoryConfig, Caption, Category, Language } from '@/types';
import { CaptionCard } from './CaptionCard';
import { formatCategoryForCopy } from '@/lib/captionGenerator';
import { useToast } from '@/hooks/useToast';

interface CategorySectionProps {
  category: CategoryConfig;
  captions: Caption[];
  onReorder: (category: Category, captions: Caption[]) => void;
}

type LangFilter = 'all' | Language;

const iconMap: Record<string, React.ReactNode> = {
  palette: <Palette size={18} />,
  scissors: <Scissors size={18} />,
  utensils: <UtensilsCrossed size={18} />,
  sparkles: <Sparkles size={18} />,
  user: <User size={18} />,
  heart: <Heart size={18} />,
};

/** Per-category accent theme (gradient + soft tint). */
const themeMap: Record<
  string,
  { grad: string; tint: string; text: string; ring: string }
> = {
  nails: {
    grad: 'from-pink-500 via-rose-400 to-orange-300',
    tint: 'bg-pink-500/10',
    text: 'text-pink-600 dark:text-pink-300',
    ring: 'ring-pink-500/30',
  },
  'hair-men': {
    grad: 'from-blue-600 via-sky-500 to-cyan-400',
    tint: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-300',
    ring: 'ring-blue-500/30',
  },
  'hair-women': {
    grad: 'from-purple-600 via-fuchsia-500 to-pink-400',
    tint: 'bg-purple-500/10',
    text: 'text-purple-600 dark:text-purple-300',
    ring: 'ring-purple-500/30',
  },
  restaurant: {
    grad: 'from-orange-500 via-amber-500 to-yellow-400',
    tint: 'bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-300',
    ring: 'ring-orange-500/30',
  },
  eyelash: {
    grad: 'from-teal-500 via-cyan-500 to-sky-400',
    tint: 'bg-teal-500/10',
    text: 'text-teal-600 dark:text-teal-300',
    ring: 'ring-teal-500/30',
  },
};

export function CategorySection({
  category,
  captions,
  onReorder,
}: CategorySectionProps) {
  const [langFilter, setLangFilter] = useState<LangFilter>('all');
  const [kindFilter, setKindFilter] = useState<'all' | 'short' | 'long'>('all');
  const [copiedAll, setCopiedAll] = useState(false);
  const { show } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const theme = themeMap[category.id] ?? themeMap.nails;

  const visible = useMemo(
    () =>
      captions.filter(
        (c) =>
          (langFilter === 'all' || c.language === langFilter) &&
          (kindFilter === 'all' || c.kind === kindFilter)
      ),
    [captions, langFilter, kindFilter]
  );

  const skCount = captions.filter((c) => c.language === 'sk').length;
  const enCount = captions.filter((c) => c.language === 'en').length;
  const shortCount = captions.filter((c) => c.kind === 'short').length;
  const longCount = captions.filter((c) => c.kind === 'long').length;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = captions.findIndex((item) => item.id === active.id);
    const newIndex = captions.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(category.id, arrayMove(captions, oldIndex, newIndex));
  };

  const handleCopyAll = useCallback(async () => {
    if (visible.length === 0) return;
    try {
      await navigator.clipboard.writeText(formatCategoryForCopy(visible));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
      show(`Đã chép ${visible.length} caption · ${category.nameSK}`);
    } catch (err) {
      console.error('Failed to copy all:', err);
      show('Không thể sao chép, hãy thử lại', 'error');
    }
  }, [visible, show, category.nameSK]);

  const counts: { key: LangFilter; label: string; n: number }[] = [
    { key: 'all', label: 'Tất cả', n: captions.length },
    { key: 'sk', label: 'SK', n: skCount },
    { key: 'en', label: 'EN', n: enCount },
  ];

  return (
    <section className="group/card flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition-shadow duration-300 hover:shadow-card">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${theme.grad} opacity-[0.14] dark:opacity-[0.2]`}
          aria-hidden
        />
        <div
          className={`absolute -right-6 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${theme.grad} opacity-20 blur-2xl transition-transform duration-500 group-hover/card:scale-125`}
          aria-hidden
        />

        <div className="relative flex items-center gap-3 px-4 py-3.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${theme.grad} text-white shadow-soft`}
          >
            {iconMap[category.icon]}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-bold tracking-tight text-fg">
              {category.name}
            </h2>
            <p className="truncate text-[11.5px] font-medium text-fg-muted">
              {category.nameSK}
            </p>
          </div>

          <div
            className={`ml-auto shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-bold ${theme.tint} ${theme.text}`}
          >
            {skCount + enCount}
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-y border-line bg-surface-2/60 px-3 py-2">
        <div className="flex rounded-lg bg-surface-3 p-0.5">
          {counts.map(({ key, label, n }) => (
            <button
              key={key}
              onClick={() => setLangFilter(key)}
              className={`flex items-center gap-1 rounded-[7px] px-2 py-1 text-[11px] font-semibold transition-all duration-200 ${
                langFilter === key
                  ? 'bg-surface text-fg shadow-xs'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              {label}
              <span
                className={`text-[9.5px] tabular-nums ${
                  langFilter === key ? theme.text : 'text-fg-subtle'
                }`}
              >
                {n}
              </span>
            </button>
          ))}
        </div>

        <div className="flex rounded-lg bg-surface-3 p-0.5">
          {(
            [
              { key: 'all', label: '5+2', n: captions.length },
              { key: 'short', label: 'Ngắn', n: shortCount },
              { key: 'long', label: 'Dài', n: longCount },
            ] as const
          ).map(({ key, label, n }) => (
            <button
              key={key}
              onClick={() => setKindFilter(key)}
              className={`flex items-center gap-1 rounded-[7px] px-2 py-1 text-[11px] font-semibold transition-all duration-200 ${
                kindFilter === key
                  ? 'bg-surface text-fg shadow-xs'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              {label}
              <span
                className={`text-[9.5px] tabular-nums ${
                  kindFilter === key ? theme.text : 'text-fg-subtle'
                }`}
              >
                {n}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleCopyAll}
          disabled={visible.length === 0}
          className={`ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-200 active:scale-95 disabled:opacity-40 ${
            copiedAll
              ? 'bg-emerald-500 text-white shadow-soft'
              : 'bg-surface-3 text-fg-muted hover:bg-accent hover:text-white hover:shadow-soft'
          }`}
        >
          {copiedAll ? (
            <>
              <Check size={12} />
              Đã chép
            </>
          ) : (
            <>
              <Copy size={12} />
              Copy tất cả
            </>
          )}
        </button>
      </div>

      {/* Caption list */}
      <div className="flex-1 space-y-2 p-3">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <div className={`rounded-full p-3 ${theme.tint} ${theme.text}`}>
              <Sparkles size={18} />
            </div>
            <p className="text-[11.5px] text-fg-subtle">
              Không có caption cho bộ lọc này
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={visible.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {visible.map((caption, index) => (
                <CaptionCard key={caption.id} caption={caption} index={index} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </section>
  );
}
