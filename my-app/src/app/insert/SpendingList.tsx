'use client';

import { SpendingItem } from '@/app/insert/SpendingItem';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { useEffect, useState } from 'react';

interface Props {
  data: SpendingRecord[];
  loading: boolean;
  refreshData: () => void;
}

export const SpendingList = (props: Props) => {
  const { refreshData, data, loading } = props;
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    setIsInit(!loading);
  }, [loading]);

  return (
    <div className="flex w-full flex-col text-xs sm:text-sm">
      {!isInit && (
        <div className="flex w-full flex-col gap-1">
          <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100 sm:h-14"></div>
          <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100 sm:h-14"></div>
          <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100 sm:h-14"></div>
        </div>
      )}
      {isInit && (
        <div className="flex w-full flex-col gap-1">
          {data.map((spending, index) => (
            <SpendingItem
              key={`${spending.id}-${index.toString()}`}
              spending={spending}
              refreshData={refreshData}
            />
          ))}
        </div>
      )}
      {isInit && data.length === 0 && (
        <div className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-2 sm:h-14">
          <SearchIcon className="size-5 text-gray-700" />
          <span className="text-gray-700">找不到資料</span>
        </div>
      )}
    </div>
  );
};
