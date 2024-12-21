'use client';

import { Account } from '@/composites/Account';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { CoinIcon } from '@/components/icons/CoinIcon';
import { HomeIcon } from '@/components/icons/HomeIcon';
import { ListIcon } from '@/components/icons/ListIcon';
import { MenuIcon } from '@/components/icons/MenuIcon';
import { SettingIcon } from '@/components/icons/SettingIcon';
import useFocusRef from '@/hooks/useFocusRef';
import { ROUTE_TITLE } from '@/utils/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useRef } from 'react';

export const MenuButton = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const asideRef = useFocusRef<HTMLElement>(() => {
    handleCloseAside();
  });

  function handleCloseAside() {
    requestAnimationFrame(() => {
      if (!asideRef.current || !bgRef.current) return;
      asideRef.current.style.left = '-240px';
      bgRef.current.style.right = '100%';
    });
  }

  function handleOpenAside() {
    requestAnimationFrame(() => {
      if (!asideRef.current || !bgRef.current) return;
      asideRef.current.style.left = '0';
      bgRef.current.style.right = '0';
    });
  }

  return (
    <>
      <button
        onClick={handleOpenAside}
        className="size-8 rounded-full p-1 transition-colors hover:bg-primary-100"
      >
        <MenuIcon className="size-full" />
      </button>
      <div
        ref={bgRef}
        className="fixed bottom-0 left-0 right-full top-0 bg-black/50"
      ></div>
      <aside
        ref={asideRef}
        className="fixed -left-60 bottom-0 top-0 z-30 flex w-60 origin-right flex-col items-center justify-between bg-background p-4 shadow-xl transition-all sm:p-6"
      >
        <div className="mb-6 flex w-full items-center">
          <button
            onClick={handleCloseAside}
            className="size-8 rounded-full p-2 transition-colors hover:bg-gray-300"
          >
            <CloseIcon className="size-full" />
          </button>
        </div>
        <Account />
        <div className="flex w-full flex-1 flex-col items-center gap-2">
          {Object.keys(ROUTE_TITLE).map((path) => (
            <RouteButton
              key={path}
              href={path}
              label={ROUTE_TITLE[path]}
              onClick={handleCloseAside}
            />
          ))}
        </div>
        <button className="flex w-full items-center rounded-md bg-gray-200 px-6 py-3 text-left text-sm font-semibold transition-colors hover:bg-gray-300 sm:text-base">
          <SettingIcon className="mr-3 size-5" />
          設定
        </button>
      </aside>
    </>
  );
};

const ROUTE_ICON: Record<string, ReactNode> = {
  '/': <HomeIcon className="mr-3 size-5" />,
  '/list': <ListIcon className="mr-3 size-5" />,
  '/budget': <CoinIcon className="mr-3 size-5" />,
};

const RouteButton = ({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) => {
  const pathName = usePathname();
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex w-full items-center rounded-md px-6 py-3 text-left text-sm font-semibold transition-colors sm:text-base ${pathName === href ? 'bg-primary-100' : 'hover:bg-primary-300'}`}
    >
      {ROUTE_ICON[href]}
      {label}
    </Link>
  );
};
