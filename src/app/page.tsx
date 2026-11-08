'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  Zap,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  TrendingUp,
  Sun,
  Moon,
  Shuffle,
  LayoutGrid,
  Rows3,
  RefreshCw,
  Download,
  Copy,
} from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { CategorySection } from '@/components/CategorySection';
import { ToastContainer } from '@/components/ToastContainer';
import { Caption, Category } from '@/types';
import { addDays, generateDailyCaptions, toDateKey } from '@/lib/captionGenerator';
import { loadHistory, clearHistory } from '@/lib/history';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';

type LayoutMode = 'grid' | 'list';

export default function Home() {
  const [offset, setOffset] = useState(0);
  const [byCategory, setByCategory] = useState<Record<Category, Caption[]>>(
    {} as Record<Category, Caption[]>
  );
  const [isLoading, setIsLoading] = useState(true);
  const [layout, setLayout] = useState<LayoutMode>('grid');
  const [nonce, setNonce] = useState(0);
  const [variant, setVariant] = useState(0);

  const { theme, toggle, mounted } = useTheme();
  const { toasts, show, dismiss } = useToast();

  const date = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    return addDays(base, offset);
  }, [offset]);

  const dateKey = toDateKey(date);
  const isToday = offset === 0;

  useEffect(() => {
    setIsLoading(true);
    try {
      const history = loadHistory();
      setByCategory(
        generateDailyCaptions({ date, history, persist: true, variant })
      );
    } catch (error) {
      console.error('Error generating captions:', error);
      setByCategory(generateDailyCaptions({ date, variant }));
    } finally {
      setIsLoading(false);
    }
  }, [dateKey, date, nonce, variant]);

  const totalCaptions = useMemo(
    () =>
      Object.values(byCategory).reduce(
        (sum, list) => sum + (list?.length ?? 0),
        0
      ),
    [byCategory]
  );

  const handleReorder = (category: Category, captions: Caption[]) => {
    setByCategory((prev) => ({ ...prev, [category]: captions }));
  };

  const handleCopyAll = async () => {
    const all = Object.values(byCategory).flat();
    if (all.length === 0) return;
    const text = all
      .map((c) => `${c.content} ${c.icon}\n\n${c.hashtags.join(' ')}`)
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      show(`Đã chép toàn bộ ${all.length} caption`);
    } catch {
      show('Không thể sao chép, hãy thử lại', 'error');
    }
  };

  const handleDownload = () => {
    const all = Object.values(byCategory).flat();
    if (all.length === 0) return;
    const text = CATEGORIES.map((cat) => {
      const list = byCategory[cat.id] ?? [];
      return `===== ${cat.nameSK} / ${cat.name} =====\n\n` +
        list
          .map((c) => `${c.content} ${c.icon}\n${c.translation}\n${c.hashtags.join(' ')}`)
          .join('\n\n');
    }).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `captions-${dateKey}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    show(`Đã tải xuống captions-${dateKey}.txt`);
  };

  const handleReset = () => {
    clearHistory();
    setNonce((n) => n + 1);
    show('Đã xoá lịch sử, bắt đầu chu kỳ mới', 'info');
  };

  const formattedDate = date.toLocaleDateString('sk-SK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const dayLabel = isToday
    ? 'Hôm nay'
    : offset === -1
      ? 'Hôm qua'
      : offset === 1
        ? 'Ngày mai'
        : formattedDate;

  return (
    <div className="min-h-screen bg-bg">
      {/* ---------------------------------------------------------------- */}
      {/* Header                                                          */}
      {/* ---------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Brand */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 via-fuchsia-500 to-purple-600 text-lg font-black text-white shadow-card">
                  C
                </div>
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-surface" />
              </div>
              <div className="min-w-0">
                <h1 className="text-[16px] font-black leading-tight tracking-tight text-fg sm:text-lg">
                  CapDaily
                </h1>
                <p className="hidden text-[11.5px] font-medium text-fg-muted sm:block">
                  Caption tự động · không lặp trong 30 ngày
                </p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              {/* Day navigation */}
              <div className="flex items-center gap-0.5 rounded-xl border border-line bg-surface-2 p-0.5">
                <button
                  onClick={() => setOffset((o) => o - 1)}
                  aria-label="Ngày trước"
                  className="rounded-[9px] p-1.5 text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg"
                >
                  <ChevronLeft size={15} />
                </button>

                <div className="flex min-w-[112px] items-center justify-center gap-1.5 px-1.5">
                  <Calendar size={13} className="text-accent" />
                  <span className="text-[12px] font-bold text-fg">{dayLabel}</span>
                </div>

                <button
                  onClick={() => setOffset((o) => Math.min(0, o + 1))}
                  disabled={offset >= 0}
                  aria-label="Ngày sau"
                  className="rounded-[9px] p-1.5 text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg disabled:opacity-25 disabled:hover:bg-transparent"
                >
                  <ChevronRight size={15} />
                </button>

                {!isToday && (
                  <button
                    onClick={() => setOffset(0)}
                    aria-label="Về hôm nay"
                    className="rounded-[9px] p-1.5 text-fg-muted transition-colors hover:bg-surface-3 hover:text-accent"
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
              </div>

              {/* Shuffle captions */}
              <button
                onClick={() => setVariant((v) => v + 1)}
                title="Đổi bộ caption khác cho hôm nay"
                className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface-2 px-2.5 py-2 text-[11.5px] font-bold text-fg-muted transition-all hover:border-line-strong hover:text-accent active:scale-95"
              >
                <Shuffle size={14} />
                <span className="hidden sm:inline">
                  {variant === 0 ? 'Đổi cap' : `Bộ ${variant + 1}`}
                </span>
              </button>

              {/* Layout toggle */}
              <div className="hidden rounded-xl border border-line bg-surface-2 p-0.5 sm:flex">
                <button
                  onClick={() => setLayout('grid')}
                  aria-label="Lưới"
                  className={`rounded-[9px] p-1.5 transition-colors ${
                    layout === 'grid'
                      ? 'bg-surface text-accent shadow-xs'
                      : 'text-fg-muted hover:text-fg'
                  }`}
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setLayout('list')}
                  aria-label="Danh sách"
                  className={`rounded-[9px] p-1.5 transition-colors ${
                    layout === 'list'
                      ? 'bg-surface text-accent shadow-xs'
                      : 'text-fg-muted hover:text-fg'
                  }`}
                >
                  <Rows3 size={14} />
                </button>
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggle}
                aria-label="Đổi giao diện sáng/tối"
                className="rounded-xl border border-line bg-surface-2 p-2 text-fg-muted transition-all hover:border-line-strong hover:text-accent active:scale-95"
              >
                {mounted && theme === 'dark' ? (
                  <Sun size={15} />
                ) : (
                  <Moon size={15} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* Hero / stats                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            {/* Left: headline */}
            <div className="animate-fade-up max-w-xl">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-fg-muted">
                <Zap size={11} className="text-amber-500" />
                {dateKey} · {CATEGORIES.length} danh mục
              </div>

              <h2 className="font-display text-3xl font-black leading-[1.15] tracking-tight text-fg sm:text-[2.6rem]">
                Caption ngắn,{' '}
                <span className="text-gradient">bắt trend</span>
              </h2>

              <p className="mt-2.5 text-[13.5px] leading-relaxed text-fg-muted">
                Mỗi caption chỉ 1 dòng — đúng chuẩn đang chạy trên Instagram
                và TikTok. 3 Slovak + 2 English cho mỗi danh mục, không trùng
                trong 30 ngày, kèm trending word và bản dịch tiếng Việt.
              </p>

              {/* Action buttons */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopyAll}
                  disabled={totalCaptions === 0}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2.5 text-[12.5px] font-bold text-white shadow-card transition-all hover:shadow-float active:scale-95 disabled:opacity-40"
                >
                  <Copy size={14} />
                  Copy tất cả ({totalCaptions})
                </button>

                <button
                  onClick={handleDownload}
                  disabled={totalCaptions === 0}
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-[12.5px] font-bold text-fg-muted shadow-xs transition-all hover:border-line-strong hover:text-fg active:scale-95 disabled:opacity-40"
                >
                  <Download size={14} />
                  Tải .txt
                </button>

                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-[12.5px] font-bold text-fg-muted shadow-xs transition-all hover:border-amber-500/40 hover:text-amber-600 active:scale-95"
                >
                  <RefreshCw size={14} />
                  Reset lịch sử
                </button>
              </div>
            </div>

            {/* Right: stat cards */}
            <div className="grid shrink-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[26rem]">
              <StatCard
                icon={<Zap size={14} />}
                label="Caption hôm nay"
                value={totalCaptions.toString()}
                tone="pink"
              />
              <StatCard
                icon={<TrendingUp size={14} />}
                label="Chủ đề trending"
                value={CATEGORIES.length * 3 + '+'}
                tone="amber"
              />
              <StatCard
                icon={<Shuffle size={14} />}
                label="Không lặp trong"
                value="30 ngày"
                tone="violet"
              />
              <StatCard
                icon={<LayoutGrid size={14} />}
                label="Danh mục"
                value={CATEGORIES.length.toString()}
                tone="sky"
              />
              <StatCard
                icon={<Calendar size={14} />}
                label="Chu kỳ pool"
                value="365+ ngày"
                tone="emerald"
              />
              <StatCard
                icon={<RefreshCw size={14} />}
                label="Cập nhật"
                value="9:00 hằng ngày"
                tone="slate"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Content                                                         */}
      {/* ---------------------------------------------------------------- */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-2xl border border-line bg-surface"
              >
                <div className="skeleton h-full w-full rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 gap-5 ${
              layout === 'grid' ? 'lg:grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {CATEGORIES.map((category, i) => (
              <div
                key={category.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <CategorySection
                  category={category}
                  captions={byCategory[category.id] ?? []}
                  onReorder={handleReorder}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-6 border-t border-line bg-surface/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-7 text-center sm:px-6 sm:flex-row sm:justify-between sm:text-left">
          <p className="text-[11.5px] text-fg-subtle">
            © {new Date().getFullYear()} CapDaily · Sinh tự động, không lặp lại trong 30 ngày
          </p>
          <div className="flex items-center gap-3 text-[11.5px] text-fg-subtle">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Hệ thống hoạt động
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">
              Dịch tiếng Việt chỉ để đọc, không copy
            </span>
          </div>
        </div>
      </footer>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat card                                                            */
/* ------------------------------------------------------------------ */

const toneMap: Record<
  string,
  { grad: string; iconCls: string; ring: string }
> = {
  pink: {
    grad: 'from-pink-500/12 to-pink-500/0',
    iconCls: 'bg-pink-500/12 text-pink-600 dark:text-pink-300',
    ring: 'ring-pink-500/20',
  },
  amber: {
    grad: 'from-amber-500/12 to-amber-500/0',
    iconCls: 'bg-amber-500/12 text-amber-600 dark:text-amber-300',
    ring: 'ring-amber-500/20',
  },
  violet: {
    grad: 'from-violet-500/12 to-violet-500/0',
    iconCls: 'bg-violet-500/12 text-violet-600 dark:text-violet-300',
    ring: 'ring-violet-500/20',
  },
  sky: {
    grad: 'from-sky-500/12 to-sky-500/0',
    iconCls: 'bg-sky-500/12 text-sky-600 dark:text-sky-300',
    ring: 'ring-sky-500/20',
  },
  emerald: {
    grad: 'from-emerald-500/12 to-emerald-500/0',
    iconCls: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-300',
    ring: 'ring-emerald-500/20',
  },
  slate: {
    grad: 'from-slate-500/12 to-slate-500/0',
    iconCls: 'bg-slate-500/12 text-slate-600 dark:text-slate-300',
    ring: 'ring-slate-500/20',
  },
};

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: string;
}) {
  const t = toneMap[tone] ?? toneMap.pink;
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-line bg-surface p-3 shadow-xs ring-1 ring-transparent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft hover:ring-1 ${t.ring}`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${t.grad} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
        aria-hidden
      />
      <div className="relative">
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${t.iconCls}`}
        >
          {icon}
        </span>
        <p className="mt-2 text-[15px] font-black leading-none tracking-tight text-fg">
          {value}
        </p>
        <p className="mt-1 text-[10.5px] font-medium text-fg-subtle">{label}</p>
      </div>
    </div>
  );
}
