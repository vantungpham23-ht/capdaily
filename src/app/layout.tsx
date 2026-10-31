import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CapDaily | Každodenné Captiony',
  description:
    'Sinh caption tự động mỗi ngày cho nails, tóc nam, tóc nữ, nhà hàng và mihalnice. 3 Slovak + 2 English caption, không trùng lặp trong 30 ngày.',
  keywords: [
    'caption',
    'daily captions',
    'instagram captions',
    'tiktok captions',
    'nails',
    'hair',
    'restaurant',
    'eyelash',
    'hashtags',
  ],
  authors: [{ name: 'CapDaily' }],
  openGraph: {
    title: 'CapDaily | Každodenné Captiony',
    description:
      'Caption mới mỗi ngày, không lặp lại trong 30 ngày. Kèm trending topic và bản dịch tiếng Việt.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CapDaily | Každodenné Captiony',
    description:
      'Caption mới mỗi ngày, không lặp lại trong 30 ngày.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f7fb' },
    { media: '(prefers-color-scheme: dark)', color: '#080b14' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jakarta.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
