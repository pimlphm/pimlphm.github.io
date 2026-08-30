import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://pimlphm.github.io'),
  title: 'Weikun Deng 邓炜坤 | Academic Homepage',
  description:
    'Academic homepage of Weikun Deng, Assistant Professor in Intelligent Manufacturing and Systems Engineering.',
  authors: [{ name: 'Weikun Deng' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Weikun Deng | Academic Homepage',
    description: 'Research in intelligent manufacturing, condition monitoring and engineering systems.',
    images: [{ url: '/og.jpg', width: 1200, height: 686, alt: 'Weikun Deng — Academic Homepage.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weikun Deng | Academic Homepage',
    description: 'Research in intelligent manufacturing, condition monitoring and engineering systems.',
    images: ['/og.jpg'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
