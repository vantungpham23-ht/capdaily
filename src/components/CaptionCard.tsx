'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Copy, Check, TrendingUp, Languages } from 'lucide-react';
import { Caption } from '@/types';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { formatForCopy } from '@/lib/captionGenerator';

interface CaptionCardProps {
  caption: Caption;
  index: number;
}

export function CaptionCard({ caption, index }: CaptionCardProps) {
  const { copiedId, copy } = useCopyToClipboard();
  const isCopied = copiedId === caption.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: caption.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleCopy = async () => {
    await copy(formatForCopy(caption), caption.id);
  };

  const langLabel = caption.language === 'sk' ? 'SK' : 'EN';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl border transition-all duration-200 ${
        isDragging
          ? 'z-20 border-accent/50 bg-surface shadow-float ring-2 ring-accent/25 scale-[1.015]'
          : 'border-line bg-surface-2 hover:border-line-strong hover:bg-surface hover:shadow-soft'
      }`}
    >
      {/* Left accent bar by language */}
      <span
        aria-hidden
        className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full transition-opacity ${
          caption.language === 'sk' ? 'bg-sky-400' : 'bg-emerald-400'
        } ${isDragging ? 'opacity-100' : 'opacity-45 group-hover:opacity-90'}`}
      />

      <div className="pl-4 pr-3 py-3">
        {/* Meta row */}
        <div className="mb-2 flex items-center gap-1.5 flex-wrap">
          <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-surface-3 px-1 text-[10px] font-semibold text-fg-subtle tabular-nums">
            {index + 1}
          </span>

          <span
            className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tracking-wide ${
              caption.language === 'sk'
                ? 'bg-sky-500/12 text-sky-600 dark:text-sky-300'
                : 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-300'
            }`}
          >
            <Languages size={9} />
            {langLabel}
          </span>

          {caption.trending && (
            <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/25 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-300">
              <TrendingUp size={9} />
              <span className="max-w-[9rem] truncate">{caption.trending}</span>
            </span>
          )}

          <button
            {...attributes}
            {...listeners}
            aria-label="Kéo để sắp xếp"
            className="ml-auto cursor-grab touch-none rounded-md p-1 text-fg-subtle opacity-0 transition-opacity hover:bg-surface-3 hover:text-fg active:cursor-grabbing group-hover:opacity-100 focus-visible:opacity-100"
          >
            <GripVertical size={14} />
          </button>
        </div>

        {/* Caption body */}
        <p className="text-[13.5px] leading-relaxed text-fg">
          {caption.content}{' '}
          <span className="text-base leading-none">{caption.icon}</span>
        </p>

        {/* Vietnamese translation */}
        <p className="mt-1.5 border-l-2 border-line pl-2.5 text-[11.5px] italic leading-relaxed text-fg-muted">
          {caption.translation}
        </p>

        {/* Hashtags */}
        <div className="mt-2 flex flex-wrap gap-1">
          {caption.hashtags.map((tag, i) => (
            <span
              key={i}
              className="rounded-md bg-surface-3 px-1.5 py-0.5 text-[10.5px] font-medium text-fg-muted transition-colors hover:text-accent"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Copy button */}
        <div className="mt-2.5 flex justify-end">
          <button
            onClick={handleCopy}
            aria-label="Sao chép caption"
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-200 active:scale-95 ${
              isCopied
                ? 'bg-emerald-500 text-white shadow-soft'
                : 'bg-surface-3 text-fg-muted hover:bg-accent hover:text-white hover:shadow-soft'
            }`}
          >
            {isCopied ? (
              <>
                <Check size={12} />
                Đã chép
              </>
            ) : (
              <>
                <Copy size={12} />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
