'use client';

import { usePrefetchRoute } from '@/hooks/usePrefetchRoute';

export const PrefetchRoute = () => {
  usePrefetchRoute('/edit');
  usePrefetchRoute('/analysis');
  usePrefetchRoute('/group');
  return null;
};
