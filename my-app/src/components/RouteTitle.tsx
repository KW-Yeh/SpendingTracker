'use client';

import { PAGE_TITLE } from '@/utils/constants';
import { usePathname } from 'next/navigation';

export const RouteTitle = () => {
  const pathName = usePathname();
  return (
    <h1 className="text-lg font-bold sm:text-xl">{PAGE_TITLE[pathName]}</h1>
  );
};
