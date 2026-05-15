'use client';

import { useGroupCtx } from '@/context/GroupProvider';
import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const NoGroupEmptyState = ({ children }: Props) => {
  const { groups, hasEverLoaded, currentGroup } = useGroupCtx();

  if (hasEverLoaded && groups.length === 0) {
    return (
      <div className="flex w-full flex-1 items-center justify-center p-6">
        <div className="flex max-w-sm flex-col items-center gap-3 rounded-xl border border-dashed border-gray-600 p-6 text-center">
          <p className="text-base font-semibold text-gray-100">
            尚未建立任何帳本
          </p>
          <p className="text-sm text-gray-400">
            建立第一本帳本後，即可開始記帳、規劃預算與檢視分析。
          </p>
          <Link
            href="/group"
            className="btn-primary mt-1 inline-flex min-h-11 items-center text-sm"
          >
            前往建立帳本
          </Link>
        </div>
      </div>
    );
  }

  if (hasEverLoaded && !currentGroup) {
    return (
      <div className="flex w-full flex-1 items-center justify-center p-6">
        <p className="text-sm text-gray-300">請先選擇一個帳本</p>
      </div>
    );
  }

  return <>{children}</>;
};
