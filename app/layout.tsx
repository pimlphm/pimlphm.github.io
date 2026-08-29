import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://pimlphm.github.io'),
  title: 'Weikun Deng 邓炜坤 | Engineering Intelligence',
  description:
    'Academic homepage of Weikun Deng — physics-informed machine learning, diagnostics, prognostics and intelligent maintenance.',
  authors: [{ name: 'Weikun Deng' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Weikun Deng | Engineering Intelligence',
    description: 'Physics-informed machine learning for diagnostics, prognostics and intelligent maintenance.',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Weikun Deng — Engineering intelligence, grounded in physics.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weikun Deng | Engineering Intelligence',
    description: 'Physics-informed machine learning for diagnostics, prognostics and intelligent maintenance.',
    images: ['/og.jpg'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
