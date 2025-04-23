'use client';

import { CoinIcon } from '@/components/icons/CoinIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { HomeIcon } from '@/components/icons/HomeIcon';
import { ListIcon } from '@/components/icons/ListIcon';
import { PeopleIcon } from '@/components/icons/PeopleIcon';
import { SettingIcon } from '@/components/icons/SettingIcon';
import { WhereIcon } from '@/components/icons/WhereIcon';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import useFocusRef from '@/hooks/useFocusRef';
import { MENU_CONFIG } from '@/utils/constants';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
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
      asideRef.current.style.left = '-288px';
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
        className="fixed top-0 right-full bottom-0 left-0 z-50 bg-black/50"
      ></div>
      <aside
        ref={asideRef}
        className="bg-background fixed top-0 bottom-0 -left-72 z-50 flex w-72 origin-right flex-col items-center justify-between shadow-xl transition-all"
      >
        <div className="bg-primary-500 relative mb-8 h-14 w-full sm:h-18">
          <div className="bg-primary-500 absolute top-full left-0 -mt-6 h-8 w-26 rounded-r-lg"></div>
          <div className="bg-primary-500 absolute top-full right-0 -mt-6 h-8 w-26 rounded-l-lg"></div>
          <div className="bg-background absolute top-full left-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-1">
            <Image
              src={user?.image ?? '/Spending-origin.png'}
              alt="logo"
              width={1000}
              height={1000}
              className="border-primary-500 rounded-full border-2 border-solid p-1"
            />
          </div>
          {user && (
            <button
              type="button"
              onClick={async () => {
                if (confirm('確定要登出嗎？')) {
                  await signOut();
                  onClose();
                }
              }}
              className="bg-background text-text absolute top-2 right-2 flex shrink-0 items-center justify-center rounded-md p-2 text-xs font-semibold transition-all active:text-red-500 hover:text-red-500"
            >
              <span className="text-xs">登出</span>
            </button>
          )}
        </div>
        <div className="mt-4 flex flex-col items-center">
          <h3 className="max-w-36 overflow-hidden text-base font-bold text-ellipsis whitespace-nowrap">
            {user ? user.name : '尚未登入'}
          </h3>
          <p className="max-w-36 overflow-hidden text-xs text-ellipsis whitespace-nowrap text-gray-500">
            {user ? user.email : '尚未登入'}
          </p>
        </div>
        <div className="flex h-px w-full items-center px-4 py-5">
          <span className="h-px w-full bg-gray-200"></span>
        </div>
        <div className="flex w-full flex-1 flex-col items-center gap-2 px-4">
          {Object.keys(MENU_CONFIG).map((path) => (
            <MenuButton
              key={path}
              href={path}
              label={MENU_CONFIG[path]}
              onClick={onClose}
            />
          ))}
        </div>
        <div className="w-full border-t border-solid border-gray-300 px-4 py-2">
          <MenuButton
            href="/setting"
            onClick={onClose}
            label="設定"
            icon={<SettingIcon className="mr-3 size-4 sm:mr-4" />}
          />
        </div>
      </aside>
    </>
  );
};

const ROUTE_ICON: Record<string, ReactNode> = {
  '/': <HomeIcon className="mr-3 size-4 sm:mr-4" />,
  '/insert': <EditIcon className="mr-3 size-4 sm:mr-4" />,
  '/list': <ListIcon className="mr-3 size-4 sm:mr-4" />,
  '/budget': <CoinIcon className="mr-3 size-4 sm:mr-4" />,
  '/group': <PeopleIcon className="mr-3 size-4 sm:mr-4" />,
  '/choose': <WhereIcon className="mr-3 size-4 sm:mr-4" />,
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
        className={`flex w-full items-center rounded-md px-5 py-3 text-left text-sm font-semibold transition-all sm:text-base ${pathName === href ? 'bg-primary-100' : 'active:bg-primary-100 hover:bg-primary-100'}`}
      >
        {icon ?? ROUTE_ICON[href]}
        {label}
      </Link>
    );
  }
  return (
    <button
      onClick={onClick}
      className="active:bg-primary-100 hover:bg-primary-100 flex w-full items-center rounded-md px-5 py-3 text-left text-sm font-semibold transition-all sm:text-base"
    >
      {icon}
      {label}
    </button>
  );
};
