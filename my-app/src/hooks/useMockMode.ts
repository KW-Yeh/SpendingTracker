'use client';

import { isMockRequest } from '@/utils/mockMode';
import { useEffect, useState } from 'react';

/**
 * Resolved after mount so the server render and the first client render agree
 * (the query string is not available during SSR of a static route).
 */
export const useMockMode = () => {
  const [mockMode, setMockMode] = useState(false);

  useEffect(() => {
    setMockMode(isMockRequest());
  }, []);

  return mockMode;
};
