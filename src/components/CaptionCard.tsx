'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Copy, Check } from 'lucide-react';
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
    opacity: isDragging ? 0.5 : 1,
  };

  const handleCopy = async () => {
    const formattedText = formatForCopy(caption);
    await copy(formattedText, caption.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-gray-50 hover:bg-gray-100 rounded-xl p-3 transition-all cursor-default ${
        isDragging ? 'shadow-lg ring-2 ring-pink-200' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 p-1 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical size={14} />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-200 text-gray-500">
              {index + 1}
            </span>
            <span
              className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                caption.language === 'sk'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-green-100 text-green-600'
              }`}
            >
              {caption.language === 'sk' ? 'SK' : 'EN'}
            </span>
            <span className="text-base">{caption.icon}</span>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed mb-2 line-clamp-2">
            {caption.content}
          </p>

          {/* Hashtags + Copy */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {caption.hashtags.slice(0, 4).map((tag, i) => (
                <span key={i} className="text-xs text-gray-400">
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                isCopied
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isCopied ? (
                <>
                  <Check size={12} />
                  <span>OK</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
