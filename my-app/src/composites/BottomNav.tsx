'use client';

import { BarChartIcon } from '@/components/icons/BarChartIcon';
import { CoinIcon } from '@/components/icons/CoinIcon';
import { HomeIcon } from '@/components/icons/HomeIcon';
import { ListTaskIcon } from '@/components/icons/ListTaskIcon';
import { MENU_CONFIG } from '@/utils/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { IoMdAdd } from 'react-icons/io';

const ROUTE_ICON: Record<string, ReactNode> = {
  '/': <HomeIcon className="size-5" />,
  '/transactions': <ListTaskIcon className="size-5" />,
  '/analysis': <BarChartIcon className="size-5" />,
  '/budget': <CoinIcon className="size-5" />,
};

// "2 + FAB + 2" — /group lives in the AsideMenu drawer
const LEFT_ROUTES = ['/', '/transactions'];
const RIGHT_ROUTES = ['/analysis', '/budget'];

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-40 border-t border-black/[0.08] md:hidden"
      style={{
        backgroundColor: 'rgba(245, 245, 247, 0.8)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      }}
      aria-label="Mobile navigation"
    >
      <div className="safe-area-inset-bottom relative mx-auto grid max-w-md grid-cols-5 items-center px-2 pt-1.5 pb-2">
        {LEFT_ROUTES.map((route) => (
          <NavItem key={route} route={route} isActive={pathname === route} />
        ))}

        {/* Centered FAB */}
        <div className="flex items-center justify-center">
          <Link
            href="/edit"
            className="flex size-14 -translate-y-3 items-center justify-center rounded-full text-white transition-transform duration-150 active:scale-95"
            style={{
              background: 'var(--color-primary-500)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
            }}
            aria-label="新增帳目"
            scroll={false}
          >
            <IoMdAdd className="size-7" />
          </Link>
        </div>

        {RIGHT_ROUTES.map((route) => (
          <NavItem key={route} route={route} isActive={pathname === route} />
        ))}
      </div>
    </nav>
  );
};

const NavItem = ({ route, isActive }: { route: string; isActive: boolean }) => (
  <Link
    href={route}
    className={`relative flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl py-1 transition-colors ${
      isActive ? 'text-primary-500' : 'text-gray-500 hover:text-gray-300'
    }`}
    aria-label={MENU_CONFIG[route]}
    aria-current={isActive ? 'page' : undefined}
  >
    {/* Active dot above icon */}
    <span
      aria-hidden
      className={`absolute top-0 h-1 w-6 rounded-full transition-opacity ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ backgroundColor: 'var(--color-primary-500)' }}
    />
    {ROUTE_ICON[route]}
    <span className="text-[10px] font-semibold">{MENU_CONFIG[route]}</span>
  </Link>
);
