import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Každodenné Captiony | Daily Captions Generator',
  description: 'Generujte 5 captionov denne pre nails, vlasy, reštaurácie a mihalnice. 3 slovenské + 2 anglické captiony.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk">
      <body className="antialiased">{children}</body>
    </html>
  );
}
