'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const usePrefetchRoute = (route: string) => {
  const router = useRouter();
  useEffect(() => {
    router.prefetch(route);
  }, [router, route]);
};
