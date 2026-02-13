import type { Metadata, Viewport } from 'next';
import './globals.css';
import ServiceWorkerRegister from './sw-register';

export const metadata: Metadata = {
  title: 'SnowCraft - Fan Remake',
  description: 'A clean-room fan remake of SnowCraft (2001) by Nicholson NY. 3v3 snowball fight action in your browser!',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#87CEEB',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-sky-100 overflow-hidden w-screen h-screen">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
