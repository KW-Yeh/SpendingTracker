'use client';

import { useRouter } from 'next/navigation';

export const usePrefetchRoutes = () => {
  const router = useRouter();
  router.prefetch('/edit/[id]');
  router.prefetch('/list');
  router.prefetch('/group');
  router.prefetch('/setting');
  router.prefetch('/budget');
  router.prefetch('/choose');
};
