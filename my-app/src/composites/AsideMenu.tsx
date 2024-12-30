'use client';

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
      asideRef.current.style.left = '-288px';
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
        className="fixed -left-60 bottom-0 top-0 z-50 flex w-72 origin-right flex-col items-center justify-between bg-background p-4 shadow-xl transition-all"
      >
        <Account session={session} />
        <div className="flex w-full flex-1 flex-col items-center gap-2">
          {Object.keys(MENU_CONFIG).map((path) => (
            <MenuButton
              key={path}
              href={path}
              label={MENU_CONFIG[path]}
              onClick={onClose}
            />
          ))}
        </div>
        {session?.user && (
          <MenuButton
            onClick={async () => {
              await signOut();
              onClose();
            }}
            label="登出"
            icon={<LeaveIcon className="mr-3 size-4 sm:mr-4" />}
          />
        )}
        {!session?.user && (
          <MenuButton
            href="/login"
            onClick={() => onClose()}
            label="登入"
            icon={<EnterIcon className="mr-3 size-4 sm:mr-4" />}
          />
        )}
        <MenuButton
          onClick={() => console.log('setting')}
          label="設定"
          icon={<SettingIcon className="mr-3 size-4 sm:mr-4" />}
        />
      </aside>
    </>
  );
};

const ROUTE_ICON: Record<string, ReactNode> = {
  '/': <HomeIcon className="mr-3 size-4 sm:mr-4" />,
  '/list': <ListIcon className="mr-3 size-4 sm:mr-4" />,
  '/budget': <CoinIcon className="mr-3 size-4 sm:mr-4" />,
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
        className={`flex w-full items-center rounded-md px-5 py-3 text-left text-sm font-semibold transition-all hover:brightness-110 sm:text-base ${pathName === href ? 'bg-primary-100' : 'hover:bg-primary-100'}`}
      >
        {icon ?? ROUTE_ICON[href]}
        {label}
      </Link>
    );
  }
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center rounded-md px-5 py-3 text-left text-sm font-semibold transition-all hover:bg-primary-100 hover:brightness-110 sm:text-base"
    >
      {icon}
      {label}
    </button>
  );
};
