// Lightweight analytics event tracking via Vercel Analytics
export function trackEvent(name: string, properties?: Record<string, string | number>): void {
  try {
    // Vercel Analytics track function (injected by @vercel/analytics)
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('event', { name, ...properties });
    }
  } catch {
    // Silently ignore analytics errors
  }
}
