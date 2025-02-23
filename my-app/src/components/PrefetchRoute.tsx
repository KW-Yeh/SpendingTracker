'use client';

import { usePrefetchRoute } from '@/hooks/usePrefetchRoute';

export const PrefetchRoute = () => {
  usePrefetchRoute('/edit');
  return null;
};
