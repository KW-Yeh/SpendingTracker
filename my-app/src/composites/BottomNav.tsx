'use client';

import { CoinIcon } from '@/components/icons/CoinIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { HomeIcon } from '@/components/icons/HomeIcon';
import { ListIcon } from '@/components/icons/ListIcon';
import { PeopleIcon } from '@/components/icons/PeopleIcon';
import { MENU_CONFIG } from '@/utils/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const ROUTE_ICON: Record<string, ReactNode> = {
  '/': <HomeIcon className="size-4" />,
  '/transactions': <EditIcon className="size-4" />,
  '/group': <PeopleIcon className="size-4" />,
  '/analysis': <ListIcon className="size-4" />,
  '/budget': <CoinIcon className="size-4" />,
};

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav
      className="fixed rounded-full bottom-1 left-1 right-1 z-50 md:hidden bg-white/50 backdrop-blur-md shadow-[0_-2px_16px_rgba(0,0,0,0.1)]"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {Object.keys(MENU_CONFIG).map((route) => {
          const isActive = pathname === route;
          return (
            <Link
              key={route}
              href={route}
              className={`flex flex-col items-center hover:bg-white/50 justify-center gap-1 size-12 rounded-full transition-colors duration-200 ${
                isActive
                  ? 'text-primary-500'
                  : 'text-gray-500 hover:text-gray-700 active:text-primary-400'
              }`}
              aria-label={MENU_CONFIG[route]}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="flex items-center justify-center">
                {ROUTE_ICON[route]}
              </span>
              <span className="text-xs font-medium">{MENU_CONFIG[route]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
