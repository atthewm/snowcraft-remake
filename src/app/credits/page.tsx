import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About and Credits',
  description:
    'SnowCraft (Fan Remake) is an unofficial fan project built from scratch. Original SnowCraft released in 2001 by Nicholson NY. Art, code, and audio in this remake are original clean room work.',
  alternates: { canonical: 'https://snowcraft.vercel.app/credits' },
  openGraph: {
    title: 'SnowCraft (Fan Remake) | About and Credits',
    description:
      'Unofficial fan remake of the 2001 SnowCraft by Nicholson NY. All assets original, non commercial, independent project.',
    type: 'article',
    url: 'https://snowcraft.vercel.app/credits',
  },
};

const videoGameSchema = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'SnowCraft (Fan Remake)',
  alternateName: 'SnowCraft',
  description:
    'A free browser based 3v3 snowball fight game. Clean room fan remake of the 2001 Nicholson NY original. No download, no ads, no account.',
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
  publisher: {
    '@type': 'Person',
    name: 'Matthew McKenzie',
    url: 'https://matthewrmckenzie.com',
  },
  isBasedOn: {
    '@type': 'VideoGame',
    name: 'SnowCraft',
    datePublished: '2001',
    author: {
      '@type': 'Organization',
      name: 'Nicholson NY',
    },
  },
};

export default function CreditsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-white py-16 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameSchema) }}
      />
      <div className="mx-auto max-w-2xl space-y-8 text-gray-800">
        <header>
          <h1 className="text-4xl font-bold">About SnowCraft (Fan Remake)</h1>
          <p className="mt-3 text-lg text-gray-600">
            An unofficial fan project. Free to play, no download, no account.
          </p>
        </header>

        <section className="rounded-xl bg-sky-50 p-6">
          <h2 className="text-2xl font-semibold">Original game</h2>
          <p className="mt-2">
            SnowCraft was released in 2001 by Nicholson NY as a holiday Flash
            mini game. It spread virally for years until Flash was deprecated in
            2020 and the original playable URL stopped working. This remake
            brings the format (3v3 snowball combat, 10 levels) to modern
            browsers.
          </p>
          <p className="mt-2">
            Original developer and publisher: Nicholson NY.
          </p>
          <p className="mt-2">
            Source record:{' '}
            <a
              href="https://www.myabandonware.com/game/snowcraft-du6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              myabandonware.com/game/snowcraft-du6
            </a>
          </p>
        </section>

        <section className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-6">
          <h2 className="text-2xl font-semibold">Fan project posture</h2>
          <p className="mt-2 text-amber-900">
            This is an unofficial fan remake. It is not affiliated with,
            endorsed by, or sponsored by Nicholson NY. All art, code, and audio
            in this remake are original clean room work produced in 2025 and
            2026. No assets are lifted from the original. If the rights holder
            to the original SnowCraft objects to this project, contact the
            maintainer and it will be resolved.
          </p>
        </section>

        <section className="rounded-xl bg-gray-50 p-6">
          <h2 className="text-2xl font-semibold">Remake credits</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Fan remake by Matthew McKenzie</li>
            <li>Engine: HTML5 Canvas + Next.js</li>
            <li>Audio: procedurally generated via Web Audio API, no sampled assets</li>
            <li>Graphics: procedural, no imported sprites</li>
          </ul>
          <p className="mt-3 text-sm text-gray-600">
            Source is public on GitHub:{' '}
            <a
              href="https://github.com/atthewm/snowcraft-remake"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              github.com/atthewm/snowcraft-remake
            </a>
          </p>
        </section>

        <div>
          <Link
            href="/"
            className="inline-block rounded-lg bg-sky-600 px-6 py-3 text-white font-semibold hover:bg-sky-700 transition-colors"
          >
            Play SnowCraft
          </Link>
        </div>
      </div>
    </main>
  );
}
