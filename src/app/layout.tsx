import type { Metadata, Viewport } from 'next';
import { VT323, Press_Start_2P } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import ServiceWorkerRegister from './sw-register';

const vt323 = VT323({ weight: '400', subsets: ['latin'], variable: '--font-vt323', display: 'swap' });
const pressStart = Press_Start_2P({ weight: '400', subsets: ['latin'], variable: '--font-press-start', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://snowcraft.vercel.app'),
  title: 'SnowCraft (Fan Remake) | Free Browser Snowball Fight Game',
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
    title: 'SnowCraft (Fan Remake) | Free Browser Snowball Fight Game',
    description: 'Play SnowCraft, a free 3v3 snowball fight game in your browser. 10 levels of tactical snowball combat, no download required.',
    url: 'https://snowcraft.vercel.app',
    type: 'website',
    siteName: 'SnowCraft',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SnowCraft (Fan Remake) | Free Browser Snowball Fight Game',
    description: 'Play SnowCraft, a free 3v3 snowball fight game in your browser. 10 levels of tactical snowball combat, no download required.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://snowcraft.vercel.app',
  },
};

const videoGameJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'SnowCraft (Fan Remake)',
  alternateName: 'SnowCraft',
  description:
    'A free browser based 3v3 snowball fight game. Clean room fan remake of the 2001 Nicholson NY original.',
  genre: ['Strategy', 'Action', 'Casual'],
  gamePlatform: ['Web Browser'],
  applicationCategory: 'Game',
  operatingSystem: 'Any',
  inLanguage: 'en',
  screenshot: 'https://snowcraft.vercel.app/opengraph-image',
  url: 'https://snowcraft.vercel.app/',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  author: {
    '@type': 'Person',
    name: 'Matthew McKenzie',
    url: 'https://matthewrmckenzie.com',
  },
  isBasedOn: {
    '@type': 'VideoGame',
    name: 'SnowCraft',
    datePublished: '2001',
    author: { '@type': 'Organization', name: 'Nicholson NY' },
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Where can I play SnowCraft?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can play SnowCraft in any modern browser at https://snowcraft.vercel.app. No download and no account required.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this the original SnowCraft?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. This is an unofficial fan remake of the 2001 SnowCraft by Nicholson NY. All art, code, and audio are original clean room work. The original Flash game stopped working after Flash was deprecated in 2020.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I play?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Control three red team units. Throw snowballs by clicking or tapping opponents. Knock out all three green team units to clear the level. Ten levels in all with escalating difficulty.',
      },
    },
    {
      '@type': 'Question',
      name: 'What browsers are supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Any modern browser with HTML5 canvas support. Chrome, Firefox, Safari, and Edge are all tested on desktop and mobile.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. No ads, no account, no microtransactions. This is a non commercial fan project.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it work on mobile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Mobile controls use tap to aim and throw plus an on screen joystick for movement.',
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <ServiceWorkerRegister />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
