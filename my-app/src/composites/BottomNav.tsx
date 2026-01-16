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
      className="fixed right-4 bottom-5 left-4 z-40 rounded-2xl border border-gray-700/50 bg-gray-800/90 shadow-2xl backdrop-blur-xl md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="safe-area-inset-bottom flex items-center justify-between px-3 py-2">
        {/* Add Transaction Button - Prominent with warm gradient */}
        <Link
          href="/edit"
          className="from-primary-500 to-accent-500 shadow-primary-glow flex size-14 items-center justify-center rounded-full bg-linear-to-r text-white transition-all duration-200 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] active:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          aria-label="新增帳目"
          scroll={false}
        >
          <IoMdAdd className="size-7" />
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-1 items-center justify-around gap-1">
          {Object.keys(MENU_CONFIG).map((route) => {
            const isActive = pathname === route;
            return (
              <Link
                key={route}
                href={route}
                className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary-400 bg-primary-900/30 shadow-primary-glow'
                    : 'hover:text-primary-400 active:text-primary-300 text-gray-400 hover:bg-gray-700'
                }`}
                aria-label={MENU_CONFIG[route]}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="flex items-center justify-center">
                  {ROUTE_ICON[route]}
                </span>
                <span className="text-[10px] font-semibold">
                  {MENU_CONFIG[route]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
