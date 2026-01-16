'use client';

import { BarChartIcon } from '@/components/icons/BarChartIcon';
import { BookIcon } from '@/components/icons/BookIcon';
import { CoinIcon } from '@/components/icons/CoinIcon';
import { HomeIcon } from '@/components/icons/HomeIcon';
import { ListTaskIcon } from '@/components/icons/ListTaskIcon';
import { MENU_CONFIG } from '@/utils/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { IoMdAdd } from 'react-icons/io';

const ROUTE_ICON: Record<string, ReactNode> = {
  '/': <HomeIcon className="size-4" />,
  '/transactions': <ListTaskIcon className="size-4" />,
  '/group': <BookIcon className="size-4" />,
  '/analysis': <BarChartIcon className="size-4" />,
  '/budget': <CoinIcon className="size-4" />,
};

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav
      className="fixed right-4 bottom-5 left-4 z-40 rounded-2xl bg-white/90 shadow-xl backdrop-blur-xl border border-gray-200/50 md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="safe-area-inset-bottom flex items-center justify-between px-3 py-2">
        {/* Add Transaction Button - Prominent with warm gradient */}
        <Link
          href="/edit"
          className="bg-linear-to-r from-primary-500 to-accent-500 text-white flex size-14 items-center justify-center rounded-full shadow-warm-lg transition-all duration-200 hover:shadow-2xl hover:scale-105 active:scale-95"
          aria-label="新增帳目"
          scroll={false}
        >
          <IoMdAdd className="size-7" />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center justify-around gap-1 flex-1">
          {Object.keys(MENU_CONFIG).map((route) => {
            const isActive = pathname === route;
            return (
              <Link
                key={route}
                href={route}
                className={`flex min-w-[44px] min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-300 hover:text-primary-600 hover:bg-primary-50/50 active:text-primary-700'
                }`}
                aria-label={MENU_CONFIG[route]}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="flex items-center justify-center">
                  {ROUTE_ICON[route]}
                </span>
                <span className="text-[10px] font-semibold">{MENU_CONFIG[route]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
