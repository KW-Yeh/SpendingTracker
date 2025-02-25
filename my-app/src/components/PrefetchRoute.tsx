'use client';

import { usePrefetchRoute } from '@/hooks/usePrefetchRoute';

export const PrefetchRoute = () => {
  usePrefetchRoute('/edit');
  usePrefetchRoute('/list');
  usePrefetchRoute('/group');
  return null;
};
