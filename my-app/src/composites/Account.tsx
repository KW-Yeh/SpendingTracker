'use client';

import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  user?: User | null;
  close: () => void;
}

export const Account = (props: Props) => {
  const { user, close } = props;
  return (
    <div className="relative mb-4 flex w-full items-center gap-3 p-4">
      <div className="size-12 shrink-0 rounded-full bg-gray-500 p-px">
        {user && (
          <Image
            src={user.image ?? ''}
            alt={user.email ?? ''}
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
      </div>
      <div className="flex flex-col">
        <h3 className="max-w-36 overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold">
          {user ? user.name : '尚未登入'}
        </h3>
        <p className="max-w-36 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-500">
          {user ? user.email : '尚未登入'}
        </p>
      </div>
      {user && (
        <button
          type="button"
          onClick={async () => {
            if (confirm('確定要登出嗎？')) {
              await signOut();
              close();
            }
          }}
          className="absolute right-2 top-4 flex shrink-0 items-center justify-center rounded-md p-2 text-red-300 transition-all hover:bg-red-100 hover:text-red-500"
        >
          <span className="text-xs">登出</span>
        </button>
      )}
      {!user && (
        <Link
          href="/login"
          onClick={() => {
            close();
          }}
          className="flex shrink-0 items-center justify-center rounded-md p-2 text-primary-300 transition-all hover:bg-primary-100 hover:text-text"
        >
          <span className="text-xs">登入</span>
        </Link>
      )}
    </div>
  );
};
