'use client';

import { PAGE_TITLE } from '@/utils/constants';
import { usePathname } from 'next/navigation';

export const RouteTitle = () => {
  const pathName = usePathname();

  return (
    <div className="flex items-center text-center text-lg font-semibold">
      <h1 className="text-primary-700">{PAGE_TITLE[pathName]}</h1>
    </div>
  );
};
