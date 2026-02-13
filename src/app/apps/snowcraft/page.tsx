'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import SnowcraftApp from '@/components/SnowcraftApp';

function SnowcraftPage() {
  const searchParams = useSearchParams();
  const hideChrome = searchParams.get('hideChrome') === 'true';
  const embedded = searchParams.get('embedded') === 'true';

  return (
    <SnowcraftApp
      mode={embedded ? 'embedded' : 'standalone'}
      hideChrome={hideChrome}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="w-screen h-screen bg-sky-100 flex items-center justify-center text-gray-500" style={{ fontFamily: 'VT323, monospace' }}>Loading SnowCraft...</div>}>
      <SnowcraftPage />
    </Suspense>
  );
}
