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
      className="fixed right-4 bottom-5 left-4 z-50 rounded-full bg-white/50 shadow-[0_-2px_16px_rgba(0,0,0,0.1)] backdrop-blur-md md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="safe-area-inset-bottom flex items-center justify-around px-2 py-2">
        {Object.keys(MENU_CONFIG).map((route) => {
          const isActive = pathname === route;
          return (
            <Link
              key={route}
              href={route}
              className={`flex size-12 flex-col items-center justify-center gap-1 rounded-full transition-colors duration-200 hover:bg-white/50 ${
                isActive
                  ? 'text-primary-500'
                  : 'active:text-primary-400 text-gray-500 hover:text-gray-700'
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
