'use client';

import { BarChartIcon } from '@/components/icons/BarChartIcon';
import { BookIcon } from '@/components/icons/BookIcon';
import { CoinIcon } from '@/components/icons/CoinIcon';
import { HomeIcon } from '@/components/icons/HomeIcon';
import { ListTaskIcon } from '@/components/icons/ListTaskIcon';
import { SettingIcon } from '@/components/icons/SettingIcon';
import { UserAvatar } from '@/components/UserAvatar';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import useFocusRef from '@/hooks/useFocusRef';
import { MENU_CONFIG } from '@/utils/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ReactNode,
  startTransition,
  useCallback,
  useEffect,
  useRef,
} from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AsideMenu = (props: Props) => {
  const { isOpen, onClose } = props;
  const { config: user } = useUserConfigCtx();
  const bgRef = useRef<HTMLDivElement>(null);
  const asideRef = useFocusRef<HTMLElement>(() => {
    onClose();
    close();
  });

  const close = useCallback(() => {
    startTransition(() => {
      if (!bgRef.current || !asideRef.current) return;
      bgRef.current.style.right = '100%';
      asideRef.current.style.left = '-300px';
    });
  }, [asideRef]);

  const open = useCallback(() => {
    startTransition(() => {
      if (!bgRef.current || !asideRef.current) return;
      bgRef.current.style.right = '0';
      asideRef.current.style.left = '0';
    });
  }, [asideRef]);

  useEffect(() => {
    if (isOpen) {
      open();
    } else {
      close();
    }
  }, [close, isOpen, open]);

  return (
    <>
      <div
        ref={bgRef}
        className="fixed top-0 right-full bottom-0 left-0 z-50 bg-black/50 max-md:hidden"
      ></div>
      <aside
        ref={asideRef}
        className="fixed top-0 bottom-0 -left-72 z-50 flex w-72 origin-right flex-col items-center justify-between border-r border-gray-700 bg-gray-800 shadow-2xl transition-all max-md:hidden"
      >
        <div className="gradient-glow clip-profile-bg absolute h-30 w-full"></div>
        <div className="relative flex w-full flex-col items-center pt-17">
          <Link
            href="/profile"
            onClick={onClose}
            className="hover:ring-primary-500 active:ring-primary-600 flex size-20 items-center justify-center rounded-full bg-gray-700 p-1 shadow-xl ring-4 ring-gray-600 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            <UserAvatar user={user} />
          </Link>
        </div>
        <div className="mt-4 flex w-full flex-col items-center px-4">
          <h3
            className="max-w-70 overflow-hidden text-base font-bold text-ellipsis whitespace-nowrap text-gray-100"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {user ? user.name : '尚未登入'}
          </h3>
          <p className="max-w-70 overflow-hidden text-xs text-ellipsis whitespace-nowrap text-gray-400">
            {user ? user.email : '尚未登入'}
          </p>
        </div>
        <div className="flex h-px w-full items-center px-4 py-5">
          <span className="h-px w-full bg-linear-to-r from-transparent via-gray-600 to-transparent"></span>
        </div>
        <div className="flex w-full flex-1 flex-col items-center gap-1 px-4">
          {Object.keys(MENU_CONFIG).map((path) => (
            <MenuButton
              key={path}
              href={path}
              label={MENU_CONFIG[path]}
              onClick={onClose}
            />
          ))}
        </div>
        <div className="w-full border-t border-solid border-gray-700 px-4 py-2">
          <MenuButton
            href="/setting"
            onClick={onClose}
            label="設定"
            icon={<SettingIcon className="mr-3 size-5 sm:mr-4" />}
          />
        </div>
      </aside>

      <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="clip-profile-bg" clipPathUnits="userSpaceOnUse">
            <path d="M 0,0 L 288,0 L 288,120 L 194,120 A 10,10 0,0,1 184,110 A 40,40 0,0,0 104,110 A 10,10 0,0,1 94,120 L 0,120 L 0,0 Z" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};

const ROUTE_ICON: Record<string, ReactNode> = {
  '/': <HomeIcon className="mr-3 size-4 sm:mr-4" />,
  '/transactions': <ListTaskIcon className="mr-3 size-4 sm:mr-4" />,
  '/analysis': <BarChartIcon className="mr-3 size-4 sm:mr-4" />,
  '/budget': <CoinIcon className="mr-3 size-4 sm:mr-4" />,
  '/group': <BookIcon className="mr-3 size-4 sm:mr-4" />,
};

const MenuButton = ({
  href,
  icon,
  label,
  onClick,
}: {
  href?: string;
  icon?: ReactNode;
  label: string;
  onClick: () => void;
}) => {
  const pathName = usePathname();
  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`flex min-h-11 w-full cursor-pointer items-center rounded-xl px-5 py-3 text-left text-sm font-semibold transition-all duration-200 sm:text-base ${pathName === href ? 'bg-primary-900/30 text-primary-400 shadow-primary-glow' : 'hover:text-primary-400 text-gray-300 hover:bg-gray-700 active:bg-gray-600'}`}
      >
        {icon ?? ROUTE_ICON[href]}
        {label}
      </Link>
    );
  }
  return (
    <button
      onClick={onClick}
      className="hover:text-primary-400 flex min-h-11 w-full cursor-pointer items-center rounded-xl px-5 py-3 text-left text-sm font-semibold text-gray-300 transition-all duration-200 hover:bg-gray-700 active:bg-gray-600 sm:text-base"
    >
      {icon}
      {label}
    </button>
  );
};
