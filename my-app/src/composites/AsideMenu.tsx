'use client';

import { CloseIcon } from '@/components/icons/CloseIcon';
import { CoinIcon } from '@/components/icons/CoinIcon';
import { EnterIcon } from '@/components/icons/EnterIcon';
import { HomeIcon } from '@/components/icons/HomeIcon';
import { LeaveIcon } from '@/components/icons/LeaveIcon';
import { ListIcon } from '@/components/icons/ListIcon';
import { SettingIcon } from '@/components/icons/SettingIcon';
import { Account } from '@/composites/Account';
import useFocusRef from '@/hooks/useFocusRef';
import { MENU_CONFIG } from '@/utils/constants';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useRef } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AsideMenu = (props: Props) => {
  const { isOpen, onClose } = props;
  const { data: session } = useSession();
  const bgRef = useRef<HTMLDivElement>(null);
  const asideRef = useFocusRef<HTMLElement>(() => {
    onClose();
    close();
  });

  useEffect(() => {
    if (isOpen) {
      open();
    } else {
      close();
    }
  }, [isOpen]);

  function close() {
    requestAnimationFrame(() => {
      if (!bgRef.current || !asideRef.current) return;
      bgRef.current.style.right = '100%';
      asideRef.current.style.left = '-240px';
    });
  }

  function open() {
    requestAnimationFrame(() => {
      if (!bgRef.current || !asideRef.current) return;
      bgRef.current.style.right = '0';
      asideRef.current.style.left = '0';
    });
  }

  return (
    <>
      <div
        ref={bgRef}
        className="fixed bottom-0 left-0 right-full top-0 z-50 bg-black/50"
      ></div>
      <aside
        ref={asideRef}
        className="fixed -left-60 bottom-0 top-0 z-50 flex w-60 origin-right flex-col items-center justify-between bg-background p-4 shadow-xl transition-all sm:p-6"
      >
        <div className="mb-6 flex w-full items-center">
          <button
            onClick={onClose}
            className="size-8 rounded-full p-2 transition-colors hover:bg-gray-300"
          >
            <CloseIcon className="size-full" />
          </button>
        </div>
        <Account session={session} onClose={onClose} />
        <div className="flex w-full flex-1 flex-col items-center gap-2">
          {Object.keys(MENU_CONFIG).map((path) => (
            <RouteButton
              key={path}
              href={path}
              label={MENU_CONFIG[path]}
              onClick={onClose}
            />
          ))}
        </div>
        <button className="flex w-full items-center justify-between rounded-md bg-gray-200 px-6 py-3 text-left text-sm font-semibold transition-colors hover:bg-gray-300 sm:text-base">
          設定
          <SettingIcon className="size-5" />
        </button>
        {session?.user && (
          <button
            onClick={async () => {
              await signOut();
              onClose();
            }}
            className="mt-2 flex w-full items-center justify-between rounded-md bg-red-200 px-6 py-3 text-left text-sm font-semibold transition-colors hover:bg-red-300 sm:text-base"
          >
            登出
            <LeaveIcon className="size-5" />
          </button>
        )}
        {!session?.user && (
          <Link
            href="/login"
            onClick={() => onClose()}
            className="mt-2 flex w-full items-center justify-between rounded-md bg-blue-200 px-6 py-3 text-left text-sm font-semibold transition-colors hover:bg-blue-300 sm:text-base"
          >
            登入
            <EnterIcon className="size-5" />
          </Link>
        )}
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
