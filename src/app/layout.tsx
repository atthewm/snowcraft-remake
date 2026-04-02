import type { Metadata, Viewport } from 'next';
import { VT323, Press_Start_2P } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import ServiceWorkerRegister from './sw-register';

const vt323 = VT323({ weight: '400', subsets: ['latin'], variable: '--font-vt323', display: 'swap' });
const pressStart = Press_Start_2P({ weight: '400', subsets: ['latin'], variable: '--font-press-start', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://snowcraft.vercel.app'),
  title: 'SnowCraft | Free Browser Snowball Fight Game',
  description: 'Play SnowCraft, a free 3v3 snowball fight game in your browser. A clean room fan remake of the 2001 classic by Nicholson NY. 10 levels, no download required.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/icons/icon-192.png',
  },
  keywords: ['snowcraft', 'snowball fight', 'browser game', 'free game', 'fan remake', 'strategy game', 'HTML5 game'],
  openGraph: {
    title: 'SnowCraft | Free Browser Snowball Fight Game',
    description: 'Play SnowCraft, a free 3v3 snowball fight game in your browser. 10 levels of tactical snowball combat, no download required.',
    url: 'https://snowcraft.vercel.app',
    type: 'website',
    siteName: 'SnowCraft',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SnowCraft | Free Browser Snowball Fight Game',
    description: 'Play SnowCraft, a free 3v3 snowball fight game in your browser. 10 levels of tactical snowball combat.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#87CEEB',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${vt323.variable} ${pressStart.variable}`}>
      <body className="bg-sky-100 overflow-hidden w-screen h-screen">
        <ServiceWorkerRegister />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
