'use client';

import { useEffect, useState } from 'react';
import scholarData from '../data/scholar.json';
import { canUseScholarSnapshot } from '../lib/scholar-snapshot.mjs';

type Snapshot = {
  profile: typeof scholarData.profile;
  works: Record<string, { citations: number; href: string }>;
  refresh?: { attemptedAt: string; outcome: string };
};

export function useScholar() {
  const [snapshot, setSnapshot] = useState<Snapshot>(scholarData);

  useEffect(() => {
    let disposed = false;
    let request: AbortController | undefined;
    const refresh = async () => {
      if (document.visibilityState === 'hidden' || request) return;
      request = new AbortController();
      const timeout = window.setTimeout(() => request?.abort(), 10000);
      try {
        const response = await fetch(`/data/scholar.json?t=${Date.now()}`, { cache: 'no-store', signal: request.signal });
        if (!response.ok) return;
        const next: unknown = await response.json();
        if (!disposed) setSnapshot((current) => canUseScholarSnapshot(next, current) ? next as Snapshot : current);
      } catch {
        // The bundled verified snapshot remains available when the data request fails.
      } finally {
        window.clearTimeout(timeout);
        request = undefined;
      }
    };
    void refresh();
    document.addEventListener('visibilitychange', refresh);
    const interval = window.setInterval(refresh, 5 * 60 * 1000);
    return () => {
      disposed = true;
      request?.abort();
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  return snapshot;
}
